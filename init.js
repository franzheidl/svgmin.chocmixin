/*
SVGmin.chocmixin.
A mixin for Chocolat to minify SVG.
https://github.com/franzheidl/svgmin.chocmixin
Uses SVGO (https://github.com/svg/svgo).
Franz Heidl 2014.
MIT License
*/


var SVGO = require('svgo');

function minify() {
  if (Document.current()) {
    Recipe.run(function(recipe) {
      var doc = Document.current();
      var scope = doc.rootScope();
      var options = {
        plugins: [
          {removeViewBox: false},
          {removeComments: true}
        ]
      };
              
      // SVG uses html scope!
      if (scope === 'basic.html.text') {
        var selection, input;
        if (recipe.selection.length > 0) {
          selection = recipe.selection;
        } else {
          selection = new Range(0, recipe.length);
        }
        
        input = recipe.textInRange(selection);
        
        var my_svgo = new SVGO(options);
        
        my_svgo.optimize(input, function(result) {
        
          if (result.error) {
            Alert.show('svgmin Error: ', result.error);
          }
          else {
            recipe.replaceTextInRange(selection, result.data);
          }
          
        });
      }
      else {
        Alert.show('svgmin error: ', doc.filename() + ' does not appear to be an HTML or SVG file.');
      }
    });
  }
}

Hooks.addMenuItem('Actions/SVG/Minify SVG', '', function() {
  minify();
});
