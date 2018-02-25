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

                res.cookie('userName', doc.userName, {
                    path: '/',
                    maxAge: 1000*60*60
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

// 登陆拦截
router.get("/checkLogin", function (req, res, next) {
    if (req.cookies.userId) {   // 判断是否存在userId这个cookie
        res.json({
            status: '0',
            msg: '',
            result: req.cookies.userName || ''
        })
    } else {  // 表示当前未登录
        res.json({
            status: '1',
            msg: '当前未登录',
            result: ''
        })
    }
});

// 查询当前用户的购物车数据
router.get('/cartList', function (req, res, next) {

    var userId = req.cookies.userId;
    User.findOne({userId:userId}, function (err,doc) {    // 查询用户id对应的数据
        if (err) {
            res.json({
                status:'1',
                msg: err.message,
                result: ''
            });
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: doc.cartList          // 这里便取到了用户对应的购物车列表
                })
            }
        }
    });
});

// 删除购物车商品
router.post('/cartDel', function (req, res, next) {
    var userId = req.cookies.userId, productId = req.body.productId;
    User.update({
        userId: userId                           // 查询到这个用户的条件
    }, {
        $pull:{                                    // $pull 来删除数组元素，删除cartList数组下面的为productId的数据
            'cartList': {
                'productId': productId
            }
        }
    }, function (err, doc) {
        if(err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: 'suc'
            })
        }
    });

});

module.exports = router;
