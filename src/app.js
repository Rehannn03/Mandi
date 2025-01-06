import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

import ledgerRoutes from './routes/ledger.routes.js'
import bepariRoutes from './routes/bepari.routes.js'
import dukaandarRoutes from './routes/dukaandar.routes.js'
import userRoutes from './routes/user.routes.js'

app.use('/api/v1/ledger',ledgerRoutes)
app.use('/api/v1/bepari',bepariRoutes)
app.use('/api/v1/dukaandar',dukaandarRoutes)
app.use('/api/v1/user',userRoutes)


export default app;