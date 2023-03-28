const room = require('../../room')
const authRoomExist = (req, res)=>{
    const pincode = req.body.pincode
    const auth = !room.authPinCode(pincode)
    res.send({
        auth:auth
    })
}
module.exports = authRoomExist