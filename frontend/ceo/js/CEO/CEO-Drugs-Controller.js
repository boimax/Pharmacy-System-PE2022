function loadBaseContentDrugs() {
    contentEl.innerHTML = `
    <div class="drugs-container">
        <div class="drugs-container-header">
            <h1 class="sticky">Drugs</h1>
        </div>
        <div class="drugs-container-body">
            <h2>Last 12 Months</h2>
            <canvas id="polarDrugs"></canvas>
            <h2>Last Month</h3>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>DrugID</th>
                            <th>Name</th> 
                            <th>Price</th>
                            <th>QuantitySold</th>
                            <th>Total</th>
                            <th>BranchWithMostSale</th>
                        </tr> 
                    </thead>

                    <tbody id="drugsTableData">
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

async function loadPolarDrugs(token) {
    var data = await retrieveTopSalerDrugs(token=token, startYear=new Date().getFullYear(), startMonth=new Date().getMonth()+1, top=5)
    var ctx = document.getElementById('polarDrugs').getContext('2d');
    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: data.map(item => item.dname),
            datasets: [{
                label: 'Top 5 drugs',
                data: data.map(item => item.sale),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        }
    })
}

async function loadDrugsTableData(token) {
    var data = await retrieveCompanyDrugSale(token=token, startYear=new Date().getFullYear(), startMonth=new Date().getMonth()+1, step=1)
    let dataHTML = ''
    let count = 0
    for(key in data) {
        count += 1
        if (key == 24 || key == 15) {
            count -= 1
            continue
        }
        if (count < 20) {
            const drugInfo = await retrieveDrugInfo(token=token, drugID=key)
            print(data[key])
            dataHTML += `
            <tr>
                <td>${count}</td>
                <td>${key}</td>
                <td>${drugInfo[0].dname}</td>
                <td>${drugInfo[0].price.toLocaleString('en-US')}</td>
                <td>${data[key].qnt}</td>
                <td>${(drugInfo[0].price * data[key].qnt).toLocaleString('en-US')}</td>
                <td>${data[key].branchWithMostSale}</td>
            </tr>
            `
        }
    }
    document.getElementById('drugsTableData').innerHTML = dataHTML

}

function displayDrugsContent() {
    loadBaseContentDrugs()
    loadPolarDrugs(token)
    loadDrugsTableData(token)
}
