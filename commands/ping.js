module.exports = function(bot) {
   bot.command({
      name : 'ping',
      help : 'R\u00e9pond avec un pong',
      execute : function(context) {
         this.say(context.to, 'pong');
      }
   });

   bot.command({
      name : 'pong',
      help : 'R\u00e9pond avec un ping',
      execute : function(context) {
         this.say(context.to, 'ping');
      }
   });
};