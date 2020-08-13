// Init project
var express = require('express');
var app = express();

// Enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Git/Glitch syncing webhook
const gitWebhook = require('./routers/git.js');
app.use('/git', gitWebhook);

// Main API endpoint
const api = require('./routers/api.js');
app.use('/api', api);

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  console.log('GITHUB_URL is set to ' + process.env.GITHUB_URL);
});
