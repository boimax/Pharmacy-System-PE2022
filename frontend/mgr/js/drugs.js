const getDrugsData = async () => {
	const bid = localStorage.getItem("bid") || 1;
	const response = await fetch(`https://tiemthuocgiadinh.click/drugs?branchID=${bid}`, {
		headers: {
			Authorization: "Bearer " + localStorage.getItem("token"),
		},
	});
	const drugsData = await response.json();
	return drugsData;
};

async function showDrugsContent() {
	const drugsData = await getDrugsData();
	console.log("🚀 -> drugsData", drugsData);
	const drugsHTML = `

        <div class="header">
                    <h2>Drugs</h2>
                    <div class="branch-details">
                        <ion-icon name="storefront-outline"></ion-icon>
                        <div class="info">
                            <h3>${localStorage.getItem("bname")}</h3>
                            <p>${localStorage.getItem("addr")}</p>
                        </div>
                    </div>
                </div>
                <div class="drugs-main">
                ${drugsData
					.slice(0, 10)
					.map(
						(drug) => `
                    <div class="drug">
                        <h3 class="drug__title">${drug.dname}</h3>
                        <img src="${drug.url}" alt="drug image">
                        <div class="drug__price">${drug.price}₫</div>
                        <div class="drug__stock">Stock: ${drug.qnt}</div>
                        <button onclick='openModalHandler(${drug.did})'>Refill stock</button>
                    </div>`,
					)
					.join("")}

    `;
	const overlayEl = document.createElement("div");
	overlayEl.classList.add("overlay");
	overlayEl.innerHTML = `
            <div class="modal">
                    <form onsubmit='refillStockHandler(event)' data-drugId="1">
                        <label> Amount: </label>
                        <input type="number"  class='stock-amount'/>
                    </form>
                    <button onclick='closeModalHandler()'>
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
            </div>`;
	document.querySelector("body").appendChild(overlayEl);
	contentEl.innerHTML = drugsHTML;
	drugsAnimation();
}

function closeModalHandler() {
	document.querySelector(".overlay").classList.remove("show");
}

function openModalHandler(id) {
	const overlayEl = document.querySelector(".overlay");
	overlayEl.classList.add("show");
	document.querySelector("form").setAttribute("data-drugID", id);
}

async function refillStockHandler(event) {
	event.preventDefault();
	const amount = document.querySelector(".stock-amount").value;
	const drugId = document.querySelector("form").getAttribute("data-drugID");
	await sendRefillStockRequest(drugId, amount);
	closeModalHandler();
	alert("Please reload the page to see updated stock");
}

async function sendRefillStockRequest(drugId, quantity) {
	console.log("🚀 -> quantity", quantity);
	console.log("🚀 -> drugId", drugId);
	console.log("🚀 -> token", localStorage.getItem("token"));
	console.log("🚀 -> bid", localStorage.getItem("bid"));
	const response = await fetch("https://tiemthuocgiadinh.click/drugs", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + localStorage.getItem("token"),
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			branchID: localStorage.getItem("bid"),
			drugID: drugId,
			quantity: quantity,
		}),
	});
	console.log("🚀 -> response", response);
}

function drugsAnimation() {
	const tl_drug = gsap.timeline();
	tl_drug.fromTo(".link", { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.1 });
	tl_drug.fromTo("h2", { opacity: 0, y: -10 }, { opacity: 1, y: 0 }, "<30%");
	tl_drug.fromTo(".branch-details", { opacity: 0, x: 20 }, { opacity: 1, x: 0 }, "<");
	tl_drug.fromTo(
		".drug",
		{ opacity: 0, x: 10, y: 10 },
		{ opacity: 1, x: 0, y: 0, stagger: 0.1, ease: Elastic.easeOut.config(0.5, 0.3) },
		"<30%",
	);
}
