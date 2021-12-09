const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const path = require('path');
const fs = require('fs');
const { ifError } = require('assert');
const uuid = require('uuid');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    console.log("in the api routes");
    fs.readFile('./db/db.json', (error, results) => {
        if (error) {
            throw error;
        }
        else {
            res.send(results);
        }
    })
})

app.post('/api/notes', (req, res) => {
    console.log(req.body);
    fs.readFile('./db/db.json', (error, results) => {
        if (error) {
            throw error;
        }
        else {
            var notes = JSON.parse(results);
            var newNote = {
                title: req.body.title,
                text: req.body.text,
                id: uuid.v1()
            }
            notes.push(newNote);
            console.log("this is the old", notes);
            fs.writeFile("./db/db.json", JSON.stringify(notes), error => {
                if (error) {
                    throw error;
                }
                else {
                    res.send(req.body);
                }
            })
        }
    })
});

app.delete("/api/notes/:id", function (req, res) {
    const note = req.params.id;
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const notesArr = notes.filter(item => {
            return item.id !== note
        });
        fs.writeFile('./db/db.json', JSON.stringify(notesArr), (err, data) => {
            console.log("note deleted")
            if (err) throw err;
            res.json(notesArr)
        });
    });
});

app.listen(PORT, () => {
    console.log("listening on port 3001")
});

// /api/notes/:id from here remove note