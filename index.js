const express = require('express');
const { home, submitBucketForm } = require('./controller/home.controller');
const app = express()
const port = 3000

app.use(express.urlencoded());

app.get('/', home);

app.post('/', submitBucketForm);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})