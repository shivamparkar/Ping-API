
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ],
    lastMessage: { type: String, default: null },  
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', ChatSchema);
