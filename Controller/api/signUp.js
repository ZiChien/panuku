const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://Chian:1k1F12LP5w2qb73U@panuku.lpylash.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri)

const bcrypt = require('bcrypt')
const saltRounds = 10

exports.check = (req, res) => {
    const { email, username, password, confirmpassword } = req.body
    async function check() {
        try {
            const USER = client.db("USER")
            const users = USER.collection("users")
            const query = { email: email }
            const result = await users.findOne(query)
            if (result == null) {
                signup()
                return res.send({ auth: true })
            } else {
                return res.send({ auth: false })
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    function signup() {
        const info = {
            email: email,
            username: username,
            password: '',
            points:180,
            borderStyle:[false,false,false,true,true,true,true],
            colorStyle:[false,false,false,false],
            history:[],
        }
        bcrypt.hash(password, saltRounds).then(async function (hash) {
            info.password = hash
            try {
                const USER = client.db('USER')
                const users = USER.collection('users')
                const result = await users.insertOne(info)
            }
            catch (err) {
                console.log(err);
            }
        })

    }
    check()
}

