const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Yuri:IfMHnDqi7h8eFnzr@cluster0.p5voe.mongodb.net/textbooks?retryWrites=true&w=majority";
var http = require('http');
var fs = require('fs');
var qs = require('querystring');
	
http.createServer(function (req, res) 
  {	  
	  if (req.url == "/")
	  {
		  file = 'StockTickerApp.html';
		  fs.readFile(file, function(err, txt) {
    	  res.writeHead(200, {'Content-Type': 'text/html'});
		  res.write("This is the home page<br>");
          res.write(txt);
          res.end();
		  });
	  }
	  else if (req.url == "/process")
	  {
		 res.writeHead(200, {'Content-Type':'text/html'});
		 res.write ("Process the form<br>");
		 pdata = "";
		 req.on('data', data => {
           pdata += data.toString();
         });
		// when complete POST data is received
		req.on('end', () => {
			pdata = qs.parse(pdata);    
            // on means when we have the data
            findType = pdata['select'];
            MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, db) {
                if(err) { 
                    console.log("Connection err: " + err); return; 
                }
                if (findType == "stock"){
                    theQuery = {Ticker: {$regex: ".*" + pdata['StockName'] + ".*"}};          
                } else {
                    theQuery = {Company: {$regex: ".*" + pdata['CompanyName'] + ".*"}};             
                }

                var dbo = db.db("Assignment14");
                var coll = dbo.collection('companies');

                coll.find(theQuery).toArray(function(err, items) {
                if (err) {
                    res.write("Error: " + err);
                } 
                else 
                {
                    res.write("Items: </br>");
                    if (items.length == 0){
                        res.write("Not found");
                    } else {
                        for (i=0; i<items.length; i++)
                        res.write(i + ": " + items[i].Company + " by: " + items[i].Ticker + "</br>");		
                    }  		
                }   
                db.close();      
                });//end find	   
            });  //end connect            
		});
	  }
	  else 
	  {
		  res.writeHead(200, {'Content-Type':'text/html'});
		  res.write ("Unknown page request");
		  res.end();
	  } 
}).listen(8080);
