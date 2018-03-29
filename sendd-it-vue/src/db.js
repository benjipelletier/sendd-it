import firebaseApp from './firebase'
const database = firebaseApp.database()

function readData () {
  database.ref('/tracks/').once('value').then(function (data) {
    return data.val()
  })
}

export default database
