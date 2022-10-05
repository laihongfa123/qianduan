// 引入express框架
const express = require('express');
// 路径处理模块
const path = require('path');
const formidable = require('formidable');//解析formData数据
// 创建web服务器
const app = express();


// 静态资源访问服务功能
app.use(express.static(path.join(__dirname, 'public')));
// 拦截所有请求,解决跨域问题
app.use((req, res, next) => {
    // * 代表允许所有的客户端访问我
    res.header('Access-Control-Allow-Origin', '*')
    //2.允许客户端使用哪些请求方法访问我
    res.header('Access-Control-Allow-Methods', 'get,post')
    //允许客户端发送跨域请求时携带cookie信息
    res.header('Access-Control-Allow-Credentials', true);
    // 调用next()方法，请求继续往下匹配
    next()
})
// 对应14.html
app.get('/test', (req, res) => {
    // const result = 'fn()';
    // res.send(result);
    res.send('ok');
});
// 对应15.html
app.get('/test1', (req, res) => {
    // 写在字符串中就不会调用函数
    // const result = 'fn()';
    // {name: "zhangsan"} 是 函数fn 的实参
    const result = 'fn({name: "zhangsan"})';
    res.send(result); // 当客户端加载完这个函数调用的时候，fn（） 这个函数会被立即执行。
});
// 对应16-18.html
app.get('/better', (req, res) => {
    // 获取请求参数中的函数名称(接收客户端传递过来的函数的名称)
    const fnName = req.query.callback;
    // 将函数名称对应的函数调用代码返回给客户端
    // const result = 'fn2({name: "张三"})';
    const result = fnName + '({name: "zhangsan"})';
    res.send(result);
    // setTimeout(() => {
    //     res.send(result);
    // }, 1000)
});
// 对应19.html
app.get('/better1', (req, res) => {
    // 接收客户端传递过来的请求参数
    // 将真实的数据转换为字符串。拼接起来，返回给客户端
    const data = req.query || {}
    res.jsonp(req.query);
});
// 对应20.html
app.get('/cross', (req, res) => {
    // 1. 允许哪些客户端访问我
    // 2. 允许客户端使用哪些请求方法访问我
    // * 代表允许所有的客户端访问我
    // res.header('Access-Control-Allow-Origin', '*')
    // res.header('Access-Control-Allow-Methods', 'get,post')
    res.send('ok');
});
// 登录
app.post('/login', (req, res) => {
    var form = formidable.IncomingForm();//解析表单
    form.parse(req, (err, fields, file) => {
        //接收客户端传递过来的用户名和密码
        const { username, password } = fields;//用户名密码比对
        console.log(fields)
        if (username == 'admin' && password == '1111') {
            //设置session
            // req.session.isLogin = true;
            res.send({ message: '登录成功' })
        } else {
            res.send({ message: '登录失败，用户名或密码错误' });
        }
    })
})
app.get('/checkLogin', (req, res) => {
    res.send('ok')
})
// 监听端口
app.listen(3001, () => {
    // 控制台提示输出
    console.log('服务器3001端口启动成功');
});
