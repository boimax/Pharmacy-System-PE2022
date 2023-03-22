const labels = document.querySelectorAll(".form-control label");
const userNameEl = document.querySelector("#username");
const passwordEl = document.querySelector("#password");
const btnEl = document.querySelector(".btn");

labels.forEach((label) => {
	label.innerHTML = label.innerText
		.split("")
		.map((letter, idx) => `<span style="transition-delay:${idx * 50}ms">${letter}</span>`)
		.join("");
});

const login = async function (username, password) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify({
		username: username,
		password: password,
	});

	var requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: raw,
		redirect: "follow",
	};
	fetch("https://tiemthuocgiadinh.click/login", requestOptions)
		.then((response) => response.text())
		.then((token) => {
			{
				const tok = parseJwt(token);
				console.log("🚀 -> tok", tok);
				const { name, role, url, bid, uid } = parseJwt(token);
				const data = {
					uid,
					token,
					name,
					role,
					bid,
					avaUrl: url,
				};
				console.log("🚀 -> data", data);
				// postCrossDomainMessage(role, data);
				localStorage.setItem("name", name);
				localStorage.setItem("uid", uid);
				localStorage.setItem("token", token);
				localStorage.setItem("role", role);
				localStorage.setItem("bid", bid);
				localStorage.setItem("avaUrl", url);
				window.location.href = `../${role.toLowerCase()}/index.html`;
			}
		})
		.catch((error) => {
			alert("There is something wrong!: ", error);
		});
};
btnEl.addEventListener("click", (event) => {
	event.preventDefault();
	const username = userNameEl.value;
	const password = passwordEl.value;
	login(username, password);
	userNameEl.value = "";
	passwordEl.value = "";
});

function postCrossDomainMessage(role, msg) {
	const win = document.getElementById(`ifr-${role.toLowerCase()}`).contentWindow;
	win.postMessage(msg, "*");
}

function parseJwt(token) {
	let base64Url = token.split(".")[1];
	let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	let jsonPayload = decodeURIComponent(
		atob(base64)
			.split("")
			.map(function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join(""),
	);

	return JSON.parse(jsonPayload);
}

function loginAnimation() {
	const tl = gsap.timeline();
	tl.fromTo(".login", { opacity: 0, y: 20 }, { opacity: 1, y: 0 });
	tl.fromTo(".text", { y: 10 }, { y: 0 });
	tl.fromTo(".doctor", { opacity: 0, y: -50 }, { opacity: 1, y: 0 }, "<");
	tl.fromTo(".gsap", { opacity: 0, y: -10, x: 10 }, { opacity: 1, stagger: 0.3, y: 0, x: 0 });
	tl.fromTo(
		".circle1",
		{ opacity: 0, x: -500 },
		{ x: 0, opacity: 1, duration: 2, ease: "elastic.out(2,0.75)" },
		"<",
	);
	tl.fromTo(
		".circle2",
		{ y: -300, opacity: 0 },
		{ y: 0, opacity: 1, duration: 2, ease: "elastic.out(1,0.75)" },
		"<30%",
	);
	tl.fromTo(
		".circle3",
		{ y: -500, opacity: 0 },
		{ y: 0, opacity: 1, duration: 2, ease: "bounce.out" },
		"<30%",
	);
	tl.fromTo(".flake", { x: -10, opacity: 0 }, { x: 0, opacity: 1 }, "<");
}

loginAnimation();
