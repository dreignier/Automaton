module.exports = function(bot) {

   var request = require('request'),
      _ = require('underscore');
   
   bot.command({
      name : ['analyse'],
      help : '<pseudo> | Analyse un pseudo. Source 100% fiable',
      execute : function(context) {
         var _this = this;
         
         if (context.args.length <= 0) {
            return;
         }
         
         var nick = context.args[0];
         
         var results = {};
         
         ['Penis', 'Anus', 'Tits', 'Vagina'].forEach(function(type) {
            request({
               method : 'GET',
               url : 'http://en.inkei.net/' + (type != 'Penis' ? type.toLowerCase() + '/' : '') + encodeURIComponent(nick)
            }, function(error, response, body) {
               body = body.substring(body.indexOf('<div id="elmDescCmmn">') + 23);
               body = body.substring(0, body.indexOf('</div>'));
               body = body.replace('<p>', '').replace('</p>', '').replace(/<br \/>/ig, '').replace(/[\n\r\t]/ig, '').replace(/ [ ]+/g, ' ');
               body = body.replace(type + ' of ' + nick, '').replace(nick + "'s " + type + ' / ', '');

               results[type] = body;
               
               if (_.size(results) == 4) {
                  _this.say(context.to, 'Analyses de ' + nick + ' : ');
                  
                  for (var key in results) {
                     _this.say(context.to, ' * ' + key + ' : ' + results[key]);
                  }
               }
            });
         });
         
         
      }
   });
   
};