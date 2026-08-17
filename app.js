var express = require('express');
var session = require('express-session');
var engine = require('ejs-locals');
var path = require('path');
var favicon = require('serve-favicon');
var fs = require('fs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log4js = require('log4js');
var crypto = require('crypto');
var https = require('https');

var init_db = require('./model/init_db');
var login = require('./routes/login');
var products = require('./routes/products');

var app = express();

// config second logger
log4js.loadAppender('file');
// log4js.addAppender(log4js.appenders.console());
log4js.addAppender(
  log4js.appenders.file('app-custom.log'),
  'vnode'
);

var logger4js = log4js.getLogger('vnode');
logger4js.setLevel('INFO');

var accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log')
);

/*
 * Template engine
 */
app.engine('ejs', engine);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(
  logger('combined', {
    stream: accessLogStream
  })
);

app.use(bodyParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    // Existing security-sensitive configuration.
    // Kept here for SonarQube Security Hotspot demonstration.
    secret: 'ñasddfilhpaf78h78032h780g780fg780asg780dsbovncubuyvqy',

    cookie: {
      // Existing security-sensitive configuration.
      // Kept here for SonarQube Security Hotspot demonstration.
      secure: false,
      maxAge: 99999999999
    }
  })
);

/*
 * Routes config
 */
app.use('', products);
app.use('', login);


// ============================================================
// SONARQUBE DEMONSTRATION SECTION
// INTENTIONAL SECURITY/BUG FINDINGS - DEMO ENVIRONMENT ONLY
// These functions are intentionally not called.
// ============================================================

/*
 * ------------------------------------------------------------
 * DEMO BUG #1
 * Rule:
 * "NaN" should not be used in comparisons
 * ------------------------------------------------------------
 */
function demoBugNaN(value) {
  if (value === NaN) {
    console.log('Value is NaN');
  }
}


/*
 * ------------------------------------------------------------
 * DEMO BUG #2
 * Rule:
 * "in" should not be used with primitive types
 * ------------------------------------------------------------
 */
function demoBugPrimitiveIn(value) {
  if ('name' in value) {
    console.log('Name exists');
  }
}


/*
 * ------------------------------------------------------------
 * DEMO BUG #3
 * Rule:
 * "delete" should be used only with object properties
 * ------------------------------------------------------------
 */
function demoBugDelete() {
  var value = 100;

  delete value;
}


/*
 * ------------------------------------------------------------
 * DEMO VULNERABILITY #1
 * Rule:
 * Cipher algorithms should be robust
 *
 * DES is intentionally used here for SonarQube demonstration.
 * DO NOT use this algorithm in production.
 * ------------------------------------------------------------
 */
function demoWeakCipher(data) {
  var cipher = crypto.createCipher(
    'des',
    'demo-password'
  );

  return (
    cipher.update(data, 'utf8', 'hex') +
    cipher.final('hex')
  );
}


/*
 * ------------------------------------------------------------
 * DEMO VULNERABILITY #2
 * Rule:
 * Server certificates should be verified during SSL/TLS
 * connections
 *
 * rejectUnauthorized: false intentionally disables TLS
 * certificate verification.
 * ------------------------------------------------------------
 */
function demoInsecureTLS() {
  var requestOptions = {
    hostname: 'example.com',
    port: 443,
    path: '/',
    method: 'GET',

    // INTENTIONAL DEMO VULNERABILITY
    rejectUnauthorized: false
  };

  var request = https.request(
    requestOptions,
    function(res) {
      console.log(
        'Demo HTTPS response: ' + res.statusCode
      );
    }
  );

  request.on('error', function(error) {
    console.log(
      'Demo HTTPS error: ' + error.message
    );
  });

  request.end();
}


/*
 * ------------------------------------------------------------
 * DEMO VULNERABILITY #3
 * Weak cryptographic key demonstration
 *
 * Intentionally weak key for SonarQube demonstration.
 * DO NOT use this key in production.
 * ------------------------------------------------------------
 */
function demoWeakKey(data) {
  var weakKey = '12345678';

  var cipher = crypto.createCipheriv(
    'aes-128-ecb',
    Buffer.from(weakKey),
    null
  );

  return (
    cipher.update(data, 'utf8', 'hex') +
    cipher.final('hex')
  );
}


/*
 * ------------------------------------------------------------
 * DEMO HARD-CODED SECRET
 *
 * This is intentionally included for security scanning
 * demonstration. It may appear as a Security Hotspot
 * depending on the active SonarQube rules.
 * ------------------------------------------------------------
 */
var demoApiKey = 'DEMO-API-KEY-123456789';
var demoPassword = 'DemoPassword123!';


// ============================================================
// END OF SONARQUBE DEMONSTRATION SECTION
// ============================================================


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


/*
 * Debug functions and error handlers
 */
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);

    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  res.render('error', {
    message: err.message,
    error: {}
  });
});


/*
 * Create database
 */
logger4js.info('Building database');

init_db();

module.exports = app;
