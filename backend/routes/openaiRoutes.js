const express = require('express');
const router = express.Router();
const { enahnceController, eli5Controller, quizController, chatCompletionsController, saveNoteController } = require('../controllers/openaiController');

router.post('/enhance', enahnceController);
router.post('/eli5', eli5Controller);
router.post('/quiz', quizController);
router.post('/chat', chatCompletionsController);
router.post('/notes', saveNoteController);

module.exports = router;
