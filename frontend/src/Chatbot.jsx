import React, { useState, useRef, useEffect } from "react";
import chatbot_logo from "./chatbot.png";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = (userInput) => {
    const text = userInput.toLowerCase();
    if (text.includes("hi") || text.includes("hello")) return "Hello! How can I help you today?";
    if (text.includes("help")) return "Sure! I can assist you with common queries.";
    if (text.includes("joke")) return "Why don’t scientists trust atoms? Because they make up everything!";
    return "I'm just a demo bot. Try typing: Hi, Help, or Tell me a joke.";
  };

 const handleSendQuery = () => {
  if (!inputText.trim()) return;

  const userMsg = {
    text: inputText,
    sender: "user",
    time: new Date().toLocaleTimeString(),
  };

  setMessages((prev) => [...prev, userMsg]);
  setInputText("");

  setTimeout(() => {
    const botMsg = {
      text: botResponses(userMsg.text),
      sender: "bot",
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, botMsg]);
  }, 1500);
};


  const handleQuickReply = (text) => {
    setInputText(text);
    setTimeout(() => handleSendQuery(), 100);
  };

  const quickReplies = ["Hi", "Help", "Tell me a joke","F&Qs"];

  return (
    <>
      {!isOpen && (
        <div className="chatbot-icon" onClick={() => setIsOpen(true)}>
          <img src={chatbot_logo} alt="chatbot" width="40" height="40" />
          <span style={{ marginLeft: "10px", fontWeight: "bold" }}>Chatbot</span>
        </div>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h5>Chatbot</h5>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.sender === "user" ? "user_msg" : "bot_msg"}
              >
                <div className="msg_text">{msg.text}</div>
                <div className="msg_time">{msg.time}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="quick-replies">
            {quickReplies.map((reply, index) => (
              <button key={index} onClick={() => handleQuickReply(reply)}>
                {reply}
              </button>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
              placeholder="Type your message..."
            />
            <button onClick={handleSendQuery}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;


// import React, { useEffect } from 'react';

// function Chatbot() {
//   useEffect(() => {
//     const s = document.createElement("script");
//     s.src = "https://builder.corover.ai/params/widget/corovercb.lib.min.js?appId=7f280340-588c-4542-83fe-6fc746d57317";
//     s.type = "text/javascript";
//     document.body.appendChild(s);
//   }, []);

//   return (
    
//     <div style={{ padding: "10px", fontFamily: "Arial, sans-serif", fontSize: "16px", color: "#333" }}>
   
//     </div>
//   );
// }

// export default Chatbot;
