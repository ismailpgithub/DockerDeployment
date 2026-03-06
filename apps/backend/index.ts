import { config } from 'dotenv';
import path from 'path';

// Load from monorepo root
const envPath = path.resolve(__dirname, '../../.env');

const result = config({ path: envPath, debug: true });

if (result.error) {
  console.error("Failed to load .env:", result.error.message);
} else {
  console.log("Successfully loaded .env from:", envPath);
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
}

import express from 'express'
import { prismaClient } from "db/client"


const app = express();

app.use(express.json())

app.get("/users", (req, res)=>{
    prismaClient.user.findMany().then((users) => {
        res.json(users)
    }).catch((err) => {
        res.status(500).json({error: err.message})
    });
})


app.post('/user', (req, res)=>{
    console.log(req.body)
    const {username, password} = req.body;
    if(!username || !password){
        res.status(400).json({error: "Username and password are required"})
        return 
    }

    prismaClient.user.create({
        data:{
            username,
            password
        }
    }).then( user => {
        res.status(201).json(user)
    }).catch(err =>{
        res.status(500).json({error: err.message})
    })
})

app.listen(8000)

