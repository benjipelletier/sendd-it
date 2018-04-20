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
} catch (e) {
	console.log('!!! Firebase Admin Error');
}


const app = express();

app.use((req, res, next) => {
	console.log('Server invoked, middleware test');
	next();
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
			body: { error: "Not Found" }
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
			body: { error: "Not Found" }
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
		res.send({ code: 200, body: {} })
	}).catch((err) => {
		res.send({
			code: 404,
			body: { error: "Not Found" }
		});
	})
})

app.post('/tracks', (req, res) => {
	const date = new Date()
	const timestamp = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '')}${date.getMinutes()}`
	if (!req.query.title) {
		return res.send({
			error: "req.query.title not defined"
		})
	}
	const dbRef = admin.database().ref('/tracks').push(
		{
			title: req.query.title,
			timestamp,
			passcode: 'XXXX'
		}
	)
	const key = dbRef.getKey()
	admin.database().ref(`/comments/${key}`).set({ status: 'null' })
	res.send({
		code: 200,
		body: {
			id: key
		}
	})
})

// const handleFileUpload = (req, id, res) => new Promise((resolve, reject) => {
// 	console.log('FILE SESSION START')
// 	const busboy = new Busboy({ headers: req.headers })
// 	let uploadedFile = false;
// 	busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
// 		console.log(`FILE | INFO | file found - info: ${fieldname} / ${filename}`)
// 		uploadedFile = true
// 		const tempFilePath = path.join(os.tmpdir(), id);
// 		const storageRef = admin.storage().bucket()
// 		//file.pipe(fs.createWriteStream(tempFilePath))
// 		var options = {
// 			destination: id,
// 			metadata: {
// 				contentType: mimetype,
// 				metadata: {
// 					event: 'test meta'
// 				}
// 			}
// 		}
// 		// storageRef.upload(file, options).then((snap) => {
// 		// 	console.log(`FILE | INFO | finished storage upload - path: ${tempFilePath}`)
// 		// 	const resObj = {
// 		// 		id: id,
// 		// 		mimetype: mimetype,
// 		// 	}
// 		// 	resolve(resObj);
// 		// }).catch((err) => {
// 		// 	reject({
// 		// 		message: err,
// 		// 		error: "Could not upload file"
// 		// 	})
// 		// })
// 	})

// 	busboy.on('finish', () => {
// 		if (!uploadedFile) reject({
// 			error: "No file found"
// 		})
// 	})
// 	const storageRef = admin.storage().bucket()
// 	storageRef.upload(req.rawBody, options).then((snap) => {
// 		console.log(`FILE | INFO | finished storage upload - path: ${tempFilePath}`)
// 		const resObj = {
// 			id: id,
// 			mimetype: mimetype,
// 		}
// 		resolve(resObj);
// 	}).catch((err) => {
// 		reject({
// 			message: err,
// 			error: "Could not upload file"
// 		})
// 	})
// 	//busboy.end(req.rawBody)
// })

exports.api = functions.https.onRequest((req, res) => {
	if (!req.path) {
		// prepending "/" keeps query params, path params intact
		req.url = `/${req.url}`
	}
	return app(req, res)
});