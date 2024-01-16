const express = require('express')
const app = express()
const port = 3000
const { Client } = require('pg')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: 'Delta#2023!',
  port: 5432,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");
});