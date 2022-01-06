const express = require('express')

const app = express()
const port = 8080

app.use(express.static('public'));
app.use('/node_modules', express.static('node_modules'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})