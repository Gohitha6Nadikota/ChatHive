import React from 'react'
import { capitalizeFirstLetter } from '../config/chatLogics';
import {Text, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure ,Image} from '@chakra-ui/react';
const ProfileModel = ({user,children}) => { 
  const info= user.data?user.data:user 
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
          src={info.profilepicture}
          borderRadius="full"
          boxSize="40px"
          alt={capitalizeFirstLetter(info.name)}
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
            {capitalizeFirstLetter(info.name)}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              src={info.profilepicture}
              borderRadius="lg"
              boxSize="220px"
              alt={info.name}
            />
            <Text fontSize={{ base: "18px", md: "23px" }} pb="30px">
              Email: {info.email}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModel