//dependencies

const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db.json")

//Express App

var app = express();
var PORT = process.env.PORT || 3000;

// link assets
app.use(express.static('public'));

// This sets up data parsing

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//On load get root index
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Notes html and it's "url"
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

// GET and POST routes
app.route("/api/notes")
    .get(function (req, res) {
        res.json(database);
    })

    // Add a new note to the json db file.
    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;
        let highestId = 99;


        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestId) {
                highestId = individualNote.id;
            }
        }
        newNote.id = highestId + 1;
        //push to db.json.
        database.push(newNote)

        // Write the db.json file again.
        fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("Your note was saved!");
        });
        // Gives back the response, which is the user's new note. 
        res.json(newNote);
    });

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});