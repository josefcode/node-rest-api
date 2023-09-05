import { env } from '../env/env'
import { app } from './app'

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('the server is Running'))
