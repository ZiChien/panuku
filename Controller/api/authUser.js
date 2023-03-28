const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://Chian:1k1F12LP5w2qb73U@panuku.lpylash.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri)

const bcrypt = require('bcrypt')

const authUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const USER = client.db('USER')
        const users = USER.collection('users')
        const query = { email: email }
        const result = await users.findOne(query)
        if(result==null){
            return res.send({compare:false})
        }
        const match = await bcrypt.compare(password, result.password);
        if (match) {
            req.session.sUemail = result.email
            req.session.sUname = result.username
            return res.send({compare:true })
        }else{
            return res.send({compare:false})
        }
    } catch (err) {
        console.log(err);
    }
}
module.exports = authUser