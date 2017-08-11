
/*$(document).ready(function(){
  var buttons = {};
  var but_count = 0;
  $('#save_button').on('click', function(){
    var history_but = $('<input type="button" class="btn btn-primary" />');
    history_but.id=but_count;
    history_but.value=but_count+1;
    $('#history_box').append(history_but);
    //$('#'+history_but.id).html(but_count+1);

    //var b = document.getElementById(but_count);
    history_but.addEventListener("click", function(){alert('dfdf')});
    but_count++;


  });


  //$('#'+but_count).bind('click', function(){
  //  alert('dfs');
  //});
});*/

function log_to_DOM (str) {
  var elem = document.createElement('div');
  elem.innerHTML = str;
  document.body.appendChild(elem);
}

function trace_image(){

  // ImageData can be traced to an SVG string synchronously.
  ImageTracer.loadImage(
    document.getElementById('img').src,
    function(canvas){

      // Get options from DOM elements
      let option = {};
      let options = document.getElementById('range_all');
      let optionSetting_input = options.getElementsByTagName("input");
      for (let i = 0; i < optionSetting_input.length; i++) {
        let input = optionSetting_input[i];
        option[input.name] = input.value;
      }
      option.pal = [{r:0,g:0,b:0,a:255},{r:255,g:255,b:255,a:255}];
      option.linefilter=true;

      let start_t = new Date();

      // Getting ImageData from canvas with the helper function getImgdata().
      let imgd = ImageTracer.getImgdata( canvas );

      // Synchronous tracing to SVG string
      let svgstr = ImageTracer.imagedataToSVG( imgd, option);

      // Appending SVG
      ImageTracer.appendSVGString( svgstr, 'post_image' );
      console.log(svgstr);
      console.log(svgstr.length);

      // Load SVG to Canvas
      /*  var canvas2 = new fabric.Canvas('canvas2');
      canvas2.backgroundColor = 'rgb(150,150,150)';
      var path = fabric.loadSVGFromString(svgstr,function(objects, options) {
        var obj = fabric.util.groupSVGElements(objects, options);
        obj.scaleToHeight(canvas2.height-10)
        .set({ left: canvas2.width/2, top: canvas2.height/2 })
        .setCoords();

        canvas2.add(obj).renderAll();
});*/


      log_to_DOM('tracing time : ' + (new Date() - start_t) + ' ms');
    }
  );
}

function create_option(name, min, max, step, value) {
    //var option = document.createElement('div');
    //option.style.padding = "0px 0px 20px 0px";
    //var optionName = document.createElement('div');
    //var optionName_string = document.createElement('p');
    //optionName_string.innerHTML = name;
    //optionName.appendChild(optionName_string);
    //optionName.style.cssFloat = 'left';
    //option.appendChild(optionName);

    //var optionSetting = document.createElement('div');
    //optionSetting.id = 'OptionSetting';
    var optionSetting_input = document.getElementById(name);
    optionSetting_input.class = 'OptionSetting_input';
    optionSetting_input.type = 'range';
    optionSetting_input.min = min;
    optionSetting_input.max = max;
    optionSetting_input.step = step;
    optionSetting_input.value = value;
    optionSetting_input.name = name;
    optionSetting_input.addEventListener("change", trace_image);
    //optionSetting.appendChild(optionSetting_input);
    //optionSetting.style.cssFloat = 'right';
    //option.appendChild(optionSetting);

    //document.getElementById('optioncontainer').appendChild(option);

  /*  if(name=='ltres'||name=='qtres'||name=='scale'||name=='strokewidth'){
      document.getElementById('optioncontainer').appendChild(option);
    }
    else{
      document.getElementById('optioncontainer2').appendChild(option);
    }*/
}

function onload_init() {

  create_option('ltres', 0, 10, 0.1, 1);
  create_option('qtres', 0, 10, 0.1, 1);
  create_option('strokewidth', 0, 5, 0.1, 1);
  create_option('pathomit', 0, 10, 1, 8);
  create_option('blurradius',1, 5, 1, 0);
  create_option('blurdelta', -100, 100, 10, 10);
  var elem = document.createElement("img");
  elem.setAttribute("src", "/images/bb.png");
  elem.id='img';
  document.getElementById("pre_image").appendChild(elem);
  trace_image();

  var history = {};
  var but_count = 0;
  var save_but = document.getElementById('save_button');

  save_but.addEventListener('click',function(){
    var history_but = document.createElement('button');
    var history_box = document.getElementById('history_box');
    var date = new Date();
    var time = document.createElement('p');

    time.innerHTML = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    history_but.id = but_count;
    history_but.className ='btn btn-success btn-sm';
    history_but.innerHTML = but_count+1;

    history[but_count] = {ltres:$('#ltres').val(), qtres:$('#qtres').val(), strokewidth:$('#strokewidth').val(),
                          pathomit:$('#pathomit').val(), blurradius:$('#blurradius').val(), blurdelta:$('#blurdelta').val()};

    history_box.appendChild(history_but);
    history_box.appendChild(time);

    history_but.addEventListener("click", function(){
      $('#ltres').val(history[this.id].ltres);
      $('#qtres').val(history[this.id].qtres);
      $('#strokewidth').val(history[this.id].strokewidth);
      $('#pathomit').val(history[this.id].pathomit);
      $('#blurradius').val(history[this.id].blurradius);
      $('#blurdelta').val(history[this.id].blurdelta);
      trace_image();
    });

    but_count++;

  });


  /*ImageTracer.loadImage(
    document.getElementById('img').src,
    function(canvas){

      // Get options from DOM elements
      let option = {};
      let options = document.getElementsByClassName('OptionSetting');
      let optionSetting_input = options.getElementsByTagName("input");
      for (let i = 0; i < optionSetting_input.length; i++) {
        let input = optionSetting_input[i];
        option[input.name] = input.value;
      }
      option.pal = [{r:0,g:0,b:0,a:255},{r:255,g:255,b:255,a:255}];
      option.linefilter=true;
      option.ltres=10;


      // Getting ImageData from canvas with the helper function getImgdata().
      let imgd = ImageTracer.getImgdata( canvas );

      // Synchronous tracing to SVG string
      let svgstr = ImageTracer.imagedataToSVG( imgd, option );

      // Appending SVG
      ImageTracer.appendSVGString( svgstr, 'post_image' );
    }
  );*/
}

window.addEventListener('load', onload_init);
