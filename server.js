// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// Enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// Webhook for updating Glitch via a Github adapted from
// https://github.com/nmcardoso/glitch-github-sync/
const cmd = require('node-cmd');
const crypto = require('crypto');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const verifySignature = (req, res, next) => {
  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac('sha1', process.env.GITHUB_SECRET);
  const digest = 'sha1=' + hmac.update(payload).digest('hex');
  const checksum = req.headers['x-hub-signature'];

  if (!checksum || !digest || checksum !== digest) {
    return res.status(403).send('auth failed');
  }
  return next();

}

app.post('/git', verifySignature, (req, res) => {
  if (req.headers['x-github-event'] == 'push') {
    cmd.get('bash git.sh', (err, data) => {
      if (err) return console.log(err);
      console.log(data);
      cmd.run('refresh');
      return res.status(200).send(data);
    });
  } else if (req.headers['x-github-event'] == 'ping') {
    return res.status(200).send('PONG');
  } else {
    return res.status(200).send('Unsuported Github event. Nothing done.');
  }
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  console.log('GITHUB_URL is set to ' + process.env.GITHUB_URL);
});
