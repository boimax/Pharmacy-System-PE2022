function chatApplication() {
	const socket = io();
	const username = prompt("What is your name?");
	const userid = prompt("What is your id?");
	const sendBtn = document.querySelector("#chat-btn");
	const chatMes = document.querySelector("#chat-mes");
	const messageContainer = document.querySelector(".chats");
	const conversationContainer = document.querySelector(".conversationBox");
	let room = "";
	//messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
	//Get username and room from URL
	/*const {namee, userid, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});*/
	const userCardTemplate = document.querySelector("[data-user-template]");
	const userCardContainer = document.querySelector("[data-user-cards-container]");
	const searchInput = document.querySelector("[data-search]");
	let users = [];
	let lastRoom = "";
	let activeRom;
	let activeUsers = [];

	function changeMainName() {
		document.querySelector("#mainuser-name").textContent = username;
	}

	changeMainName();

	// Change online offline
	socket.on("updateUserStatus", (data) => {
		activeUsers = data;
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
			messageContainer.scrollTop =
				messageContainer.scrollHeight - messageContainer.clientHeight;
		}
	});
	//Show new message to users
	socket.on("user-chat", (message) => {
		var i = activeRom;
		const el1 = document.querySelector(`[data-id="${i}"]`);
		if (el1 !== null) {
			el1.remove();
			conversationContainer.insertBefore(el1, conversationContainer.firstChild);
		}
		let el = document.createElement("div");
		console.log("Hello");
		if (userid === message.userid) {
			el.setAttribute("class", "my-chat");
		} else {
			el.setAttribute("class", "client-chat");
		}
		el.textContent = `${message.message}`;
		messageContainer.appendChild(el);
		messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
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
			});
		}
	});

	fetch("https://virtserver.swaggerhub.com/thangvip4321/hay/1.0.0/employee")
		.then((res) => res.json())
		.then((data) => {
			users = data.map((user) => {
				const card = userCardTemplate.content.cloneNode(true).children[0];
				const header = card.querySelector("[data-header]");
				const body = card.querySelector("[data-body]");
				header.textContent = user.username;
				body.textContent = user.userID;
				userCardContainer.append(card);
				return { username: user.username, userID: user.userID, element: card };
			});
			users.forEach((user) => {
				user.element.classList.toggle("hide", true);
			});
			var userCards = document.getElementsByClassName("card");
			for (var i = 0, len = userCards.length; i < len; i++) {
				userCards[i].addEventListener("click", (e) => {
					let username = "";
					if (e.target.classList.contains("card")) {
						room = e.target
							.querySelector("[data-body]")
							.firstChild.nodeValue.toString();
						username = e.target.querySelector("[data-header]").firstChild.nodeValue;
						activeRom = room;
					} else {
						room = e.target.parentElement
							.querySelector("[data-body]")
							.firstChild.nodeValue.toString();
						username =
							e.target.parentElement.querySelector("[data-header]").firstChild
								.nodeValue;
						activeRom = room;
					}
					users.forEach((user) => {
						user.element.classList.toggle("hide", true);
					});
					searchInput.value = "";
					searchInput.focus();

					console.log("lastroom" + lastRoom);

					//Leave previous room
					socket.emit("leaveRoom", lastRoom);

					//Join a room
					socket.emit("joinRoom", { userid, room });

					// Change room
					changeRoom(username);

					if (userid.localeCompare(room) < 0) lastRoom = userid + "_" + room;
					else lastRoom = room + "_" + userid;

					// Show conversation again
					showConversation();
				});
			}
			init(users);
		});

	// Change name, icon and status of room
	function changeRoom(username) {
		document.getElementById("user-name").textContent = username;

		// Change icon

		console.log(activeUsers);
		for (const i of activeUsers) {
			console.log(activeRom);
			if (activeRom === i.userid) {
				document.getElementById("user-status").textContent = "online";
				document.getElementById("user-status").classList.remove("status-off");
				return;
			}
		}

		document.getElementById("user-status").textContent = "offline";
		document.getElementById("user-status").classList.add("status-off");
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

	socket.on("init", (arr) => {
		for (const i of arr.unique) {
			for (const j of arr.users) {
				if (i.user === j.userID && i.user !== userid) {
					createDivConversation(j.username, j.userID, i.lastmes);
				}
			}
		}
		enableClickConversation();
		showLastestChat();
		socket.emit("updateUserStatus", userid);
	});

	function createDivConversation(username, userid, lastMess) {
		let el = document.createElement("div");
		let img = document.createElement("img");
		let span = document.createElement("span");
		let spanMess = document.createElement("p");
		let statusicon = document.createElement("div");
		let el2 = document.createElement("div");
		let box = document.createElement("div");
		el.setAttribute("class", "conversation");
		el.setAttribute("data-id", userid);
		box.setAttribute("class", "box");
		span.setAttribute("class", "conversationName");
		span.textContent = username;
		spanMess.textContent = lastMess;
		img.setAttribute("src", "images/chion-bieton.PNG");
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
					activeRom = room;
				} else {
					room = e.target.parentElement.getAttribute("data-id");
					username =
						e.target.parentElement.querySelector(".conversationName").textContent;
					activeRom = room;
				}
				//Leave previous room
				socket.emit("leaveRoom", lastRoom);

				//Join a room
				socket.emit("joinRoom", { userid, room });

				// Change room
				changeRoom(username);
			});
		}
	}

	// Show lastest chat when reload page
	function showLastestChat() {
		var x = document.getElementsByClassName("conversation");
		x[0].click();
	}
}

chatApplication();
