const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs')
const app = express()
const port = 3000

app.use(bodyParser.raw({limit: '200mb'}))
app.use(bodyParser.text({limit: '200mb'}))

app.get('/ok', (req, res) => {
    res.send('Hello World!')
})

app.get('/load/:user', (req, res) => {
    const user = req.params.user
    try {
        const binary = fs.readFileSync(`./save_files/${user}`);
        console.log(binary)
        res.send(binary)
    }
    catch (e) {
        res.send()
    }
})

app.post('/save/:user', (req, res) => {
    const user = req.params.user
    console.log(req.body)
    const binary = fs.writeFileSync(`./save_files/${user}`, req.body)
    res.send('Saved successfully')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
