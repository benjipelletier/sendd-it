const express = require('express')
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const namegen = require('./name-gen/namegen')
const bodyParser = require('body-parser')
const { encryptPass, decryptPass, checkPass } = require('./utils/encrypt')

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
	console.log('Server invoked, middleware test');

	const settings = {timestampsInSnapshots: true};
	db.settings(settings);
	next();
})

 // GET Track updated
app.get('/tracks/:id', (req, res) => {
	db.doc(`tracks/${req.params.id}`).get().then(doc => {
		if (doc.exists) {
			if (checkPass(req.body.pass, doc.data().passcode)) {
				return res.send({
					code: 200,
					body: doc.data()
				})
			} else throw {status: 401}
		} else {
			throw new Error()
		}
	}).catch((err) => {
		if (err.status == 401) {
			return res.send({
				code: 401,
				body: { error: "Not Authorized" }
			});
		}
		return res.send({
			code: 404,
			body: { error: "Not Found" }
		});
	})
})

// GET comments updated
// TODO: limit comments returned / socket.io?
app.get('/tracks/:id/comments', (req, res) => {
	db.collection(`tracks/${req.params.id}/comments`)
	  .orderBy('timestamp', 'desc').get().then(snapshot => {
		let comments = []
		snapshot.forEach(doc => {
			comments.push(doc.data());
		  });
		return res.send({
			code: 200,
			body: comments
		})
	}).catch((err) => {
		res.send({
			code: 404,
			body: { error: "Not Found" }
		});
	})
})

// POST comments updated
app.post('/tracks/:id/comments', (req, res) => {
	db.collection(`tracks/${req.params.id}/comments`).add({
		name: namegen.genNames()[0] || null,
		body: req.body.body || null,
		timestamp: FieldValue.serverTimestamp()
	}).then(ref => {
		return res.send({ code: 200, body: {
			id: ref.id
		}});
	}).catch((err) => {
		res.send({
			code: 404,
			error: "Not Found"
		});
	})
})

// POST track updated
// TODO: add creator information
app.post('/tracks', (req, res) => {
	const date = new Date()
	if (!req.body.title) {
		return res.send({
			code: 400,
			error: "Bad Request: information missing"
		})
	}
	const pass = req.body.pass ? encryptPass(req.body.pass) : null;
	db.collection('tracks').add({
		title: req.body.title,
		timestamp: FieldValue.serverTimestamp(),
		passcode: pass
	}).then(ref => {
		console.log('Added document with ID: ', ref.id);
		return res.send({
			code: 200,
			body: {
				id: ref.id
			}
		})
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
	updateFileUrl(key, object.metadata)
	return 0
});

exports.onStoragePost = functions.storage.object().onFinalize((object) => {
	const key = object.name
	console.log(`Storage POST trigger: ${key}`)
	updateFileUrl(key, object.metadata)
	return 0
});

const updateFileUrl = (key, meta) => {
	const ref = db.collection('tracks').doc(key);
	ref.update({
		token: meta.firebaseStorageDownloadTokens
	}).then(() => {
		console.log('Successfully update meta')
	}).catch(err => {
		console.log(`Update Meta error: key '${key} not found in database'`)
	})
}
