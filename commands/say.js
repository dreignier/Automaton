module.exports = function(bot) {
   
   bot.command({
      name : 'say',
      help : '<text> | Dit <text>',
      security : 'admin',
      execute : function(context) {
         this.say(context.to, context.args.join(' '));
      }
   });
   
};