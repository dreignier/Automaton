var ircbot = require('./lib/ircbot'),
   fs = require('fs');

if (!fs.existsSync('./data')) {
  console.info('Creating the ./data directory');
  fs.mkdirSync('./data');
}

var bot = new ircbot(JSON.parse(fs.readFileSync('./config.json')));

bot.connect();

var commands = 'command google kill nick ping say link analyse old bookmark admin op stream logs';

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