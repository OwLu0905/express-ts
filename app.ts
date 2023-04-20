import express from 'express'

const port = 3000
const app = express()

app.use(express.json())

app.get('/', (req, res)=> {
	res.status(200).json({name:'weiii', status: 'busy'})
})

app.get('/api/vi/count', (req, res) => {
	res.status(200).json({
		success: true,
		data: {name:'weiii', status: 'busy'}
	})
})

app.use('/', (req, res) => {
	res.status(404).send("<h1>Page Not Found</h1>")
})

app.listen(port, () => {
	console.log(`App runs on ${port}`)
})
