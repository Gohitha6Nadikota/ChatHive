import {
  Box,
  Button,
  Tooltip,
  useDisclosure,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon ,ChevronDownIcon} from '@chakra-ui/icons'
import React ,{useState} from 'react'
import { FaSearch } from "react-icons/fa";
import { ChatState } from '../Context/chatProvider';
import ProfileModel from './ProfileModel';
import { useHistory } from "react-router-dom";
import axios from 'axios'
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { MdHive } from "react-icons/md";
import {Effect} from "react-notification-badge"
import { capitalizeFirstLetter} from "../config/chatLogics";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
const SideBar = () => {
  const [search,setSearch]=useState('')
  const [searchResult,setSearchResult]=useState('')
  const [loading,setLoading]=useState(false)
  const [loadingChat,setLoadingChat]=useState(false)
  const { user, setSelectedChat, chats, setChats,Logout,notifications,setNotifications} = ChatState();
  const toast=useToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const LogoutHandler = () => {
    Logout();
    history.push("/");
  };
  const accessChat=async (userId)=>{
    try{
      setLoadingChat(true)
      const config={
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.data.token}`
        },
      }
      const {data}=await axios.post('/api/chat',{userId},config)
      if(!chats.find((c)=>c._id===data._id))
        setChats([...chats,data])
      setSelectedChat(data)
      setLoadingChat(false)
      onClose()
    }
    catch(error)
    {
      toast({
        title: "Erro fetching chat",
        description: error.message,
        status: "error",
        duration: "5000",
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      return;
    }
  }
  const handleSearch=async()=>{
    if(!search)
      {
        toast({
          title:"Please Enter to Search",
          status:"warning",
          duration:'5000',
          isClosable:true,
          position:'top-left'
        })
        return;
      }
    try{
      setLoading(true)
      const config={
        headers:{
          Authorization:`Bearer ${user.data.token}`
        },
      }
      const {data}=await axios.get(`/api/user?search=${search}`,config)
      setLoading(false)
      setSearchResult(data)
    }
    catch(error)
    {
      toast({
        title: "Erro occured",
        description:"Failed to load the search results",
        status: "error",
        duration: "5000",
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false)
      return;
    }
  }
  return (
    <>
      <Box
        display="flex"
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        bg="black"
        borderWidth="2px"
        p="5px 10px 5px 10px"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen} bg="white">
            <FaSearch fontSize={{ base: "xs", md: "xl" }} />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize={{ base: "lg", md: "2xl" }}
          fontWeight="bold"
          fontFamily="Reddit Sans"
          color="white"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <MdHive />
          ChatHive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge count={notifications.length} effect={Effect.SCALE}/>
              <BellIcon fontSize="2xl" m={1} color="white" />
            </MenuButton>
            <MenuList pl={2}>
              {!notifications.length
                ? "No New Messages"
                : notifications.map((n) => (
                    <MenuItem key={n._id} onClick={()=>{
                      setSelectedChat(n.chat);
                      setNotifications(notifications.filter((nt)=>(n._id!==nt._id)))
                    }}>
                      {n.chat.isGroupChat
                        ? `New Message in ${n.chat.chatName}`
                        : `New Message from ${n.sender.name}`}
                    </MenuItem>
                  ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={{ base: "xs", md: "sm" }}
                cursor="pointer"
                name={capitalizeFirstLetter(user.data.name)}
                src={user.data.profilepicture}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={LogoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search By Name or Email"
                mr={2}
                value={search}
                focusBorderColor="black.100"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} bg="black" color="white">
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult && searchResult?.map((users) => {
                return (
                  <UserListItem
                    key={users._id}
                    user={users}
                    handleClick={() => {
                      accessChat(users._id);
                    }}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml="auto" display="flex"></Spinner>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideBar