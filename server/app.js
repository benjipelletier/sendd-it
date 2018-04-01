const firebase = require('firebase');
const config = require('./keys.json');
const request = require('request');


firebase.initializeApp(config)
var database = firebase.database();
database.ref('/tracks/').once('value').then((data) => {
    console.log("Data: " + data.val());
    firebase.database().goOffline();
});


