module.exports = function(bot) {
   
  var request = require('request'),
      _ = require('underscore'),
      store = require('../lib/store');

  var streams = store('stream.streams') || {};

  function register(channel, id) {
    streams[id] = channel;
    store('stream.streams', streams);
  }

  function unregister(id) {
    delete streams[id];
    store('stream.streams', streams);
  }

  function tick(talk, to) {
    var counter = _.size(streams),
        found = false;

    for (var id in streams) {
      details(id, function(stream) {
        if (stream) {
          found = true;

          bot.client.say(streams[id], stream.channel.display_name + ' joue \u00e0 ' + stream.channel.game 
            + ' (' + stream.channel.status.trim().replace(/[\n\r]/g, '') + ') : ' + stream.channel.url);
        }

        if (--counter <= 0 && !found && talk && to) {
          bot.client.say(to, 'Aucun stream en cours');
        }
      });
    }
  }

  function details(id, callback) {
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
            return stream.channel.name.toLowerCase() == id.toLowerCase();
         });
         
         return callback(stream.length ? stream[0] : false);
      })
   };

  bot.command({
    name : ['stream'],
    help : '<id> | Ajoute un stream twitch \u00e0 surveiller pour le bot. Ne pas donner <id> force le bot a v\u00e0rifier tous les streams',
    execute : function(context) {
      if (!_.size(context.args)) {
        tick(true, context.to);
        return;
      }

      var id = context.args[0].trim();

      if (!id) {
        return;
      }
 
      register(context.to, id.toLowerCase());
      this.say(context.to, 'Stream de ' + id + ' ajout\u00e9 \u00e0 la liste des streams que je surveille');
    }
  });

  bot.command({
    name : ['stream.remove'],
    help : '<id> | Retire un stream \u00e0 surveiller',
    execute : function(context) {
      if (!_.size(context.args)) {
        return;
      }

      unregister(context.args[0]);
    }
  });

  // 10 minutes
  setInterval(tick, 600000);

};