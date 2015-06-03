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
      return directory + to.replace('#', '') + moment().format('YYYY-MM-DD') + '.log';
   };

   bot.client.addListener('message', function(from, to, text, message) {
      fs.appendFileSync(getLogPath(to), '(' + moment().format('HH:mm:ss') + ') ' + from + ' : ' + text + '\n');
   });
   
};