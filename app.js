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
// SONARQUBE VULNERABILITY DEMO
// INTENTIONAL VULNERABILITIES - DEMO ENVIRONMENT ONLY
// DO NOT USE THESE PATTERNS IN PRODUCTION
// ============================================================

var https = require('https');
var crypto = require('crypto');
var childProcess = require('child_process');
var fsDemo = require('fs');


// ============================================================
// VULNERABILITY #1 - OS COMMAND INJECTION
// Rule: OS commands should not be vulnerable to
// command injection attacks
// ============================================================

app.get('/demo-vuln-command', function(req, res) {

  var userCommand = req.query.command;

  childProcess.exec(
    userCommand,
    function(error, stdout) {

      if (error) {
        return res.status(500).send('Command error');
      }

      res.send(stdout);
    }
  );
});


// ============================================================
// VULNERABILITY #2 - PATH INJECTION
// Rule: I/O function calls should not be vulnerable
// to path injection attacks
// ============================================================

app.get('/demo-vuln-file', function(req, res) {

  var filename = req.query.file;

  fsDemo.readFile(
    filename,
    'utf8',
    function(error, data) {

      if (error) {
        return res.status(500).send('File error');
      }

      res.send(data);
    }
  );
});


// ============================================================
// VULNERABILITY #3 - DYNAMIC CODE INJECTION
// Rule: Dynamic code execution should not be vulnerable
// to injection attacks
// ============================================================

app.get('/demo-vuln-eval', function(req, res) {

  var expression = req.query.expression;

  var result = eval(expression);

  res.send(String(result));
});


// ============================================================
// VULNERABILITY #4 - OPEN REDIRECT
// Rule: HTTP request redirections should not be open
// to forging attacks
// ============================================================

app.get('/demo-vuln-redirect', function(req, res) {

  var target = req.query.url;

  res.redirect(target);
});


// ============================================================
// VULNERABILITY #5 - SERVER-SIDE REQUEST FORGERY
// Rule: Server-side requests should not be vulnerable
// to forging attacks
// ============================================================

app.get('/demo-vuln-ssrf', function(req, res) {

  var targetUrl = req.query.url;

  https.get(
    targetUrl,
    function(response) {

      var data = '';

      response.on('data', function(chunk) {
        data += chunk;
      });

      response.on('end', function() {
        res.send(data);
      });

    }
  ).on('error', function(error) {

    res.status(500).send(
      'Request error: ' + error.message
    );

  });
});


// ============================================================
// VULNERABILITY #6 - WEAK CIPHER
// Rule: Cipher algorithms should be robust
// ============================================================

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


// ============================================================
// VULNERABILITY #7 - INSECURE ENCRYPTION MODE
// Rule: Encryption algorithms should be used with
// secure mode and padding scheme
// ============================================================

function demoInsecureEncryption(data) {

  var key = Buffer.alloc(16);
  var iv = null;

  var cipher = crypto.createCipheriv(
    'aes-128-ecb',
    key,
    iv
  );

  return (
    cipher.update(data, 'utf8', 'hex') +
    cipher.final('hex')
  );
}


// ============================================================
// VULNERABILITY #8 - WEAK CRYPTOGRAPHIC KEY
// Rule: Cryptographic keys should be robust
// ============================================================

function demoWeakKey(data) {

  var weakKey = Buffer.from(
    '1234567890123456'
  );

  var cipher = crypto.createCipheriv(
    'aes-128-cbc',
    weakKey,
    Buffer.alloc(16)
  );

  return (
    cipher.update(data, 'utf8', 'hex') +
    cipher.final('hex')
  );
}


// ============================================================
// VULNERABILITY #9 - INSECURE TLS PROTOCOL
// Rule: Weak SSL/TLS protocols should not be used
// ============================================================

function demoWeakTLS() {

  var agent = new https.Agent({
    minVersion: 'TLSv1'
  });

  return agent;
}


// ============================================================
// VULNERABILITY #10 - UNVERIFIED TLS CERTIFICATE
// Rule: Server certificates should be verified during
// SSL/TLS connections
// ============================================================

function demoUnverifiedCertificate() {

  var options = {
    hostname: 'example.com',
    port: 443,
    path: '/',
    method: 'GET',

    rejectUnauthorized: false
  };

  return https.request(options);
}


// ============================================================
// END SONARQUBE VULNERABILITY DEMO
// ============================================================

// ============================================================
// END OF SONARQUBE DEMO FINDINGS
// ============================================================
