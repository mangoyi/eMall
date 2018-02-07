/*
* 通过nodejs来调用其它服务
*
* */
let http = require('http')

let util = require('util')

http.get('http://www.imooc.com/u/card',function (res) {
  let data = '';

  res.on('data', function (chunk) {  // on是表示只要有数据发送过来的时候就可以取到
    data += chunk;
  })

  res.on("end", function () {
    let result = JSON.parse(data);   // 因为data接收到的时候是一个字符串，我们要将data转化成一个对象


    console.log("result"+ util.inspect(result))
  })

})
