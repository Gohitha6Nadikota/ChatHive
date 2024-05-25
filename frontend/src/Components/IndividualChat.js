
import React, { useEffect } from "react";
import { ChatState } from "../Context/chatProvider";
import { Box, FormControl, IconButton, Input, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { BsSendFill } from "react-icons/bs";
import {
  getSender,
  getSenderInfo,
  capitalizeFirstLetter,
} from "../config/chatLogics";
import ProfileModel from "./ProfileModel";
import FormedGroupChatModel from "./FormedGroupChatModel";
import { useState } from "react";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client"
import GroupProfileModel from "./GroupProfileModel";
const ENDPOINT="http://localhost:4000";
var socket,selectedChatCompare;

const IndividualChat = ({ fetchAgain, setFetchAgain }) => {
  const toast=useToast();
  const [newMessage, setNewMessage] = useState('');
  const [messages,setMessages]=useState([]);
  const [loading,setLoading]=useState(false);
  const[socketCon,setSocketCon]=useState(false);
  const[typing,setTyping]=useState(false);
  const[isTyping,setIsTyping]=useState(false);
  const { user, selectedChat, setSelectedChat ,notifications,setNotifications,chats,setChats} = ChatState();
  const fetchMessages=async()=>{
    if(!selectedChat)
      return;
    try {
      const config={
        headers:{
          Authorization:`Bearer ${user.data.token}`
        }
      }
      setLoading(false)
      const {data}=await axios.get(`/api/message/${selectedChat._id}`,config)
      setMessages(data)
      setLoading(false)
      socket.emit('join chat',selectedChat._id);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "Failed to load messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
  const sendMessage=async ()=>{
    if(newMessage){
      socket.emit('stop typing',selectedChat._id)
      try {
        const config={
          headers:{
            "Content-Type":'application/json',
            Authorization:`Bearer ${user.data.token}`
          }
        };
        const {data}=await axios.post('/api/message',{
          content:newMessage,
          chatId:selectedChat._id
        },config)
        setNewMessage("")
        socket.emit("send message",data)
        setMessages([...messages,data])
        const updatedChats = chats.map((chat) => {
          if (chat._id === selectedChat._id) {
            chat.latestMessage = data;
          }
          return chat;
        });

        setChats(updatedChats);
      } catch (error) {
        toast({
          title: "Error occurred",
          description: "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketCon) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    typingTimeout = setTimeout(() => {
      let timepresent = new Date().getTime();
      let difference = timepresent - lastTypingTime;
      if (difference >= timerLength) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  let typingTimeout;
   useEffect(() => {
     socket = io(ENDPOINT);
     socket.emit("setup", user.data._id);
     socket.on("connected", () => {
       setSocketCon(true);
     });
     socket.on('typing',()=>{
      setIsTyping(true);
     })
     socket.on("stop typing", () => {
       setIsTyping(false);
     });
   }, []);
  useEffect(()=>{
    
    socket.on("Message Recieved",(newMessage)=>{
      if(!selectedChatCompare || selectedChatCompare._id!==newMessage.chat._id)
        {
           if(!notifications.includes(newMessage))
            {
              setNotifications([newMessage, ...notifications]);
              setFetchAgain(!fetchAgain);
            }
        }
        else
        {
          setMessages([...messages,newMessage])
        }
    });
  })
  useEffect(()=>{
    fetchMessages();
    selectedChatCompare=selectedChat;
  },[selectedChat])
  
  return (
    <div w="100%" h="100%">
      {selectedChat ? (
        <Box bg="black" color="white">
          <Box display="flex" justifyContent="start" alignItems="center">
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
              mx={1}
            ></IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                <Box pr="10px" p={3}>
                  <ProfileModel
                    user={getSenderInfo(user, selectedChat.users)}
                  />
                </Box>
                <Text>
                  {capitalizeFirstLetter(getSender(user, selectedChat.users))}
                </Text>
              </>
            ) : (
              <Box
                display="flex"
                justifyContent="start"
                alignItems="center"
                w="100%"
              >
                <Box pr="10px" p={3}>
                  <GroupProfileModel selectedOne={selectedChat} />
                </Box>
                <Box>
                  <Text>{selectedChat.chatName.toUpperCase()}</Text>
                  {isTyping && <span color="green">Typing...</span>}
                </Box>
                <Box ml="auto" mr={3}>
                  <FormedGroupChatModel
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </Box>
              </Box>
            )}
          </Box>
          <Box
            bg="#E8E8E8"
            h={{ base: "72vh" }}
            display="flex"
            flexDirection="column"
            color="black"
            justifyContent="flex-end"
            alignItems="center"
            p={3}
            w="100%"
            overflowY="hidden"
          >
            {loading ? (
              <div>Loading</div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                  width: "100%",
                }}
              >
                <ScrollableChat messages={messages} style={{ width: "100%" }} />
              </div>
            )}
          </Box>
          <FormControl
            style={{ display: "flex", alignItems: "center" }}
            isRequired
          >
            <Input
              variant="filled"
              bg="black"
              placeholder="Enter a message"
              onChange={typingHandler}
              value={newMessage}
              _hover={{ bg: "black" }}
              _focus={{ bg: "black" }}
              _active={{ bg: "black" }}
              width="95%"
            />
            <Box
              width={{base:'20%',md:"10%",lg:"8%",xl:'5%'}}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <BsSendFill onClick={sendMessage} fontSize="25px" />
            </Box>
          </FormControl>
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="100%" //set this
        >
          <Text fontSize="3xl" pb={3} fontFamily="Reddit Sans">
            Click on a user to start chating
          </Text>
        </Box>
      )}
    </div>
  );
};

export default IndividualChat;
