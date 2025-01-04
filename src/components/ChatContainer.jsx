// import axios from "axios";
// import React, { useState, useEffect, useRef } from "react";
// import styled from "styled-components";
// import Logout from "./Logout";
// import ChatInput from "./ChatInput";
// import { v4 as uuidv4 } from 'uuid';
// import { getAllMessageRoute, sendMessageRoute } from "../util/APIRoutes";

// export default function ChatContainer({ currentChat, currentUser, socket }) {
//     const [messages, setMessages] = useState([]);
//     const [arrivalMessage, setArrivalMessage] = useState(null);

//     const scrollRef = useRef();

//     useEffect(() => {
//         const fetchMessages = async () => {
//             if (currentChat && currentUser) {
//                 const response = await axios.post(getAllMessageRoute, {
//                     from: currentUser._id,
//                     to: currentChat._id,
//                 });
//                 setMessages(response.data);
//             }
//         };

//         fetchMessages();
//     }, [currentChat, currentUser]);

//     const handleSendMsg = async (msg) => {
//         await axios.post(sendMessageRoute, {
//             from: currentUser._id,
//             to: currentChat._id,
//             message: msg,
//         });

//         socket.current.emit("send-msg", {
//             to: currentChat._id,
//             from: currentUser._id,
//             message: msg,
//         });

//         // const msgs = [...messages];
//         // msgs.push({ fromSelf: true, message: msg });
//         // setMessages(msgs);

//         // Optionally fetch messages again or update the state directly
//         setMessages((prevMessages) => [
//             ...prevMessages,
//             { fromSelf: true, message: msg },
//         ]);
//     };

//     useEffect(() => {
//         if (socket.current) {
//             socket.current.on("msg-receive", (msg) => {
//                 setArrivalMessage({ fromSelf: false, message: msg });
//             });
//         }
//     }, [socket]);

//     useEffect(() => {
//         arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
//     }, [arrivalMessage]);

//     useEffect(() => {
//         scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     return (
//         <>
//             {currentChat && (
//                 <Container>
//                     <div className="chat-header">
//                         <div className="user-details">
//                             <div className="avatar">
//                                 <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
//                             </div>
//                             <div className="username">
//                                 <h3>{currentChat.username}</h3>
//                             </div>
//                         </div>
//                         <Logout />
//                     </div>
//                     <div className="chat-messages">
//                         {messages.map((message, index) => (
//                             <div ref={scrollRef} key={uuidv4()}>
//                                 <div key={index} className={`message ${message.fromSelf ? "sended" : "receive"}`}>
//                                     <div className="content">
//                                         <p>{message.message}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                         <div ref={scrollRef} />
//                     </div>
//                     <ChatInput handleSendMsg={handleSendMsg} />
//                 </Container>
//             )}
//         </>
//     );
// }

// const Container = styled.div`
//     padding-top: 1rem;
//     display: grid;
//     grid-template-rows: 10% 78% 12%;
//     gap: 0.1rem;
//     overflow: hidden;
//     @media screen and (min-width: 720px) and (max-width: 1080px) {
//         grid-template-rows: 15% 70% 15%;
//     }
//     .chat-header {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         padding: 0.2rem;
//         .user-details {
//             display: flex;
//             align-items: center; /* Corrected align-item to align-items */
//             gap: 1rem;
//             .avatar {
//                 img {
//                     height: 3rem;
//                 }
//             }
//             .username {
//                 h3 {
//                     color: white;
//                 }
//             }
//         }
//     }
//     .chat-messages {
//         display: flex;
//         flex-direction: column;
//         gap: 0.5rem;
//         overflow-y: auto;
//         padding: 1rem;
//         .message {
//             display: flex;
//             .content {
//                 max-width: 40%;
//                 overflow-wrap: break-word;
//                 padding: 1rem;
//                 border-radius: 1rem;
//                 color: white;
//             }
//             &.sended {
//                 justify-content: flex-end;
//                 .content {
//                     background-color: #4f04ff21;
//                 }
//             }
//             &.receive {
//                 justify-content: flex-start; /* Changed from justify-content: flex-end */
//                 .content {
//                     background-color: #9900ff20;
//                 }
//             }
//         }
//     }
// `;



import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from 'uuid';
import { getAllMessageRoute, sendMessageRoute } from "../util/APIRoutes";

export default function ChatContainer({ currentChat, currentUser, socket }) {
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();

    // Fetch Messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (currentChat && currentUser) {
                const response = await axios.post(getAllMessageRoute, {
                    from: currentUser._id,
                    to: currentChat._id,
                });
                setMessages(response.data);
            }
        };

        setMessages([]); // Clear old messages on chat switch
        fetchMessages();
    }, [currentChat, currentUser]);

    // Send Message
    const handleSendMsg = async (msg) => {
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
        });

        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: currentUser._id,
            message: msg,
        });

        setMessages((prevMessages) => [
            ...prevMessages,
            { fromSelf: true, message: msg },
        ]);
    };

    // Receive Message
    useEffect(() => {
        socket.current?.on("msg-receive", (msg) => {
            setMessages((prev) => [...prev, { fromSelf: false, message: msg }]);
        });

        return () => {
            socket.current?.off("msg-receive"); // Cleanup listener
        };
    }, []);

    // Scroll to the latest message
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            {currentChat && (
                <Container>
                    <div className="chat-header">
                        <div className="user-details">
                            <div className="avatar">
                                <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
                            </div>
                            <div className="username">
                                <h3>{currentChat.username}</h3>
                            </div>
                        </div>
                        <Logout />
                    </div>
                    <div className="chat-messages">
                        {messages.map((message) => (
                            <div key={uuidv4()} className={`message ${message.fromSelf ? "sended" : "receive"}`}>
                                <div className="content">
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>
{/*                     <ChatInput handleSendMsg={handleSendMsg} /> */}
                </Container>
            )}
        </>
    );
}

const Container = styled.div`
    padding-top: 1rem;
    display: grid;
    grid-template-rows: 10% 78% 12%;
    gap: 0.1rem;
    overflow: hidden;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
        grid-template-rows: 15% 70% 15%;
    }
    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.2rem;
        .user-details {
            display: flex;
            align-items: center;
            gap: 1rem;
            .avatar {
                img {
                    height: 3rem;
                }
            }
            .username {
                h3 {
                    color: white;
                }
            }
        }
    }
    .chat-messages {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        overflow-y: auto;
        padding: 1rem;
        .message {
            display: flex;
            .content {
                max-width: 40%;
                overflow-wrap: break-word;
                padding: 1rem;
                border-radius: 1rem;
                color: white;
            }
            &.sended {
                justify-content: flex-end;
                .content {
                    background-color: #4f04ff21;
                }
            }
            &.receive {
                justify-content: flex-start;
                .content {
                    background-color: #9900ff20;
                }
            }
        }
    }
`;

