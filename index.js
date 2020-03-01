const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

function willCollide () {
  if (
    request.pos['x'] < 0
    || request.pos['x'] < 0
    || request.post['x'] > board['width'] - 1
    || request.post['y'] > board['height'] - 1) {
      return true
    } else {
      return false
    }
}

app.post('/start', (request, response) => {

  const data = {
    color: '#DFFF00',
  }

  return response.json(data)
})

app.post('/move', (request, response) => {
  const data = {move='left'}
  // if (willCollide) {
  //   data = {move: 'left'}
  // } else {
  //   data = {move: 'right'}
  // }
  return response.json(data)
})

app.post('/end', (request, response) => {
  return response.json({})
})

app.post('/ping', (request, response) => {
  return response.json({});
})

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
