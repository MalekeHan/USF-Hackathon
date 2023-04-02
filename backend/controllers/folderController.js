const Folder = require('../models/folderModel');

exports.getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find();
    res.status(200).json({ folders }); // send an object with the key of folders
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFolder = async (req, res) => {
  try {
    const newFolder = new Folder({
      name: req.body.name,
    });
    await newFolder.save();
    res.status(201).json(newFolder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
