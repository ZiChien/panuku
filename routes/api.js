const express = require('express')
const router = express.Router()
const authRoomExist = require('../Controller/api/authRoomExist')

router.post('/api.authPincode',authRoomExist)
const initRoom = require('../Controller/api/initRoom')
router.get('/api.initRoom',initRoom)

const authUser = require('../Controller/api/authUser')
router.post('/api.authUser',authUser)

const signUp = require('../Controller/api/signUp')
router.post('/api.signUpCheck',signUp.check)

const logout = require('../Controller/logout')
router.get('/logout',logout)

const user = require('../Controller/api/user')
router.get('/api.getUser',user.getUser)
router.put('/api.updateborder',user.updateborder)
router.put('/api.updatePoints',user.updatePoints)

const history = require('../Controller/api/history')
router.post('/api.postroom',history.postNewRoom)
module.exports = router