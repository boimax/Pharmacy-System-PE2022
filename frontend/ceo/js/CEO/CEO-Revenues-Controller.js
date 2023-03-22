var revenuesBarChart = null;

async function loadRevenuesBarChart(){
    const data = await retrieveCompanyRevenues(token=token, startYear=new Date().getFullYear(), startMonth=new Date().getMonth(), numMonth=6)
    var backgrounds = []

    for (var i = 0; i < data.length - 1; i++) {
        if (data[i].revenue <= data[i+1].revenue) {
            backgrounds.push('#00ff00')
        }
        else {
            backgrounds.push('#ff0000')
        }
    }

    if (revenuesBarChart) {
        revenuesBarChart.destroy()
    }

	revenuesBarChart = new Chart(document.getElementById("revenuesBarChart"), {
		type: "bar",
		data: {
			labels: data.slice(1, data.length).map(item => getFormattedDate(timestamp=item.timestamp, separator='.')),
			datasets: [
				{
					label: 'Monthly income',
					data: data.slice(1, data.length).map(item => item.revenue, ),
					fill: true,
					backgroundColor: backgrounds,
			  }
			]
			
		},
		options: {
		},
	});
}

async function retrieveRevenueLastNMonths(token, month) {
    const data = await retrieveCompanyRevenues(token=token, startYear=new Date().getFullYear(), startMonth=new Date().getMonth(), numMonth=month)
    var sum = 0
    for (const item of data) {
        sum += item.revenue
    }
    return sum
}

async function displayRevenuesContent(){
    contentEl.innerHTML = `
    <div class="revenues-container">
        <div class="revenues-container-header">
            <h1>Revenues</h1>
        </div>

        <div class="revenues-container-body">
            <div style="font-family:'Montserrat'" class="revenues-container-contents">
                <div class="revenues-container-content income">
                    <p>Last 12 months</p>
                    <h3>${(await retrieveRevenueLastNMonths(token, 12)).toLocaleString('en-US')} đ</h3>
                </div>
                <div class="revenues-container-content last-month">
                    <p>Last 6 months</p>
                    <h3>${(await retrieveRevenueLastNMonths(token, 6)).toLocaleString('en-US')} đ</h3>
                </div>
                <div class="revenues-container-content today">
                    <p>Last month</p>
                    <h3>${(await retrieveRevenueLastNMonths(token, 1)).toLocaleString('en-US')} đ</h3>
                </div>
            </div>
            <canvas id="revenuesBarChart" class="chart" height="500"></canvas>
        </div>
    </div>`

    loadRevenuesBarChart()
}