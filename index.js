// const http = require("http"); //Inbuilt in Node

// const server = http.createServer((request, response) =>{
//     //response.statusCode = 404 
//     console.log(request.url)
//     console.log(request.method)
//     response.setHeader("Content-Type", "text/html")
//     response.end("<img src='https://pbs.twimg.com/media/Dj8XlmjV4AEzsvr.jpg'>")  
// }) //creates the server and sends the response



// server.listen(3000, () =>{console.log("Server Ready")})
const express = require("express");
const app = express();
const fruits = require("./fruits.json")
const port = process.env.PORT
require('dotenv').config()
const cors = require('cors')

// app.get('/', (request, response) =>{
//     response.send("Hello World")
// })

// app.get('/chicken', (request, response) =>{
//     response.send("Hello Chicken.")
// })


// app.get('/chicken/:name', (request, response) =>{
//     response.send(request.params)
//     //response.send(request.query)
// })

// app.get('/example', (request, response) =>{
//     response.sendStatus(418)
// })

// Fruit APi


// app.use((req, res, next) =>{
//     console.log("I am a piece of middleware.")
//     next();
// })


// app.use((req, res, next) =>{
//     console.log("I am also a piece of middleware.")
//     next();
// })

app.use(cors())
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Hello Fruit API")
})

app.get("/fruits", (req, res)=>{
    res.send(fruits)
})

const getFruitIndex = name => {
    //Take in a lower case fruit name and returns the index of the fruit or -1
    
    return fruits.findIndex((fruit) => fruit.name.toLowerCase() == name)
}



app.post("/fruits", (req, res) =>{
    //Check if the fruit exists
    const fi = getFruitIndex(req.body.name.toLowerCase())
    if(fi > -1){
        res.status(409).send("The fruit already exists.")
    }else{
        //Create an array of all IDs
        const ids = fruits.map((fruit) => fruits.id);
        //Get the maximum ID
        let maxId = Math.max(...ids);
        //Increment that by 1
        maxId++
        //Adjust ID to new maxId
        req.body.id = maxId;

        fruits.push(req.body)
        res.status(201).send(req.body)
    }

    // const fruit = req.body
    // console.log(fruit) // This is good for debugging
    // res.send("New fruit created")
})

app.delete("/fruits/:name", (req, res) =>{
    const fi = getFruitIndex(req.param.name.toLowerCase());
    if (fi == -1){
        //Fruit can not be found
        res.status(404).send("Fruit can not be found.")
    }else{
        fruits.splice(fi, 1);
        res.sendStatus(200)
    }

})

app.get("/fruits/:name", (req, res)=>{
    //res.send(`Return a fruit with ${req.params.name} name`)
    const name = req.params.name.toLowerCase(); //Get the name of what I am searching for (param = name in URL)
    //Search fruits.json(fruits) to return fruit if the names matches
    const fruit = fruits.find(fruit => fruit.name.toLowerCase() == name)
    if (fruit == undefined){
        //There is no fruit 
        res.status(404).send("The fruit doesn't exist.")
    } else{
        //If there is a fruit
        res.send(fruit)
    }
})

app.listen(port, ()=>{
    console.log(`Server is now listening on port ${port}`)
})


