const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const videoController = require('./controllers/video');
const EventBusInMemory = require('./video/infrastructure/event-bus-in-memory');
const app = express();
const eventBusInMemory = new EventBusInMemory();
const port = 80;

app.use(bodyParser.json());

app.use(function setHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    next();
});

/**
 * Setup our routers
 */
app.get('/video/:videoId', videoController.createVideoFinderController(eventBusInMemory));
app.post('/video/token', videoController.createTokenController());

/**
 * Setup our handlers to manager async flows/tasks
 * We do not have a dependency container so we can create manually the dependencies here
 */
 (() => {
    const VideoViewedRepositoryMongo = require('./video/infrastructure/video-viewed-repository-mongo');
    const RegisterClientOnVideoViewed = require('./video/application/register-client-on-video-watched');
    new RegisterClientOnVideoViewed(
        new VideoViewedRepositoryMongo(),
        eventBusInMemory
    );
})();

function startServer() {
    mongoose.connect('mongodb://mongo/db');

    const db = mongoose.connection;
    db.on('connected', function () {
        console.log('MongoDB connected!');
    });
    db.on('connecting', function () {
        console.log('connecting to MongoDB...');
    });
    db.on('error', function (error) {
        console.error('Error in MongoDb connection: ' + error);
        mongoose.disconnect();
    });
    db.on('disconnected', function () {
        console.log('MongoDB disconnected!');
        mongoose.connect('mongodb://mongo/db', { server: { auto_reconnect: true } });
    });
    db.once('open', function () {
        console.log('MongoDB connection opened!');
    });
    db.on('reconnected', function () {
        console.log('MongoDB reconnected!');
    });
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });
}

startServer();