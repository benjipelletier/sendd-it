import firebase from 'firebase'
import config from '../keys.json'

firebase.initializeApp(config)
let firebaseApp = firebase.app()
let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof firebaseApp[feature] === 'function')
console.group('Firebase initialized:')
console.table(features)
firebaseApp.auth().signInAnonymously().catch(function (error) {
  console.log(error.code + ': ' + error.message)
})
console.groupEnd('Firebase initialized')

export default firebaseApp
