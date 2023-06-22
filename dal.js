const MongoClient = require('mongodb').MongoClient;
const url         = 'mongodb+srv://byambakatmr:6ioHtWOscBEMacCq@bankdb.iomtvoo.mongodb.net/';
let db            = null;
 
async function main(){
    const client = new MongoClient(url);

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        db = client.db('bank');
        console.log("Connected successfully to db server");

    } catch (e) {
        console.error(e);
    } finally {
      //  await client.close();
    }
}

main().catch(console.error);


// create user account
function create(name, email, uid) {
    return new Promise((resolve, reject) => {    
        const collection = db.collection('users');
        const doc = {name, email, uid, balance: 0};
        collection.insertOne(doc, {w:1}, function(err, result) {
            err ? reject(err) : resolve(doc);
        });    
    })
}

// find user account
function find(email) {
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')
            .find({email: email})
            .toArray(function(err, docs) {
                err ? reject(err) : resolve(docs);
        });    
    })
}

// find user account
function findOne(email) {
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')
            .findOne({email: email})
            .then((doc) => resolve(doc))
            .catch((err) => reject(err));    
    })
}

// update - balance
function update(email, amount) {
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')            
            .findOneAndUpdate(
                {email: email},
                { $inc: { balance: amount}},
                { returnOriginal: false },
                function (err, documents) {
                    err ? reject(err) : resolve(documents);
                }
            );            

    });    
}

// all users
function all() {
    return new Promise((resolve, reject) => {    
        const customers = db
        .collection('users')
        .find({})
        .toArray(function(err, docs) {
            err ? reject(err) : resolve(docs);
        });     
    });
}

module.exports = {create, findOne, find, update, all};