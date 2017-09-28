var express = require('express');
var router = express.Router();
const { exec, execSync, spawn } = require('child_process');
var multer = require('multer');
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Main page' });
});

router.get('/about', function(req, res, next){
  res.render('about');
});

router.get('/upload', function(req, res, next){
  res.render('upload');
});

var doing_training = false;

var training_progress = [];
var root_dir;
var scan_dir;
var crop_dir;
var data_dir;
var model_dir;
var image_dir;
var logs_dir;
var result_dir;

router.post('/train',function(req,res){

  if (doing_training) {
    return res.json({doing_training:true});
  }

  doing_training = true;

  /* Create working directory */
  root_dir = new Date().toUTCString().replace(/ /gi, "").replace(/,/gi, "").replace(/:/gi,"_");
  scan_dir = root_dir + "/scanned_image";
  crop_dir = root_dir + "/cropped_image";
  data_dir = root_dir + "/data";
  model_dir = root_dir + "/checkpoint";
  image_dir = root_dir + "/image";
  logs_dir = root_dir + "/logs";
  result_dir = root_dir + "/result";

  execSync('mkdir -p zi2zi/' + root_dir);         // root directory
  execSync('mkdir -p zi2zi/' + scan_dir);         // scanned image directory
  execSync('mkdir -p zi2zi/' + crop_dir);         // cropped image directory
  execSync('mkdir -p zi2zi/' + data_dir);         // data directory
  execSync('mkdir -p zi2zi/' + image_dir);        // image data directory
  execSync('mkdir -p zi2zi/' + logs_dir);         // log data directory
  execSync('mkdir -p zi2zi/' + result_dir);       // result data directory
  fs.closeSync(fs.openSync('zi2zi/' + logs_dir + '/progress', 'w'));    // create an empty file to check progress
  execSync('cp -r zi2zi/binary/baseline/checkpoint zi2zi/' + root_dir + "/.");    // model directory (copy baseline model)

  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'zi2zi/' + scan_dir);
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
      // TODO: check file name (e.g., 1-frequency.png)
    }
  });
  var upload = multer({storage:storage}).array('fontPhoto', 3);

  // 1. Upload scanned image
  upload(req,res,function(err) {
    if(err) {
      console.log('uploading error');
      console.log(err);
      return res.end("Error uploading file.");
    }

    training_progress.push("fileUploaded");

    // 2. Crop each character
    exec('docker exec -t neural_font python crop.py --src_dir=' + scan_dir + ' --dst_dir=' + crop_dir, (error, stdout, stderr) => {
      if (error)
        console.log(error);
      training_progress.push("imageCropped");

      // 3. Create image data for training
      exec('docker exec -t neural_font python font2img.py --src_font=fonts/NanumGothic.ttf --dst_font=fonts/NanumGothic.ttf --sample_dir=' + image_dir + ' --label=0 --handwriting_dir=' + crop_dir, (error, stdout, stderr) => {
        if (error)
          console.log(error);
        training_progress.push("imgDataCreated");

        // 4. Create data object with the image data
        exec('docker exec -t neural_font python package.py --fixed_sample=1 --dir=' + image_dir + ' --save_dir=' + data_dir, (error, stdout, stderr) => {
          if (error)
            console.log(error);
          training_progress.push("dataObjCreated");

          // 5. Start training (phase 1)
          exec('docker exec -t neural_font python train.py --experiment_dir=' + root_dir + ' --experiment_id=0 --batch_size=16 --lr=0.001 --epoch=60 --sample_steps=100 --schedule=20  --L1_penalty=100 --Lconst_penalty=15 --freeze_encoder=1', (error, stdout, stderr) => {
            if (error)
              console.log(error);
            training_progress.push("firstPhaseTrained");
          });
        });
      });
    });
  });
  console.log('doing_training: ' + doing_training);
  res.json({'doing_training':doing_training});
});

router.get('/adjust', function(req, res, next){
  res.render('adjust');
});

router.get('/download_template', function(req, res){
  var file = __dirname + '/../public/images/Template.pdf';
  res.download(file);
});

router.get('/download_ttf', function(req, res){
  var file = __dirname + '/../ttf_fonts/myfont.ttf';
  res.download(file);
});

var training_count = 0;

router.post('/progress',function(req,res){
  // progress level of each step (initial state + 6 steps = total 7 steps)
  let progress_level = [0, 5, 10, 15, 20, 70, 90, 100];
  let progress_msg = ["File uploading..", "Cropping characters..", "Creating image data..", "Creating data object..", "Training (1st phase)..", "Training (2nd phase)..", "Inferencing ..", "Done"];

  // On training. start 2nd training when the 1st is done.
  if (training_progress.length >= 4) {
    let data = fs.readFileSync('zi2zi/' + logs_dir + '/progress', {encoding:'utf8'});
    var count = (data.match(/Done/g) || []).length;
    if (count == 1 && training_count == 0) {
      console.log('1st Training Done');
      // 6. Start training (phase 2)
      exec('docker exec -t neural_font python train.py --experiment_dir=' + root_dir + ' --experiment_id=0 --batch_size=16 --lr=0.001 --epoch=120 --sample_steps=100 --schedule=30  --L1_penalty=500 --Lconst_penalty=1000 --freeze_encoder=1', (error, stdout, stderr) => {
        if (error)
          console.log(error);
      });
      training_count++;
    }
    if (count == 2 && training_count == 1) {
      // 7. Do inference.
      exec('docker exec -t neural_font python infer.py --model_dir=' + model_dir + '/experiment_0_batch_16 --batch_size=1 --source_obj=' + data_dir + '/val.obj --embedding_ids=0 --save_dir=' + result_dir + ' --progress_file=' + logs_dir+ '/progress', (error, stdout, stderr) => {
        if (error)
          console.log(error);
      });
      training_count++;
      training_progress.push("secondPhaseTrained");
    }
    if (count == 3) {
      training_count = 0; // reset
      doing_training = false;
      training_progress.push("Inferenced");
    }
  }

  console.log('progress message : ' + JSON.stringify({progress:progress_level[training_progress.length], progress_msg:progress_msg[training_progress.length]}));
  res.json({progress:progress_level[training_progress.length], progress_msg:progress_msg[training_progress.length]});
});

router.post('/current_dir',function(req,res){
  let list = fs.readdirSync('zi2zi/' + result_dir);
  res.json({'root_dir':root_dir, 'sample_img_paths':list.slice(0,9)});
});
module.exports = router;
