import { app } from './src/app'
import { env } from './src/config/env'

app.listen(env.port)

console.info(`API is running at http://localhost:${env.port}`)
