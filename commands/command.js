var _ = require('underscore');

module.exports = function(bot) {
   bot.command({
      name : 'command',
      help : 'Execute une commande brute',
      security : 'admin',
      execute : function(context) {
         if (context.args.length > 0) {
            this.send.call(this, context.args[0], context.args.length > 1 ? _.rest(context.args).join(' ') : undefined);
         }
      }
   });
};