/* eslint-disable prettier/prettier */
import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { transitionsRoutes } from './routes/routes'

export const app = fastify()

app.register(cookie)
app.register(transitionsRoutes, {
   prefix: 'user'
})