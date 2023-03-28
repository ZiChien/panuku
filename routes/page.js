const express = require('express')
const router = express.Router()

function auth(req, res, next){
    if(req.session.sUemail){
        next()
    }else{
        next()
    }
}

router.get('/',auth,(req, res)=>{
    return res.render('homepage',{
        sUemail:req.session.sUemail,
        sUname:req.session.sUname
    })
})

router.get('/join',(req, res)=>{
    return res.redirect('/')
})
router.get('/room',(req, res)=>{
    return res.redirect('/')
})
router.get('/create',(req, res)=>{
    return res.redirect('/')
})
router.get('/login',(req, res)=>{
    return res.render('login')
})
router.get('/signUp',(req, res)=>{
    return res.render('signUp')
})
router.get('/account/:sUemail',auth,(req, res)=>{
    if(req.session.sUemail != req.params.sUemail){
        return res.send("page not found")
    }
    return res.render('account',{
        sUemail:req.session.sUemail,
        sUname: req.session.sUname
    })
})
router.get('/:other',(req, res)=>{
    res.render('error')
})

module.exports = router