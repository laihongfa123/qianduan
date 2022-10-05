// 引入express框架
const express = require('express');
// 路径处理模块
const path = require('path');
const bodyParser = require('body-parser');
const formidable = require('formidable');//解析formData数据
const fs = require('fs');
const request = require('request')//向其他服务器请求数据的模块
// 创建web服务器
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态资源访问服务功能
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  // 1. 允许哪些客户端访问我
  // 2. 允许客户端使用哪些请求方法访问我
  // * 代表允许所有的客户端访问我
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'get,post')
  // 调用next（）方法，请求继续往下匹配
  next()
})
// 对应 01html文件
app.get('/first', (req, res) => {
  res.send('Hello Ajax');
})
// 对应 02html文件
app.get('/responseData', (req, res) => {
  res.send({ "name": "zhangsan" });
});
// 对应 03html文件
app.get('/get', (req, res) => {
  // req.query : get请求参数
  res.send(req.query);
})
// 对应04html文件
app.post('/post', (req, res) => {
  // console.log(req.body)
  res.send(req.body);
})
// 对应05html文件
app.post('/json', (req, res) => {
  res.send(req.body);
})
// 对应06html
app.get('/readystate', (req, res) => {
  res.send('Hello');
})
//对应07html
app.get('/error', (req, res) => {
  // console.log(abc); // abc 这个变量是没有定义的 语法错误
  res.status(400).send('not ok');
})
app.get('/cache', (req, res) => {
  fs.readFile('./test.txt', (err, result) => {
    res.send(result);
  })
})
// 对应检测邮箱地址唯一性.html
app.get('/verifyEmailAdress', (req, res) => {
  // 接收客户端传递过来的邮箱地址以及参数
  const { email } = req.query;
  console.log(email)
  // 判断邮箱地址注册过的情况
  if (email == 'zhif6688@163.com') {
    // 设置http状态码并对客户端做出响应
    res.status(400).send({ message: '邮箱地址已经注册过了, 请更换其他邮箱地址' });
  } else {
    // 邮箱地址可用的情况,对客户端做出响应
    res.send({ message: '恭喜, 邮箱地址可用' });
  }
})
// 输入框文字提示
app.get('/searchAutoPrompt', (req, res) => {
  // 搜索关键字
  const key = req.query.key;
  // 提示文字列表
  const list = [
    '黑马程序员',
    '黑马程序员官网',
    '黑马程序员顺义校区',
    '黑马程序员学院报名系统',
    '传智播客',
    '传智博客前端与移动端开发',
    '传智播客大数据',
    '传智播客python',
    '传智播客java',
    '传智播客c++',
    '传智播客怎么样'
  ];
  // 搜索结果
  let result = list.filter(item => item.includes(key));
  // 将查询结果返回给客户端
  res.send(result);
})
// 获取省份
app.get('/province', (req, res) => {
  res.json([{
    id: '001',
    name: '黑龙江省'
  }, {
    id: '002',
    name: '四川省'
  }, {
    id: '003',
    name: '河北省'
  }, {
    id: '004',
    name: '江苏省'
  }]);
})
// 根据省份id获取城市
app.get('/cities', (req, res) => {
  // 获取省份id
  const id = req.query.id;
  // 城市信息
  const cities = {
    '001': [{
      id: '300',
      name: '哈尔滨市'
    }, {
      id: '301',
      name: '齐齐哈尔市'
    }, {
      id: '302',
      name: '牡丹江市'
    }, {
      id: '303',
      name: '佳木斯市'
    }],
    '002': [{
      id: '400',
      name: '成都市'
    }, {
      id: '401',
      name: '绵阳市'
    }, {
      id: '402',
      name: '德阳市'
    }, {
      id: '403',
      name: '攀枝花市'
    }],
    '003': [{
      id: '500',
      name: '石家庄市'
    }, {
      id: '501',
      name: '唐山市'
    }, {
      id: '502',
      name: '秦皇岛市'
    }, {
      id: '503',
      name: '邯郸市'
    }],
    '004': [{
      id: '600',
      name: '常州市'
    }, {
      id: '601',
      name: '徐州市'
    }, {
      id: '602',
      name: '南京市'
    }, {
      id: '603',
      name: '淮安市'
    }]
  }
  // 响应
  res.send(cities[id]);
})
// 根据城市id获取县城
app.get('/areas', (req, res) => {
  // 获取城市id
  const id = req.query.id;
  // 县城信息
  const areas = {
    '300': [{
      id: '20',
      name: '道里区',
    }, {
      id: '21',
      name: '南岗区'
    }, {
      id: '22',
      name: '平房区',
    }, {
      id: '23',
      name: '松北区'
    }],
    '301': [{
      id: '30',
      name: '龙沙区'
    }, {
      id: '31',
      name: '铁锋区'
    }, {
      id: '32',
      name: '富拉尔基区'
    }]
  };
  // 响应
  res.send(areas[id] || []);
})
// 对应12.html
app.post('/formData', (req, res) => {
  // 创建formidable表单解析对象
  const form = new formidable.IncomingForm();
  // 解析客户端传递过来的FormData对象
  form.parse(req, (err, fields, files) => {
    console.log(fields)
    res.send(fields);
  });
});
// 对应13.html
// 实现文件上传的路由
app.post('/upload', (req, res) => {
  // 创建formidable表单解析对象
  const form = new formidable.IncomingForm();
  // 设置客户端上传文件的存储路径
  form.uploadDir = path.join(__dirname, 'public', 'uploads');
  // 保留上传文件的后缀名字
  form.keepExtensions = true;
  // 解析客户端传递过来的FormData对象
  form.parse(req, (err, fields, files) => {
    // 将客户端传递过来的文件地址响应到客户端
    console.log('测试:', files.img.path)
    // 将客户端传递过来的文件地址响应到客户端
    res.send({
      path: files.img.path.split('public')[1]
    });
  });
});
// 对应21.html
app.get('/server', (req, res) => {
  // err: 错误对象，如果当前这个请求发生了错误，err将会是一个对象类型，否则就是 null
  // response：服务器端的响应信息    body：响应的主体内容
  request('http://localhost:3001/cross', (err, response, body) => {
    // 打印三个参数
    // console.log(err);
    // console.log(response);
    // console.log(body);
    // 向1号服务器端响应的内容
    res.send(body);
  })
})
// 对应21.html
app.get('/base', (req, res) => {
  console.log(req.query)
  const data = req.query
  res.send(data)
})
app.post('/base', (req, res) => {
  console.log(req.body)
  const data = req.body
  res.send(data)
})
// 对应24.html
app.get('/jsonp', (req, res) => {
  // res.jsonp({ name: '张三', age: 18 })
  console.log(req.query)
  const { cb, name, age } = req.query
  const data = `${cb}({name: '${name}',age:'${age}'})`
  // console.log(data)
  res.send(data);
})
/***************************** restful风格API ************************/
// 获取用户列表
app.get('/users', (req, res) => {
  res.send('获取用户列表');
})
//获取用户信息
app.get('/users/:id', (req, res) => {
  //获取客户端传递过来的用户id
  const { id } = req.params;
  res.send(`获取用户id为${id}的用户信息`);
});
// 删除用户信息
app.delete('/users/:id', (req, res) => {
  //获取客户端传递过来的用户id
  const { id } = req.params;
  res.send(`删除用户id为${id}的用户信息`);
});
// 修改用户信息
app.put('/users/:id', (req, res) => {
  //获取客户端传递过来的用户id
  const { id } = req.params;
  res.send(`修改用户id为${id}的用户信息`);
});
/***************************** restful风格API ************************/
// 26.html xml接口
app.get('/xml', (req, res) => {
  res.header('content-type', 'text/xml');
  res.send('<message><title>消息标题</title><content>消息内容</content></message>')

})
// 监听端口
app.listen(3000, () => {
  // 控制台提示输出
  console.log('服务器3000端口启动成功:http://localhost:3000');
});
