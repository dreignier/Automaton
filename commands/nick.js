module.exports = function(bot) {

   bot.command({
      name : ['nick', 'rename'],
      help : '<nick> | Change le pseudo du bot en <nick>',
      security : 'admin',
      execute : function(context) {
         this.send('NICK', context.args[0]);
         bot.nick = context.args[0];
      }
   });
   
};