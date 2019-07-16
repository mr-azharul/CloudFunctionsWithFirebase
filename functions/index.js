const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
let db = admin.firestore();

// Test Function
exports.helloWorld = functions.https.onRequest((req, res) => {
 res.send("Hello World!");
});

//This is using Firestore
exports.addResult = functions.https.onRequest(async (req, res) => {
    db.collection('results').doc(req.query.title).set({
        'Winner': req.query.winner,
        'Looser': req.query.looser
    }).then(created => {
        res.send("Data Added Successfully!");
    });
});

exports.showResult = functions.https.onRequest(async (req, res) => {
    let results = [];
    await db.collection('results').get().then(doc => {
        doc.forEach(response => {
            let data = response.data();
            results.push(data);
        });
    })
    .catch(error => {
        res.send(error);
    });

    res.json(results);
});

exports.updateResult = functions.https.onRequest(async (req, res) => {
    db.collection('results').doc(req.query.title).update({
        'Winner': req.query.winner,
        'Looser': req.query.looser
    }).then(updated => {
        res.send('Update Successfully');
    })
    .catch(error => {
        res.send('Updated Successfully')
    });
});

exports.deleteResult = functions.https.onRequest(async (req, res) => {
    db.collection('results').doc(req.query.title).delete().then(deleted => {
        res.send("Deleted Successfully!");
    })
    .catch(error => {
        res.send(error);
    });
});


// This is using Realtime Database
exports.addMessage = functions.https.onRequest(async(req, res) => {
    const snapshot = await admin.database().ref('/message').push({message: req.query.text});
    
    res.redirect(303, snapshot.ref.toString());
});

exports.makeUpperCase = functions.database.ref('/message/{pushId}/message').onCreate((snapshot, context) => {
    const message = snapshot.val();
    console.log('Uppercasing', context.params.pushId, message);

    const uppercase = message.toUpperCase();

    return snapshot.ref.parent.child('uppercase').set(uppercase);
});


