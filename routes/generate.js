var express = require("express");
var router = express.Router();
var fs = require('fs');
var svg2ttf = require('svg2ttf');
var svgicons2svgfont = require('svgicons2svgfont');
var fontStream = svgicons2svgfont({
  fontName: 'myfont'
});

router.post("/", function(req, res){

  var svgstring = req.body.svgstring;
  var sources = req.body.sources;

  for (var i=0; i < sources.length; i++) {
    fs.writeFileSync('./svg/' + sources[i] + '.svg', svgstring[i]);
  }
            // Setting the font destination
            fontStream.pipe(fs.createWriteStream( './svg_fonts/font_ss.svg'))
              .on('finish',function() {
                var ttf = svg2ttf(fs.readFileSync( './svg_fonts/font_ss.svg', 'utf8'), {});
                fs.writeFileSync('./ttf_fonts/myfont.ttf', new Buffer(ttf.buffer));
              })
              .on('error',function(err) {
                console.log(err);
              });

            for (var i=0; i < sources.length; i++) {
              // Writing glyphs
              var glyph1 = fs.createReadStream('./svg/' + sources[i] + '.svg');
              glyph1.metadata = {
                unicode: [sources[i]],
                name: 'glyph' + sources[i]
              };
              fontStream.write(glyph1);
            }
            fontStream.end();


  // fs.writeFile(
  //       './svg/ss.svg', // Output file pathj
  //       svgstring,
  //       function(err){
  //         if(err){ throw err; }
  //          console.log( __dirname + '/ss.svg was saved!' );
  //           // Setting the font destination
  //           fontStream.pipe(fs.createWriteStream( './svg_fonts/font_ss.svg'))
  //             .on('finish',function() {
  //               var ttf = svg2ttf(fs.readFileSync( './svg_fonts/font_ss.svg', 'utf8'), {});
  //               fs.writeFileSync('./ttf_fonts/testfont_ss.ttf', new Buffer(ttf.buffer));
  //             })
  //             .on('error',function(err) {
  //               console.log(err);
  //             });
  //
  //           for (var i=0; i < sources.length; i++) {
  //             // Writing glyphs
  //             var glyph1 = fs.createReadStream('./svg/ss.svg');
  //             glyph1.metadata = {
  //               unicode: [sources[i]],
  //               name: 'icon1'
  //             };
  //             fontStream.write(glyph1);
  //           }
  //         // Multiple unicode values are possible
  //           [>var glyph2 = fs.createReadStream('icons/icon1.svg');
  //           glyph2.metadata = {
  //             unicode: ['\uE002', '\uEA02'],
  //             name: 'icon2'
  //           };
  //           fontStream.write(glyph2);
  //           // Either ligatures are available
  //           var glyph3 = fs.createReadStream('icons/icon1.svg');
  //           glyph3.metadata = {
  //             unicode: ['\uE001\uE002'],
  //             name: 'icon1-icon2'
  //           };
  //           fontStream.write(glyph3);*/
  //
  //           // Do not forget to end the stream
  //           fontStream.end();
  //       }
  //     );

      res.send("success");
});

module.exports = router;
