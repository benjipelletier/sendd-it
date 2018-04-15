const express = require('express')
const functions = require('firebase-functions')
const admin = require('firebase-admin');
 
const serviceAccount = require("./serviceAccountKey.json")

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
    storageBucket: "sendd-it.appspot.com"
});

const app = express();

app.use((req, res, next) => {
	console.log('Server invoked, middleware test');
	next();
})

app.get('/file', (req, res) => {
	const storageRef = admin.storage().bucket()
	var message = '5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
	storageRef.upload('./index.js').then((snap) => {
		res.send('SUCCESS')
	  })
})

app.get('/tracks/:id', (req, res) => {
	admin.database().ref(`/tracks/${req.params.id}`).once('value').then((snap) => {
		if (snap.val()) {
			res.send({
				code: 200,
				body: snap.val()
			})
		} else {
			throw new Error()
		}
	}).catch((err) => {
		res.send({
			code: 404,
			body: {error: "Not Found"}
		});
	})
})

app.get('/comments/:id', (req, res) => {
	admin.database().ref(`/comments/${req.params.id}`).once('value').then((snap) => {
		if (snap.val()) {
			res.send({
				code: 200,
				body: snap.val()
			})
		} else {
			throw new Error()
		}
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
			name: req.query.name || 'default',
			body: req.query.body || 'default',
			timestamp: req.query.timestamp || 'default'
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
		{title: req.query.title,
		 timestamp,
		 passcode: 'XXXX'}
	).getKey()
	admin.database().ref(`/comments/${key}`).set({status: 'null'})
	res.send({
		code: 200,
		body: {
			id: key
		}
	})
})

exports.api = functions.https.onCall((req, res) => {
	if (!req.path) {
		// prepending "/" keeps query params, path params intact
		req.url = `/${req.url}`
	}
	return app(req, res)
});