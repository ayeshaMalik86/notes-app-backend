import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id) => 
    jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '7d'});

//signup
router.post('/signup', async (req, res) => {
    const {name, email, password} = req.body;
    try{
        const exists = await User.findOne({email});
        if(exists) return res.status(400).json({message: "User already exists"});

        const user = await User.create({name, email, password});
        const token = generateToken(user._id);
        res.status(201).json({_id: user._id, name, email, token });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

//login
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(user && (await user.matchPassword(password))){
            const token = generateToken(user._id);
            res.json({_id: user._id, name: user.name, email, token });
        } else {
            res.status(401).json({message: "Invalid email or password"});
        }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
});

//get user
router.get('/me', protect, async (req, res) => {
    res.json(req.user);
});


export default router;