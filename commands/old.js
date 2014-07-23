module.exports = function(bot) {
   
   var store = require('../lib/store'),
      moment = require('moment');
   
   require('../lib/momentfr')(moment);
   
   var REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

   bot.client.addListener('message', function(from, to, text, message) {
      if (!text || text.charAt(0) === '!') {
         return;
      }
      
      var captured = REGEX.exec(text),
         links = store('old.links') || {};
      
      if (Array.isArray(captured) && captured.length > 1) {
         var link = captured[1];
         if (links[link] && links[link].from != from) {
            bot.client.say(to, 'Old ! Lien post\u00e9 en premier par ' + links[link].from + ' ' + moment(links[link].date).fromNow());
         } else {
            links[link] = {
               from : from,
               date : new Date().getTime()
            };
         }
      }
      
      store('old.links', links);
   });
      
};