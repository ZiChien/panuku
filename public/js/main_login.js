const { createApp, ref, reactive, computed, nextTick, watch } = Vue
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

const isloading = ref(false)
const timeoutforloading = function () {
    return new Promise((resovle, reject) => {
        setTimeout(() => {
            isloading.value = false
            resovle()
        }, 600)
    })
}
const logininfo = reactive({
    email: '',
    password: ''
})
const authUser = function () {
    if (logininfo.email == '' || logininfo.password == '') {
        return
    }
    isloading.value = true
    axios.post("/api/api.authUser", logininfo)
        .then(async(res) => {
            await timeoutforloading()
            if(res.data.compare){
                document.location.href='/'
            }else{
                popUpalert("帳號或密碼錯誤")
            }
        })
        .catch((err) => {
            console.log(err);
        })
}
const loginbtn = function () {
    authUser()
}

const app = createApp({
    setup() {
        return {
            isloading,
            isshowalert, alertMsg, loginbtn,
            logininfo,
        }
    }
})
app.mount('#app')