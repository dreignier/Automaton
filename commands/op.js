module.exports = function(bot) {

   bot.command({
      name : ['op'],
      help : 'Le bot vous op sur le canal',
      security : 'admin',
      execute : function(context) {
         this.send('MODE', context.to, '+o', context.from);
      }
   });
   
};