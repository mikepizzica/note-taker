const express = require('express');
const port = process.env.PORT || 3001;
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
        if(error) {
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
    if(error) {
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
        fs.writeFile("./db/db.json",JSON.stringify(notes), error => {
            if(error) {
                throw error;
            }
            else {
                res.send(req.body);
            }
        })
    }
        })
});

app.delete('/api/notes/:id', (req, res) => {
    if(req.params.id) {
        console.log("deleting note" + req.params.id);
        // read in the file of your database
        // when you find object with matching id,
        // remove from array of objects
        
    }
    else{
        res.status(400).send("Please specify a noteId");
    }

    // console.log("DELETE Request Called for /api endpoint")
    // res.send("DELETE Request Called")
});

app.get('*', (req, res) => {
    console.log("in the *");
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () => {
    console.log("listening on port 3001")
});

// /api/notes/:id from here remove note