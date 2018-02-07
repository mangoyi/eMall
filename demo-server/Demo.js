// CommonJs的规范是通过require来加载的, 通过module.exports 来输出的
// 一个js文件就代表着一个模块
/*
nodejs是基于Chrome V8引擎，Chrome是支持大规模的ES6的语法，所以可以在服务器端直接使用ES6，不用再去编译

而我们写前端代码ES6的时候。因为不同的用户使用的浏览器不同，而很多浏览器是不支持ES6的，所以前端代码需要经过babel进行编译转换

*
*/

let user = require('./User.js')
console.log(`userName:${user.userName}`)
console.log(`userName:${user.sayHello()}`)

let http = require('http')
let url = require('url')
let util = require('util')

let server = http.createServer((req, res) => {
  // 1. 创建了一个server,启用了一个服务
  res.statusCode = 200;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");  // response Headers 响应头对应的信息

  url.parse(req.url)                                          // req.url 浏览器请求的地址

  console.log("url:"+req.url)

  // util.inspect(url.parse(req.url))                      // 对当前的url进行解析,但是不能取到明确的url信息

  console.log("parse:"+url.parse(req.url))                 // object

  console.log("inspect:"+util.inspect(url.parse(req.url)))  //

  res.end(util.inspect(url.parse("http://127.0.0.1:3000/demo.html?a=123#tag")))  // 除非将我们的url地址放进去进行解析

});

// 2. 监听端口
server.listen(3000,'127.0.0.1', () => {
  console.log("服务器已经运行，请输入http:127.0.0.1:3000来进行访问");
});

