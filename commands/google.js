module.exports = function(bot) {
   var _ = require('underscore');
   
   var banned = [];

   bot.command({
      name : 'google',
      help : '<text> | Fait une recherche sur google avec <text> et donne le premier r\u00e9sultat',
      execute : function(context) {
         if (context.args.length <= 0) {
            return;
         }

         if (banned.indexOf(context.from) != -1) {
            bot.client.say(context.to, "D\u00e9sol\u00e9 " + context.from + ", tu es trop m\u00e9chant");
            return
         }

         var q = context.args.join(' ');

         // Test the content of q
         var blacklist = ['porn', 'enfant', 'child', 'jizz', 'oujiz', 'sex ', ' sex', 'boobs', 'couille', 'pisse', 'penis', 'p\u00e9nis', 'suce', 'zizi', 'bukkake', 'chatte', 'cul ', ' cul', ' bite', 'bite '];
         for (var index = 0; index < blacklist.length; ++index) {
            if (q.indexOf(blacklist[index]) != -1) {
               bot.client.say(context.to, context.from + ", Tu es vilain !");
               banned.push(context.from);
               return;
            }
         }

         require('request')({
            method : 'GET',
            url : 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&language=fr&q=' + encodeURIComponent(q),
            json : true,
            headers : {
               'Accept-Language' : 'fr,fr-fr;q=0.8,en-us;q=0.5,en;q=0.3'
            }
         }, function(error, response, body) {
            if (error) {
               bot.client.say(context.to, 'Erreur. Magus sale dev en carton, r\u00e9pare moi !');
               return;
            }

            if (body.responseData && Array.isArray(body.responseData.results) && body.responseData.results.length > 0) {
               bot.client.say(context.to, 'Recherche de "' + q + '" sur Google : ' + body.responseData.results[0].unescapedUrl);
            } else {
               bot.client.say(context.to, 'Recherche de "' + q + '" sur Google : Aucun r\u00e9sultat');
            }
         });
      }
   });
   
   bot.command({
      name : 'google.ban',
      help : 'Banni un utilisateur pour la commande !google',
      security : 'admin',
      execute : function(context) {
         if (context.args.length <= 0) {
            return;
         }
         
         banned.push(context.args[0]);
      }
   });
   
   bot.command({
      name : 'google.unban',
      help : 'D\u00e9banni un utilisateur pour la commande !google',
      security : 'admin',
      execute : function(context) {
         if (context.args.length <= 0) {
            return;
         }
         
         banned = _.without(banned, context.args[0]);
      }
   });

};