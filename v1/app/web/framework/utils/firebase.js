import firebase from 'firebase/app'
import 'firebase/firestore'

let db = {}

const config = {
    test: {
        apiKey: '',
        authDomain: '',
        databaseURL: '',
        projectId: '',
        storageBucket: ''
    },
    prod: {
        apiKey: '',
        projectId: '',
        authDomain: '',
        databaseURL: '',
        storageBucket: ''
    }
}
if (!EASY_ENV_IS_NODE) {
    const env = /^dash.geektomato.com$/.test(location.hostname) ? 'prod' : 'test'
    firebase.initializeApp(config[env])
    db = firebase.firestore()
    db.settings({timestampsInSnapshots: true})
}

export default db
