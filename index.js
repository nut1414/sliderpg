import express from 'express'
import expressWs from 'express-ws'
import ViGEmClient from 'vigemclient'

const vgClient = new ViGEmClient()
vgClient.connect()
const controller = vgClient.createDS4Controller()
controller.connect()

const app = express()
expressWs(app)

app.use(express.static('public'))

app.ws('/ws', (ws, req) => {
  ws.on('message', (msg) => {
  let speed = msg.split(',').map(x => (+x) / 300.0)
  controller.axis.leftX.setValue(speed[0])
  controller.axis.rightX.setValue(speed[1])
  console.log(speed)    
  })
})

app.listen(8080,()=>{
  console.log('Server is running on 8080')
})