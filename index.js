const express = require('express')

const app = express()
const port = 3000
app.use(express.json())

app.listen(port, () => {
    console.log(`Flutterwave technical assessment app listening at http://localhost:${port}`);
})