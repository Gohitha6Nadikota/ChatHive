import { FormControl,FormLabel,VStack,Input,InputGroup,InputRightElement,Button,useToast} from "@chakra-ui/react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
const Login = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const handleClick = () => {
    setShowPwd(!showPwd);
  };
  const handleSubmit = async() => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const data = await axios.post(
        "/api/user/login",
        {
          email,
          password,
        },
        config
      );
      toast({
        title: "Sucessfully Logged in",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      localStorage.setItem("UserInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
      window.location.reload();
      
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing="5px" color="black">
        <FormControl id="Email1" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            focusBorderColor="black.100"
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="Password1" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              focusBorderColor="black.100"
              type={showPwd ? "text" : "Password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement w="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          variant="outline"
          bg="#D5CEA3"
          w="100%"
          style={{ marginTop: 15 }}
          isLoading={loading}
          onClick={handleSubmit}
          _hover={{ bg: "#000000", color: "white" }}
        >
          Login
        </Button>
        <Button
          variant="solid"
          bg="#90B77D"
          w="100%"
          style={{ marginTop: 15 }}
          onClick={() => {
            setEmail("abc@email.com");
            setPassword("abc");
          }}
        >
          Guest
        </Button>
      </VStack>
    </form>
  );
};

export default Login;
