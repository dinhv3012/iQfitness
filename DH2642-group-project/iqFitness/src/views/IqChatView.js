import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  // faExpand,
  // faCompress,
} from "@fortawesome/free-solid-svg-icons";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { IconButton } from "@mui/material";

const IqChatView = ({
  messages,
  isTyping,
  handleSendACB,
  handleToggleChatACB,
  // expanded,
}) => {
  return (
    <div
      className="chat-container"
      style={{
        position: "fixed",
        zIndex: "1",
        bottom: "3vh",
        right: "0.1em",
        // width: expanded ? "90%" : "25vw",
        // height: expanded ? "80%" : "45vh",
        width: "min(25em,90vw)",
        height: "min(25em,90vh)",
      }}
    >
      <div className="popup-wrapper">
        <div className="button-bar"></div>
        <div className="button-container">
          <IconButton className="chat-close-button" onClick={handleToggleChatACB}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </div>
      </div>

      <MainContainer
        style={{
          borderRadius: "0.5em",
          boxShadow: "0px 0.125em 0.25em rgba(0, 0, 0, 0.1)",
          background: "#fff",
        }}
      >
        <ChatContainer>
          <MessageList
            className="message-list"
            scrollBehavior="smooth"
            typingIndicator={
              isTyping ? <TypingIndicator content="Your PT is typing" /> : null
            }
            style={{
              maxHeight: "calc(100% - 3.5em)",
              padding: "0.625em",
              overflow: "auto",
            }}
          >
            {messages.map((message, index) => {
              return <Message key={index} model={message} />;
            })}
          </MessageList>
          <MessageInput
            placeholder="Send your message here"
            onSend={handleSendACB}
            style={{ borderRadius: "0.5em", borderTop: "0.0625em solid #ddd" }}
            buttonprops={{
              style: { borderRadius: "0 0.5em 0.5em 0", background: "#43A047" },
            }}
            attachButton={null}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default IqChatView;
