(function() {
   var fs = require('fs')
      _ = require('underscore');
   
   var cache = {},
   
   getFile = function(key) {
      return './data/store/' + key + '.json';
   },
   
   get = function (key) {
      if (!cache[key]) {
         var file = getFile(key);
         
         if (fs.existsSync(file)) {
            cache[key] = JSON.parse(fs.readFileSync(file));
         }
      }
      
      var result = cache[key];
      
      if (_.isObject(result) && result.__forced__) {
         result = result.value;
      }
      
      return result;
   },
   
   set = function(key, value) {
      if (!_.isObject(value)) {
         value = {
            value : value,
            __forced__ : true
         };
      }
      
      cache[key] = value;
      
      fs.writeFile(getFile(key), JSON.stringify(value));
   };
   
   module.exports = function(key, value) {
      if (value === undefined) {
         return get(key);
      } else {
         set(key, value);
      }
   };
})();