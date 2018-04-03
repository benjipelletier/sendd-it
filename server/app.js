const firebase = require('firebase')
const express = require('express')

const config = require('./keys.json')

const app = express();

firebase.initializeApp(config)
const firebaseApp = firebase.app()
const database = firebase.database()

var courses = [1, 2, 3]

app.get('/test:id', (req, res) => {
    res.send(courses)
})

// firebaseApp.auth().signInAnonymously().then(() => {
//     // database.ref('/comments').push({ //returns id
//     //     author: "gracfehop",
//     //     title: "Announcing COBOL, a New Programming Language"
//     //   });
// }).catch(function (error) {
//     console.log(error.code + ': ' + error.message)
// });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))