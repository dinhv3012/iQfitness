import React, { useState } from "react";
import IqChatView from "../views/IqChatView";
import { API_KEY, endpointURL } from "../api/ChatGPT";
import { Button } from "@mui/material";
import { FaBolt } from "react-icons/fa";


const IqChatPresenter = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Your PT! Ask me anything!",
      sentTime: "just now",
      sender: "PT",
    },
  ]);
  const [expanded, setExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const systemMessage = {
    role: "system",
    content: "Ask AI",
  };

  const handleSendACB = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };
    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setIsTyping(true);
    await handleResponseACB(newMessages);
  };

  async function handleResponseACB(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "PT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    const response = await fetch(endpointURL, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    const data = await response.json();

    setMessages([
      ...chatMessages,
      {
        message: data.choices[0].message.content,
        sender: "PT",
      },
    ]);

    setIsTyping(false);
  }

  const handleToggleChatACB = () => {
    setShowChat((prevShowChat) => !prevShowChat);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };


  return (
    <div>
      {!showChat && (
        <Button sx={{
          position: "fixed",
          bottom: "0",
          right: "0.01em",
          width: "min(20em, 60vw)",
          height: "3em",
          backgroundColor: "white",
          boxShadow: "0px -0.0625em 0.625em 0px rgba(0, 0, 0, 0.5)",
        }} onClick={handleToggleChatACB} startIcon={<FaBolt />} variant="outlined">
          IQTrainer Online
        </Button>
      )
      }

      {
        showChat && (
          <IqChatView
            messages={messages}
            isTyping={isTyping}
            handleSendACB={handleSendACB}
            handleToggleChatACB={handleToggleChatACB}
            expanded={expanded}
            toggleExpand={toggleExpand}
          />
        )
      }
    </div >
  );
};

export default IqChatPresenter;
