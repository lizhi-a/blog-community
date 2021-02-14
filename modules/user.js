const mongoose = require('mongoose')
//连接数据库
mongoose.connect('mongodb://localhost/user',{ useNewUrlParser: true ,useUnifiedTopology: true})

var Schema = mongoose.Schema


var userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    nickname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    created_time:{
        type:Date,
        // 注意：这里不要写Date.now()，因为会即可调用，会写死时间
        // Date.now，当new Model时,如果你没有传递creat_time，
        // mongoose 会调用 efault 指定的 Date.now 方法，从而去调用这个方法
        default:Date.now
    },
    last_modified_time:{
        type:Date,
        default:Date.now
    },
    avatar:{
        type:String,
        default:'/public/img/avatar-default.png'
    },
    bio:{
        type:String,
        default:''
    },
    gender:{
        type:Number,
        enum:[-1,0,1],
        default:-1
    },
    birthday:{
        type:Date,
        // default:''
    },
    status:{
        type:Number,
        // 0没有权限限制
        // 1不可以评论
        // 2不可以登录使用
        enum:[0,1,2],
        default:0
    }
})

module.exports = mongoose.model('User',userSchema)