import firebase from 'firebase/app'
import 'firebase/firestore'

let db = {}

const config = {
    test: {
        apiKey: 'AIzaSyCVJSCpW_plwp1osQZ1dGA9kkjmpGg9r9Y',
        authDomain: 'majestic-camp-110315.firebaseapp.com',
        databaseURL: 'https://majestic-camp-110315.firebaseio.com',
        projectId: 'majestic-camp-110315',
        storageBucket: 'majestic-camp-110315.appspot.com'
    },
    prod: {
        apiKey: 'AIzaSyDVBTZW4EeO-rGS3BeJWA6MMYqFh2Tvbjs',
        projectId: 'api-project-368343050402',
        authDomain: 'api-project-368343050402.firebaseapp.com',
        databaseURL: 'https://api-project-368343050402.firebaseio.com',
        storageBucket: 'api-project-368343050402.appspot.com'
    }
}
if (!EASY_ENV_IS_NODE) {
    const env = /^dash.geektomato.com$/.test(location.hostname) ? 'prod' : 'test'
    firebase.initializeApp(config[env])
    db = firebase.firestore()
    db.settings({timestampsInSnapshots: true})
}

export default db
