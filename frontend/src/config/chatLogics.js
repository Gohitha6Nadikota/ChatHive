export const getSender =(loggedUser,users)=>{
  //console.log(users,loggedUser)
    return users[0]?._id===loggedUser.data?._id ? users[1].name:users[0].name;
}
export const getSenderInfo = (loggedUser, users) => {
  return users[0]?._id === loggedUser?.data._id ? users[0] : users[1];
};
export const getSenderAvatar = (loggedUser, users) => {
  return users[0]._id === loggedUser.data._id
    ? users[1].profilepicture
    : users[0].profilepicture;
};

export const capitalizeFirstLetter=(string)=> {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const isSamePerson=(message,m,i,userId)=>{
  return (
    i < message.length - 1 &&
    (message[i + 1].sender._id !== m.sender._id ||
      message[i + 1].sender._id === undefined) &&
    message[i].sender._id!==userId
  );
}

export const isFirst=(messages,i)=>{
  if(i===0)
    return true;
  else if(messages[i-1].sender._id!==messages[i].sender._id)
    return true;
  return false;
}

export const isSameAsSenderMargin =(messages,m,i,userId)=>{
  if(messages[i].sender._id===userId)
    return "auto"
  return "0"
}
