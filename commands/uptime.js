var moment = require('moment');

module.exports = function(bot) {

  var start = moment();

  bot.command({
    name : ['uptime'],
    help : "Donne l'uptime du bot",
    execute : function(context) {
      this.say(context.to, 'Uptime : ' + start.fromNow() + ' (' + start.format('DD/MM/YYYY HH:mm:ss') + ')');
    }
  });
   
};