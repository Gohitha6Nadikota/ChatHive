import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { ChatState } from '../Context/chatProvider'
import {Text,Box } from '@chakra-ui/react'
import {isSameAsSenderMargin, isFirst} from '../config/chatLogics'
const ScrollableChat = ({messages}) => {
  //console.log(messages)
    const {user}=ChatState()
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div
            style={{ display: "flex", marginTop: "1px" }}
            key={m._id}
            w="100%"
          >
            <Box
              style={{
                backgroundColor: `${
                  m.sender._id === user.data._id ? "#C7C8CC" : "#36454F"
                }`,
                color: `${m.sender._id === user.data._id ? "black" : "white"}`,
                marginLeft: isSameAsSenderMargin(messages, m, i, user.data._id),
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              <Box>
                {isFirst(messages, i) === true && (
                  <Text fontSize="x-small">{m.sender.name}</Text>
                )}
                <Text fontSize="small">{m.content}</Text>
              </Box>
            </Box>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat