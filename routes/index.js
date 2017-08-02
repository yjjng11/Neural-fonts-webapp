var express = require('express');
var router = express.Router();

var execSync = require('child_process').execSync;
var multer = require('multer');
var fs = require('fs');

var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './uploads');
	},
	filename: function (req, file, callback) {
		callback(null, file.originalname);
	}
});
var upload = multer({storage:storage}).array('fontPhoto', 3);



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

router.post('/upload',function(req,res){
    upload(req,res,function(err) {
        // console.log(req.body);
        // console.log(req.files);
        if(err) {
            return res.end("Error uploading file.");
        }
        res.json({success:true});

//		execSync('docker exec -d neural_fonts python train.py');
//		execSync('docker exec -d neural_fonts touch test');
    });
});

router.get('/adjust', function(req, res, next){
  res.render('adjust');
});

router.get('/examples', function(req, res, next){
  res.render('examples');
});

router.get('/download_template', function(req, res){
  var file = __dirname + '/../public/images/Random_template.pdf';
  res.download(file);
});

var count = 0;
router.post('/progress',function(req,res){
	if (count >= 100) {
		res.json({progress:"complete"});
	}
	else {
		res.json({progress:count});
		count += 10;
	}
});

module.exports = router;
