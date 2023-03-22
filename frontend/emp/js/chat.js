// const socket = io();
const socket = io("https://chat.tiemthuocgiadinh.click");
let username = localStorage.getItem("username") || "user";
let userid = localStorage.getItem("uid") || "6569";

const sendBtn = document.querySelector("#chat-btn");
const chatMes = document.querySelector("#chat-mes");
const messageContainer = document.querySelector(".chats");
const conversationContainer = document.querySelector(".conversationBox");
let room = "";
const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsIm5hbWUiOiJWZXJvbmljYSBTa2lubmVyIiwicm9sZSI6IkNFTyIsInVybCI6Imh0dHBzOi8vY2RuLmRvbm1haS51cy9vcmlnaW5hbC8zZC85Zi9fX29yaWdpbmFsX2RyYXduX2J5X2ZhcnRpYXJ0X18zZDlmNjZmOGEyZjMwOWZiYzEwYjEyNzVmYTI4YWY3Mi5wbmciLCJiaWQiOjEsImlhdCI6MTY1NTI4MTIwMCwiZXhwIjoxNjU1MzY3NjAwfQ.u1md1Fo1YMtr3KN_vQbVfMg8h4BDeuAzbKQqyxNd1vM";
const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-user-cards-container]");
const searchInput = document.querySelector("[data-search]");
let users = [];
let lastRoom = "";
// id of user in chat room
let activeRoom;
// username of user in chat room
let activeUsername;
// avatar of user in chat room
let activeAvatar;
//listening for cross domain message
window.addEventListener("message", function (event) {
    if (event.data) {
        const { userName, userId } = event.data;
        username = userName;
        userid = userId;
    }
});
function changeMainName() {
    document.querySelector("#mainuser-name").textContent = username;
}

changeMainName();

socket.on("init", (arr) => {
    for (const i of arr.unique) {
        for (const j of arr.users) {
            if (i.user === j.userID && i.user !== userid) {
                createDivConversation(j.username, j.userID, j.userURL, i.lastmes);
            }
        }
    }
    if (arr.unique.length !== 0) {
        enableClickConversation();
        showLastestChat();
    }
    socket.emit("updateUserStatus", userid);
});

// Change online offline
socket.on("updateUserStatus", (data) => {
    var x = document.getElementsByClassName("status-circle");
    for (var i = 0, len = x.length; i < len; i++) {
        x[i].classList.remove("status-circle-on");

        for (const j of data) {
            if (j.userid === x[i].parentElement.parentElement.getAttribute("data-id")) {
                x[i].classList.add("status-circle-on");
            }
        }
    }
    changeStatusOfRoom(data);
});

// Check icon status when creating conversation div
socket.on("check-icon-status", (data) => {
    var x = document.getElementsByClassName("status-circle");
    for (var i = 0, len = x.length; i < len; i++) {
        x[i].classList.remove("status-circle-on");

        for (const j of data) {
            if (j.userid === x[i].parentElement.parentElement.getAttribute("data-id")) {
                x[i].classList.add("status-circle-on");
            }
        }
    }
});

//Get message from users
sendBtn.addEventListener("click", function () {
    const message = chatMes.value;
    if (message === "") {
        return;
    }
    socket.emit("on-chat", {
        username,
        userid,
        room,
        message,
    });
    chatMes.value = "";
    chatMes.focus();
});

chatMes.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendBtn.click();
    }
});

// Click to chatMess to remove new chat inform
chatMes.addEventListener("click", () => {
    let el1 = document.querySelector(`[data-id="${activeRoom}"]`);
    if (el1 === null) return;
    el1.classList.remove("new-chat-style");
});

//Show history chat
socket.on("new-chat", (data) => {
    document.querySelector(".chats").textContent = "";
    for (const i of data) {
        let el = document.createElement("div");
        if (userid === i.userid) {
            el.setAttribute("class", "my-chat");
        } else {
            el.setAttribute("class", "client-chat");
        }
        el.textContent = `${i.message}`;
        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
});

//Show new message to users
socket.on("user-chat", (message) => {
    // To-do
    // If room == show, if not don't show
    // div conversation change last message
    var i = activeRoom;
    let el1 = document.querySelector(`[data-id="${i}"]`);
    let el = document.createElement("div");
    if (userid === message.userid) {
        el.setAttribute("class", "my-chat");
        if (el1 !== null) {
            let conversationName = el1.querySelector(".lastMess");
            conversationName.textContent = "You: " + message.message;
        } else {
            createDivConversation(
                activeUsername,
                activeRoom,
                activeAvatar,
                "You: " + message.message,
            );
            el1 = document.querySelector(`[data-id="${activeRoom}"]`);
            socket.emit("check-icon-status");
            enableClickConversation();
            focusConversation(activeRoom);
        }
        el1.remove();
        conversationContainer.insertBefore(el1, conversationContainer.firstChild);
    } else {
        // Check if is chatting with another user
        if (activeRoom !== message.userid) {
            el1 = document.querySelector(`[data-id="${message.userid}"]`);
            receiveMessage(message, el1);
        } else {
            el.setAttribute("class", "client-chat");
            receiveMessage(message, el1);
        }
    }
    el.textContent = `${message.message}`;
    messageContainer.appendChild(el);
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
});

socket.on("change-room", (data) => {
    // Change name
    document.getElementById("user-name").textContent = data.username;

    let img = document.getElementById("user-avatar");
    if (img === null) {
        img = document.createElement("img");
        img.setAttribute("id", "user-avatar");
        document
            .querySelector(".right")
            .querySelector(".client")
            .insertBefore(
                img,
                document.querySelector(".right").querySelector(".client").firstChild,
            );
    }
    img.src = activeAvatar;

    // Change status
    changeStatusOfRoom(data.users);
});

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    // Hide or show conversation history
    if (value === "") {
        showConversation();
    } else {
        hideConversation();
    }

    if (!value) {
        users.forEach((user) => {
            user.element.classList.toggle("hide", true);
        });
    } else {
        users.forEach((user) => {
            const isVisible =
                user.username.toLowerCase().includes(value) ||
                user.userID.toLowerCase().includes(value);
            user.element.classList.toggle("hide", !isVisible);
            if (user.userID.toLowerCase() === userid) {
                user.element.classList.toggle("hide", true);
            }
        });
    }
});

fetch("https://tiemthuocgiadinh.click/employee", {
    headers: {
        Authorization: "Bearer " + token,
    },
})
    .then((res) => res.json())
    .then((data) => {
        users = data.map((user) => {
            const card = userCardTemplate.content.cloneNode(true).children[0];
            const header = card.querySelector("[data-header]");
            const body = card.querySelector("[data-body]");
            const avatar = card.querySelector(".avatar-conv");
            header.textContent = user.ename;
            body.textContent = user.eid.toString();
            avatar.src = user.url;
            userCardContainer.append(card);
            return {
                username: user.ename,
                userID: user.eid.toString(),
                userURL: user.url,
                element: card,
            };
        });
        users.forEach((user) => {
            user.element.classList.toggle("hide", true);
        });
        var userCards = document.getElementsByClassName("card");
        for (var i = 0, len = userCards.length; i < len; i++) {
            userCards[i].addEventListener("click", (e) => {
                let username = "";
                if (e.target.classList.contains("card")) {
                    room = e.target.querySelector("[data-body]").firstChild.nodeValue.toString();
                    username = e.target.querySelector("[data-header]").firstChild.nodeValue;
                    activeRoom = room;
                    activeUsername = username;
                    activeAvatar = e.target.querySelector(".avatar-conv").src;
                } else if (
                    e.target.classList.contains("avatar-conv") ||
                    e.target.classList.contains("client-info-left")
                ) {
                    room = e.target.parentElement
                        .querySelector("[data-body]")
                        .firstChild.nodeValue.toString();
                    username =
                        e.target.parentElement.querySelector("[data-header]").firstChild.nodeValue;
                    activeRoom = room;
                    activeUsername = username;
                    activeAvatar = e.target.parentElement.querySelector(".avatar-conv").src;
                } else {
                    room = e.target.parentElement.parentElement
                        .querySelector("[data-body]")
                        .firstChild.nodeValue.toString();
                    username =
                        e.target.parentElement.parentElement.querySelector("[data-header]")
                            .firstChild.nodeValue;
                    activeRoom = room;
                    activeUsername = username;
                    activeAvatar =
                        e.target.parentElement.parentElement.querySelector(".avatar-conv").src;
                }
                users.forEach((user) => {
                    user.element.classList.toggle("hide", true);
                });
                searchInput.value = "";
                searchInput.focus();

                // Leave previous room
                socket.emit("leaveRoom", lastRoom);

                //Join a room
                socket.emit("joinRoom", { userid, room });

                // Change room
                changeRoom(username);

                if (userid.localeCompare(room) < 0) lastRoom = userid + "_" + room;
                else lastRoom = room + "_" + userid;

                // Show conversation again
                showConversation();

                focusConversation(room);

                chatMes.click();
                chatMes.focus();
            });
        }
        init(users);
    });

// Change name, icon and status of room
function changeRoom(username) {
    socket.emit("change-room", username);
}

// Hide conversation
function hideConversation() {
    var x = document.getElementsByClassName("conversation");
    for (var i = 0, len = x.length; i < len; i++) {
        x[i].style.display = "none";
    }
}

// Show conversation
function showConversation() {
    var x = document.getElementsByClassName("conversation");
    for (var i = 0, len = x.length; i < len; i++) {
        x[i].style.display = "flex";
    }
}

function init(users) {
    socket.emit("init", { userid, users });
}

function createDivConversation(username, userid, userurl, lastMess) {
    let el = document.createElement("div");
    let img = document.createElement("img");
    let span = document.createElement("span");
    let spanMess = document.createElement("p");
    let statusicon = document.createElement("div");
    let el2 = document.createElement("div");
    let box = document.createElement("div");
    el.setAttribute("class", "conversation");
    el.setAttribute("data-id", userid);
    el.setAttribute("data-url", userurl);
    box.setAttribute("class", "box");
    span.setAttribute("class", "conversationName");
    spanMess.setAttribute("class", "lastMess");
    span.textContent = username;
    spanMess.textContent = lastMess;
    img.setAttribute("src", userurl);
    img.setAttribute("alt", "icon avatar");
    el2.setAttribute("class", "icon-container");
    statusicon.setAttribute("class", "status-circle");
    el.appendChild(el2);
    box.appendChild(span);
    box.appendChild(spanMess);
    el.appendChild(box);
    conversationContainer.appendChild(el);
    el2.appendChild(img);
    el2.appendChild(statusicon);
}

function enableClickConversation() {
    var x = document.getElementsByClassName("conversation");
    let username = "";
    for (var i = 0, len = x.length; i < len; i++) {
        x[i].addEventListener("click", (e) => {
            if (e.target.classList.contains("conversation")) {
                room = e.target.getAttribute("data-id");
                username = e.target.querySelector(".conversationName").firstChild.textContent;
                activeRoom = room;
                activeUsername = username;
                activeAvatar = e.target.getAttribute("data-url");
            } else if (
                e.target.classList.contains("icon-container") ||
                e.target.classList.contains("box")
            ) {
                room = e.target.parentElement.getAttribute("data-id");
                username = e.target.parentElement.querySelector(".conversationName").textContent;
                activeRoom = room;
                activeUsername = username;
                activeAvatar = e.target.parentElement.getAttribute("data-url");
            } else {
                room = e.target.parentElement.parentElement.getAttribute("data-id");
                username =
                    e.target.parentElement.parentElement.querySelector(
                        ".conversationName",
                    ).textContent;
                activeRoom = room;
                activeUsername = username;
                activeAvatar = e.target.parentElement.parentElement.getAttribute("data-url");
            }
            // Leave previous room
            socket.emit("leaveRoom", lastRoom);

            //Join a room
            socket.emit("joinRoom", { userid, room });

            // Change room
            changeRoom(username);

            focusConversation(room);

            chatMes.focus();
            chatMes.click();
        });
    }
}

// Show lastest chat with user when reload page
function showLastestChat() {
    var x = document.getElementsByClassName("conversation");
    if (x.length === 0) return;
    x[0].click();
}

function changeStatusOfRoom(data) {
    if (document.getElementById("user-name").textContent !== "") {
        for (const i of data) {
            if (activeRoom === i.userid) {
                document.getElementById("user-status").textContent = "online";
                document.getElementById("user-status").classList.remove("status-off");
                return;
            }
        }
        document.getElementById("user-status").textContent = "offline";
        document.getElementById("user-status").classList.add("status-off");
    }
}

// process when receive message from users
function receiveMessage(message, el1) {
    if (el1 !== null) {
        let conversationName = el1.querySelector(".lastMess");
        conversationName.textContent = message.message;
        if (activeRoom !== message.userid) {
            el1.classList.add("new-chat-style");
        }
    } else {
        let avatar = "";
        users.forEach((user) => {
            if (user.userID === message.userid) {
                avatar = user.userURL;
            }
        });
        createDivConversation(message.username, message.userid, user.userURL, message.message);
        socket.emit("check-icon-status");
        enableClickConversation();

        el1 = document.querySelector(`[data-id="${message.userid}"]`);
        if (activeRoom !== message.userid) {
            el1.classList.add("new-chat-style");
        }
    }
    el1.remove();
    conversationContainer.insertBefore(el1, conversationContainer.firstChild);
}

// Focus conversation div when in room
function focusConversation(userid) {
    var conversations = document.getElementsByClassName("conversation");
    for (const i of conversations) {
        i.classList.remove("active");
    }
    let el1 = document.querySelector(`[data-id="${userid}"]`);
    if (el1 === null) return;
    el1.classList.add("active");
}
