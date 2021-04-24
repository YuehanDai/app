var http = require('http');
//var port = 8080;
var port = process.env.PORT || 3000;

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("<h2>Node js demo</h2>")
  res.write("Hello World</br>");
  res.write("</br>");
  res.end();
}).listen(port);
