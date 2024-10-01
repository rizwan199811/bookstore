
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({username}).lean(true);
    if(foundUser){
        return  res.status(400).send({message:'User already exists in the system'})
    }
    const user = new User({ username, password });
    await user.save();
    res.status(201).send({message: 'User registered successfully.'});
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).lean(true);
    console.log({user:user._id})
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials.');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ message:'Customer loggedIn successfully',
        token });
};
