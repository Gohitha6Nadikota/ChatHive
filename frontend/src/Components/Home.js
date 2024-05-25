import React ,{useEffect} from 'react'
import {Box,Container,Text,Tabs,TabList,TabPanels,Tab,TabPanel,} from "@chakra-ui/react";
import Login from './Login';
import SignUp from './SignUp';
import { useHistory } from "react-router-dom";
const Home = () => {
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/chats");
  }, []);
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="90px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        textAlign="center"
      >
        <Text
          fontSize="3xl"
          fontWeight="bold"
          fontFamily="Reddit Sans"
          justifyContent="center"
          color="black"
        >
          ChatHive
        </Text>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        p={4}
        color="black"
        bg="white"
        w="100%"
        m="20px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        textAlign="center"
      >
        <Tabs variant="unstyled" color="black">
          <TabList
            mb="1em"
            border="1px"
            borderColor="black"
            borderStyle="groove"
          >
            <Tab w="50%" _selected={{ color: "white", bg: "black" }}>
              Login
            </Tab>
            <Tab w="50%" _selected={{ color: "white", bg: "black" }}>
              Register
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Home