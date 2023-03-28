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

const app = createApp({
    setup() {
        const points = ref('')
        function init(){
            isloading.value = true
            axios.get('/api/api.getUser')
                .then((res)=>{
                    points.value = res.data.points
                    timeoutforloading()
                })
                .catch((err)=>{
                    console.log(err);
                })
        }
        init()
        return {
            isloading,
            isshowalert, alertMsg,
            points
        }
    }
})
app.mount('#app')