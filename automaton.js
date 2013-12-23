var ircbot = require('./lib/ircbot'),
   fs = require('fs');

var bot = new ircbot(JSON.parse(fs.readFileSync('./config.json')));

bot.connect();

['command', 'google', 'kill', 'nick', 'ping', 'say', 'link'].forEach(function(command) {
   require('./commands/' + command)(bot);
});

require('./lib/rage_meter')(bot);

//Specific case for #FrenchWhine users
bot.client.addListener('message', function(from, to, text, message) {
   if (text === ' ' || text === '') {
      bot.client.say(to, 'pong');
   }
});