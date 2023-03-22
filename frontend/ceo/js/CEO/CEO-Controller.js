const linksEl = document.querySelector(".links");
const sidebarLinks = document.querySelectorAll(".dashboard .link");
const contentEl = document.querySelector(".content");

linksEl.addEventListener("click", function (e) {
	const linkEl = e.target.closest(".link");
	if (!linkEl) return;
	sidebarLinks.forEach((link) => link.classList.remove("active"));
	linkEl.classList.add("active");
	showTabContent(linkEl.id);
});

function showTabContent(id) {
	contentEl.innerHTML = `
	<div class="spinner">
		<svg
			id="loading-spinner"
			width="80"
			height="80"
			viewBox="0 0 80 80"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				id="loading-circle-large"
				cx="40"
				cy="40"
				r="36"
				stroke="#8cd2b8"
				stroke-width="8"
			/>
		</svg>
	</div>`;

	switch (id) {
		case "revenue":
			displayRevenuesContent();
			break;
		case "drugs":
			displayDrugsContent();
			break;
		case "branches":
			displayBranchesContent();
			break;
		case "logout":
			localStorage.clear();
			window.location.href = "../login/index.html";
			break;
	}
}

/*--------------------------------- Default Page ---------------------------------*/
window.onload = () => {
	displayRevenuesContent();
};

/*--------------------------------- Cross domain message ---------------------------------*/
window.addEventListener("message", function (event) {
	if (event.data) {
		console.log(event.data);
		const { token, username, avaUrl, bid, uid } = event.data;
		this.localStorage.setItem("token", token);
		this.localStorage.setItem("uid", uid);
		this.localStorage.setItem("username", username);
		this.localStorage.setItem("avaUrl", avaUrl);
		this.localStorage.setItem("bid", bid);
	}
});

var token = localStorage.getItem("token");
