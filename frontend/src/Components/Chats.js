import React ,{useEffect, useState} from 'react'
import { ChatState } from '../Context/chatProvider'
import { Box, Button, Stack, useToast ,Text,Avatar} from '@chakra-ui/react'
import {AddIcon} from "@chakra-ui/icons"
import ChatLoading from "./ChatLoading"
import { getSender, getSenderAvatar} from '../config/chatLogics'
import axios from 'axios'
import GroupChatModel from './GroupChatModel'
import { capitalizeFirstLetter } from '../config/chatLogics'

const Chats = ({fetctAgain}) => {
  const [loggedUser,setLoggedUser]=useState('')
  const { user, setSelectedChat, selectedChat ,chats, setChats } = ChatState()
  const toast=useToast()
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("UserInfo"));
    setLoggedUser(user);

    const fetchChats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user?.data?.token}`,
          },
        };
        const { data } = await axios.get("/api/chat", config);
        //console.log(data);
        setChats(data);
      } catch (error) {
        toast({
          title: "Error Loading Chat",
          description: error.message,
          status: "error",
          duration: "5000",
          isClosable: true,
          position: "bottom-left",
        });
        return;
      }
    };

    fetchChats();
  }, [user,fetctAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      bg="white"
      p={3}
      borderRadius="lg"
      borderWidth="1px"
      w={{ base: "100%", md: "31%" }}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "24px", md: "24px" }}
        fontFamily="Reddit Sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text px={2}>Chats</Text>
        <GroupChatModel>
          <Button
            display="flex"
            bg="black"
            color="white"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            leftIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#000000"
        overflowY="hidden"
        w="100%"
        h="100%"
        borderRadius="lg"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                key={chat._id}
                bg={selectedChat === chat ? "#36454F" : "#000000"}
                color={selectedChat === chat ? "white" : "white"}
                shadow="lg"
              >
                <Box display="flex" alignItems="center">
                  {!chat.isGroupChat ? (
                    <Avatar
                      size="sm"
                      cursor="pointer"
                      name={capitalizeFirstLetter(
                        getSender(loggedUser, chat.users)
                      )}
                      src={getSenderAvatar(loggedUser, chat.users)}
                      mx={2}
                    />
                  ) : (
                    <Avatar
                      size="sm"
                      cursor="pointer"
                      name={chat.chatName}
                      src={chat.profilepicture}
                      mx={2}
                    />
                  )}
                  <Box
                    p={2}
                    flex="1"
                    borderBottom="0.5px"
                    borderTop="0.5px"
                    borderColor="gray.700"
                    borderStyle="groove"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    maxWidth="calc(100% - 40px)"
                  >
                    <Text>
                      {!chat.isGroupChat
                        ? capitalizeFirstLetter(
                            getSender(loggedUser, chat.users)
                          )
                        : capitalizeFirstLetter(chat.chatName)}
                    </Text>
                    <Box>
                      {chat.latestMessage ? (
                        <Text fontSize="xs" display="flex">
                          <b>{chat.latestMessage.sender.name} : </b>
                          <span
                            style={{
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 1,
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {chat.latestMessage.content}
                          </span>
                        </Text>
                      ) : (
                        <Text fontSize="xs">No Messages Yet</Text>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default Chats