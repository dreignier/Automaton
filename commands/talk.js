var fs = require('fs'),
    _ = require('underscore');

function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

function talk(words, beginning) {
   var result = [],
       word = '__START__';

   if (!words) {
      return '';
   }

   if (beginning) {
      result = beginning;
      word = _.last(beginning);
   }

   while (word != '__END__' && result.length < 25) {
      if (!words[word] || (result.length > 20 && words[word].__END__)) {
         break;
      }

      var random = getRandomInt(0, words[word].__TOTAL__ + 1);

      for (var key in words[word]) {
         if (key != '__TOTAL__') {
            random -= words[word][key];

            if (random <= 0) {
               if (key != '__END__') {
                  result.push(key);
               }
               word = key;

               break;
            }
         }
      }
   }

   if (result.length < 2) {
      // Retry
      return talk(words);
   } else {
      return result.join(' ');   
   }
}

module.exports = function(bot) {

   function addWord(words, from, to) {
      if (!from || !to || from == '__TOTAL__' || to == '__TOTAL__' || from.toLowerCase() == bot.nick.toLowerCase() || to.toLowerCase() == bot.nick.toLowerCase()) {
         return;
      }

      if (!words[from]) {
         words[from] = {
            __TOTAL__ : 0
         };
      }

      words[from][to] = words[from][to] || 0;
      words[from][to] += 1;
      words[from].__TOTAL__ += 1;
   }

   function addLine(words, line) {
      if (line.length < 2 || line[0][0] == '!') {
         return;
      }

      addWord(words, '__START__', line[0]);

      for (var i = 0; i < line.length; ++i) {
         addWord(words, line[i - 1], line[i]);
      }

      addWord(words, line[line.length - 1], '__END__');
   }

	var directory = './data/logs/',
       words = {};

   bot.options.talkative.forEach(function(channel) {
      channel = channel.replace('#', '').toLowerCase();

      words[channel] = {
         __START__ : {
            __TOTAL__ : 0
         }
      };

      console.log('Reading words for channel', channel);

      fs.readdirSync(directory).forEach(function(file) {
         if (file.startsWith(channel.toLowerCase() + '-')) {
            console.log('Reading log file', file);
         }

         var content = fs.readFileSync(directory + file, 'utf-8');

         content.split('\n').forEach(function(line) {
            if (line[11] == '*') {
               return;
            }

            line = line.replace(/ +/g, ' ').split(' ');

            if (line.length < 2 || line[1].toLowerCase() == bot.nick.toLowerCase()) {
               return;
            }

            line = _.rest(line, 3);

            addLine(words[channel], line);
         });
      });

      fs.writeFileSync('./test.json', JSON.stringify(words, null, 4));
   });

   bot.client.addListener('message', function(from, to, text) {
      if (text) {
         if (bot.options.talkative.some(function(channel) {
            return channel.toLowerCase() == to.replace('#', '').toLowerCase()
         })) {
            if (text.toLowerCase().indexOf(bot.nick.toLowerCase()) !== -1) {
               var str = talk(words[to.replace('#', '').toLowerCase()]);

               if (str) {
                  bot.client.say(to, str);
               }
            }
         
            addLine(words[to.replace('#', '').toLowerCase()], text.split(' '));
         }
      }
   });

   bot.command({
      name : ['guess'],
      help : "Devine la fin d'une phrase",
      execute : function(context) {
         this.say(context.to, context.args.split(' '));
      }
   });
};