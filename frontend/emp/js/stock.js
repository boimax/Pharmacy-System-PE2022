

async function showStockContent() {
	const drugsData = await getDrugsData();
	const drugsHTML = `
        <div class="header">
            <h2>STOCK</h2>
			<div class="branch-details">
				<ion-icon name="storefront-outline"></ion-icon>
				<div class="info">
					<h3>District 5</h3>
					<p>Sai Gon</p>
				</div>
			</div>
        </div>
            <div class="drugs-main">
                ${drugsData
					.slice(0, 100)
					.map(
						(drug) => `
                    <div class="drug">
                        <h3 class="drug__title">${drug.dname}</h3>
                        <img src="${drug.url}" alt="drug image">
                        <div class="drug__price">${drug.price}₫</div>
                        <div class="drug__stock">Stock: ${drug.qnt}</div>
                    </div>`,
					)
					.join("")}

    `;

	contentEl.innerHTML = drugsHTML;
	drugsAnimation();
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
