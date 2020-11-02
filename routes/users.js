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
router.post('/', async (req, res) => {
    const users = new User ({
        username: req.body.username,
        password: req.body.password
    }) 
    try {
        const savedUser = await users.save();
        res.json(savedUser);
    } catch {
        res.json({ message: err});
    }
});

// DELETE USERS
router.delete('/:usersID', async (req, res) => {
    try{ 
        const removedUser =  await User.remove({_id: req.params.usersID });
        res.json(removedUser);
    } catch (err) {
        res.json({ message:err });
    }   
});

//NOTE: When ever you want to get/submit/change data, we call the model User.
module.exports = router;