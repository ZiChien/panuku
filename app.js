const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)
const path = require('path')

const session = require('express-session');
const MongoStore = require('connect-mongo');

const uri = "mongodb+srv://Chian:1k1F12LP5w2qb73U@panuku.lpylash.mongodb.net/?retryWrites=true&w=majority"
app.use(session({
    secret: 'cai39kf299fk03k0f29',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: uri,
        dbName: 'SESSION',
        ttl:60*60
    })
}));

const page = require('./routes/page')
const api = require('./routes/api')

const PORT = process.env.PORT || 3030;
const HOST = '0.0.0.0'
server.listen(PORT, HOST, () => {
    console.log(`server is running on ${HOST}:${PORT}`)
})


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'hbs')

app.use('/', page)
app.use('/api', api)
const socket = require('./socket.js')
socket.socketOn(io)




