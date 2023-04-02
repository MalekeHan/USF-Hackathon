const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
});

const Folder = mongoose.model('Folder', folderSchema, 'notes');

module.exports = Folder;
