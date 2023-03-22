const getRevenueData = async () => {
	const bid = localStorage.getItem("bid") || 1;
	const response = await fetch(
		`https://tiemthuocgiadinh.click/revenue?BID=${bid}&year=2019&month=11`,
		{
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
		},
	);
	let revenueData = await response.json();
	revenueData = revenueData.map((r) => r.revenue).reverse();
	const thisMonth = new Date().getMonth();
	const formatter = new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});
	const revenueThisMonth = formatter.format(revenueData[thisMonth]);
	const revenueLastMonth = formatter.format(revenueData[thisMonth - 1]);
	const revenueThisYear = formatter.format(
		revenueData.reduce((total, monthRevenue) => monthRevenue + total),
	);
	const graphData = {};
	//prettier-ignore
	const monthNames = ["January", "February", "March", "April", "May", "June","July", "August","September", "October", "November", "December"];
	for (let i = 0; i <= thisMonth; i++) {
		graphData[monthNames[[i]]] = revenueData[i];
	}

	return [revenueThisMonth, revenueThisYear, revenueLastMonth, graphData];
};

async function showRevenueContent() {
	const [revenueThisMonth, revenueThisYear, revenueLastMonth, graphData] = await getRevenueData();
	const revenueHTML = `
    <div class="header">
        <h2>INCOME</h2>
        <div class="branch-details">
            <ion-icon name="storefront-outline"></ion-icon>
            <div class="info">
                <h3>${localStorage.getItem("bname")}</h3>
                <p>${localStorage.getItem("addr")}</p>
            </div>
        </div>
    </div>
    <div class="content__revenues">
        <div class="card content__revenue income">
            <p>This month's income</p>
            <h3>${revenueThisMonth}</h3>
        </div>
        <div class="card content__revenue last-month">
            <p>Last month</p>
            <h3>${revenueLastMonth}</h3>
        </div>
        <div class="card content__revenue today">
            <p>Last ${new Date().getMonth() + 1} months</p>
            <h3>${revenueThisYear}</h3>
        </div>
    </div>
    <canvas id="revenueChart" class="chart" height="340"></canvas>`;
	contentEl.innerHTML = revenueHTML;
	showChart(graphData);
	revenueAnimation();
}

// line chart for revenue
function showChart(graphData) {
	const labels = Object.keys(graphData);
	const data = {
		labels: labels,
		datasets: [
			{
				label: "Monthly income",
				backgroundColor: "rgb(255, 99, 132)",
				borderColor: "rgb(255, 99, 132)",
				data: Object.values(graphData),
			},
		],
	};
	const config = {
		type: "line",
		data: data,
		options: {},
	};
	const myChart = new Chart(document.getElementById("revenueChart"), config);
}

function revenueAnimation() {
	const tl_revenue = gsap.timeline();
	tl_revenue.fromTo(".link", { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.1 });
	tl_revenue.fromTo("h2", { opacity: 0, y: -10 }, { opacity: 1, y: 0 }, "<30%");
	tl_revenue.fromTo(
		".content__revenue",
		{
			opacity: 0,
			y: -10,
		},
		{
			opacity: 1,
			stagger: 0.25,
			y: 0,
		},
		"<30%",
	);
	tl_revenue.fromTo(".branch-details", { opacity: 0, x: 20 }, { opacity: 1, x: 0 }, "<30%");
	tl_revenue.fromTo(".chart", { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "<50%");
}
