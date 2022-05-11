const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

initializeApp({
    credential: applicationDefault()
});

export async function quickstartListen(db) {
    // [START firestore_setup_dataset_read]
    const snapshot = await db.collection('packages').get();
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
    // [END firestore_setup_dataset_read]
}

export async function checkForPackage(pkg) {
    console.log('working on it.');
}
