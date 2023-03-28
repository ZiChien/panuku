const room = require('./room')
const history = require('./Controller/api/history')
const socketOn = function (io) {
    io.on('connection', (socket) => {
        socket.on('createroom', async (roomhostName) => {
            let pincode = Math.random().toFixed(7).slice(2)
            while (!room.authPinCode(pincode)) {
                pincode = Math.random().toFixed(7).slice(2)
            }
            socket.join(pincode)
            let newroom = {
                pinCode: pincode,
                roomHostName: roomhostName,
                member: [roomhostName],
                msgList: [],
                question: '',
                answer: '',
                questionStatus: '',
                questionList: [],
            }
            room.roomlist.push(newroom)
            socket.nickname = roomhostName
            socket.pinCode = pincode
            console.log(`room:${pincode} has been created`);
            socket.emit('createSuscess', room.findRoom(pincode))
        })
        socket.on('joinroom', (pinCode, nickname) => {
            socket.join(pinCode)
            socket.nickname = nickname
            socket.pinCode = pinCode
            const index = room.addUserToRooom(pinCode, nickname)
            socket.to(pinCode).emit('userjoin', nickname)
        })
        socket.on('disconnect', () => {
            if (!room.findRoom(socket.pinCode)) {
                return
            }

            const roomindex = room.roomlist.findIndex(room => room.pinCode == socket.pinCode)
            const nameindex = room.roomlist[roomindex].member.findIndex(name => name == socket.nickname)
            room.roomlist[roomindex].member.splice(nameindex, 1)
            io.to(socket.pinCode).emit('userLeave', nameindex)
            room.distroyRoom(socket.pinCode)
        })
        socket.on('sendMsg', (msgobj) => {
            let newMsg = {
                sendBy: socket.nickname,
                msg: msgobj.msg,
                border: msgobj.border,
                color: msgobj.color,
                time: nowHHMM(),
                bingo: false,
                questionMsg: 'commonMsg',
            }
            const index = room.getRoomIndex(socket.pinCode)
            if (index == -1) {
                return
            }
            if (msgobj.msg == '/snow') {
                io.to(socket.pinCode).emit('snow')
                newMsg.msg = `感謝 ${socket.nickname} 的雪花`
                newMsg.sendBy = '系統'
                room.roomlist[index].msgList.push(newMsg)
                io.to(socket.pinCode).emit('newMsg', newMsg)
                return
            }
            if (msgobj.msg == room.roomlist[index].answer && room.roomlist[index].questionStatus == true) {
                newMsg.bingo = true
                newMsg.questionMsg = 'questionMsg'
                room.roomlist[index].questionStatus = false
            }
            room.roomlist[index].msgList.push(newMsg)
            io.to(socket.pinCode).emit('newMsg', newMsg)
        })
        socket.on('sendQuestion', (Q, A) => {
            const index = room.getRoomIndex(socket.pinCode)
            room.roomlist[index].question = Q
            room.roomlist[index].answer = A
            room.roomlist[index].questionList.push({
                Q: Q,
                A: A
            })
            room.roomlist[index].questionStatus = true
            let newMsg = {
                sendBy: '問題',
                msg: Q,
                border: '',
                color: '',
                time: nowHHMM(),
                bingo: false,
                questionMsg: 'questionMsg',
            }
            room.roomlist[index].msgList.push(newMsg)
            io.to(socket.pinCode).emit('newQuestion', Q, A, newMsg)
        })
    })
}
function nowHHMM() {
    const now = new Date()
    let hour
    let min
    if (now.getHours() < 10) {
        hour = `0${now.getHours()}`
    } else {
        hour = now.getHours()
    }
    if (now.getMinutes() < 10) {
        min = `0${now.getMinutes()}`
    } else {
        min = now.getMinutes()
    }
    const hhmm = `${hour}:${min}`
    return hhmm
}
module.exports = { socketOn }