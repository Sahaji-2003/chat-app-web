import React from 'react';
import '../App.css';

// function MessageInput({ message, setMessage, sendMessage }) {
//   return (
//     <div className="message-input">
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type your message"
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// }

// export default MessageInput;



function MessageInput({ message, setMessage, sendMessage }) {
  return (
    <div className="message-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default MessageInput;



