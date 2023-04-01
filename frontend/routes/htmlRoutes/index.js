const path = require('path');
const router = require('express').Router();

//route to start page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'))
});
//route to create note page
router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/notes.html'))
   });

router.get ('*', (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'))
});

module.exports = router;


