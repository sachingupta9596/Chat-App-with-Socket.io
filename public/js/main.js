const chatform = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// get queryString username and room name
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// join chatroom event

socket.emit("joinRoom", { username, room });

// get room and user

socket.on("roomuser", ({ room, user }) => {
  outputRoomName(room);
  outputUserName(user);
});

socket.on("message", (message) => {
  // we are catching here the emitted message from the server
  // which server emit on getting new connection
  console.log(message);
  outputMessage(message);

  // scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight; // it will take always to the bottom
});

chatform.addEventListener("submit", (e) => {
  e.preventDefault(); // submit the file ???

  // get message text from input form
  const msg = e.target.elements.msg.value;

  // emit message to server
  socket.emit("chatMessage", msg);

  // clear input after hitting submit in the chat box
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus(); //to make focus again on input box
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `	<p class="meta"> ${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}
// Add user List
function outputUserName(users) {
  userList.innerHTML = `${user.map((user) => `<li>${username}</li.`).join("")}`;
}
