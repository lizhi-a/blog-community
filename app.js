const express = require('express')
var path = require('path')
var router = require('./router')
var session = require('express-session')

var bodyParser = require('body-parser')
var app = express()

app.use('/public/',express.static(path.join(__dirname,'./public/')))
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))

//配置解析表单POST请求体数据,要在app.use(router)之前
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())  

// 在 Node 中有很多模板引擎可以使用，不是只有 art-template
//  ejs,jade(pug),handlebars,nunjucks
app.engine('html',require('express-art-template'))
app.set('views',path.join(__dirname,'./views/'))  //默认是 ./views


// 使用第三方插件 express-session:存取数据状态
// 1.npm install express-session
// 2.配置，一定要在路由之前
// 3.使用
//  当把这个插件配置好之后，我们就可以通过req.session来访问和设置session成员了
//  添加session数据:req.session.foo = 'bar
//  访问session数据:req.session.foo

app.use(session({
    // 配置加密字符串，他会在原有加密基础上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: 'itcast',   
    resave: false,
    // 默认为true:即无论你是否使用session,我都默认直接给你分配一把钥匙
    // 设置 为 false ：只有往session中存数据时才扽配钥匙
    saveUninitialized: false
}))


//把路由挂载到app中
app.use(router)

app.listen(5000,function(){
    console.log('blog is running...')
})