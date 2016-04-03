var http = require('http');

var listeners = [],
    port;

module.exports = {

  register : function(regexp, handler) {
    listeners.push({
      regexp : regexp,
      handler : handler
    });
  },

  setPort : function(newPort) {
    port = newPort;
  },

  initialize : function() {
    // Register a mini server
    http.createServer(function(req, res) {
      var url = req.url;

      if (!url) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 not found');
        return;
      }

      if (url.charAt(0) == '/') {
        url = url.substring(1);
      }

      if (url.indexOf('//') != -1) {
        res.writeHead(400, {'Context-Type': 'text/plain'});
        res.end('400 bad request');
        return;
      }

      console.log('Request on ' , url);

      for (var index = 0; index < listeners.length; ++index) {
        var listener = listeners[index];

        if (listener.regexp.test(url)) {
          listener.handler(url, req, res);
          return;
        }
      }

      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404 not found');
    }).listen(port);
  }

};
