import { Box, CloseButton,Text } from '@chakra-ui/react'
import React from 'react'
import {capitalizeFirstLetter} from "../config/chatLogics"

const UserDisplay = ({user,handleClick}) => {
  return (
    <Box
      fontSize={12}
      color="white"
      bg="black"
      py={0.5}
      px={2}
      borderRadius="lg"
      alignItems="center"
      m={1}
      mb={2}
      display="flex"
      variant="solid"
      cursor="pointer"
      onClick={handleClick}
    >
      <Text>{capitalizeFirstLetter(user.name)}</Text>
      <CloseButton pl={0.5} fontSize="x-small" />
    </Box>
  );
}

export default UserDisplay