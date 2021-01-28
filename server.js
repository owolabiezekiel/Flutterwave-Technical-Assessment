const express = require('express')

const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

app.get('/', async(req, res) => {
  return res.status(200).json({
    message: "My Rule-Validation API",
    status: "success",
    data: {
      name: "Tobiloba Owolabi",
      github: "@owolabiezekiel",
      email: "owo.ezekiel@gmail.com",
      mobile: "08106723916",
      twitter: "@Toby_Ezekiel"
    }
  })
})

app.post('/validate-rule', async(req, res) => {
  
})

module.exports = app