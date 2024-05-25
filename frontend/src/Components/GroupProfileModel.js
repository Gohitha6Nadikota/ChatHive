import React from "react";
import { capitalizeFirstLetter } from "../config/chatLogics";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
const GroupProfileModel = ({ selectedOne,children }) => {
    //console.log(selectedOne.chatName)
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span
          onClick={() => {
            onOpen();
          }}
        >
          {children}
        </span>
      ) : (
        <Image
          src={selectedOne.profilepicture}
          borderRadius="full"
          boxSize="40px"
          alt={capitalizeFirstLetter(selectedOne.chatName)}
          cursor="pointer"
          onClick={() => {
            onOpen();
          }}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="30px"
            fontFamily="Reddit Sans"
            display="flex"
            justifyContent="center"
          >
            {capitalizeFirstLetter(selectedOne.chatName)}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              src={selectedOne.profilepicture}
              borderRadius="lg"
              boxSize="220px"
              alt={selectedOne.chatName}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupProfileModel;
