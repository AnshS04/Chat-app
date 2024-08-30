import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import SideDrawer from '../Components/misc/SideDrawer';

const ChatPage = () => {
    const {user} = ChatState();

    return (
        <div style={{width: '100%'}}>
            {user && <SideDrawer />}
            {/* <Box>
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box> */}
        </div>
    )
}

export default ChatPage