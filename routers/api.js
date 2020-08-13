const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  console.log('api.js accessed');
  next();
});

router.get("/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

router.get("/timestamp/:date_string?", function (req, res) {
  let date, timestamp, error;
  if (!req.params.date_string) {
    date = new Date();
  } else {
    timestamp = isNaN(Number(req.params.date_string))
      ? req.params.date_string
      : Number(req.params.date_string);
    date = new Date(timestamp);
    error = date.toString() === 'Invalid Date' ? date.toString() : undefined;
    date = !error ? date : undefined;
  }
  let unix = !error ? date.getTime() : undefined;
  let utc = !error? date.toUTCString() : undefined;
  res.json({ unix, utc, error });
});

module.exports = router;
