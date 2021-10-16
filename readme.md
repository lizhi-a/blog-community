# 运行代码
执行`node app.js`并访问 http://localhost:5000/
#  一、路由设计
| 路径 | 方法 | get参数 | post参数 | 是否需要登录 | 备注 |
|------|------|--------|----------|-------------|-----|
|/          |GET   |   |          |                |渲染首页|
|/register  |GET   |   |          |                |渲染注册页面|
|/register  |POST  |   |email,nickname,password  | |处理注册请求|
|/login     |GET   |   |          |                |渲染登录页面|
|/login     |POST| |              |email,password  |处理登录请求|
|/logout    |GET|  |              |                |处理退出请求|
|/topics/new|GET|  |              |                |渲染新建文章页面|
|/topics/new|POST| |        |nickname,title,article|处理新建文章请求|
|/topics/show|GET  |    |         |                |渲染显示文章详情界面|
|/topics/show|POST|||nickname,created_time,comments|处理提交评论请求|
|||||||
#  二、书写步骤
- 创建目录结构
- 整合静态页-模板页
    + include
    + block
    + extend
- 设计用户登录、退出、注册等路由
- 用户注册
    + 无处理好客户端页面的内容(表单控件的name、手机表单数据、发送请求)
    + 服务端
        * 获取客户端表单请求数据
        * 操作数据库
            - 如果有错，告诉客户端错了
            - 其他的根据业务发送不同的响应数据
- 用户登录
- 用户退出

#  三、项目功能说明
1.	登录、注册
2.	新建博客
3.	首页显示全部博客
4.	查看博客详情页
5.	查看博客评论区
6.	修改、删除博客
# 四、最终效果
见博客 https://editor.csdn.net/md/?articleId=120806160
# 五、文件目录结构说明
![在这里插入图片描述](https://img-blog.csdnimg.cn/4ca514e1238d4871bb8fe4f369809b8c.png)
 - modules：包含需要建多个的Schema
 - public：包含公共的Css、Js、Image
 - views：按照不同功能、板块创建文件夹，并在对应文件夹下创建html文件
 - app.js：配置解析表单POST请求体数据、存取数据状态、使用模板引擎、挂载路由
 - router.js：路由配置
# 六、项目技术栈
 - express 框架
 - bootstrap 作为UI框架
 - mongodb 数据库
 - art-template 模板引擎
 - jquery + ajax 发送网络请求
 - 使用 express-session 存取数据状态，通过req.session来访问和设置session成员
 - mongoose 使用了一种直接的、基于scheme结构的方式定义数据模型
# 七、核心技术
## 1. 使用Schema定义数据模型
例如：定义评论的 Schema模型
```js
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
        type:Date,
        default:Date.now      
    }
})
```
## 2. mongoose 的操作
连接mongodb数据库：`mongoose.connect('mongodb://localhost/user',{ useNewUrlParser: true ,useUnifiedTopology: true})`
导出 Schema模型：`module.exports = mongoose.model('Comment',commentSchema)`
## 3.mogodb数据库的操作
查找：`Topic.find(function(err,topics){ ... })`
查找一个：`User.findOne({	},function(err,data){})`
保存信息：`Topic(req.body).save(function(err,data){})`
查找一个并更新：`User.findOneAndUpdate({查找条件},{要修改的信息},function(err,data){})`
删除：`User.remove({查找条件},function(err,data){})`
## 3. 使用第三方插件 express-session:存取数据状态
session 的配置
```js
// 使用第三方插件 express-session:存取数据状态
// 1.npm install express-session
// 2.配置，一定要在路由之前
// 3.使用
//  当把这个插件配置好之后，我们就可以通过req.session来访问和设置session成员了
//  添加session数据:req.session.foo = 'bar
//  访问session数据:req.session.foo
var session = require('express-session')
app.use(session({
    // 配置加密字符串，他会在原有加密基础上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: 'itcast',   
    resave: false,
    saveUninitialized: false
}))
```
通过session 读取状态：
```js
// 用户存在，登录成功，记录登录状态
        req.session.user = user
        res.status(200).json({
            err_code:0,
            message:'OK'
        })
```
清除 session：
```js
	// 清楚登录状态
    // 重定向到登录页，<a>链接是同步请求，所以可以服务端重定向
    req.session.user = null
    res.redirect('/')
```

## 4. 挂载路由
创建路由：`var router = express.Router()`，并在路由上通过router.get()、router.post()方法添加请求，最后导出 router 
## 5.使用md5对密码进行加密
通过md5对密码加密，这样数据库也无法读取到正确的密码
# 八、遇到的问题
1.	没有很好的对时间进行格式化
2.	未实现搜索文章功能
