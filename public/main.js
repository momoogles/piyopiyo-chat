import { NODE } from "./constant.js"

//ここから呼び出す関数
const makeForm = () => {
  const input_username = document.createElement("input")
  input_username.setAttribute("id", "username")

  const input_text = document.createElement("input")
  input_text.setAttribute("id", "text")

  const button_send = document.createElement("button")
  button_send.setAttribute("id", "send")
  button_send.textContent = "送信"
  button_send.addEventListener("click", () => {
    send()
  })

  const button_reload = document.createElement("button")
  button_reload.setAttribute("id", "reload")
  button_reload.textContent = "↻"
  button_reload.addEventListener("click", () => {
    getTimeline()
  })

  NODE.INPUT.appendChild(input_username)
  NODE.INPUT.appendChild(input_text)
  NODE.BUTTON.appendChild(button_send)
  NODE.BUTTON.appendChild(button_reload)
}

const makeLog = messages_info => {
  NODE.LOG_AREA.innerHTML = ""
  messages_info.reverse().forEach(message_info => {
    const div_username = document.createElement("div")
    div_username.setAttribute("class", "username")
    div_username.textContent = message_info.username

    const div_text = document.createElement("div")
    div_text.setAttribute("class", "text")
    div_text.textContent = message_info.text

    const div_time = document.createElement("div")
    div_time.setAttribute("class", "time")
    div_time.textContent = message_info.time

    const div_log = document.createElement("div")
    div_log.setAttribute("class", "log")
    div_log.appendChild(div_username)
    div_log.appendChild(div_text)
    div_log.appendChild(div_time)

    NODE.LOG_AREA.appendChild(div_log)
  })
}

const getTimeline = () => {
  fetch("/messages")
    .then(res => {
      return res.json()
    })
    .then(messages_info => {
      makeLog(messages_info)
    })
}

const getTime = () => {
  const now = new Date()

  const year = now.getFullYear()

  const month = now.getMonth() + 1

  const day_key = now.getDay()
  const day_array = ["日", "月", "火", "水", "木", "金", "土"]
  const day = day_array[day_key]

  const date = now.getDate()

  const hours_str = now.getHours().toString(10)
  const hours = hours_str.padStart(2, "0")

  const minutes_str = now.getMinutes().toString(10)
  const minutes = minutes_str.padStart(2, "0")

  const seconds_str = now.getSeconds().toString(10)
  const seconds = seconds_str.padStart(2, "0")

  const time = `${year}/${month}/${date}(${day}) ${hours}:${minutes}:${seconds}`

  return time
}

//ここから初期処理

makeForm()
getTimeline()

NODE.USERNAME = document.getElementById("username")
NODE.TEXT = document.getElementById("text")
NODE.TIME = document.getElementById("time")

const socket = io()

socket.on("messages", messages => {
  makeLog(messages)
})

//ここからクリック処理

const send = () => {
  // fetch("/messages", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json charset=utf-8"
  //   },
  //   body: JSON.stringify({
  //     username: NODE.USERNAME.value,
  //     text: NODE.TEXT.value,
  //     time: getTime()
  //   })
  // })
  //   .then(res => {
  //     return res.json()
  //   })
  //   .then(res => {
  //     NODE.USERNAME.value = null
  //     NODE.TEXT.value = null
  //     getTimeline()
  //   })
  const username_temp = NODE.USERNAME.value
  const text_temp = NODE.TEXT.value

  if (typeof text_temp == "undefined" || text_temp.trim() == false) {
    alert("テキストを入力してください！")
    return
  }

  const msg_info = {
    username: (typeof username_temp !== "undefined" && username_temp.trim()) || "名無しさん",
    text: NODE.TEXT.value,
    time: getTime()
  }

  socket.emit("messages", msg_info)

  NODE.TEXT.value = null
}
