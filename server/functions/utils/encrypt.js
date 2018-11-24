const NodeRSA = require('node-rsa')
const rsaKeys = require('../rsa-keys.json')

exports.encryptPass = (pass) => {
	const key = new NodeRSA(rsaKeys.private)
	return key.encrypt(pass, 'base64')
}

exports.decryptPass = (ePass) => {
	const key = new NodeRSA(rsaKeys.private)
	return key.decrypt(ePass, 'utf8')
}

exports.checkPass = (input, dbPass) => {
	return !dbPass || (input === exports.decryptPass(dbPass))
}
