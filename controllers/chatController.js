const Chat = require("../models/Chat");
const Message = require("../models/Message");

exports.getUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "username img")
      .sort({ updatedAt: -1 });

    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        const otherUser = chat.participants.find(
          (p) => p._id.toString() !== userId
        );

        const lastMsgDoc = await Message.findOne({ chatId: chat._id })
          .populate("senderID", "username img")
          .sort({ createdAt: -1 })
          .lean();

        return {
          _id: chat._id,
          participants: chat.participants,
          lastMessage: lastMsgDoc
            ? {
                _id: lastMsgDoc._id,
                text: lastMsgDoc.text,
                senderID: lastMsgDoc.senderID,
                createdAt: lastMsgDoc.createdAt,
              }
            : null,
          username: otherUser?.username,
          avatar: otherUser?.img,
          updatedAt: chat.updatedAt,
        };
      })
    );

    res.status(200).json(enrichedChats);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error", error });
  }
};

exports.getChatMessages = async (req, res) => {
  const chatId = req.params.chatId;
  try {
    const messages = await Message.find({ chatId })
      .populate("senderID", "username img")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error", error });
  }
};

exports.createChat = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    const existingChat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (existingChat) return res.status(200).json(existingChat);

    const newChat = await Chat.create({
      participants: [senderId, receiverId],
    });

    res.status(201).json(newChat);
  } catch (err) {
    console.error("Chat creation failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};
