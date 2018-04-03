const express = require('express')
const functions = require('firebase-functions')
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

//const config = require('./keys.json')

const app = express();


app.post('/tracks', (req, res) => {
	const date = new Date()
	const timestamp = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
	const key = admin.database().ref('/tracks').push(
		{title: req.query.title,
		 timestamp,
		 passcode: 'XXXX'}
	).getKey()
	admin.database().ref(`/comments/${key}`).set({status: 'null'})
	res.send('SUCCESS')
})

app.get('/tracks/:id', (req, res) => {

	admin.database().ref(`/tracks/${req.params.id}`).once('value').then((snap) => {
		res.send(snap.val())
	}).catch((err) => {
		res.send(err)
	})
})

app.get('/comments/:id', (req, res) => {
	admin.database().ref(`/comments/${req.params.id}`).once('value').then((snap) => {
		res.send(snap)
	}).catch((err) => {
		res.send(err)
	})
})

app.post('/comments/:id', (req, res) => {
	admin.database().ref(`/comments/${req.params.id}/status`).once('value').then((snap) => {
		var index;
		if (snap.val() === "null") index = 0
		else if(snap.val() || snap.val() === 0) index = parseInt(snap.val()) + 1
		else {
			res.send({error: `POST comments/${req.params.id} permission denied`})
			return;
		}
		res.send('Success')
		admin.database().ref(`/comments/${req.params.id}`).update({status: index})
		admin.database().ref(`/comments/${req.params.id}/${index}`).set('somedata')
	})
})

exports.api = functions.https.onRequest((req, res) => {
	if (!req.path) {
		// prepending "/" keeps query params, path params intact
		req.url = `/${req.url}`
	}
	return app(req, res)
});
