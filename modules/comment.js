const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/user',{ useNewUrlParser: true ,useUnifiedTopology: true})

var Schema = mongoose.Schema
// var moment = require('moment')
// var date = Date.now
// var time = moment(date.format("YYYY-MM-DD HH-mm-ss"))

var commentSchema = new Schema({
    articleId:{
        type:String,
        required:true
    },
    nickname:{
        type:String,
        required:true
    },
    comments:{
        type:String,
        required:true
    },
    created_time:{
        // type:String,
        // default:new Date().getFullYear()+"-"+Number(new Date().getMonth()+1)+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()
        type:Date,
        default:Date.now      
    }
})

module.exports = mongoose.model('Comment',commentSchema)