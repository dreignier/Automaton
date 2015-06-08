var _ = require('underscore');

module.exports = function(bot) {

   bot.command({
      name : ['roll'],
      help : '<xdy> <xdy> ... | Lance des d\u00e9s. Exemple : !roll 4d6 8d12',
      execute : function(context) {
         try {
            var args = context.args;

            if (!_.size(args) || !args[0]) {
               args = ['1d6'];
            }

            var countTotal = 0;

            var dice = args.map(function(dice) {
               if (!dice) {
                  dice = '1d6';
               }

               if (dice.indexOf('d') === -1) {
                  dice = '1d' + dice;
               }

               dice = dice.split('d');

               var count = parseInt(dice[0] || '1', 10), 
                   faces = parseInt(dice[1] || '6', 10);

               if (!count) {
                  count = 1;
               }

               if (!faces) {
                  faces = 6;
               }

               if (faces > 999) {
                  faces = 999;
               }

               countTotal += count;

               return {
                  count : count,
                  faces : faces
               };
            });

            if (countTotal > 20) {
               this.say(context.to, 'D\u00e9sol\u00e9, je ne peux pas jeter plus de 20 d\u00e9s');
               return;
            }

            var results = [],
                total = 0;

            dice.forEach(function(dice) {
               for (var count = dice.count; count > 0; --count) {
                  var rand = _.random(1, dice.faces);
                  results.push(rand);
                  total += rand;
               }
            });

            var message = results.join(' ');

            if (results.length > 1) {
               message += '. Total : ' + total;
            }

            this.say(context.to, message);
         } catch (err) {
            this.say(context.to, 'Erreur dans la commande');
         }
      }
   });
   
};