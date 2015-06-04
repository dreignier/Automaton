var fs = require('fs'),
   moment = require('moment'),
   web = require('../lib/web');

   
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

   web.register(/^logs\//, function(url, req, res) {
      url = url.split('/');

      if (url.length < 5) {
         res.writeHead(400, {'Content-Type': 'text/plain'});
         res.end('Not enought parameters');
         return;
      }

      var channel = url[1].toLowerCase(),
          year = url[2],
          month = url[3],
          day = url[4];
          path = directory + channel + '-' + year + '-' + month + '-' + day + '.log';

      console.log('path : ', path);

      fs.exists(path, function(exists) {
         if (!exists) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('404 not found');
         } else {
            fs.readFile(path, function(err, data) {
               if (err) {
                  res.writeHead(500, {'Content-Type': 'text/plain'});
                  res.end('Unable to read the log file, contact the administrator');
                  return;
               }

               res.writeHead(200, {'Content-Type': 'text/plain'});
               res.end(data);
            });
         }
      });
   });

   bot.command({
      name : ['logs'],
      help : 'Donne le lien vers les logs du jour',
      execute : function(context) {
         this.say(context.to, 'Logs du jour : ' + bot.options.location + 'logs/' + context.to.toLowerCase() + '/' + moment().parse('YYYY/MM/DD'));
      }
   });
};