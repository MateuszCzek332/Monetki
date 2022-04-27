const http = require("http");
const fs = require("fs");
const Datastore = require('nedb')

const allData = new Datastore({
    filename: 'dane.db',
    autoload: true
});
const flagi = new Datastore({
    filename: 'flagi.db',
    autoload: true
});
const stopy = new Datastore({
    filename: 'stopy.db',
    autoload: true
});


const PORT = 3000;
const server = http.createServer((req, response) => {

    switch (true) {
            case  req.method == "GET":
                if (req.url === "/style.css") {
                    fs.readFile("static/style.css", function (error, data) {
                        response.writeHead(200, { 'Content-Type': 'text/plain' });
                        response.write(data);
                        response.end();
                    })
                }
                else if(req.url === "/script.js") {
                    fs.readFile("static/script.js", function (error, data) {
                        response.writeHead(200, { 'Content-Type': 'application/javascript' });
                        response.write(data);
                        response.end();
                    })
                }
                else{
                fs.readFile("static/index.html", function (error, data) {       
                    if (error) {
                        response.writeHead(404, { 'Content-Type': 'text/html' });
                        response.write("<h1>błąd 404 - nie ma pliku!<h1>");
                        response.end();
                    }
                    else {
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.write(data);
                        response.end();
                    }
                });
            }
            break;
            case req.method == "POST" && req.url == "/add":
                add(req, response)
                break;
            case req.method == "POST" && req.url == "/del":
                del(req, response)
                break;
            case req.method == "POST" && req.url == "/all":
                getAll(req, response)
                break;
    }

})

function add(req, res){

    let body = "";
    
    req.on("data", function (data) {
        console.log("data: " + data)
        body += data.toString();
     })

    req.on("end", function (data) {

        body = JSON.parse(body)

        const doc = {
            kraj: body.kraj,
            nom: body.nom,
            nr: body.nr,
            stop: body.stop,
            rok: body.rok,
        };

        allData.insert(doc, function (err, newDoc) {
            console.log(newDoc)
        
            res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
            res.end(JSON.stringify(newDoc, null, 5));
        });
     
     })
}

function getAll(req, res){

    let body = {
        docs: null,
        flags:null,
        stops:null
    }

    allData.find({ }, function (err, docs) {
        console.log(docs)
        body.docs = docs

        flagi.find({ }, function (err, docs2) {
            console.log(docs2)
            body.flags = docs2
            
            stopy.find({ }, function (err, docs3) {
                console.log(docs3)
                body.stops = docs3
                
                res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
                res.end(JSON.stringify(body, null, 5));
            });
        });
    });

}

function del(req, res){

    let body = "";
    
    req.on("data", function (data) {
        console.log("data: " + data)
        body += data.toString();
     })

    req.on("end", function (data) {
        console.log(body)

        allData.remove({ _id: body }, {}, function (err, numRemoved) {
            console.log("usunięto dokumentów: ",numRemoved)
        });

        res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        res.end("usuniete");
     })
}

server.listen(PORT, () => {
    console.log(`serwer startuje na porcie ${PORT}`)
});