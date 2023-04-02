const express = require('express');
const router = express.Router();
const {
  enahnceController,
  eli5Controller,
  quizController,
  chatCompletionsController,
  saveNoteController,
} = require('../controllers/openaiController');

// Import the folder controller functions
const {
  getAllFolders,
  createFolder,
} = require('../controllers/folderController');

router.post('/enhance', enahnceController);
router.post('/eli5', eli5Controller);
router.post('/quiz', quizController);
router.post('/chat', chatCompletionsController);
router.post('/notes', saveNoteController);

// Add the folder routes
router.get('/folders', getAllFolders);
router.post('/folders', createFolder);

module.exports = router;
