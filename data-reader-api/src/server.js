const app = require('./app')
const yenv = require('yenv')
const env = yenv()

app.listen(env.PORT, () => {
  console.log(`Escuchando en el puerto ${env.PORT}`)
})
