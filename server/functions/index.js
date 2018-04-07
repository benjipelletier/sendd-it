const express = require('express')
const functions = require('firebase-functions')
const admin = require('firebase-admin');

admin.initializeApp();

//const config = require('./keys.json')

const app = express();

app.get('/tracks/:id', (req, res) => {
	admin.database().ref(`/tracks/${req.params.id}`).once('value').then((snap) => {
		res.send({
			code: 200,
			body: snap.val()
		})
	}).catch((err) => {
		res.send({
			code: 404,
			body: {error: "Not Found"}
		});
	})
})

app.get('/comments/:id', (req, res) => {
	admin.database().ref(`/comments/${req.params.id}`).once('value').then((snap) => {
		if (!snap.val()) {
			res.send({
				code: 404,
				body: {error: "Not Found"}
			});
			return;
		}
		res.send({
			code: 200,
			body: snap.val()
		})
	}).catch((err) => {
		res.send({
			code: 404,
			body: {error: "Not Found"}
		});
	})
})

app.post('/comments/:id', (req, res) => {
	admin.database().ref(`/comments/${req.params.id}`).once('value').then((snap) => {
		var index = (snap.val().status === "null") ? 0 : snap.numChildren()

		if (snap.val().status) admin.database().ref(`/comments/${req.params.id}/status`).remove();
		admin.database().ref(`/comments/${req.params.id}/${index}`).set({
			name: req.body.name || 'default',
			body: req.body.body || 'default',
			timestamp: req.body.timestamp || 'default'
		})
		res.send({code: 200, body: {}})
	}).catch((err) => {
		res.send({
			code: 404,
			body: {error: "Not Found"}
		});
	})
})

app.post('/tracks', (req, res) => {
	const date = new Date()
	const timestamp = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
	const key = admin.database().ref('/tracks').push(
		{title: req.body.title,
		 timestamp,
		 passcode: 'XXXX'}
	).getKey()
	admin.database().ref(`/comments/${key}`).set({status: 'null'})
	res.send({
		code: 200,
		body: {}
	})
})

exports.api = functions.https.onRequest((req, res) => {
	if (!req.path) {
		// prepending "/" keeps query params, path params intact
		req.url = `/${req.url}`
	}
	return app(req, res)
});
