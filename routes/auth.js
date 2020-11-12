// https://www.youtube.com/watch?v=frdMgKC-0r8
// https://www.youtube.com/watch?v=mbsmsi7l3r4
require('dotenv').config();
const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
let refreshTokens = [];

function generateAccessToken(user) {
    return jwt.sign({user: user._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' }); 
}

router.post('/register', async (req, res) => {
    const {username, password , passwordCheck} = req.body
    // Validation
    try {
        if (!username || !password || !passwordCheck) {
            return res.status(400).json({msg: 'Not all fields are entered'});
        }
        if(password.length < 5) {
            return res.status(400).json({msg: 'The password needs to be at least 5 characters long'});
        }
        if (password !== passwordCheck) {
            return res.status(400).json({msg: 'Passwords are not the same'});
        }
        const existingUser = await User.findOne({username: username});
        if (existingUser) { // Checks if a user already exists
            return res.status(400).json({msg: 'Account already exists'});
        }
        // Password Hasing and Registering a User
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            password: hashedPassword
        });

        const savedUser = await newUser.save()
        res.json(savedUser);
    } catch {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json(({msg: 'Not all fields are entered'}))
        }
        const existingUser = await User.findOne({username: username});
        if (!existingUser) { // Checks if a user already exists
            return res.status(400).json({msg: 'User does not exist'});
        }
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        // Checks if the inputted password is the same as the hased password.
        if (!passwordMatch) {
            return res.status(400).json(({msg: 'Password is incorrect.'}))
        }
        const accessToken = generateAccessToken(existingUser);
        const refreshToken = jwt.sign({id: existingUser._id}, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);
        res.json({
            accessToken,
            refreshToken,
            user: {
                id: existingUser._id,
                username: existingUser.username
            }
        })
        console.log(accessToken);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
});

function auth(req, res, next) {
    let token = req.headers['authorization'];
    token = token.split(' ')[1]; // Takes the token instead of the entire 'Bearer' statement.

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(!err) {
            req.user = user;
            next();
        } else {
            return res.status(403).json({message: "User not authenticated"});
        }
    });
}

router.post('/protected', auth, (req, res) => {
    res.send("Protected Route");
})

router.post("/refresh", (req, res) => {
    const refreshToken = req.body.token;
    if(!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.status(403).json({message: "User not authenticated"});
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,user) => {
        if (!err) {
            const accessToken = generateAccessToken({ username: user.username });
            return res.status(201).json({ accessToken });
        } else {
            return res.status(403).json({message: "User not authenticated"});
        }
    })
})

router.delete('/logout', (req,res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204);
})

module.exports = router;