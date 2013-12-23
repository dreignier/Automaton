module.exports = function(bot) {

   bot.command({
      name : ['kill', 'quit'],
      help : '<text> | Tue le bot avec le message donn\u00e9',
      security : 'admin',
      execute : function(context) {
         bot.client.disconnect(context.args.length > 0 ? context.args[0] : "I'll be back");
      }
   });
   
};