const express = require('express')
var path = require('path')

var app = express()

app.use('/public/',express.static(path.join(__dirname,'./public/')))
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))

// 在 Node 中有很多模板引擎可以使用，不是只有 art-template
//  ejs,jade(pug),handlebars,nunjucks
app.engine('html',require('express-art-template'))
app.set('views',path.join(__dirname,'./views/'))  //默认是 ./views

app.get('/',function(req,res){
    res.render('index.html',{
        name:'lizhi'
    })
})

app.listen(5000,function(){
    console.log('blog is running...')
})