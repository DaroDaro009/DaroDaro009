// Connect to Socket.IO server
const socket = io();

// DOM Elements
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');

// Generate a random username
const username = 'User_' + Math.random().toString(36).substr(2, 5);

let typingTimeout;

// Send chat message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const message = messageInput.value.trim();
  if (message) {
    const messageData = {
      username: username,
      text: message,
      timestamp: new Date().toLocaleTimeString()
    };
    
    // Emit message to server
    socket.emit('chat message', messageData);
    
    // Clear input
    messageInput.value = '';
    messageInput.focus();
    
    // Stop typing indicator
    socket.emit('stop typing', { username: username });
  }
});

// Listen for incoming messages
socket.on('chat message', (data) => {
  addMessage(data);
});

// Add message to chat
function addMessage(data) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${data.username === username ? 'sent' : 'received'}`;
  
  const usernameDiv = document.createElement('div');
  usernameDiv.className = 'username';
  usernameDiv.textContent = data.username;
  
  const textDiv = document.createElement('div');
  textDiv.className = 'text';
  textDiv.textContent = data.text;
  
  const timestampDiv = document.createElement('div');
  timestampDiv.className = 'timestamp';
  timestampDiv.textContent = data.timestamp;
  
  messageDiv.appendChild(usernameDiv);
  messageDiv.appendChild(textDiv);
  messageDiv.appendChild(timestampDiv);
  
  messagesContainer.appendChild(messageDiv);
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Handle typing indicator
messageInput.addEventListener('input', () => {
  socket.emit('typing', { username: username });
  
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('stop typing', { username: username });
  }, 1000);
});

// Listen for typing events
socket.on('typing', (data) => {
  if (data.username !== username) {
    typingIndicator.textContent = `${data.username} is typing...`;
  }
});

socket.on('stop typing', (data) => {
  if (data.username !== username) {
    typingIndicator.textContent = '';
  }
});

// Welcome message
console.log(`Connected as ${username}`);
