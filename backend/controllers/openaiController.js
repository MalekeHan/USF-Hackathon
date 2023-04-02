const axios = require('axios');
const Note = require('../models/noteModel');


exports.enhanceController = async (req, res) => {
  try {
    const inputPrompt = `Take the following notes and please enhance them by adding more details. I want the notes to be at a university level: ${req.body.prompt}`;
    if (typeof inputPrompt !== 'string') {
      res.status(400).json({ error: 'Prompt must be a string' });
      return;
    }

    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: inputPrompt,
        max_tokens: 100,
        temperature: 0.6,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const completion = response.data.choices[0].text;
    res.status(200).json({ completion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eli5Controller = async (req, res) => {
  try {
    const inputPrompt = `Take the follwing note and transform it into an eli5 type of note. I want all complex ideas to be simplified and easy to understand: ${req.body.prompt}`;
    if (typeof inputPrompt !== 'string') {
      res.status(400).json({ error: 'Prompt must be a string' });
      return;
    }

    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: inputPrompt,
        max_tokens: 200,
        temperature: 0.6,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const completion = response.data.choices[0].text;
    res.status(200).json({ completion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.quizController = async (req, res) => {
  try {
    // Check if the number of questions is valid
    const numQuestions = parseInt(req.body.numQuestions);
    if (!Number.isInteger(numQuestions) || numQuestions < 1 || numQuestions > 7) {
      res.status(400).json({ error: 'Number of questions must be an integer between 1 and 7' });
      return;
    }

    const inputPrompt = `Take the following notes and create a quiz from them: ${req.body.prompt}`;
    if (typeof inputPrompt !== 'string') {
      res.status(400).json({ error: 'Prompt must be a string' });
      return;
    }

    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: inputPrompt,
        max_tokens: 200,
        temperature: 0.6,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const quizQuestions = response.data.choices[0].text.split('\n');
    // Trim any extra whitespace and filter out empty questions
    const questions = quizQuestions.map((question) => question.trim()).filter(Boolean).slice(0, numQuestions);
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.chatCompletionsController = async (req, res) => {
    try {
      const inputMessages = req.body.messages;
  
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: inputMessages,
          max_tokens: 100,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
  
      const completion = response.data.choices[0].message.content;
  
      // Check if the completion contains a code snippet
      if (completion.includes('```')) {
        const formattedCompletion = `\`\`\`md\n${completion}\n\`\`\``;
        res.status(200).json({ completion: formattedCompletion });
      } else {
        res.status(200).json({ completion });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


exports.saveNoteController = async (req, res) => {
  try {
    const newNote = new Note({
      content: req.body.content
    });
    await newNote.save();
    console.log('Note saved to MongoDB:', newNote);
    res.status(200).json({ message: 'Note saved to MongoDB' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



 
  

  
