import { createContext, useContext,useEffect,useState} from 'react'
import { useHistory } from "react-router-dom";

const ChatContext=createContext()

const ChatProvider=({children})=>{
    const [user, setUser] = useState(null);
    const [selectedChat,setSelectedChat]=useState(false)
    const [chats,setChats]=useState([])
    const [notifications,setNotifications]=useState([])
    const Logout=()=>{
      setUser(null);
      setSelectedChat(null);
      setChats([]);
      localStorage.removeItem("UserInfo");
    }
    let history = useHistory();
    useEffect(()=>{
        const userData=JSON.parse(localStorage.getItem('UserInfo'))
        setUser(userData)
        if(!userData)
            history.push("/")
    },[])
    return (
      <ChatContext.Provider
        value={{
          user,
          setUser,
          selectedChat,
          setSelectedChat,
          chats,
          setChats,
          Logout,
          notifications,
          setNotifications
        }}
      >
        {children}
      </ChatContext.Provider>
    );
}

export const ChatState =()=>{  
    return useContext(ChatContext);
};
export default ChatProvider