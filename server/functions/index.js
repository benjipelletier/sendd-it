const express = require('express')
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');
const os = require('os');

const serviceAccount = require("./serviceAccountKey.json")

try {
	admin.initializeApp(functions.config().firebase);
} catch(e) {
	console.log('!!! Firebase Admin Error');
}

const app = express();

app.use((req, res, next) => {
	console.log('Server invoked, middleware test');
	next();
})

app.post('/file', (req, res) => {
	const busboy = new Busboy({ headers: req.headers });
	let tfp = ''
	busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
		const tempFilePath = path.join(os.tmpdir(), fieldname);
		tfp = tempFilePath
		console.log(`File located from req ` + tempFilePath);
		const storageRef = admin.storage().bucket() 
		file.pipe(fs.createWriteStream(tempFilePath))
		storageRef.upload(tempFilePath).then((snap) => {
			res.send('SUCCESS')
		}).catch((err) => {
			res.send(err)
		})
	});

	busboy.on('finish', function() {
		fs.unlinkSync(tfp)
	});
	req.pipe(busboy);
	busboy.end(req.rawBody);
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
	const timestamp = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${(date.getMinutes() < 10 ? '0':'')}${date.getMinutes()}`;
	if (!req.body.title) {
		res.status(400).send("body.title not defined")
		return
	}
	const key = admin.database().ref('/tracks').push(
		{title: req.body.title,
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

exports.api = functions.https.onRequest((req, res) => {
	if (!req.path) {
		// prepending "/" keeps query params, path params intact
		req.url = `/${req.url}`
	}
	return app(req, res)
});