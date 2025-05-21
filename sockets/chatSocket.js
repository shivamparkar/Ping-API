const Chat = require("../models/Chat");
const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
      socket.join(userData._id);
    });

    socket.on("joinRoom", ({ roomId }) => {
      socket.join(roomId);
    });

    socket.on("hangUp", ({ to }) => {
      io.to(to).emit("callEnded");
    });

    socket.on("cancelCall", ({ to }) => {
      io.to(to).emit("callCancelled");
    });

    socket.on("rejectCall", ({ to }) => {
      io.to(to).emit("callRejected");
    });

    socket.on("callUser", ({ from, to, offer }) => {
      io.to(to).emit("incomingCall", { from, offer });
    });

    socket.on("callResponse", ({ to, accepted }) => {
      io.to(to).emit("callResponse", { accepted });
    });

    socket.on("answerCall", ({ to, answer }) => {
      io.to(to).emit("callAnswered", { answer });
    });

    socket.on("iceCandidate", ({ to, candidate }) => {
      io.to(to).emit("iceCandidate", { candidate });
    });

    socket.on("sendMessage", async (data, callback) => {
      try {
        const { chatId, senderId, receiverId, text, image } = data;

        const newMessage = await Message.create({
          chatId,
          senderID: senderId,
          receiverId,
          text,
          image: image || "",
          createdAt: new Date(),
        });

        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: text,
          updatedAt: new Date(),
        });

        io.to(senderId).emit("receiveMessage", newMessage);
        io.to(receiverId).emit("receiveMessage", newMessage);

        const chatUpdatePayload = {
          chatId,
          senderId,
          text,
          updatedAt: new Date(),
        };

        io.to(senderId).emit("chatListUpdate", chatUpdatePayload);
        io.to(receiverId).emit("chatListUpdate", chatUpdatePayload);

        if (callback) {
          callback(newMessage);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });
  });
};
