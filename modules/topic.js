const mongoose = require('mongoose')
const user = require('./user')

mongoose.connect('mongodb://localhost/user',{ useNewUrlParser: true ,useUnifiedTopology: true})

var Schema = mongoose.Schema


var topicSchema = new Schema({
    nickname:{
        type:String,
        default:''
    },
    model:{
        type:Number,
        required:true,
        enum:[0,1,2,3],
        default:0
    },
    title:{
        type:String,
        required:true
    },
    article:{
        type:String,
        required:true
    },
    created_time:{
        type:Date,
        default:Date.now
    },
    last_modified_time:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Topic',topicSchema)
