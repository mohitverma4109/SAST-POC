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
// SONARQUBE CLIENT DEMO - INTENTIONAL FINDINGS
// ============================================================
// WARNING:
// The following code is intentionally insecure/incorrect.
// DEMO ENVIRONMENT ONLY.
// DO NOT USE THESE PATTERNS IN PRODUCTION.
// ============================================================

var crypto = require('crypto');
var https = require('https');
var childProcess = require('child_process');
var fsDemo = require('fs');


// ============================================================
//                    10 INTENTIONAL BUGS
// ============================================================

/*
 * BUG #1
 * "NaN" should not be used in comparisons
 */
function demoBug01(value) {
  if (value === NaN) {
    console.log('Value is NaN');
  }
}


/*
 * BUG #2
 * "in" should not be used with primitive types
 */
function demoBug02(value) {
  if ('name' in value) {
    console.log('Name exists');
  }
}


/*
 * BUG #3
 * "delete" should be used only with object properties
 */
function demoBug03() {
  var value = 100;
  delete value;
}


/*
 * BUG #4
 * for-loop counter moves in the wrong direction
 */
function demoBug04() {
  for (var i = 0; i < 10; i--) {
    console.log(i);
  }
}


/*
 * BUG #5
 * Invalid typeof comparison
 */
function demoBug05(value) {
  if (typeof value === 'integer') {
    console.log('Value is integer');
  }
}


/*
 * BUG #6
 * Incorrect NaN comparison
 */
function demoBug06(number) {
  if (number == NaN) {
    return true;
  }

  return false;
}


/*
 * BUG #7
 * Another invalid typeof value
 */
function demoBug07(value) {
  if (typeof value === 'stringg') {
    return value.toUpperCase();
  }

  return value;
}


/*
 * BUG #8
 * Array sort without a proper numeric comparison
 */
function demoBug08(numbers) {
  return numbers.sort();
}


/*
 * BUG #9
 * Function condition intentionally written incorrectly
 */
function demoBug09(value) {
  if (value = 10) {
    return true;
  }

  return false;
}


/*
 * BUG #10
 * Unreachable code
 */
function demoBug10() {
  return 'completed';

  console.log('This code can never execute');
}


// ============================================================
//                10 INTENTIONAL VULNERABILITIES
// ============================================================

/*
 * VULNERABILITY #1
 *
 * Weak cipher algorithm.
 *
 * Demonstrates:
 * "Cipher algorithms should be robust"
 */
function demoVulnerability01(data) {
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
 * VULNERABILITY #2
 *
 * TLS certificate validation disabled.
 *
 * Demonstrates:
 * "Server certificates should be verified during SSL/TLS
 * connections"
 */
function demoVulnerability02() {

  var options = {
    hostname: 'example.com',
    port: 443,
    path: '/',
    method: 'GET',

    // INTENTIONAL SECURITY ISSUE
    rejectUnauthorized: false
  };

  var request = https.request(
    options,
    function(response) {
      console.log(
        'Demo HTTPS response: ' +
        response.statusCode
      );
    }
  );

  request.on('error', function(error) {
    console.log(error.message);
  });

  request.end();
}


/*
 * VULNERABILITY #3
 *
 * Weak cryptographic key.
 *
 * Demonstrates:
 * "Cryptographic keys should be robust"
 */
function demoVulnerability03(data) {

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
 * VULNERABILITY #4
 *
 * Cross-Site Scripting.
 *
 * User-controlled input is directly written into HTML.
 */
app.get('/sonar-demo-xss', function(req, res) {

  var username = req.query.username;

  res.send(
    '<html><body>' +
    '<h1>Welcome ' +
    username +
    '</h1>' +
    '</body></html>'
  );
});


/*
 * VULNERABILITY #5
 *
 * Command injection demonstration.
 *
 * User input is passed into a system command.
 *
 * DEMO ONLY.
 */
app.get('/sonar-demo-command', function(req, res) {

  var command = req.query.command;

  childProcess.exec(
    'echo ' + command,
    function(error, stdout) {

      if (error) {
        return res.status(500).send(
          'Command error'
        );
      }

      res.send(stdout);
    }
  );
});


/*
 * VULNERABILITY #6
 *
 * Path traversal demonstration.
 *
 * User-controlled path is directly used for file access.
 *
 * DEMO ONLY.
 */
app.get('/sonar-demo-file', function(req, res) {

  var filename = req.query.file;

  fsDemo.readFile(
    '/tmp/' + filename,
    'utf8',
    function(error, data) {

      if (error) {
        return res.status(500).send(
          'File error'
        );
      }

      res.send(data);
    }
  );
});


/*
 * VULNERABILITY #7
 *
 * Dynamic code execution.
 *
 * eval() should not be used with untrusted input.
 */
function demoVulnerability07(userInput) {

  return eval(userInput);
}


/*
 * VULNERABILITY #8
 *
 * Hardcoded credential.
 *
 * Depending on the SonarQube rule/profile,
 * this may appear as a Security Hotspot.
 */
var demoDatabasePassword =
  'DemoDatabasePassword123!';


/*
 * VULNERABILITY #9
 *
 * Hardcoded API token.
 *
 * Depending on the active rule,
 * this may appear as a Security Hotspot.
 */
var demoApiToken =
  'DEMO-API-TOKEN-123456789';


/*
 * VULNERABILITY #10
 *
 * Insecure HTTP URL.
 *
 * Demonstrates transmission of data over
 * an unencrypted HTTP connection.
 */
function demoVulnerability10(username) {

  var url =
    'http://example.com/api/user?name=' +
    username;

  return url;
}


// ============================================================
// END OF SONARQUBE DEMO FINDINGS
// ============================================================
