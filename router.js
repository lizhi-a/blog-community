var User = require('./modules/user')
var Topic = require('./modules/topic')
var Comment = require('./modules/comment')
var express = require('express')
var md5 = require('blueimp-md5')

var router = express.Router()

router.get('/',function(req,res){
    Topic.find(function(err,topics){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'Server error'
            })
        }
        res.render('index.html',{
            user:req.session.user,
            topics:topics
        })
    })
})

router.get('/login',function(req,res){
    res.render('login.html')
})

router.post('/login',function(req,res){
    // 1.获取表单数据
    // 2.查询数据库，邮箱密码是否正确
    // 3.发送响应数据
    var body = req.body
    User.findOne({
        email : body.email,
        // password : md5(md5(body.password))
        password : body.password
    },function(err,user){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }

        if(!user){
            return res.status(200).json({
                err_code:1,
                message:'email or password is invalid'
            })
        }

        // 用户存在，登录成功，记录登录状态
        req.session.user = user
        res.status(200).json({
            err_code:0,
            message:'OK'
        })
    })
})

router.get('/register',function(req,res){
    res.render('register.html')
})

router.post('/register',function(req,res){
    //1.获取表单提交的数据,req.body

    //2.操作数据库
    //  判断该用户是否存在
    //  如果已存在，不允许注册
    //  如果不存在，注册新用户
    //3.发送响应
    var body = req.body
    User.findOne({
        $or:[
            {
                email:body.email
            },
            {
                nickname:body.nickname
            }
        ]
    },function(err,data){
        //express 提供了一个响应方法：json
        // 0 : 正常
        // 1 : 邮箱或昵称已存在
        // 500 : 服务器错误
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'Server error'
            })
        }
        if(data){
            // 邮箱或者昵称已存在
            return res.status(200).json({
                err_code:1,
                message:'Email or nickname already exists'
            })
        }
        //对密码进行加密
        // body.password = md5(md5(body.password) + 'itcast')
        body.password = body.password

        new User(body).save(function(err,user){
            if(err){
                return res.status(500).json({
                    err_code:500,
                    message:'Server error'
                })
            }
            // 注册成功，使用session记录用户的登录状态
            req.session.user = user

            res.status(200).json({
                err_code:0,
                message:'OK'
            })
        })
    })
})

router.get('/logout',function(req,res){
    // 清楚登录状态
    // 重定向到登录页，<a>链接是同步请求，所以可以服务端重定向
    req.session.user = null
    res.redirect('/')
})

router.get('/topics/new',function(req,res){
    Topic.find(function(err,topics){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'Server error'
            })
        }
        res.render('topic/new.html',{
            user:req.session.user
        })
    })
})
router.post('/topics/new',function(req,res){
    //1.获取表单提交的数据,req.body

    //2.操作数据库
    //  存入数据库user topics
    //3.发送响应
    var body = req.body
    body.nickname = req.session.user.nickname
    new Topic(body).save(function(err,data){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'Server error'
            })
        }
        res.status(200).json({
            err_code:0,
            message:'OK'
        })
    })
})

router.get('/topics/show',function(req,res){
    const id = (req.query.id).replace(/\"/g,"")
    Topic.findOne({
        _id:id
    },function(err,topic){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'Server error'
            })
        }
        Comment.find({
            articleId:req.query.id
        },function(err,comments){
            if(err){
                return res.status(500).json({
                    err_code:500,
                    message:'Server error'
                })
            }
            res.render('topic/show.html',{
                topic:topic,
                user:req.session.user,
                comments:comments
            })
        })
    })
})

router.post('/topics/show',function(req,res){
    //1.获取表单提交的数据,req.body
    //2.操作数据库
    //  存入数据库user comments
    //3.发送响应
    var body = req.body
    if(req.session.user == undefined){
        // 0:发布成功
        // 1:未登录
        // 500:服务器错误
        return res.status(200).json({
            err_code:1,
            message:'Already Logout'
        })
    }
    body.nickname = req.session.user.nickname
    new Comment(body).save(function(err,comment){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'Server error'
            })
        }
        res.status(200).json({
            err_code:0,
            message:'OK'
        })
    })

})

router.get('/settings/profile',function(req,res){
    res.render('settings/profile.html',{
        user:req.session.user
    })
})
router.post('/settings/profile',function(req,res){
    var body = req.body
    User.findOneAndUpdate({
        _id:req.session.user._id
    },{
        nickname : body.nickname,
        bio : body.bio,
        gender : body.gender
    },function(err,user){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'Server error'
            })
        }
        req.session.user = user
        req.session.user.bio = body.bio
        req.session.user.nickname = body.nickname
        req.session.user.gender = body.gender
        res.status(200).json({
            err_code:0,
            message:'OK'
        })
    })
})

router.get('/settings/admin',function(req,res){
    res.render('settings/admin.html',{
        user:req.session.user
    })

})
router.post('/settings/admin',function(req,res){
    var body = req.body
    User.findOneAndUpdate({
        _id:req.session.user._id
    },{
        password:body.newPassword
    },function(err,user){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'Server error'
            })
        }
        req.session.user = user
        res.status(200).json({
            err_code:0,
            message:'OK'
        })
    })
})
router.get('/settings/delete',function(req,res){
    User.remove({
        _id:req.session.user._id
    },function(err,user){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'Server error'
            })
        }
        res.status(200).json({
            err_code:0,
            message:'OK'
        })
    })
})

router.get('/settings/myblog',function(req,res){
    Topic.find({
        nickname:req.session.user.nickname
    },function(err,topics){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'Server error'
            })
        }
        res.render('settings/myblog.html',{
            user:req.session.user,
            topics:topics
        })
    })
})

router.get('/topics/myblog_show',function(req,res){
    const id = (req.query.id).replace(/\"/g,"")
    Topic.findOne({
        _id:id
    },function(err,topic){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'Server error'
            })
        }
        Comment.find({
            articleId:req.query.id
        },function(err,comments){
            if(err){
                return res.status(500).json({
                    err_code:500,
                    message:'Server error'
                })
            }
            // console.log(comments)
            res.render('topic/myblog_show.html',{
                topic:topic,
                user:req.session.user,
                comments:comments
            })
        })
    })
})

router.get('/settings/myblog/delete',function(req,res){
    const id = (req.query.id).replace(/\"/g,"")
    Topic.remove({
        _id:id
    },function(err,comment){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'Server error'
            })
        }
        res.redirect('/settings/myblog')
    })
})


router.get('/myblog/update',function(req,res){
    const id = (req.query.id).replace(/\"/g,"")
    Topic.findOne({
        _id:id
    },function(err,topic){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'Server error'
            })
        }
        res.render('topic/myblog_update.html',{
            user:req.session.user,
            topic:topic
        })
    })
})
router.post('/myblog/update',function(req,res){
    //1.获取表单提交的数据,req.body

    //2.操作数据库
    //  存入数据库user topics
    //3.发送响应
    var body = req.body
    const id = (body.id).replace(/\"/g,"")

    Topic.findOneAndUpdate({
        _id:id
    },{
        model:body.model,
        title:body.title,
        article:body.article
    },function(err,user){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'Server error'
            })
        }
        res.status(200).json({
            id:id,
            err_code:0,
            message:'OK'
        })
    })
})

router.get('/settings/myblog/comment_delete',function(req,res){
    const id = (req.query.id).replace(/\"/g,"")
    const articleId = (req.query.articleId).replace(/\"/g,"")
    Comment.remove({
        _id:id
    },function(err,comment){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'Server error'
            })
        }
        res.redirect('/topics/myblog_show?id="'+articleId+'"')
    })
})

module.exports = router