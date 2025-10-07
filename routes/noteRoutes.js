import express from 'express';
import Note from '../models/Note.js';

const router = express.Router();

// Create a note
router.post('/', async (req, res) => {
    try {
        const note = await Note.create(req.body);
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//get all notes
router.get('/', async (req, res) => {
    try {
        const {search} = req.query;
        const query = search 
        ? {
            $or: [
                {title: {$regex: search, $options: 'i'}},
                {content: {$regex: search, $options: 'i'}},
                {tags: {$regex: search, $options: 'i'}},
            ]
        } 
        : {};
        const notes = await Note.find(query).sort({createdAt: -1});
        res.json(notes);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//update a note
router.put("/:id", async (req, res) => {
    try{
        const note = await Note.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!note){
            return res.status(404).json({message: "Note not found"});
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//delete a note
router.delete("/:id", async (req, res) => {
    try{
        const note = await Note.findByIdAndDelete(req.params.id);
        if(!note){
            return res.status(404).json({message: "Note not found"});
        }
        res.json({message: "Note deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router;