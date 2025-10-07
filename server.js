import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import noteRoutes from './routes/noteRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

//Routes
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.status(500).json({message: "Internal server error"});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});