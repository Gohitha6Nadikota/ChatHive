const mongoose=require('mongoose');

const chatModel = mongoose.Schema(
  {
    //chatName
    chatName: { type: String, trim: true },
    //isGroupChat
    isGroupChat: { type: Boolean, default: false },
    profilepicture: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/026/306/343/original/user-group-team-social-business-human-person-stick-figure-teamwork-office-partnership-black-white-icon-sign-symbol-artwork-clipart-illustration-vector.jpg",
    },
    //users
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    //latestMessage
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    //groupAdmin
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);


const Chat=mongoose.model("Chat",chatModel);

module.exports=Chat;

