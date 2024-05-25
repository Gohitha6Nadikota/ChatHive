import { Box } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../Context/chatProvider';
import IndividualChat from './IndividualChat';

const ChatArea = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat}=ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
    <Box flex={1} width="100%"> 
    <IndividualChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
    </Box>
  );
}

export default ChatArea