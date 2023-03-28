const { createApp, ref, reactive, computed, nextTick, watch } = Vue
const isloading = ref(false)
const timeoutforloading = function () {
    return new Promise((resovle, reject) => {
        setTimeout(() => {
            isloading.value = false
            resovle()
        }, 700)
    })
}
const isshowalert = ref(false)
const alertMsg = ref('')
const popUpalert = function (msg) {
    if (isshowalert.value) {
        return
    }
    alertMsg.value = msg
    isshowalert.value = true
    const close = setTimeout(() => {
        isshowalert.value = false
    }, 3000)
}
const accountInfo = reactive({
    accountID: '',
    points: 120
})
const mySocket = reactive({
    room: {
        pinCode: '',
        roomHostName: '',
        member: [],
        msgList: [],
        question: '',
        answerman: ''
    }
})
const identity = ref('')

function ScrolltoEnd() {
    const msgcontainer = document.getElementById('msgcontainer')
    msgcontainer.scrollTop = msgcontainer.scrollHeight
}
const maku = reactive([])
const makuroad = reactive([
    {
        available: true,
        space: []
    },
    {
        available: true,
        space: []
    },
    {
        available: true,
        space: []
    },
    {
        available: true,
        space: []
    },
])
let msgID = 1
const runmaku = function () {
    if (!maku.length) {
        return
    }
    for (let i = 0; i < makuroad.length; i++) {
        if (makuroad[i].available) {
            makuroad[i].available = false
            maku[0].id = msgID++
            makuroad[i].space.push(maku[0])

            maku.shift()
            setTimeout(() => {
                makuroad[i].available = true
            }, 2000)
            setTimeout(() => {
                makuroad[i].space.shift()
            }, 7000)
            break
        }
    }
}
setInterval(() => {
    runmaku()
}, 300)
const movemsg = document.querySelector('.movemsg')

// movemsg.addEventListener('transitionend', () => {
//     console.log('Animation ended');
// });

const isshowconfetti = ref(false)
const showconfetti = function () {
    isshowconfetti.value = true
    setTimeout(() => {
        isshowconfetti.value = false
    }, 3000)
}
const borderStyle = [
    {
        name: 'border1',
        price: 10,
        islock: false
    },
    {
        name: 'border2',
        price: 10,
        islock: false
    },
    {
        name: 'border3',
        price: 10,
        islock: false
    },
    {
        name: 'border4',
        price: 20,
        islock: true
    },
    {
        name: 'border5',
        price: 40,
        islock: true
    },
    {
        name: 'border6',
        price: 40,
        islock: true
    },
    {
        name: 'border7',
        price: 40,
        islock: true
    },
]
const colorStyle = ['color1', 'color2', 'color3', 'color4','color5','color6','color7']

const applyEffect = reactive({
    border: '',
    color: ''
})
const questioncontent = ref('Question')
const answercontent = ref('')

const app = {
    setup() {
        const main = ref(true)
        const authroom = ref(true)
        const join = ref(false)
        const create = ref(false)
        const room = ref(false)
        const pinCode = ref('')
        const click_authPinCode = function () {
            if (pinCode.value == '') {
                popUpalert("請先輸入房間pin碼")
                return
            }
            isloading.value = true
            axios.post('/api/api.authPincode', { pincode: pinCode.value })
                .then(async (res) => {
                    if (res.data.auth) {
                        await timeoutforloading()
                        authroom.value = false
                        join.value = true
                        history.replaceState(null, null, "/join")

                    }
                    else {
                        isshowalert.value = false
                        await timeoutforloading()
                        popUpalert("房間pin碼不存在")
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        const nickname = ref('')
        const click_joinroom = function () {

            if (nickname.value == '') {
                popUpalert("請輸入暱稱")
                return false
            }
            joinroom(pinCode.value, nickname.value)
            initUser()
            initroom()

        }
        function initUser() {
            axios.get('/api/api.getUser')
                .then((res) => {
                    if (res.data == -1) {
                        accountInfo.points = 135;
                        return
                    }
                    accountInfo.points = res.data.points
                    accountInfo.accountID = res.data.account
                    for (index in res.data.borderStyle) {
                        borderStyle[index].islock = res.data.borderStyle[index]
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        function initroom() {
            isloading.value = true
            axios.get('/api/api.initRoom', { params: { pinCode: pinCode.value } })
                .then(async (res) => {
                    mySocket.room = res.data.room
                    identity.value = 'Guest'
                    join.value = false
                    main.value = false
                    room.value = true
                    history.replaceState(null, null, "/room")
                    if (mySocket.room.questionStatus) {
                        questioncontent.value = 'Question'
                        answercontent.value = mySocket.room.question
                    } else {
                        questioncontent.value = "Question: "+mySocket.room.question
                        answercontent.value = "Answer: "+mySocket.room.answer
                    }
                    mySocket.room.msgList.push({
                        sendBy: '系統',
                        msg: `歡迎${nickname.value}!開始互動吧!`,
                        time: nowHHMM(),
                        questionMsg: 'commonMsg',
                    })
                    await timeoutforloading()
                })
                .catch((err) => {
                    console.log(err);
                })

        }
        const click_create = function () {
            authroom.value = false
            create.value = true
            history.replaceState(null, null, "/create")
        }
        const roomHostName = ref('')
        const click_createroom = async function () {
            if (roomHostName.value == '') {
                popUpalert("請輸入暱稱")
                return false
            }
            isloading.value = true
            createRoom(roomHostName.value)
            create.value = false
            main.value = false
            room.value = true
            initUser()
            await timeoutforloading()
            history.replaceState(null, null, "/room")

        }
        const isShowMember = ref(false)
        const showMember = function () {
            isShowMember.value = !isShowMember.value
        }
        window.addEventListener('click', (e) => {
            if (e.target.id == 'member') return
            if (e.target.id != 'membermodal' && e.target.id != 'members' && e.target.id != 'memname') {
                isShowMember.value = false
            }
        })
        const isShowChatRoom = ref(false)
        const showChatRoom = function () {
            isShowChatRoom.value = !isShowChatRoom.value
        }
        const inputMsg = ref('')
        const sendMsg = function () {
            if (inputMsg.value == '') {
                return false
            }
            if(inputMsg.value == '/snow'){
                if(accountInfo.points<1){
                    return
                }
            }
            emit_sendMsg({
                msg: inputMsg.value,
                border: applyEffect.border,
                color: applyEffect.color
            })
            inputMsg.value = ''
        }

        const isQmodal = ref(false)
        const openQmodal = function () {
            isQmodal.value = !isQmodal.value
        }
        window.addEventListener('click', (e) => {
            if (e.target.id == 'QModal') {
                openQmodal()
            }
        })

        const question = ref('')
        const hasAnswer = ref(true)
        const answer = ref('')
        const turnHasAnswer = function () {
            hasAnswer.value = !hasAnswer.value
        }
        const questionConfirm = function () {
            if (question.value == '') {
                popUpalert("請輸入題目")
                return
            }
            if (hasAnswer.value && answer.value == '') {
                popUpalert("請輸入答案")
                return
            }
            if(hasAnswer.value){
                sendQuestion(question.value, answer.value)
            }else{
                sendQuestion(question.value, false)
            }
            openQmodal()
            question.value = ''
            answer.value = ''
        }

        const isShowEffectmodal = ref(false)
        const showEffectmodal = function () {
            isShowEffectmodal.value = !isShowEffectmodal.value
        }


        const CchangeBorderEffect = function (border,index) {
            if (border == 'bordernone') {
                applyEffect.border = 'bordernone'
                return
            }
            if (border.islock) {
                if (accountInfo.points < border.price) {
                    return
                }
                accountInfo.points -= border.price
                border.islock = false
                axios.put('/api/api.updateborder',{
                    index:index,
                    points:-border.price
                })
            }
            applyEffect.border = border.name
        }
        const CchangeColorEffect = function (color) {
            applyEffect.color = color
        }
        const answerNickname = computed(() => {
            if (mySocket.room.answerman == nickname.value) {
                return '你'
            } else {
                return mySocket.room.answerman
            }
        })

        return {
            main,
            isloading, isshowalert, alertMsg,
            authroom, join, create, room, click_create, click_joinroom, nickname, identity,
            pinCode, click_authPinCode,
            roomHostName, click_createroom,
            mySocket, accountInfo,
            isShowMember, showMember, isShowChatRoom, showChatRoom,
            inputMsg, sendMsg,
            maku, makuroad,
            isQmodal, openQmodal,
            question, hasAnswer, answer, turnHasAnswer, questionConfirm, questioncontent, answercontent,
            isShowEffectmodal, showEffectmodal, borderStyle, applyEffect, CchangeBorderEffect, colorStyle, CchangeColorEffect,
            answerNickname, showconfetti, isshowconfetti,
        }
    }
}
Vue.createApp(app).mount('#app')
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
const socket = io()
const createRoom = function (roomhostName) {
    socket.emit('createroom', roomhostName)
    socket.on('createSuscess', (room) => {
        mySocket.room = room;
        identity.value = 'Admin'
    })
}
const joinroom = function (pinCode, nickname) {
    socket.emit('joinroom', pinCode, nickname)
}
socket.on('userjoin', (newMember) => {
    mySocket.room.member.push(newMember)
    mySocket.room.msgList.push({
        sendBy: '系統',
        msg: `${newMember} 進入了房間`,
        time: nowHHMM(),
        questionMsg: 'commonMsg',
    })
    maku.push({
        sendBy: '系統',
        msg: `${newMember}進入了房間`,
        border: 'noneborder',
        color: '',
        time: nowHHMM(),
        bingo: false,
    })
})
socket.on('userLeave', (userindex) => {
    mySocket.room.msgList.push({
        sendBy: '系統',
        msg: `${mySocket.room.member[userindex]} 離開了房間`,
        time: nowHHMM(),
        questionMsg: 'commonMsg',
    })
    maku.push({
        sendBy: '系統',
        msg: `${mySocket.room.member[userindex]} 離開了房間`,
        border: 'noneborder',
        color: '',
        time: nowHHMM(),
        bingo: false,
    })
    mySocket.room.member.splice(userindex, 1)
})
const emit_sendMsg = function (msgobj) {
    socket.emit('sendMsg', msgobj)
}
socket.on('newMsg', (msgobj) => {
    if (msgobj.bingo) {
        axios.put('/api/api.updatePoints',{
            points:5
        })
        .then((res)=>{
            accountInfo.points+=5
        })
        mySocket.room.answerman = msgobj.sendBy
        showconfetti()
        bingoShoot()

        questioncontent.value = "Question: "+mySocket.room.question
        answercontent.value = "Answer: "+msgobj.msg
    }
    msgobj.time = nowHHMM()
    mySocket.room.msgList.push(msgobj)
    nextTick(() => {
        ScrolltoEnd()
    })
    maku.push(msgobj)
    runmaku()
})
socket.on('snow',()=>{
    playSnow()
    axios.put('/api/api.updatePoints',{
        points:-1
    })
    accountInfo.points--

})
const sendQuestion = function (question, answer) {
    socket.emit('sendQuestion', question, answer)
}
socket.on('newQuestion', (question,answer, newMsg) => {
    mySocket.room.question = question
    if(!answer){
        questioncontent.value = 'Question 本題無標準答案'
    }else{
        questioncontent.value = 'Question'
    }
    answercontent.value = question
    mySocket.room.msgList.push(newMsg)
})



