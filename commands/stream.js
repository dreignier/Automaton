module.exports = function(bot) {
   
   var request = require('request');
   var _ = require('underscore');
   
   var streams = {};
   
   var remove = function(id) {
      if (streams[id]) {
         bot.client.say(streams[id], "Stream de " + id + " \u00e9teint");
         delete streams[id];
      }
   };
   
   var details = function(id, callback) {
      request({
         method : 'GET',
         json : true,
         url : 'https://api.twitch.tv/kraken/search/streams?q=' + encodeURIComponent(id)
      }, function(error, response, body) {
         if (error) {
            console.dir(error);
            bot.client.say(context.to, 'Erreur. Magus sale dev en carton, r\u00e9pare moi !');
            return;
         }
         
         if (!body._total) {
            callback(false);
            return;
         }
         
         var stream = body.streams.filter(function(stream) {
            return stream.channel.name.toLowerCase() == id;
         });
         
         return callback(stream.length ? stream[0] : false);
      })
   };
   
   var tick = function() {
      for (var id in streams) {
         details(id, function(stream) {
            if (!stream) {
               remove(id);
               return;
            }
            
            bot.client.say(streams[id], stream.channel.display_name + ' joue \u00e0 ' + stream.channel.game 
                  + ' (' + stream.channel.status.trim().replace(/[\n\r]/g, '') + ') : ' + stream.channel.url);
         });
      }
   };
   
   bot.command({
      name : 'stream',
      help : '<id> | Active un stream sur le bot',
      execute : function(context) {
         if (!context.args.length) {
            if (_.size(streams)) {
               tick();
            } else {
               this.say(context.to, 'Aucun stream en cours');
            }
            
            return
         }
         
         var id = context.args[0].toLowerCase();
         
         if (!streams[id]) {
            streams[id] = context.to;
         }
         
         tick();
      }
   });
   
   bot.command({
      name : 'stream.off',
      help : '<id> | D\u00e9sactive un stream sur le bot',
      execute : function(context) {
         if (!context.args.length) {
            return
         }
         
         var id = context.args[0].toLowerCase();
         remove(id);
      }
   });
   
   // 10 minutes
   setInterval(tick, 600000);
   
   
};