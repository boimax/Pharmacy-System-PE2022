const linksEl = document.querySelector(".links");
const sidebarLinks = document.querySelectorAll(".dashboard .link");
const contentEl = document.querySelector(".content");

// changing active tab and show tab content
linksEl.addEventListener("click", function (e) {
	const linkEl = e.target.closest(".link");
	if (!linkEl) return;
	sidebarLinks.forEach((link) => link.classList.remove("active"));
	linkEl.classList.add("active");
	showTabContent(linkEl.id);
});

function showTabContent(id) {
	contentEl.innerHTML = ` <div class="spinner">
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
		case "order":
			showOrderContent();
			break;
		case "history":
			showHistoryContent();
			break;
		case "stock":
			showStockContent();
			break;
		case "chat":
			break;
	}
}

// localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjgsIm5hbWUiOiJDaGFybGllIFF1YXJsZXMiLCJyb2xlIjoiRU1QIiwidXJsIjoiaHR0cHM6Ly9jZG5iLmFydHN0YXRpb24uY29tL3AvYXNzZXRzL2ltYWdlcy9pbWFnZXMvMDUwLzA3Mi8zODMvbGFyZ2UvaGFydWtvLTA0LmpwZ1xuIiwiYmlkIjo1LCJpYXQiOjE2NTUzNTYzMjIsImV4cCI6MTY1NTQ0MjcyMn0.Ydodk7PcEWGMi4SFCNnEVfSWoSVfL1faOB8rgacsEq8')
// localStorage.setItem('bid', 1);
// localStorage.setItem('eid', 1);
// localStorage.setItem('username', 'Tan')
// localStorage.setItem('bname', 'quan 1')
// localStorage.setItem('addr', 'some addr')

// listening for cross domain message
window.addEventListener("message", function (event) {
	if (event.data) {
		const { token, name, avaUrl, bid, uid } = event.data;
		this.localStorage.setItem("token", token);
		this.localStorage.setItem("uid", uid);
		this.localStorage.setItem("username", name);
		this.localStorage.setItem("avaUrl", avaUrl);
		this.localStorage.setItem("bid", bid);
	}
});

this.document.querySelector(".user img").src = this.localStorage.getItem("avaUrl");
this.document.querySelector(".user-info h1").innerText = this.localStorage.getItem("username");

function logoutHandler() {
	localStorage.clear();
	window.location.href = "../login/index.html";
}

if (localStorage.getItem("avaUrl") || localStorage.getItem("username")) {
	document.querySelector(".user img").src = localStorage.getItem("avaUrl");
	document.querySelector(".user h1").innerHTML = localStorage.getItem("username");
}

async function getBranchAndManagerInfo() {
	const branchResponse = await fetch(
		`https://tiemthuocgiadinh.click/branch/${localStorage.getItem("bid") ?? "1"}`,
		{
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
		},
	);
	const branchData = await branchResponse.json();
	console.log("🚀 -> branchData", branchData);
	const { bname, addr } = branchData[0];
	localStorage.setItem("bname", bname);
	localStorage.setItem("addr", addr);
}

getBranchAndManagerInfo();

showOrderContent();
