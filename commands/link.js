module.exports = function(bot) {
   
   var REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

   var last = null;
   
   bot.client.addListener('message', function(from, to, text, message) {
      var captured = REGEX.exec(text);
      
      if (Array.isArray(captured) && captured.length > 1) {
         last = captured[1];
      }
   });
   
   bot.command({
      name : 'link',
      help : 'Donne le dernier lien vu sur le canal',
      execute : function(context) {
         if (last) {
            bot.client.say(context.to, "Dernier lien vu sur le canal : " + last);
         } else {
            bot.client.say(context.to, "Je n'ai vu aucun lien pour l'instant");
         }
      }
   });
   
};