import React from 'react';
import '../App.css';

// function Sidebar({ users, username, setCurrentRecipient }) {
//   return (
//     <div className="sidebar">
//       <div className="sidebar-header">
//         <h2>Contacts</h2>
//       </div>
//       <div className="user-list">
//         {users.map((user) => (
//           user !== username && (
//             <div key={user} className="user-item" onClick={() => setCurrentRecipient(user)}>
//               {user}
//             </div>
//           )
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Sidebar;


function Sidebar({ users, username, setCurrentRecipient, unreadMessages }) {
  return (
    <div className="sidebar">
      <h3>Users</h3>
      <ul>
        {users.map((user) => (
          user !== username && (
            <li key={user} onClick={() => setCurrentRecipient(user)}>
              {user}
              {unreadMessages[user] > 0 && (
                <span className="notification">{unreadMessages[user]}</span>
              )}
            </li>
          )
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;


