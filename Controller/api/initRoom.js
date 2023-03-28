const Room = require('../../room')
const msgHistoryMax = 10
const initRoom = (req ,res)=>{
    const room = Room.findRoom(req.query.pinCode)
    if(room.msgList.length>msgHistoryMax){
        let splicenum = room.msgList.length-msgHistoryMax
        room.msgList.splice(0,splicenum)
    }
    return res.send({
        room:room
    })
}
module.exports = initRoom