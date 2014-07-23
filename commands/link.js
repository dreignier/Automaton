module.exports = function(bot) {
   
   var store = require('../lib/store'),
      moment = require('moment');
      
   require('../lib/momentfr')(moment);
   
   var REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;   
   
   bot.client.addListener('message', function(from, to, text, message) {
      var captured = REGEX.exec(text);
      
      if (Array.isArray(captured) && captured.length > 1) {
         store('link' , {
            last : captured[1],
            author : from,
            date : new Date().getTime()
         });
      }
   });
   
   bot.command({
      name : 'link',
      help : 'Donne le dernier lien vu sur le canal',
      execute : function(context) {
         var link = store('link');
         if (link && link.last) {
            bot.client.say(context.to, 'Dernier lien vu sur le canal (Par ' + link.author + ' ' + moment(link.date).fromNow() + ') : ' + link.last);
         } else {
            bot.client.say(context.to, "Je n'ai vu aucun lien pour l'instant");
         }
      }
   });
   
};