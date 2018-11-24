const express = require('express')
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const namegen = require('./name-gen/namegen')
const bodyParser = require('body-parser')
const { encryptPass, decryptPass, checkPass } = require('./utils/encrypt')

const serviceAccount = require("./serviceAccountKey.json")

try {
	admin.initializeApp(functions.config().firebase);
} catch (e) {
	console.log('!!! Firebase Admin Error');
}

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
	console.log('Server invoked, middleware test');
	console.log('Comment name test: ' + namegen.genNames()[0])
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

// GET comments
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

// POST comments
app.post('/comments/:id', (req, res) => {
	admin.database().ref(`/comments/${req.params.id}`).once('value').then((snap) => {
		var index = (snap.val().status === "null") ? 0 : snap.numChildren()

		if (snap.val().status) admin.database().ref(`/comments/${req.params.id}/status`).remove();
		admin.database().ref(`/comments/${req.params.id}/${index}`).set({
			name: req.body.name || 'default',
			body: req.body.body || 'default',
			timestamp: req.body.timestamp || 'default'
		})
		admin.database().ref(`/tracks/${req.params.id}`).update({
			commentsAmt: index + 1
		})
		res.send({ code: 200, body: {} })
	}).catch((err) => {
		res.send({
			code: 404,
			body: { error: "Not Found" }
		});
	})
})

// POST track
app.post('/tracks', (req, res) => {
	const date = new Date()
	const timestamp = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '')}${date.getMinutes()}`
	if (!req.body.title) {
		return res.send({
			error: "req.body.title not defined"
		})
	}
	console.log(encryptPass(req.body.pass).length)
	const pass = req.body.pass ? encryptPass(req.body.pass) : "null"
	const dbRef = admin.database().ref('/tracks').push(
		{
			title: req.body.title,
			timestamp,
			passcode: pass,
			commentsAmt: 0
		}
	)
	const key = dbRef.getKey()
	console.log("pass: " + decryptPass("ZSPSbEiBtbLTtBVn+HndMwHbxF3r11lh5JaeiHwnx1lUZ0bc1nKfqNz6eGPoF/gfnhMA2nOZSWwAMeJCqhBjCA=="))
	admin.database().ref(`/comments/${key}`).set({ status: 'null' })
	return res.send({
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

exports.onStorageMetaUpdate = functions.storage.object().onMetadataUpdate((object) => {
	const key = object.name
	console.log(`Storage meta update trigger: ${key}`)
	updateMetadata(key, object.metadata)
	return 0
});

exports.onStoragePost = functions.storage.object().onFinalize((object) => {
	const key = object.name
	console.log(`Storage POST trigger: ${key}`)
	updateMetadata(key, object.metadata)
	return 0
});

const updateMetadata = (key, meta) => {
	try {
		const ref = admin.database().ref().child('tracks').child(key)
		ref.update(meta)
	} catch (err) {
		console.log(`Update Meta error: key '${key} not found in database'`)
	}
}
