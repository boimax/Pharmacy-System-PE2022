const getDrugsData = async () => {
	const bid = localStorage.getItem("bid");
	const response = await fetch(`https://tiemthuocgiadinh.click/drugs?branchID=${bid}`, {
		headers: {
			Authorization: "Bearer " + localStorage.getItem("token"),
		},
	});
	const drugsData = await response.json();
	return drugsData;
};

var totalPrice = 0;

async function showOrderContent() {
	const data = await getDrugsData();
	const drugNames = data.slice(0, 100).map(drug => drug.dname);

	const orderHTML = `
	<div class="header">
		<h2>ORDER</h2>
		<div class="branch-details">
			<ion-icon name="storefront-outline"></ion-icon>
			<div class="info">
			<h3>District 5</h3>
			<p>Sai Gon</p>
			</div>
		</div>
	</div>

	<form class="order" autocomplete="off">
		<div class="fields">
			<label for="name">Medicine Name</label><br>                       
			<input type="text" id="drugName" onkeyup="selectDrugHandler()" placeholder="Search">

			<ul id="myUL">
				${drugNames.map(drug => `<li>${drug}</li>`).join('')}
			</ul>
			<input type="hidden" id="drugID" name="drugID" value="">
			<input type="hidden" id="drugImg" name="drugImg" value="">
			<input type="hidden" id="drugPrice" name="drugPrice" value="">
			<label for="quantity">Quantity</label><br>
			<input type="number" id="quantity" name="quantity" min="0" max="10000" step="50" value="" required><br>
		</div>
		<div class="buttons">
			<button id="addmedicine-button" onclick="handleSubmit(event)">Add Medicine</button>
		</div>
	</form>
	<div class="drug-table">
		<table style="width:100%;" id="medicine-table">
		<tr>
			<th style="width: 10%;">Image</th>
			<th style="width: 45%;">Medicine Name</th>
			<th style="width: 20%;">Quantity</th>
			<th style="width: 20%;">Price</th>
			<th style="width: 15%;">Remove</th>
		</tr>
		</table>
	</div>
	<div class="confirm-section">
		<div class="price-section">
			<h3>Total Price</h3>
			<p id="total-price">${totalPrice}₫</p>
		</div>
		<button id="confirm-order" onclick="confirmOrder()">Confirm Order</button>  
	</div>
    `;

	contentEl.innerHTML = orderHTML;
	orderAnimation();
	var ulEl = document.getElementById("myUL");

	for (var i = 0; i < ulEl.children.length; i++) {
		ulEl.children[i].addEventListener("click", function () {
			const drugName = this.innerHTML;
			document.querySelector("#drugName").value = drugName;
		})
	}
}

function orderAnimation() {
	const tl_order = gsap.timeline();
	tl_order.fromTo(".link", { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.1 });
	tl_order.fromTo("h2", { opacity: 0, y: -10 }, { opacity: 1, y: 0 }, "<30%");
	tl_order.fromTo(".branch-details", { opacity: 0, x: 20 }, { opacity: 1, x: 0 }, "<");
	tl_order.fromTo(
		".order, .table, .confirm-section",
		{ opacity: 0, x: 10, y: 10 },
		{ opacity: 1, x: 0, y: 0, stagger: 0.1, ease: Elastic.easeOut.config(0.5, 0.3) },
		"<30%",
	);
}

function checkDrugDuplicate(drugName) {
	const drugTable = document.getElementById("medicine-table");
	for (var i = 1; i < drugTable.rows.length; i++) {
		if (drugTable.rows[i].cells[1].innerHTML === drugName) {
			alert("This medicine is already in your order, please remove the medicine before adding it again");
			return true;
		}
	}
	return false;
}

function checkDrugExist(drugName) {
	const ulEl = document.getElementById("myUL");
	const liEl = ulEl.getElementsByTagName("li");
	let hasDrugs = false;
	for (var i = 0; i < liEl.length; i++) {
		if (drugName === liEl[i].innerHTML)
			hasDrugs = true;
	}
	return hasDrugs;
}

function checkQnt(drugQnt) {
	const qnt = document.getElementById("quantity").value;
	if (qnt > drugQnt) {
		alert("Not enough quantity");
		document.getElementById("quantity").value = "";
		return false;
	}
	return true;
}

function selectDrugHandler() {
	const inputEl = document.getElementById("drugName");
	const filter = inputEl.value.toUpperCase();
	const ulEl = document.getElementById("myUL");
	const liEl = ulEl.getElementsByTagName("li");
	for (i = 0; i < liEl.length; i++) {
		if (liEl[i].innerHTML.toUpperCase().includes(filter)) {
			liEl[i].style.display = "block";
		}
		else {
			liEl[i].style.display = "none";
		}
	}
}

var drugList = [];

async function handleSubmit(event) {
	event.preventDefault();
	var table = document.getElementById("medicine-table");
	var drugName = document.getElementById("drugName").value;
	var quantity = document.getElementById("quantity").value;
	if (!drugName || !quantity) {
		window.alert("Please fill in all the fields.");
		return;
	}

	const dataFromServer = await getDrugsData();
	const drugInfo = dataFromServer.slice(0, 100).map(drug => ({ price: drug.price, dname: drug.dname, img: drug.url, did: drug.did, qnt: drug.qnt }));
	const drugPrice = drugInfo.find(drug => drug.dname === drugName).price;
	const drugImage = drugInfo.find(drug => drug.dname === drugName).img;
	const drugID = drugInfo.find(drug => drug.dname === drugName).did;

	if (!checkDrugExist(drugName)) {
		window.alert("Please input a valid medicine name.");
		return;
	}

	if (checkDrugDuplicate(drugName)) {
		return;
	}

	var row = table.insertRow(1);

	var imgCell = row.insertCell(0);
	var nameCell = row.insertCell(1);
	var quantityCell = row.insertCell(2);
	var priceCell = row.insertCell(3);
	var removeCell = row.insertCell(4);

	imgCell.innerHTML = `<img src=\"${drugImage}\" width=\"25px\" height=\"25px\">`;
	nameCell.innerHTML = drugName;
	quantityCell.innerHTML = quantity;
	priceCell.innerHTML = drugPrice * quantity + "₫";
	removeCell.innerHTML = `<button onclick="removeRow(this)"><img src="./images/remove-button.png"></button>`;

	table.style.width = "100%";
	imgCell.style.width = "10%";
	imgCell.style.textAlign = "center"
	nameCell.style.width = "45%";
	nameCell.style.textAlign = "center"
	quantityCell.style.width = "20%";
	quantityCell.style.textAlign = "center"
	priceCell.style.width = "20%";
	priceCell.style.textAlign = "center"
	removeCell.style.width = "15%";
	removeCell.style.textAlign = "center"

	var drugData = {
		price: drugPrice,
		did: drugID,
		qnt: quantity,
	}

	drugList.push(drugData);

	totalPrice += drugPrice * quantity;
	document.getElementById("total-price").innerHTML = totalPrice + "₫";

	document.getElementById("drugName").value = '';
	document.getElementById("quantity").value = '';

}


function sendMakeBillRequest(eid, bid, date, totalPrice, drugList) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Bearer ${localStorage.getItem('token')}`);
	myHeaders.append("Content-Type", "application/json");


	var raw = JSON.stringify({
		"eid": eid,
		"drugList": drugList,
		"dmy": date,
		"total": totalPrice,
		"bid": bid
	});

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};
	console.log(requestOptions.body);

	fetch("https://tiemthuocgiadinh.click/bill", requestOptions)
		.then(response => console.log(response))
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
}

function removeRow(row) {
	var i = row.parentNode.parentNode.rowIndex;
	document.getElementById("medicine-table").deleteRow(i);
	var len = drugList.length;
	totalPrice -= drugList[len - i].price * drugList[len - i].qnt;
	drugList.splice(len - i, 1);
	document.getElementById("total-price").innerHTML = totalPrice + "₫";
}

function confirmOrder() {
	window.confirm("Confirm this order.\nTotal price: " + totalPrice + "₫");
	sendMakeBillRequest(
		localStorage.getItem('uid'),
		localStorage.getItem('bid'),
		`${new Date().getDay().toString().padStart(2, '0')}/${new Date().getMonth().toString().padStart(2, '0')}/${new Date().getFullYear()}`,
		totalPrice,
		drugList);
	window.location.reload();
}