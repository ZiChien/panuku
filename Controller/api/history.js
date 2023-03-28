const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://Chian:1k1F12LP5w2qb73U@panuku.lpylash.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri)

async function postNewRoom(req, res) {
    try {
        const USER = client.db('USER')
        const users = USER.collection('users')
        const filter = { email: req.session.sUemail}
        const updateDoc = {
            $push: { history:req.body.room}
        };
        const result = await users.updateOne(filter, updateDoc);
        return res.send(result)
    }catch(err){
        console.log(err);
        return res.send("err")
    }

}
module.exports = {postNewRoom}