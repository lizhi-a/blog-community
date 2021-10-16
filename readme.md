# 运行代码
`node app.js`
# 路由设计
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
# 书写步骤
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
