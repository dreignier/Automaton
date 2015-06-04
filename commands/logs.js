var fs = require('fs'),
   moment = require('moment');
   
module.exports = function(bot) {

   var directory = './data/logs/';

   // Test if the directory is here. If not, try to create it
   if (!fs.existsSync(directory)) {
      console.info('Creating the ' + directory + ' directory');
      fs.mkdirSync(directory);
   }

   var getLogPath = function(to) {
      return directory + to.replace('#', '') + '-' + moment().format('YYYY-MM-DD') + '.log';
   };

   var log = function(channel, text) {
      fs.appendFileSync(getLogPath(channel), '(' + moment().format('HH:mm:ss') + ') ' + text + '\n');
   }

   bot.client.addListener('message', function(from, to, text) {
      log(to, from + ' : ' + text);
   });

   bot.client.addListener('nick', function(old, nick, channels) {
      log(channels[0], '* NICK ' + old + ' => ' + nick);
   });

   bot.client.addListener('join', function(to, nick) {
      log(to, '* JOIN ' + nick);
   });

   bot.client.addListener('quit', function() {
      var message = '* QUIT ' + nick;

      if (reason) {
         message += ' : ' + reason;
      }

      log(to, message);
   });   

   bot.client.addListener('part', function(to, nick, reason) {
      var message = '* PART ' + nick;

      if (reason) {
         message += ' : ' + reason;
      }

      log(to, message);
   });

   bot.client.addListener('kick', function(to, nick, kicker, reason) {
      var message = '* KICK ' + nick + ' kicked by ' + kicker;

      if (reason) {
         message += ' : ' + reason;
      }

      log(to, message);
   });
   
   bot.client.addListener('selfMessage', function(to, text) {
      // Never log messages to Q
      if (to.toLowerCase() == 'q@cserve.quakenet.org') {
         return;
      }

      log(to, bot.options.nick + ' : ' + text);
   });

};