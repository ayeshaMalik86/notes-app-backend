import express from 'express';
import Note from '../models/Note.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a note
router.post('/', protect, async (req, res) => {
    const {title, content, tags} = req.body;
    try {
        const note = await Note.create({
            user: req.user._id,
            title,
            content,
            tags,
        });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//get all notes
router.get('/', protect, async (req, res) => {
    const {search} = req.query;
    const query = {
        user: req.user._id,
        ...(search && {
            $or: [
                {title: {$regex: search, $options: 'i'}},
                {content: {$regex: search, $options: 'i'}},
                {tags: {$regex: search, $options: 'i'}},
            ],
        }),
    };
    try {
        const notes = await Note.find(query).sort({createdAt: -1});
        res.json(notes);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//update a note
router.put("/:id", protect, async (req, res) => {
   try{
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({message: "Note not found"});
        if (note.user.toString() !== req.user._id.toString()) 
            return res.status(401).json({message: "Not authorized"});
        const updated = await Note.findByIdAndUpdate(req.params.id, req.body, 
        {new: true
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//delete a note
router.delete("/:id",protect, async (req, res) => {
    try{
        const note = await Note.findById(req.params.id);
        if(!note) return res.status(404).json({message: "Note not found"});
        if(note.user.toString() !== req.user._id.toString()) 
            return res.status(401).json({message: "Not authorized"});
        await note.deleteOne();
        res.json({message: "Note deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router;