import React from 'react';
import '../App.css';

// function ChatArea({ messages }) {
//   return (
//     <div className="chat-area-messages">
//       {messages.map((msg, index) => (
//         <div key={index} className={`message ${msg.sender === 'Me' ? 'me' : 'other'}`}>
//           <strong>{msg.sender}:</strong> {msg.message}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default ChatArea;

function ChatArea({ messages, username }) {
  return (
    <div className="chat-area-messages">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender === username ? 'me' : 'other'}`}>
          {msg.message}
        </div>
      ))}
    </div>
  );
}

export default ChatArea;

