const http = require("http");
const fs = require("fs");
const Datastore = require('nedb')

const coll1 = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});

const PORT = 3000;
const server = http.createServer((req, response) => {

    switch (req.method) {
            case "GET":
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
                break;
            case "POST":
                serverResponse(req, response)
                break;
    }

})

function serverResponse(req, res){

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
        };

        coll1.insert(doc, function (err, newDoc) {
            console.log(newDoc)
            console.log("losowe id dokumentu: "+newDoc._id)
        });

        res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        res.end(JSON.stringify(body, null, 5));
     
     })
}

server.listen(PORT, () => {
    console.log(`serwer startuje na porcie ${PORT}`)
});