const express = require('express');
const router = express.Router();
const User = require('../models/User');

//ROUTES
// GET ALL USER ACCOUNTS
router.get('/', async (req,res) => {
    try{
        const users = await User.find();
        res.json(users);
    } catch(err) {
        res.json({message:err})
    }
});

// SUBMIT USER ACCOUNTS
router.post('/', (req, res) => {
    const users = new User ({
        username: req.body.username,
        password: req.body.password,
        userID: req.body.userID
    }) 
    users.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({message: err});
        // res.status(404).json;
    });
    console.log(req.body);
});

// SPECIFIC USER
router.get('/:usersID', async (req, res) => {
    try {
        const account = await User.findByID(req.params.usersID)
        res.json(account);
    } catch(err) {
        res.json({ message:err });
    }
    
    // console.log(req.params.userID);
});



//NOTE: When ever you want to get/submit/change data, we call the model User.
module.exports = router;