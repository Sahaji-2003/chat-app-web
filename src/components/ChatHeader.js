import React from 'react';
import '../App.css';

// function ChatHeader({ currentRecipient }) {
//   return (
//     <div className="chat-header">
//       <h2>{currentRecipient}</h2>
//     </div>
//   );
// }

// export default ChatHeader;



function ChatHeader({ currentRecipient }) {
  return (
    <div className="chat-header">
      <h2>{currentRecipient}</h2>
    </div>
  );
}

export default ChatHeader;


