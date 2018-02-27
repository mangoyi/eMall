// 加入util工具类,日期格式化工具
require('./../util/util');

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

// 修改购物车商品数量
router.post("/cartEdit", function (req, res, next) {
    var userId = req.cookies.userId,
        productId = req.body.productId,
        productNum = req.body.productNum,
        checked = req.body.checked;

    User.update({"userId": userId, "cartList.productId": productId},{  // 查询对应的用户， 修改cartList子文档中商品id为productId中的商品数量productNum
       "cartList.$.productNum" : productNum,
        "cartList.$.checked" : checked,
    }, function (err, doc) {
        if(err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            });
        } else {
            res.json({
                status: '0',
                msg: '',
                result: 'suc'
            })
        }
    });
});

// 购物车中商品全部选中和全不选中
router.post("/editCheckAll", function (req, res, next) {
   var userId = req.cookies.userId,
       checkAll = req.body.checkAll ? '1': '0';

   // 批量更新子文档里面的数据
   User.findOne({userId: userId}, function (err, user) {

       if (err) {
           res.json({
               status: '1',
               msg: err.message,
               result: ''
           });
       } else {
           // 匹配当前用户
           if (user) {

               // 将子文档遍历然后修改checked属性值
               user.cartList.forEach( (item) => {
                  item.checked = checkAll;
               });

               // 然后保存修改
               user.save(function (err1, doc) {

                   if (err1) {
                       res.json({
                           status: '1',
                           msg: err1.message,
                           result: ''
                       });
                   } else {
                       res.json({
                           status:'0',
                           msg:'',
                           result:'suc'
                       });
                   }

               });
           }
       }

   });

});

// 查询用户地址
router.get('/addressList', function (req, res, next) {

    var userId = req.cookies.userId;
    User.findOne({userId: userId}, function (err, doc) {
       if (err) {  // 说明没找到
           res.json({
               status: '1',
               msg: err.message,
               result: ''
           });
       } else {
           res.json({
               status: '0',
               msg: '',
               result: doc.addressList        // 直接将用户的地址列表返回给前端
           })
       }
    });

});

// 选择默认地址
router.post("/setDefault", function (req, res, next) {

    var userId = req.cookies.userId,
        addressId = req.body.addressId;

    if (!addressId) {          // 如果addressId没有获取到
        res.json({
            status: '1000005',
            msg: "addressId is null",
            result: ''
        });
    } else {
        User.findOne({userId: userId}, function(err, doc) {

            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: ''
                });
            } else {
                var addressList = doc.addressList;    // 获取到地址列表

                addressList.forEach((item) => {
                    if (item.addressId == addressId) {
                        item.isDefault = true;                              // 只设置当前为默认地址
                    } else {
                        item.isDefault = false;                             // 其他全部不是默认地址
                    }
                });
            }

            doc.save(function (err1, doc1) {

                if (err1) {
                    res.json({
                        status: '1',
                        msg: err1.message,
                        result: ''
                    });
                } else {
                    res.json({
                        status: '0',          // 默认地址设置成功
                        msg: '',
                        result: ''
                    });
                }

            });

        });
    }


});

// 删除地址
router.post("/delAddress", function (req, res, next) {
   var userId = req.cookies.userId,
       addressId = req.body.addressId;

   User.update({
       userId: userId
   }, {
       $pull: {
           'addressList': {
               'addressId': addressId
           }
       }
   }, function (err, doc) {

       if (err) {
           res.json({
               status: '1',
               msg: err.message,
               result: ''
           });
       } else {
           res.json({
               status: '0',        // 地址删除成功
               msg: '',
               result: ''
           });
       }

   });

});

// 生成支付订单
router.post("/payMent", function(req, res, next) {

    var userId = req.cookies.userId,
        addressId = req.body.addressId,
        orderTotal = req.body.orderTotal;

    User.findOne({userId: userId}, function (err, doc) {

        if(err) {
            res.json({
                status:'1',
                msg: err.message,
                result: ''
            });
        } else {           // 获得用户信息

            // 获取选中的地址信息
            var address = '',
                goodsList = [];
            doc.addressList.forEach( (item) => {
                if(addressId == item.addressId) {       // 说明用户使用的是item.addressId 这个地址
                    address = item;
                }
            });

            // 获取购物车中选中的商品
            doc.cartList.filter((item) => {
               if (item.checked == '1') {
                   goodsList.push(item);
               }
            });

            // 日期格式化
            var r1 = Math.floor(Math.random()*10);
            var r2 = Math.floor(Math.random()*10);

            var sysDate = new Date().Format('yyyyMMddhhmmss');    // 年月日时分秒, 系统时间
            var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');  // 订单创建时间

            var platform = '866';  // 平台码

            var orderId = platform + r1 + sysDate + r2;   //   创建了订单Id

            // 创建订单
            var order = {
                orderId: orderId,
                orderTotal: orderTotal,        // 前端传
                addressInfo: address,          // 前端传
                goodsList: goodsList,
                orderStatus: '1',
                createDate: createDate
            };

            doc.orderList.push(order);      // 把上面创建的数据push到订单列表的数组中

            doc.save(function (err1, doc) {

                if (err1) {
                    res.json({
                        status: '1',
                        msg: err1.message,
                        result: ''
                    });
                } else {
                    res.json({
                        status: '0',
                        msg: '',
                        result: {
                            orderId: order.orderId,
                            orderTotal: orderTotal
                        }
                    });
                }
            });
        }
    });
});

// 订单Id查询订单信息
router.get("/orderDetail", function(req, res, next) {

    var userId = req.cookies.userId, orderId = req.param("orderId");

    User.findOne({userId: userId}, function (err, userInfo) {
       if(err) {
           res.json({      // 1. res.json  是输出json文档   2. res.end  是直接结束
               status: '1',
               msg: err.message,
               result: ''
           });
       } else {

           var orderList = userInfo.orderList;
           if(orderList.length > 0) {
               var orderTotal = 0;
               orderList.forEach( (item) => {

                   if(item.orderId == orderId) {
                        orderTotal = item.orderTotal;
                   }

               });

                if(orderTotal > 0 ) {     // 严谨性 订单金额>0
                    res.json({
                        status: '0',
                        msg: '',
                        result: {
                            orderId: orderId,
                            orderTotal: orderTotal
                        }
                    });
                } else {
                    res.json({
                        status: '13331',
                        msg: '无此订单',
                        result: ''
                    });
                }

           }else {
               // 没有订单
               res.json({
                   status: '13332',
                   msg: '当前用户无订单',
                   result: ''
               });
           }

       }
    });

});

module.exports = router;
