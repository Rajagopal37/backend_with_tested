const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Completed', 'Not Completed'], default: 'Not Completed' },
  assignDate: { type: Date, required: true },
  lastDate: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user
});

module.exports = mongoose.model('Task', taskSchema);
