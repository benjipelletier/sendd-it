const firebase = require('firebase');
const config = require('./keys.json');
const request = require('request');


firebase.initializeApp(config)
const firebaseApp = firebase.app()
const database = firebase.database();

firebaseApp.auth().signInAnonymously().then(() => {
    database.ref('/comments/').once('value').then((data) => {
        console.log("Data: " + JSON.stringify(data.val()));
    }).catch();

    // database.ref('/comments').push({ //returns id
    //     author: "gracfehop",
    //     title: "Announcing COBOL, a New Programming Language"
    //   });
}).catch(function (error) {
    console.log(error.code + ': ' + error.message)
});