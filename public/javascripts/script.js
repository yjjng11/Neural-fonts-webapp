function collapseNavbar() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
}

$(window).scroll(collapseNavbar);
$(document).ready(collapseNavbar);

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $(".navbar-collapse").collapse('hide');
});


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
      let options = document.getElementsByClassName('OptionSetting');
      for (let i = 0; i < options.length; i++) {
        let input = options[i].children[0];
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

      log_to_DOM('tracing time : ' + (new Date() - start_t) + ' ms');
    }
  );
}

function create_option(name, min, max, step, value) {
    var option = document.createElement('div');

    var optionName = document.createElement('div');
    var optionName_string = document.createElement('p');
    optionName_string.innerHTML = name;
    optionName.appendChild(optionName_string);
    option.appendChild(optionName);

    var optionSetting = document.createElement('div');
    optionSetting.class = 'OptionSetting';
    var optionSetting_input = document.createElement('input');
    optionSetting_input.type = 'range';
    optionSetting_input.min = min;
    optionSetting_input.max = max;
    optionSetting_input.step = step;
    optionSetting_input.value = value;
    optionSetting_input.name = name;
    optionSetting_input.addEventListener("change", trace_image);
    optionSetting.appendChild(optionSetting_input);
    optionSetting.style.cssFloat = 'right';
    option.appendChild(optionSetting);

    if(name=='ltres'||name=='qtres'||name=='scale'||name=='strokewidth'){
      document.getElementById('optioncontainer').appendChild(option);
    }
    else{
      document.getElementById('optioncontainer2').appendChild(option);
    }
}

function onload_init() {
  create_option('ltres', 0, 2, 0.1, 1);
  create_option('qtres', 0, 2, 0.1, 1);
  create_option('scale', 1, 10, 1, 1);
  create_option('strokewidth', 1, 5, 1, 1);
  create_option('pathomit', 1, 20, 1, 8);
  create_option('blurradius', 0, 5, 1, 0);
  create_option('blurdelta', 0, 100, 10, 20);
  create_option('lcpr', 0, 10, 1, 0);
  create_option('qcpr', 0, 10, 1, 0);
  var elem = document.createElement("img");
  elem.setAttribute("src", "/images/el.png");
  elem.id='img';
  document.getElementById("pre_image").appendChild(elem);
  trace_image();
}

window.addEventListener('load', onload_init);
