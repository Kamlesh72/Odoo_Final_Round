import React, { useEffect, useRef, useState } from 'react';
import './ChatBox.css';
import axios from 'axios';
import { Button } from 'antd';

const ChatBox = ({ buyer, buyerName, displayName, seller, productId, messageSenderId }) => {
    const [message, setMessage] = useState('');
    const [chats, setChats] = useState([]);
    const chatIntervalRef = useRef(null);
    const sendMessage = async () => {
        await axios.post('/api/users/chat', {
            buyer,
            seller,
            buyerName,
            productId,
            messageSenderId,
            message,
        });
        setMessage('');
        getChats();
    };
    const getChats = async () => {
        const response = await axios.post('/api/users/get-chats', {
            productId,
            buyer,
            seller,
        });
        setChats(response.data.chat);
    };
    useEffect(() => {
        chatIntervalRef.current = setInterval(() => {
            getChats();
        }, 3000);
        getChats();

        return () => {
            clearInterval(chatIntervalRef?.current);
        };
    }, [chatIntervalRef?.current]);

    return (
        <div className="container">
            <div className="chat-messages">
                <div className="chat-header">{displayName}</div>
                {chats.length > 0 &&
                    chats[0].messages.map((message) => {
                        if (message.messageSenderId === messageSenderId) {
                            return (
                                <div class="message-right">
                                    <p class="text">{message.message}</p>
                                </div>
                            );
                        }
                        return (
                            <div class="message-left">
                                <p class="text">{message.message}</p>
                            </div>
                        );
                    })}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    class="write-message"
                    placeholder="Type your message here"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></input>
                <Button class="" type="default" aria-hidden="true" onClick={sendMessage}>
                    SEND
                </Button>
            </div>
        </div>
    );
};

export default ChatBox;
