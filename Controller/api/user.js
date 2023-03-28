const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://Chian:1k1F12LP5w2qb73U@panuku.lpylash.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri)

function getUser(req, res) {
    async function get() {
        try {
            const USER = client.db("USER")
            const users = USER.collection("users")
            const query = { email: req.session.sUemail }
            const result = await users.findOne(query)
            if (result == null) {
                return res.send("-1")
            } else {
                return res.send({
                    account: result.email,
                    points: result.points,
                    borderStyle: result.borderStyle,
                    colorStyle: result.colorStyle,
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    get()
}
function updateborder(req, res) {
    if(!req.session.sUemail){
        return res.send("error")
    }
    async function update() {
        try {
            const USER = client.db("USER")
            const users = USER.collection("users")
            const filter = { email: req.session.sUemail }
            const updateDoc = {
                $inc: {
                    points:req.body.points
                },
                $set:{
                    [`borderStyle.${req.body.index}`] : false
                }
            };
            const result = await users.updateOne(filter, updateDoc);
            res.send("update")
        }
        catch (err) {
            console.log(err);
        }
    }
    update()
}
function updatePoints(req, res){
    if(!req.session.sUemail){
        return res.send("error")
    }
    async function update() {
        try {
            const USER = client.db("USER")
            const users = USER.collection("users")
            const filter = { email: req.session.sUemail }
            const updateDoc = {
                $inc: {
                    points:req.body.points
                }
            };
            const result = await users.updateOne(filter, updateDoc);
            res.send("update")
        }
        catch (err) {
            console.log(err);
        }
    }
    update()
}
module.exports = { getUser, updateborder,updatePoints }