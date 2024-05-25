import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../Context/chatProvider";
import axios from "axios";
import UserListItem from "./UserListItem";
import UserDisplay from "./UserDisplay";

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profilepicture, setPicture] = useState('');
  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleAddition = (user) => {
    if (members.some((member) => member._id === user._id)) {
      toast({
        title: "User already added",
        isClosable: true,
        duration: 5000,
        position: "top",
        status: "warning",
      });
      return;
    }
    setMembers([...members, user]);
  };
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dxr9cknpy");
      //console.log("data", data);
      fetch("https://api.cloudinary.com/v1_1/dxr9cknpy/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPicture(data.url.toString());
          //console.log("url", data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
  const handleSearch = async (query) => {
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
  };

  const handleDelete = (user) => {
    setMembers(members.filter((member) => member._id !== user._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || members.length === 0) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(members.map((mem) => mem._id)),
          profilepicture:profilepicture
        },
        config
      );
      setChats([...chats,data]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to create the chat",
        description: error.response?.data?.message || "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Reddit Sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                mb={1}
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <FormControl id="pic">
              <FormLabel>Upload Profile Photo</FormLabel>
              <Input
                focusBorderColor="black.100"
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => {
                  postDetails(e.target.files[0]);
                }}
              />
            </FormControl>
            <Box display="flex" flexWrap="wrap" w="100%">
              {members.map((mem) => (
                <UserDisplay
                  key={mem._id}
                  handleClick={() => handleDelete(mem)}
                  user={mem}
                />
              ))}
            </Box>
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
            <Button bg="black" color="white" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
