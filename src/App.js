import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';
import './App.css';


const socket = io('http://localhost:4000');

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [registerMode, setRegisterMode] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState({});

  useEffect(() => {
    socket.on('userList', (userList) => {
      setUsers(userList);
    });

    socket.on('private message', ({ sender, recipient, message }) => {
      console.log(`Received message from ${sender} to ${recipient}: ${message}`);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [sender]: [...(prevMessages[sender] || []), { sender, message }],
      }));

      if (sender !== currentRecipient) {
        setUnreadMessages((prevUnreadMessages) => ({
          ...prevUnreadMessages,
          [sender]: (prevUnreadMessages[sender] || 0) + 1,
        }));
      }
    });

    return () => {
      socket.off('userList');
      socket.off('private message');
    };
  }, [currentRecipient]);

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:4000/register', { username, password });
      alert('Registration successful');
      setRegisterMode(false);
    } catch (error) {
      alert('Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:4000/login', { username, password });
      setIsAuthenticated(true);
      socket.emit('register', username);
    } catch (error) {
      alert('Login failed');
    }
  };

  const sendMessage = () => {
    if (currentRecipient) {
      socket.emit('private message', { recipient: currentRecipient, message });
      setMessages((prevMessages) => ({
        ...prevMessages,
        [currentRecipient]: [
          ...(prevMessages[currentRecipient] || []),
          { sender: username, message },
        ],
      }));
      setMessage('');
    } else {
      alert('Please select a user to chat with.');
    }
  };

  const selectRecipient = (recipient) => {
    setCurrentRecipient(recipient);
    setUnreadMessages((prevUnreadMessages) => ({
      ...prevUnreadMessages,
      [recipient]: 0,
    }));
  };

  return (
    <div className="App">
      <div>
        <h1>Chat Application</h1>
        {!isAuthenticated ? (
          <div>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {registerMode ? (
              <button onClick={handleRegister}>Register</button>
            ) : (
              <button onClick={handleLogin}>Login</button>
            )}
            <button onClick={() => setRegisterMode(!registerMode)}>
              {registerMode ? 'Switch to Login' : 'Switch to Register'}
            </button>
          </div>
        ) : (
          <div className="chat-container">
            <Sidebar
              users={users}
              username={username}
              setCurrentRecipient={selectRecipient}
              unreadMessages={unreadMessages}
            />
            <div className="chat-area">
              {currentRecipient && <ChatHeader currentRecipient={currentRecipient} />}
              <ChatArea
                messages={messages[currentRecipient] || []}
                username={username}
              />
              <MessageInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;



// const socket = io('http://localhost:4000');

// function App() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [token, setToken] = useState('');
//   const [currentRecipient, setCurrentRecipient] = useState('');
//   const [users, setUsers] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [registerMode, setRegisterMode] = useState(true);

//   useEffect(() => {
//     socket.on('userList', (userList) => {
//       setUsers(userList);
//     });

//     socket.on('private message', ({ sender, message }) => {
//       console.log(`Received message from ${sender}: ${message}`);
//       setMessages((prevMessages) => [...prevMessages, { sender, message }]);
//     });

//     return () => {
//       socket.off('userList');
//       socket.off('private message');
//     };
//   }, []);

//   const handleRegister = async () => {
//     try {
//       await axios.post('http://localhost:4000/register', { username, password });
//       alert('Registration successful');
//       setRegisterMode(false);
//     } catch (error) {
//       alert('Registration failed');
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post('http://localhost:4000/login', { username, password });
//       setToken(response.data.token);
//       setIsAuthenticated(true);
//       socket.emit('register', username);
//     } catch (error) {
//       alert('Login failed');
//     }
//   };

//   const sendMessage = () => {
//     socket.emit('private message', { recipient: currentRecipient, message });
//     setMessages((prevMessages) => [...prevMessages, { sender: 'Me', message }]);
//     setMessage('');
//   };

//   return (
//     <div className="App">
//       <div>
//         <h1>Chat Application</h1>
//         {!isAuthenticated ? (
//           <div>
//             <input
//               type="text"
//               placeholder="Enter username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//             <input
//               type="password"
//               placeholder="Enter password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             {registerMode ? (
//               <button onClick={handleRegister}>Register</button>
//             ) : (
//               <button onClick={handleLogin}>Login</button>
//             )}
//             <button onClick={() => setRegisterMode(!registerMode)}>
//               {registerMode ? 'Switch to Login' : 'Switch to Register'}
//             </button>
//           </div>
//         ) : (
//           <div className="chat-container">
//             <Sidebar users={users} username={username} setCurrentRecipient={setCurrentRecipient} />
//             <div className="chat-area">
//               {currentRecipient && <ChatHeader currentRecipient={currentRecipient} />}
//               <ChatArea messages={messages.filter(msg => msg.sender === currentRecipient || msg.sender === 'Me')} />
//               <MessageInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;




// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import axios from 'axios';

// const socket = io('http://localhost:4000');

// function App() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [token, setToken] = useState('');
//   const [currentRecipient, setCurrentRecipient] = useState('');
//   const [users, setUsers] = useState([]);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [registerMode, setRegisterMode] = useState(true);

//   useEffect(() => {
//     socket.on('userList', (userList) => {
//       setUsers(userList);
//     });

//     socket.on('private message', ({ sender, message }) => {
//       console.log(`Received message from ${sender}: ${message}`);
//       setMessages((prevMessages) => [...prevMessages, { sender, message }]);
//     });

//     return () => {
//       socket.off('userList');
//       socket.off('private message');
//     };
//   }, []);

//   const handleRegister = async () => {
//     try {
//       await axios.post('http://localhost:4000/register', { username, password });
//       alert('Registration successful');
//       setRegisterMode(false);
//     } catch (error) {
//       alert('Registration failed');
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post('http://localhost:4000/login', { username, password });
//       setToken(response.data.token);
//       setIsAuthenticated(true);
//       socket.emit('register', username);
//     } catch (error) {
//       alert('Login failed');
//     }
//   };

//   const sendMessage = () => {
//     socket.emit('private message', { recipient: currentRecipient, message });
//     setMessages((prevMessages) => [...prevMessages, { sender: 'Me', message }]);
//     setMessage('');
//   };

//   return (
//     <div className="App">
//       <div>
//         <h1>Chat Application</h1>
//         {!isAuthenticated ? (
//           <div>
//             <input
//               type="text"
//               placeholder="Enter username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//             <input
//               type="password"
//               placeholder="Enter password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             {registerMode ? (
//               <button onClick={handleRegister}>Register</button>
//             ) : (
//               <button onClick={handleLogin}>Login</button>
//             )}
//             <button onClick={() => setRegisterMode(!registerMode)}>
//               {registerMode ? 'Switch to Login' : 'Switch to Register'}
//             </button>
//           </div>
//         ) : (
//           <div>
//             <h2>Welcome, {username}</h2>
//             <select onChange={(e) => setCurrentRecipient(e.target.value)}>
//               <option value="">Select a user to chat with</option>
//               {users.map((user) => (
//                 user !== username && <option key={user} value={user}>{user}</option>
//               ))}
//             </select>
//             <div>
//               {messages.map((msg, index) => (
//                 <div key={index}><strong>{msg.sender}:</strong> {msg.message}</div>
//               ))}
//             </div>
//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             />
//             <button onClick={sendMessage}>Send</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

