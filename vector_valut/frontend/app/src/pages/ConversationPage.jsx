import ChatHistoryComp from "../components/Conversation/ChatHistoryComp";
import ConversationNavComp from "../components/Conversation/ConversationNavComp";
import ChatInterFaceComp from "../components/Conversation/ChatInterFaceComp";
import UserPromptBoxComp from "../components/Conversation/UserPromptBoxComp";
import SideBar from "../layout/SideBar.jsx"


export default function ConversationPage(){
    return (
        <div className="flex h-screen">
            <SideBar />
            <div className="">
                <ConversationNavComp />
                <ChatInterFaceComp />
                <UserPromptBoxComp />
                <ChatHistoryComp />
            </div>
        </div>
    )
}