var moment = require('moment');

module.exports = function(bot) {

  var notes = {};

  bot.command({
      name : ['note'],
      help : "<nicks> <message> | Laisse un message pour quelqu'un",
      execute : function(context) {
        if (!context.args || !context.args.length) {
          return;
        }

        var nicks = '';

        var i;
        for (i = 0; i < context.args.length && context.args[i] != '#'; ++i) {
          var nick = context.args[i];

          if (nick == '#') {
            break;
          }

          nicks += ' ' + nick.toLowerCase();
        }

        nicks = nicks + ' ';

        if (i >= context.args.length - 1) {
          return;
        }

        var message = '';

        for (i = i + 1; i < context.args.length; ++ i) {
          message += ' ' + context.args[i];
        }

        message = message.trim();

        if (!notes[nicks]) {
          notes[nicks] = [];
        }

        notes[nicks].push({
          message : message,
          from : context.from,
          date : moment()
        });

        this.say(context.to, 'Message enregistr\u00e9');
      }
  });

  function getNotes(nick, to) {
    var messages = [];

    for (var nicks in notes) {
      if (nicks.indexOf(' ' + nick.toLowerCase() + ' ') !== -1) {
        messages = messages.concat(notes[nicks]);

        delete notes[nicks];
      }
    }

    if (messages.length) {
      bot.client.say(to, nick + ', vous avez ' + messages.length + ' nouveau' + (messages.length > 1 ? 'x' : '') + ' message' + (messages.length > 1 ? 's' : '') + ' : ');

      messages.forEach(function(msg) {
        bot.client.say(to, msg.date.fromNow() + ' (' + msg.date.format('DD/MM/YYYY HH:mm:ss') + ') par ' + msg.from + ' : ' + msg.message);
      });
    }
  }

  bot.client.addListener('message', function(from, to, text) {
    getNotes(from, to);
  });

  bot.client.addListener('nick', function(old, nick, channels) {
    getNotes(nick, channels[0]);
  });

  bot.client.addListener('join', function(to, nick) {
    getNotes(nick, to);
  });

};