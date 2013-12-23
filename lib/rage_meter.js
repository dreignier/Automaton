(function() {
   module.exports = function(bot) {

      var terms = {
         'putain' : 3,
         'marre' : 3,
         'saoule' : 3,
         'saoul' : 3,
         'foutre' : 3,
         'omg' : 3,
         'shit' : 3,
         'wtf' : 3,
         'vtff' : 3,
         'vtf' : 3,
         'putin' : 3,
         'plz' : 3,
         'motherfucker' : 5,
         'connar' : 5,
         'encul' : 5,
         'pd' : 5,
         'vtf' : 5,
         'suce' : 5,
         'batar' : 5,
         'batard' : 5,
         'debile' : 5,
         'd\u00e9bile' : 5,
         'gueule' : 5,
         'gueul' : 5,
         'tg' : 5,
         'op' : 5,
         'p\u00e9d\u00e9' : 5,
         'nique' : 5,
         'niquer' : 5,
         'niqu\u00e9' : 5,
         'toss' : 2,
         'protoss' : 2,
         'zerg' : 2,
         'terran' : 2,
         'tapette' : 4,
         'camp' : 4,
         'patchtoss' : 4,
         'patchzerg' : 4,
         'protossed' : 4,
         'patchedtoss' : 4,
         'patchedzerg' : 4,
         'patchedterran' : 4,
         'imba' : 4,
         'buff' : 4,
         'weak' : 4,
         'nerf' : 4,
         'all-in' : 4,
         'allin' : 4,
         'blink' : 4,
         'charge' : 4,
         'zealot' : 4,
         'msc' : 4,
         'oracle' : 4,
         'storm' : 4,
         'tvt' : 4,
         'tvp' : 4,
         'pvt' : 4
      };

      var substrings = {
         'all in' : 4,
         'merd' : 4,
         '!!' : 4,
         '??' : 4
      };

      var criterias = [function(text) {
         return text == text.toUpperCase() ? 5 : 0;
      }, function(text) {
         var result = 0;

         text = text.toLowerCase().split(' ');
         for (term in terms) {
            if (text.indexOf(term) != -1) {
               result += terms[term];
            }
         }

         return result;
      }, function(text) {
         var result = 0;

         for (substring in substrings) {
            if (text.indexOf(substring) != -1) {
               result += substrings[substring];
            }
         }

         return result;
      }];

      bot.client.addListener('message', function(from, to, text, message) {
         var meter = 0;

         criterias.forEach(function(criteria) {
            var result = criteria(text);

            if (result) {
               meter += result;
            }
         });

         if (meter > 9) {
            console.log('Rage meter score by ' + from + ' : ' + meter);
            bot.client.say(to, 'Rage de ' + from + ' : ' + meter + ' points');
         }
      });

   };
})();