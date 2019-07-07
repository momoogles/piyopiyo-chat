import { NODE } from "./constant.js";

//ここから呼び出す関数
const makeForm = () => {
  const input_username = document.createElement("input");
  input_username.setAttribute("id", "username");

  const input_text = document.createElement("input");
  input_text.setAttribute("id", "text");

  const button_send = document.createElement("button");
  button_send.setAttribute("id", "send");
  button_send.textContent = "送信";
  button_send.addEventListener("click", () => {
    send();
  });

  const button_reload = document.createElement("button");
  button_reload.setAttribute("id", "reload");
  button_reload.textContent = "↻";
  button_reload.addEventListener("click", () => {
    reload();
  });

  NODE.INPUT.appendChild(input_username);
  NODE.INPUT.appendChild(input_text);
  NODE.BUTTON.appendChild(button_send);
  NODE.BUTTON.appendChild(button_reload);
};

const makeDiv = messages_info => {
  NODE.LOG_AREA.innerHTML = "";
  messages_info.reverse().forEach(message_info => {
    console.log(message_info);
    const div_username = document.createElement("div");
    div_username.setAttribute("class", "username");
    div_username.textContent = message_info.username;

    const div_text = document.createElement("div");
    div_text.setAttribute("class", "text");
    div_text.textContent = message_info.text;

    const div_log = document.createElement("div");
    div_log.setAttribute("class", "log");
    div_log.appendChild(div_username);
    div_log.appendChild(div_text);

    NODE.LOG_AREA.appendChild(div_log);
  });
};

const getTimeline = () => {
  fetch("/messages")
    .then(res => {
      return res.json();
    })
    .then(messages_info => {
      makeDiv(messages_info);
    });
};

//ここから初期処理
makeForm();
getTimeline();

NODE.USERNAME = document.getElementById("username");
NODE.TEXT = document.getElementById("text");

//ここからクリック処理
const send = () => {
  console.log("Hello world");
  fetch("/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      username: NODE.USERNAME.value,
      text: NODE.TEXT.value
    })
  })
    .then(res => {
      return res.json();
    })
    .then(json => {
      console.log(json);
      NODE.USERNAME.value = null;
      NODE.TEXT.value = null;
      getTimeline();
    });
};
