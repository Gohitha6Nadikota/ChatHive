import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import React,{useState} from 'react'
import { IconContext } from 'react-icons/lib';
import { IoSettings } from "react-icons/io5";
import { ChatState } from '../Context/chatProvider';
import UserDisplay from './UserDisplay';
import axios from 'axios';
import UserListItem from './UserListItem';

const FormedGroupChatModel = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {selectedChat,setSelectedChat,user}=ChatState();
    const [groupChatName, setGroupChatName] = useState("");
    const [query, setQuery] = useState("");
    const [members, setMembers] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const handleAddition=async(person)=>{
        if (selectedChat.users.some((member) => member._id === person._id)) {
          toast({
            title: "User already added",
            isClosable: true,
            duration: 5000,
            position: "bottom",
            status: "warning",
          });
          return;
        }
        if(selectedChat.groupAdmin._id!==user.data._id)
        {
            toast({
              title: "Only Admins can add",
              isClosable: true,
              duration: 5000,
              position: "bottom",
              status: "error",
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
              headers: {
                Authorization: `Bearer ${user.data.token}`,
              },
            };
            const { data } = await axios.put(
              '/api/chat/groupadd',
              {
                chatId:selectedChat._id,
                userId:person._id
              },
              config
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
              title: "Error occurred",
              description: "Failed to add user",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
        }
    }
    const handleDelete=async (person)=>{
        if (selectedChat.groupAdmin._id !== user.data._id && person._id!==user.data._id) {
          toast({
            title: "Only Admins can remove",
            isClosable: true,
            duration: 5000,
            position: "bottom",
            status: "error",
          });
          return;
        }
        try {
            setLoading(true);
            const config = {
              headers: {
                Authorization: `Bearer ${user.data.token}`,
              },
            };
            const { data } = await axios.put(
              "/api/chat/groupremove",
              {
                chatId: selectedChat._id,
                userId: person._id,
              },
              config
            );
            selectedChat.groupAdmin._id === person.data._id ? setSelectedChat(null) : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
              title: "Error occurred",
              description: "Failed to remove user",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
        }
    }
    const handleRename=async()=>{
        if(!groupChatName)
            return;
        try {
            setLoading(true);
            const config = {
              headers: {
                Authorization: `Bearer ${user.data.token}`,
              },
            };
            const { data } = await axios.put(
              '/api/chat/rename',
              {
                chatId:selectedChat._id,
                chatName:groupChatName
              },
              config
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false)
        } catch (error) {
            toast({
              title: "Error occurred",
              description: "Failed to load the search results",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
            setLoading(false);
        }
        setGroupChatName('')
    }
    const handleSearch=async(query)=>{
        setQuery(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setResults(data);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
    }  
    return (
      <>
        <Button onClick={onOpen} background="black">
          <IconContext.Provider value={{ color: "white", size: "26px" }}>
            <IoSettings />
          </IconContext.Provider>
        </Button>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box display="flex" w="100%" flexWrap="wrap" pb={2}>
                {selectedChat.users.map((mem) => (
                  <UserDisplay
                    key={mem._id}
                    handleClick={() => handleDelete(mem)}
                    user={mem}
                  />
                ))}
              </Box>
              <FormControl display="flex" p={3}>
                <Input
                  placeholder="ChatName"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                ></Input>
                <Button isLoading={loading} onClick={handleRename} ml={2}>
                  Update
                </Button>
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add user to group"
                  onChange={(e) => handleSearch(e.target.value)}
                ></Input>
              </FormControl>
              {loading ? (
                <div>Loading</div>
              ) : (
                results
                  .slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      user={user}
                      key={user._id}
                      handleClick={() => handleAddition(user)}
                    />
                  ))
              )}
            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={() => handleDelete(user)}>
                Leave Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
}

export default FormedGroupChatModel