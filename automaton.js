var ircbot = require('./lib/ircbot'),
    fs = require('fs'),
    web = require('./lib/web');

if (!fs.existsSync('./data')) {
  console.info('Creating the ./data directory');
  fs.mkdirSync('./data');
}

var bot = new ircbot(require('./config'));

bot.connect();

var commands = 'command google kill nick ping say link analyse old bookmark admin op stream logs uptime roll 8ball note talk';

commands.split(' ').forEach(function(command) {
   require('./commands/' + command)(bot);
});

require('./lib/rage_meter')(bot);

//Specific case for #FrenchWhine users
bot.client.addListener('message', function(from, to, text, message) {
   if (text === ' ' || text === '') {
      bot.client.say(to, 'pong');
   }
});

web.setPort(bot.options.webPort);
web.initialize();