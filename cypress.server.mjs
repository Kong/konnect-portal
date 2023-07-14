import path from 'path'
import express from 'express'

const app = express()
const port = 8088

const __dirname = path.resolve()

app.use(express.static('dist', { index: false }))
app.use(express.json())

app.get(/^\/(?!kauth).*/, (req, res) => {
  res.status(200).sendFile(path.join(__dirname, './dist/index.html'))
})

const server = app.listen(port, () => {
  console.log(`Cypress server on port ${port}`)
})

process.on('SIGTERM', () => {
  console.log('EXITING GRACEFULLY...')
  server.close()
  server.unref()

  process.exit(0)
})
