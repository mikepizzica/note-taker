const express = require('express');
const PORT = 3001;
const app = express();
const path = require('path');
const fs = require('fs');
const { ifError } = require('assert');

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
        notes.push(req.body);
        console.log("this is the old", notes);
        fs.writeFile("./db/db.json", JSON.stringify(notes), error => {
            if(error) {
                throw error;
            }
            else {
                res.send(req.body);
            }
        })
    }
        })
})

app.get('*', (req, res) => {
    console.log("in the *");
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () => {
    console.log("listening on port 3001")
});