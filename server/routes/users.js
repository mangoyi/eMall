var express = require('express');
var router = express.Router();

var User = require('./../models/user');    // 导入User模型

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
    res.send('respond with a test');
});

router.post('/login', function(req, res, next) {    // 登陆的路由

    var param = {
        userName: req.body.userName,
        userPwd: req.body.userPwd
    };

    User.findOne(param, function (err, doc) {    // 用User模型来使用mongoose的api查询数据. 在数据库中查询param参数对应的用户
        console.log("------------------------------"+doc);
        if(err) {
            res.json({
                status: '1',
                msg: err.message
            });
        } else {
            if (doc) {   // 已经获取这个用户,说明登陆成功

                // cookie设置
                res.cookie("userId", doc.userId, {
                    path: '/',   // 存放在服务器的根目录
                    maxAge: 1000*60*60   // 存储的时间是一个小时
                });

                res.json({
                    status: '0',
                    msg: '',
                    result: {
                        userName: doc.userName           // 返回给前端
                    }
                })
            }
        }


    })

});

// 退出登录接口
router.post("/logout", function (req, res, next) {   // req 请求  res 响应 next 表示继续往下一步执行

    // 清cookie
    res.cookie("userId", "", {
        path: "/",
        maxAge: -1
    });

    res.json({
        status: "0",
        msg: '',
        result: ''
    })

});

module.exports = router;
