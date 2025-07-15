const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve audio files
app.use('/songs', express.static(path.join(__dirname, 'songs')));
app.use('/covers', express.static(path.join(__dirname, '../frontend/covers')));

// Routes
const songsRouter = require('./routes/songs');
app.use('/api/songs', songsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
