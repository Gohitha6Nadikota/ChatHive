import { FormControl,FormLabel, VStack ,Input, InputGroup, InputRightElement, Button,useToast} from '@chakra-ui/react'
import React ,{useState} from 'react'
import {useHistory} from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios"
const SignUp = () => {
    const [showPwd,setShowPwd]=useState(false);
    const [showPwd1, setShowPwd1] = useState(false);
    const [name,setName]=useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [profilepicture, setPicture] = useState('');
    const [loading,setLoading]=useState(false);
    const toast = useToast();
    const history=useHistory();
    const handleClick=()=>{
        setShowPwd(!showPwd);
    }
    const handleClick1 = () => {
      setShowPwd1(!showPwd1);
    };
    const postDetails=(pics)=>{
      setLoading(true);
      if(pics===undefined)
        {
          toast({
            title: "Please select an image",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position:"bottom"
          });
          setLoading(false);
          return;
        }
      if(pics.type==="image/jpeg" || pics.type==="image/png")
      {
        const data=new FormData();
        data.append("file",pics);
        data.append("upload_preset","chat-app");
        data.append("cloud_name", "dxr9cknpy");
        //console.log("data",data)
        fetch("https://api.cloudinary.com/v1_1/dxr9cknpy/image/upload",{
          method:"post",
          body:data
        }).then((res)=>res.json()).then(data=>{
          setPicture(data.url.toString())
          //console.log("url",data.url.toString())
          setLoading(false)
        }).catch((err)=>{
          console.log(err)
          setLoading(false)
        })
      }
      else{
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
    }
    const handleSubmit=async() =>{
      setLoading(true);
      if(!name || !email || !password || !rePassword)
        {
          toast({
            title: "Please Fill all the fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position:"bottom"
          });
          setLoading(false);
          return;
        }
        if (password!==rePassword) {
          toast({
            title: "Passwords donot Match",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return;
        }
        try{
          const config={
            headers:{
              "Content-type":"application/json"
            }
          };
          //console.log(profilepicture);
          const data = await axios.post(
            "/api/user",
            {
              name,
              email,
              password,
              profilepicture,
            },
            config
          );
          toast({
            title: "Account created.",
            description: "We've created your account for you.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });

          localStorage.setItem("UserInfo",JSON.stringify(data))
          setLoading(false)
          history.push("/chats")
        }
        catch(error)
        {
            toast({
              title: "Error Occured",
              description: error.response.data.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position:"bottom"
            });
            setLoading(false)
        }
    }
  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing="5px" color="black">
        <FormControl id="First-Name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            focusBorderColor="black.100"
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl id="Email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            focusBorderColor="black.100"
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="Password2" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              focusBorderColor="black.100"
              type={showPwd ? "text" : "Password"}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement w="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="RePassword" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              focusBorderColor="black.100"
              type={showPwd1 ? "text" : "Password"}
              placeholder="Enter your password again"
              onChange={(e) => setRePassword(e.target.value)}
            />
            <InputRightElement w="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick1}>
                {showPwd1 ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="pic">
          <FormLabel>Upload Your Photo</FormLabel>
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
        <Button
          bg="#D5CEA3"
          w="100%"
          style={{ marginTop: 15 }}
          isLoading={loading}
          onClick={handleSubmit}
          _hover={{ bg: "#000000", color: "white" }}
        >
          Register
        </Button>
      </VStack>
    </form>
  );
}

export default SignUp