const linksEl = document.querySelector(".links");
const sidebarLinks = document.querySelectorAll(".sidebar .link");
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
		case "revenue":
			showRevenueContent();
			break;
		case "drugs":
			showDrugsContent();
			break;
		case "staff":
			showStaffContent();
			break;
		case "chat":
			showChatContent();
			break;
	}
}

//get branch and manager detail
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
//showing default page
showRevenueContent();

// listening for cross domain message
window.addEventListener("message", function (event) {
	if (event.data) {
		console.log(event.data);
		const { token, name, avaUrl, bid, uid } = event.data;
		this.localStorage.setItem("token", token);
		this.localStorage.setItem("uid", uid);
		this.localStorage.setItem("username", name);
		this.localStorage.setItem("avaUrl", avaUrl);
		this.localStorage.setItem("bid", bid);
	}
});

this.document.querySelector(".user img").src = this.localStorage.getItem("avaUrl");
this.document.querySelector(".user h3").innerText = this.localStorage.getItem("name");

function logoutHandler() {
	localStorage.clear();
	window.location.href = "../login/index.html";
}
