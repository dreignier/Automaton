module.exports = function(bot) {

   bot.command({
      name : ['admin'],
      help : '<password> | Vous authentifie en tant qu\'admin',
      execute : function(context) {
         if (!context.args.length) {
            return;
         }
         
         if (context.args[0] === bot.options.adminPassword) {
            bot.client.whois(context.from, function(info) {
               bot.admins.push(info.nick + '@' + info.host);
               bot.client.say(context.from, 'Ok');
            });
         }
      }
   });
   
};