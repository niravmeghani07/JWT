require('dotenv').config()
const express = require('express');
const app = express();
const port = 1000;
const jwt = require('jsonwebtoken');
app.use(express.json());

//sample data
const data = [
    {
        username: 'Nirav',
        title: 'Post 1'
    },
    {
    username: 'Kyle',
    title: 'Post 2'
    }
]

app.get('/',(req,res)=>{
    res.send('Hello World');
})


// Retrieving the data authorized to a perticular user after comparing tokens
app.get('/posts',authenticateToken,(req,res)=>{
    res.json(data.filter(item => item.username === req.user.name));
})


//Creating a JWT of a user after logging in
app.post('/login',(req,res)=>{
    const username= req.body.username;
    const user = { name: username};
    const access_token = jwt.sign(user, process.env.ACCESS_SECRET_KEY);
    res.json({access_Token: access_token})
})

// Middleware to authenticate tokens from the authorization header of request
function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err,user)=>
    {
        if(err) return res.sendStatus(403)
        req.user = user;
        next();
    })

}

app.listen(port,()=>{
    console.log('Connected to server');
});
