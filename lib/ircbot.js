(function() {
   var _ = require('underscore');
   var irc = require('./irc');

   var defaults = {
      server : '',
      nick : 'ircbot',
      channels : [],
      floodProtection: true,
      floodProtectionDelay: 1000,
      admin : '',
      qName : '',
      qPassword : '',
      debug : true,
      showErrors : true,
      port : 8888,
      location : 'http://localhost:8888/' 
   };

   var securities = ['none', 'op', 'admin'];

   var Ircbot = function(options) {
      _.defaults(options, defaults);

      this.options = options;
      this.commands = [];
      this.admins = [];
   };

   Ircbot.prototype = {
      options : null,
      client : null,
      commands : null,
      admins : null,

      connect : function() {
         var self = this;
         
         // Remove channels from the conf, we join them later.
         var ircOptions = _.omit(this.options, 'channels');

         console.log('Connecting to ' + this.options.server);
         this.client = new irc.Client(ircOptions.server, ircOptions.nick, ircOptions);

         this.client.addListener('connect', function() {
            console.log('Connected');
            
            self.client.addListener('registered', function() {
               console.log('Connected !');
               
               var join = function() {
                  console.log('Joining channels');
                  self.options.channels.forEach(function(channel) {
                     self.client.join(channel);
                  });
               };
               
               // Connect to Q
               if (self.options.qName && self.options.qPassword) {             
                  self.client.whois('Q', function(info) {
                     if (info.host === 'CServe.quakenet.org' && info.account === 'Q' && info.operator === 'is an IRC Operator' && info.user === 'TheQBot') {
                        console.log('Q authentication ...');
                        self.client.say('Q@CServe.quakenet.org', 'AUTH ' + self.options.qName + ' ' + self.options.qPassword);
                        self.client.send('MODE', self.options.nick, '+x');
                     }
                     
                     join();
                  });
               } else {
                  join();
               }
            });
   
            self.client.addListener('message', function(from, to, text, message) {
               if (text[0] != '!') {
                  return;
               }
   
               console.log('COMMAND : ' + from + ' on ' + to + ' : ' + text);
   
               var command = self.findCommand(text);
               if (command) {
                  var callback = function() {
                     var context = {
                        from : from,
                        to : to,
                        text : text,
                        message : message,
                        args : _.rest(text.split(' '))
                     };
   
                     try {
                        command.execute.call(self.client, context);
                     } catch (error) {
                        console.log('ERROR : ' + error);
                        self.client.say(to, 'Erreur. Magus sale dev en carton, r\u00e9pare moi !')
                     }
                  };
   
                  if (command.security === 'none') {
                     callback();
                  } else {
                     self.security(from, to, command.security, callback);
                  }
               }
            });

            self.command({
               name : ['list', 'help'],
               help : 'Affiche cette liste',
               execute : function(context) {
                  self.getUserSecurity(context.from, context.to, function(security) {
                     self.client.say(context.from, "Liste des commandes : ");
                     self.commands.filter(function(command) {
                        return self.compareSecurity(security, command.security) >= 0;
                     }).sort(function(a, b) {
                        a = Array.isArray(a) ? a[0] : a;
                        a = Array.isArray(b) ? b[0] : b;
   
                        if (a == b) {
                           return 0;
                        }
   
                        return a > b ? +1 : -1;
                     }).forEach(function(command) {
                        var name = ' * !' + (Array.isArray(command.name) ? command.name.join(', !') : command.name);
                        self.client.say(context.from, name + ' : ' + command.help);
                     });
                  });
               }
            });
         });
      },

      getWhoisSecurity : function(info, to) {
         if (info.account == this.options.admin) {
            return 'admin';
         }

         if (info.channels.indexOf('@' + to) !== -1) {
            return 'op';
         }
         
         if (_.contains(this.admins, info.nick + '@' + info.host)) {
            return 'admin';
         }

         return 'none';
      },

      compareSecurity : function(a, b) {
         if (a == b) {
            return 0;
         } else if (securities.indexOf(a) > securities.indexOf(b)) {
            return +1;
         } else {
            return -1;
         }
      },

      getUserSecurity : function(nick, to, callback) {
         var self = this;
         this.client.whois(nick, function(info) {
            callback(self.getWhoisSecurity(info, to));
         });
      },

      security : function(nick, to, security, callback) {
         var self = this;
         this.client.whois(nick, function(info) {
            var userSecurity = self.getWhoisSecurity(info, to);
            if (self.compareSecurity(userSecurity, security) < 0) {
               console.log('ACCESS DENIED');
               self.client.say(nick, 'Ah ah ah ! Nice try but you are not my beloved, great master and mighty god Magus !');
               return;
            }

            callback();
         });
      },

      findCommand : function(text) {
         var result = null;
         this.commands.forEach(function(command) {
            var names = Array.isArray(command.name) ? command.name : [command.name];

            names.forEach(function(name) {
               if ((new RegExp('^!' + name, 'i')).test(text)) {
                  result = command;
               }
            });
         });
         return result;
      },

      command : function(command) {
         _.defaults(command, {
            name : '',
            help : '',
            security : 'none',
            execute : function() {}
         });

         this.commands.push(command);
      }
   };

   module.exports = Ircbot;
})();