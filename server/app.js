var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs')

var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express)
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 全局拦截
app.use(function (req, res, next) {

    // 存cookie是通过res来存，取cookie是通过req来获取
    if (req.cookies.userId) {        // 表示已经登陆了
        next();                      // 不需要任何操作，继续往后执行
    } else {

        if (req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.path == '/goods/list')  {  // 登陆或则退出登录都不去拦截,(表示匹配的查询商品url)查看商品的时候也不去拦截
            next();                                                                    // req.path == '/goods/list'  可以使用 req.originalUrl.indexOf("/goods/list") > -1 ) 来表示查看商品
        } else {
            res.json({
                status: '10001',
                msg: '当前未登录',
                result: ''
            })
        }

    }

});

app.use('/', index);
app.use('/users', users);
app.use('/goods', goods);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
