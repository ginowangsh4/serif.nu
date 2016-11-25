import express from 'express';
import path from 'path';
import { MongoClient } from 'mongodb';

const app = express();

app.use(express.static('dist'));

const url4650 = `mongodb://${process.env.MLAB_USER}:${process.env.MLAB_PASS}@${process.env.MLAB_URL}/4650`;
let db4650;

MongoClient.connect(url4650, (err, database) => {
    db4650 = database;
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Running on port ${port}`);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/data/schools', (req, res) => {
    db4650.collection('schools').find().toArray((err, result) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });
});

app.get('/data/subjects/:school', (req, res) => {
    db4650.collection('subjects').find({ school: req.params.school }).toArray((err, result) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });
});

app.get('/data/courses/:school/:subject', (req, res) => {
    db4650.collection('courses').find(
        {
            school: req.params.school,
            subject: req.params.subject
        }
    ).toArray((err, result) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });
});

app.get('/data/sections/:school/:subject/:course', (req, res) => {
    db4650.collection('sections').find(
        {
            school: req.params.school,
            subject: req.params.subject,
            course: req.params.course
        }
    ).toArray((err, result) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });
});

app.get('/data/details/:school/:subject/:course/:section', (req, res) => {
    db4650.collection('details').find(
        {
            school: req.params.school,
            subject: req.params.subject,
            course: req.params.course,
            section: req.params.section
        }
    ).toArray((err, result) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });
});