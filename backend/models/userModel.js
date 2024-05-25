const mongoose = require("mongoose");
const bcryt=require('bcryptjs')
const userModel = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true,unique:true },
  password: { type: String, required: true },
  profilepicture: {
    type: String,
    default:
      "https://images.nightcafe.studio/users/ZcDYVAlvjNbsAHbwNhUFxdU0rXs2/uploads/m7XuV1i6egth4ISiD240.jpeg?tr=w-1600,c-at_max",
  },
},{
    timestamps:true
});

userModel.methods.matchPassword= async function(enteredpassword){
  return await bcryt.compare(enteredpassword, this.password);
}
userModel.pre('save',async function(next){
  if(!this.isModified)
    {
      next()
    }
    const salt= await bcryt.genSalt(10);
    this.password=await bcryt.hash(this.password,salt);
})
const User=mongoose.model("User",userModel);

module.exports=User;