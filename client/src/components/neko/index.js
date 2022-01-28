import neko, { NekoVideo } from 'neko-client/dist/neko-lib.umd'
import io from 'socket.io-client'

window.io = io
window.$neko = neko
const client = window.$client
client.$neko = neko
client.$vue = {
  $t (){},
  $notify (){},
  $te () {}
}
export default {
  neko,
  client,
  NekoVideo
}