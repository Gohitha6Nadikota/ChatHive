import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";
import { capitalizeFirstLetter } from "../config/chatLogics";
const UserListItem = ({user,handleClick}) => {
  return (
    <Box
      onClick={handleClick}
      cursor="pointer"
      bg="black"
      _hover={{
        background: "#F5E9CF",
        color: "black",
      }}
      borderRadius="lg"
      w="100%"
      display="flex"
      alignItems="center"
      color="white"
      px={3}
      py={2}
      mb={2}
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={capitalizeFirstLetter(user.name)}
        src={user.profilepicture}
      ></Avatar>
      <Box>
        <Text>{capitalizeFirstLetter(user.name)}</Text>
        <Text fontSize="xs">
          <b>Email :</b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
