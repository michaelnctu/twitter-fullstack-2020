const socket = io('http://localhost:3000')
const message = document.getElementById('message')
const name = document.getElementById('name')
const avatar = document.getElementById('avatar')
const btn = document.getElementById('send')
const output = document.getElementById('output')
const feedback = document.getElementById('feedback')
const chatMessages = document.querySelector('.chat-messages')

//提示訊息
socket.on('message', message => {
  outPutmessage(message)  //output到DOM上
  //scrolldown
  chatMessages.scrollTop = chatMessages.scrollHeight
})

socket.on('chat-message', data => {
  console.log("hye", data)
})


//chatroomhandlebars傳來的資訊
btn.addEventListener('click', e => {
  console.log('成功')
  e.preventDefault()
  socket.emit('chat-message',
    {
      message: message.value,
      name: name.value,
      avatar: avatar.value
    }
  )
  messageInput.value = ''
});

message.addEventListener('keypress', () => {
  socket.emit('typing', name);
})

//Listen for events
socket.on('chat-message', (data) => {
  output.innerHTML += `<div class='d-flex flex-row justify-content-end my-2'>
        <div class="d-flex align-items-center" >
          <div class="send-message d-flex flex-column align-items-end " style="color: #FF0000">
            <div class="message">${data.message}</div>
            <small class="send-time text-muted">上午 06:00</small>
          </div>
          <img class="message-image rounded-circle ml-2" src="${data.avatar}" alt="" style="width:60px">
        </div>
      </div>`
})

socket.on('typing', data => {
  feedback.innerHTML = ' <p><em>' + data.name + 'is typing a message......</em></p>'
})

socket.on('online', onlineCount => {
  online.innerText = onlineCount
})

//Output message to DOM
function outPutmessage(message) {
  const div = document.createElement('div')
  div.classList.add('message');
  div.innerHTML = `
  <div class="row justify-content-center" style="background-color:#F0F0F0;border-radius: 15px; width: 30%">
    <p class="">${message.username}</span></p>
    <p class="">${message.text}</span></p>
  </div>
  `;
  document.querySelector('.chat-messages').appendChild(div)
}


// socket.on('send-chat-message', message => {
//   console.log(message)
// })
