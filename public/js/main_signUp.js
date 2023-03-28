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
const showSignUp = ref(true)
const showSignUpSus = ref(false)
const Signinfo = reactive({
    email: '',
    username: '',
    password: '',
    confirmpassword: ''
})
const signbtn_available = ref(false)
function CheckEmpty() {
    if (Signinfo.email == '') {
        popUpalert("請輸入電子郵件")
        return false
    }
    if (Signinfo.username == '') {
        popUpalert("請輸入使用者名稱")
        return false
    }
    if (Signinfo.password == '') {
        popUpalert("請輸入密碼")
        return false
    }
    if (Signinfo.confirmpassword == '') {
        popUpalert("請輸入確認密碼")
        return false
    }
    if (Signinfo.password != Signinfo.confirmpassword) {
        popUpalert("密碼與確認密碼有誤")
        return false
    }
    return true
}
const check = function () {
    axios.post('/api/api.signUpCheck', Signinfo)
        .then(async (res) => {
            await timeoutforloading()
            if(res.data.auth){
                showSignUp.value = false
                showSignUpSus.value = true
            }else{
                emaillabel.value = true
            }

        })
        .catch((err) => {
            console.log(err);
        })
}
const emaillabel = ref(false)
const signupbtn = function () {
    if (!CheckEmpty()) return
    isloading.value = true
    check()
}

const app = createApp({
    setup() {
        watch(Signinfo, () => {
            let check = true;
            signbtn_available.value = false
            for (info in Signinfo) {
                if (Signinfo[info] == '') {
                    check = false
                }
            }
            signbtn_available.value = check
        })
        return {
            showSignUp,showSignUpSus,
            isloading,
            isshowalert, alertMsg, signupbtn,
            Signinfo, signbtn_available,emaillabel
        }
    }
})
app.mount('#app')