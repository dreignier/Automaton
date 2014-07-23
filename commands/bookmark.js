module.exports = function(bot) {

   var _ = require('underscore'),
      store = require('../lib/store');
   
   bot.command({
      name : ['bookmark', 'bm'],
      help : "<id> <text> | Cr\u00e9er un bookmark. Si on tape juste l'id sans texte, le bot donne le contenu du bookmark",
      execute : function(context) {
         if (!context.args.length) {
            return;
         }
            
         var bookmarks = store('bookmark') || {},
            id = context.args[0].toLowerCase(),
            text = _.rest(context.args).join(' ').trim();
                  
         if (text.length) {
            if (bookmarks[id]) {
               this.say(context.to, 'Seul Magus peut modifier ou supprimer des bookmarks');
               return;
            }
            
            bookmarks[id] = text;
            
            store('bookmark', bookmarks);
            
            this.say(context.to, 'Bookmark ' + id + ' enregistr\u00e9');
         } else if (bookmarks[id]) {
            this.say(context.to, 'Bookmark ' + id + ' : ' + bookmarks[id]);
         }         
      }
   });
   
   bot.command({
      name : ['bookmark.list', 'bm.list'],
      help : "Le bot donne la lise des bookmarks",
      execute : function(context) {
         var bookmarks = store('bookmark') || {};
         
         this.say(context.from, 'Liste des bookmarks :');
         for (var key in bookmarks) {
            this.say(context.from, ' * ' + key + ' : ' + bookmarks[key]);
         }
      }
   });
   
   bot.command({
      name : ['bookmark.edit', 'bm.edit'],
      help : '<id> <text> | Modifie un bookmark',
      security : 'admin',
      execute : function(context) {
         if (context.args.length < 2) {
            return;
         }
         
         var bookmarks = store('bookmark') || {},
            id = context.args[0].toLowerCase(),
            text = _.rest(context.args).join(' ').trim();
         
         bookmarks[id] = text;
         
         store('bookmark', bookmarks);
      }
   });
   
   bot.command({
      name : ['bookmark.delete', 'bm.delete'],
      help : '<id> | Supprime un bookmark',
      security : 'admin',
      execute : function(context) {
         if (!context.args.length) {
            return;
         }
         
         var bookmarks = store('bookmark') || {};
         delete bookmarks[context.args[0].toLowerCase()];
         store('bookmark', bookmarks);
      }
   });
   
};