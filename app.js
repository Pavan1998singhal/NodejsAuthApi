const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req,res) => {
    res.json({
        message: 'Welcome to the api'
    });
})

app.post('/api/posts', verifyToken, (req,res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                message: 'Post created',
                authData
            });
        }
    });
});

app.post('/api/login', (req,res) => {
    //Mock User
    const user = {
        id:1,
        username:'pavan',
        email:'singhal@gmail.com'
    }

    jwt.sign({user}, 'secretkey', { expiresIn: '20s' },  (err, token) => {
        res.json({
            token
        });
    });
})

// Format Token
// Authorization : Bearer <access_token>

//Verify Token and this is like middleware
function verifyToken(req, res, next) {
    // Get auth header value
    //msg.headers['Authorization'] = "Bearer " + idToken
    const bearerHeader = req.headers['authorization'];
    // check if bearer is undefined
    if(typeof  bearerHeader != 'undefined'){
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        //next middleware
        next();
    }else{
        //Forbidden
        res.sendStatus(403);
    }
}

app.listen(5000, () => console.log('Server has started on port 5000'));