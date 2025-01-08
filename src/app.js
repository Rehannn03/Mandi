import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
const app=express()
const allowedOrigins = ['http://localhost:5173']
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like Postman)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true); // Allow this origin
        } else {
          callback(new Error('Not allowed by CORS')); // Reject other origins
        }
      },
      credentials: true // Allow credentials (cookies, authorization headers)
    })
  );

import ledgerRoutes from './routes/ledger.routes.js'
import bepariRoutes from './routes/bepari.routes.js'
import dukaandarRoutes from './routes/dukaandar.routes.js'
import userRoutes from './routes/user.routes.js'

app.use('/api/v1/ledger',ledgerRoutes)
app.use('/api/v1/bepari',bepariRoutes)
app.use('/api/v1/dukaandar',dukaandarRoutes)
app.use('/api/v1/user',userRoutes)


export default app;