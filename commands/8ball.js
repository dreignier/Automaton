var _ = require('underscore');

module.exports = function(bot) {

   var responses = [
      "Essaye plus tard",
      "Essaye encore",
      "Pas d'avis",
      "C'est ton destin",
      "Le sort en est jet\u00e9",
      "Une chance sur deux",
      "Repose ta question",
      "D'apr\u00e8s moi oui",
      "C'est certain",
      "Oui absolument",
      "Tu peux compter dessus",
      "Sans aucun doute",
      "Tr\u00e8s probable",
      "Oui",
      "C'est bien parti",
      "C'est non",
      "Peu probable",
      "Faut pas r\u00eaver",
      "N'y compte pas",
      "Impossible"
   ];

   bot.command({
      name : ['8ball'],
      help : 'Demande conseil',
      execute : function(context) {
         this.say(context.to, responses[_.random(0, responses.length - 1)]);
      }
   });
   
};