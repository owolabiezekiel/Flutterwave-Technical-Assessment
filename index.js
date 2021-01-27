const express = require('express')

const app = express()
const port = 3000
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

app.listen(port, () => {
  console.log(`Flutterwave technical assessment app listening at http://localhost:${port}`);
})