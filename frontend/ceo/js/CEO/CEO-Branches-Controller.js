function loadBaseContentBranches(){
    contentEl.innerHTML = `
    <div class="branches-container">
        <div class="branches-container-header">
            <h1>Branches</h1>
        </div>

        <div class="branches-container-body">
            <table class="branchesTableData">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>BranchID</th>
                        <th>Name</th> 
                        <th>Adress</th>
                        <th>Manager</th>
                        <th>Sales</th>
                    </tr> 
                </thead>

                <tbody id="branchesTableData">
                    
                </tbody>
            </table>
        </div>
    </div>`;
}

var branchBarChart = null;
async function loadBranchSalesDataBarChartLastYear(branchID) {
    if(branchBarChart){
        branchBarChart.destroy();
    }
    let branchBarChartID = `${branchID}-sales`

    const data = await retrieveBranchRevenuesLastYear(token=token, startYear=new Date().getFullYear(), new Date().getMonth() + 1, branchID)
    var backgrounds = ['#00ff00']

    for (var i = 0; i < 6; i++) {
        if (data[i].revenue <= data[i+1].revenue) {
            backgrounds.push('#ff0000')
        }
        else {
            backgrounds.push('#00ff00')
        }
    }

    branchBarChart = new Chart(document.getElementById(branchBarChartID), {
		type: "bar",
		data: {
			labels: data.slice(1, 6).map(item => getFormattedDate(timestamp=item.timestamp, separator='.')),
			datasets: [
				{
					label: 'Monthly income',
					data: data.slice(1, 6).map(item => item.revenue, ),
					fill: true,
					backgroundColor: backgrounds,
			  }
			]
			
		},
		options: {
		},
	});
}

async function setDefaultToggle() {
    var elements = document.getElementsByClassName("dropdownSaleDown");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = ``;
    }
    var elements = document.getElementsByClassName("dropdownSaleUp");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = `none`;
    }
}

function toggleOffCanvas (numBranch) {
    for (var i = 0; i < numBranch; i++) {
        try {
            document.getElementById(`${i+1}-sales`).style.display = 'none'
            document.getElementById(`${i+1}-sales`).parentNode.style.display = 'none'
        }
        catch (e) {
            print(e)
        }
    }
}

function toggleOffBranchManagerProfile(numBranch) {
    for (var i = 0; i < numBranch; i++) {
        try {
            document.getElementById(`${i+1}-manager`).style.display = 'none'
            document.getElementById(`${i+1}-manager`).parentNode.style.display = 'none'
        }
        catch (e) {
            print(e)
        }
    }
}

function clickDropDownSaleUpButton(numBranch) {
    document.onclick= function(event) {
        if (event.target.getAttribute("aria-label") == 'chevron up outline') {
            setDefaultToggle()
            toggleOffCanvas(numBranch)
            event.target.parentNode.querySelector('ion-icon:nth-child(1)').style.display = 'inline-block'
            event.target.style.display = 'none'
        }
    }
}

function clickDropDownSaleDownButton(branchID, numBranch) {
    document.onclick= function(event) {
        if (event.target.getAttribute("aria-label") == 'chevron down outline') {
            canvasID = `${branchID}-sales`
            toggleOffCanvas(numBranch)
            toggleOffBranchManagerProfile(numBranch)
            setDefaultToggle()
            event.target.parentNode.querySelector('ion-icon:nth-child(2)').style.display = 'inline-block'
            event.target.style.display = 'none'
            loadBranchSalesDataBarChartLastYear(branchID)
            document.getElementById(canvasID).style.display = 'block'
            document.getElementById(canvasID).parentNode.style.display = 'table-cell'
        }
    }
}

let checkManager = ''
function clickEditBranchManagerProfile(elementID, numBranch) {
    document.onclick= function(event) {
        if (event.target.getAttribute("aria-label") == 'create outline') {
            toggleOffCanvas(numBranch)
            toggleOffBranchManagerProfile(numBranch)
            setDefaultToggle()
            if (!checkManager || checkManager != elementID) {
                document.getElementById(elementID).parentNode.style.display = 'table-cell'
                document.getElementById(elementID).style.display = 'block'
                document.getElementById(elementID).classList.add('overlay')
                checkManager = elementID
            }
            else {
                checkManager = ''
            }
        }
    }
}

async function saveChangeInfoManager(elementID, managerID) {
    document.onclick= function(event) {
        if (event===undefined) event = window.event;
        var target= 'target' in event ? event.target : event.srcElement;

        const data = document.getElementById(elementID).querySelectorAll('input')
        var newManagerInfo = {
            "eid": parseInt(managerID),
            "name": data[0].value == '' ? alert('Please fill in all fields') : data[0].value,
            "mail": data[1].value == '' ? alert('Please fill in all fields') : data[1].value,
            "erole": data[2].value == '' ? alert('Please fill in all fields') : data[2].value,
            "bid": parseInt(data[3].value == '' ? alert('Please fill in all fields') : data[3].value),
        }
        
        updateEmployeeInfo(token=token, employeeInfo=newManagerInfo)
        document.querySelectorAll(".dashboard .link").forEach((link) => link.classList.remove("active"))
        document.getElementById("branches").classList.add("active")

        document.getElementById(elementID).style.display = 'none'
        document.getElementById(elementID).parentNode.style.display = 'none'
        displayBranchesContent()
    }
}

async function loadBranchesData(token){
    const branchesData = (await retrieveAllBranchesData(token)).sort(function(a, b){
        return a.bid - b.bid;
    })

    let dataHTML = ''
    for (var i = 0; i < branchesData.length; i++){
        let manager = await retrieveInfoEmployee(token=token, ID=branchesData[i].mgrid)
        dataHTML += `
        <tr>
            <td>${i+1}</td>
            <td>${branchesData[i].bid}</td>
            <td>${branchesData[i].bname}</td>
            <td>${branchesData[i].addr}</td>
            <td>
                ${manager.ename}&nbsp;&nbsp;&nbsp;
                <ion-icon 
                    name="create-outline" 
                    onClick="clickEditBranchManagerProfile(\`${branchesData[i].bid}-manager\`, \`${branchesData.length}\`)">
                </ion-icon>
            </td>
            <td>
                <div>
                    <ion-icon 
                        class="dropdownSaleDown"
                        name="chevron-down-outline" 
                        onClick="clickDropDownSaleDownButton(\`${branchesData[i].bid}\`, \`${branchesData.length}\`)">
                    </ion-icon>
                    <ion-icon 
                        class="dropdownSaleUp"
                        name="chevron-up-outline" 
                        onClick="clickDropDownSaleUpButton(\`${branchesData.length}\`)"
                        style="display:none">
                    </ion-icon>
                </div>
            </td>
        </tr>
        <tr>
            <td colspan="6">
                <canvas id="${branchesData[i].bid}-sales" class="branchBarChart" style="display: none;"></canvas>
            </td>
        </tr>
        <tr>
            <td colspan="6" id="${branchesData[i].bid}-manager" style="display:none;">
                <div>
                    ID: ${manager.eid}
                </div>
                <div>
                    Name: 
                    <input 
                        id='${manager.eid}-edit-Name' 
                        type="text" 
                        value="${manager.ename}">
                </div>
                <div>
                    Mail: 
                    <input 
                        id='${manager.eid}-edit-Mail' 
                        type="text" 
                        value="${manager.mail}">
                </div>
                <div>
                    Role: 
                    <input 
                        id='${manager.eid}-edit-Role' 
                        type="text" 
                        value="${manager.erole}">
                </div>
                <div>
                    BranchID: 
                    <input 
                        id='${manager.eid}-edit-BranchID' 
                        type="text" 
                        value="${manager.bid}">
                </div>
                <button onClick="saveChangeInfoManager(\`${branchesData[i].bid}-manager\`, \`${manager.eid}\`)">Save</button>
            </td>
        </tr>`
    }
    document.getElementById('branchesTableData').innerHTML = dataHTML
}

function displayBranchesContent(){
    loadBaseContentBranches()
    loadBranchesData(token)
}