/*--------------------------------- General ---------------------------------*/
function paddingNumber(number, padding=2){
    if (String(number).length <= padding){
        return '0'.repeat(padding - String(number).length) + String(number)
    }
}

function getFormattedDate(timestamp, separator='-') {
    var time = new Date(timestamp);
    return [
        time.getUTCFullYear(), 
        paddingNumber(time.getUTCMonth() + 1), 
        paddingNumber(time.getUTCDate())
    ].join(separator)
}

function clip(theThing, max, min=0){
    if (theThing > max) {
        return max
    }
    else if (theThing < min) {
        return min
    }
    else {
        return theThing
    }
}

function print(theThing) {
    console.log(theThing)
}

/*--------------------------------- Revenues Page ---------------------------------*/
async function retrieveBranchRevenuesLastYear(token, startYear, startMonth, branchID) {
    const response = await fetch(
        resource = `https://tiemthuocgiadinh.click/revenue?year=${startYear}&month=${startMonth}&BID=${branchID}`, 
        init = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`},
            redirect: 'follow'
        })

    return await response.json()
}

async function retrieveCompanyRevenues(token, startYear, startMonth, numMonth) {
    var data = []
    var branches = await retrieveAllBranchesData(token)
    for (const branch of branches) {
        temp = await retrieveBranchRevenuesLastYear(token, startYear, startMonth, branch.bid)
        data.push(temp.slice(0, clip(theThing=numMonth, max=12)).reverse())
    }

    var timestamps = []
    for (var i = 0; i < numMonth; i++) {
        timestamps.push(data[0][i].timestamp)
    }

    var revenues = Array(numMonth).fill(0)
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            revenues[timestamps.indexOf(data[i][j].timestamp)] += data[i][j].revenue
        }
    }

    var final = []
    for (var i = 0; i < numMonth; i++) {
        final.push({
            timestamp: timestamps[i],
            revenue: revenues[i]
        })
    }
    return final
}

async function retrieveBranchSalesData(token, startYear=2001, startMonth=12, branchID='') {
    const data = await retrieveRevenuesLastYear(token=token, startYear=startYear, startMonth=startMonth, branchID=branchID)
    return data.reverse()
}

/*--------------------------------- Drugs Page ---------------------------------*/
async function retrieveCompanyDrugSale(token, startYear, startMonth, step) {
    const response = await fetch(
        resource = `https://tiemthuocgiadinh.click/revenue/drugsale?year=${startYear}&month=${startMonth}&step=${step}`,
        init = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`},
            redirect: 'follow'
        })
    return await response.json()
}

async function retrieveDrugInfo(token, drugID){
    const response = await fetch(
        resource = `https://tiemthuocgiadinh.click/drugs/${drugID}`,
        init = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`},
            redirect: 'follow'
        })
    return await response.json()
}

async function retrieveDrugSale(token, startYear, startMonth, branchID='') {
    if (branchID === '') {
        var url = `https://tiemthuocgiadinh.click/drugs/${startYear}/${startMonth}`
    }
    else {
        var url = `https://tiemthuocgiadinh.click/drugs/${startYear}/${startMonth}/?branchID=${branchID}`
    }
    const response = await fetch(
        resource = url,
        init = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`},
            redirect: 'follow'
        })

    return await response.json()
}

async function retriveSaleDrugFromBranch(token, startYear, startMonth, branchID, drugID) {
    var data = await retrieveDrugSale(token=token, startYear=startYear, startMonth=startMonth, branchID=branchID)
    
    for (var i = 0; i < data.length; i++) {
        if (data[i][0] === drugID) {
            return data[i][1]
        }
    }
}

async function retrieveTopSaleBranchOfDrug(token, startYear, startMonth, drugID) {
    const branches = await retrieveAllBranchesData(token)
    var temp = []
    for (const branch of branches) {
        temp.push(await retriveSaleDrugFromBranch(token, startYear, startMonth, branch.bid, drugID))
    }
    return branches[temp.indexOf(Math.max(...temp))]
}

async function retrieveTopSalerDrugs(token, startYear, startMonth, top, branchID='') {
    const data = await retrieveDrugSale(token=token, startYear=startYear, startMonth=startMonth, branchID=branchID)
    
    const toplist = data.slice(data.length-top, data.length).reverse()

    var info = []
    for (var i = 0; i < toplist.length; i++) {
        var drungInfo = await retrieveDrugInfo(token, toplist[i][0])
        var item = {
            did: toplist[i][0],
            sale: toplist[i][1],
            dname: drungInfo[0].dname,
            url: drungInfo[0].url,
            price: drungInfo[0].price
        }
        info.push(item)
    }

    return info
}

/*--------------------------------- Branches Page ---------------------------------*/
async function retrieveAllBranchesData(token) {
    const response = await fetch(
        resource = "https://tiemthuocgiadinh.click/branch", 
        init = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`},
            redirect: 'follow'
        })

    return await response.json()
}

async function retrieveBranchData(token, ID) {
    const response = await fetch(
        resource = `https://tiemthuocgiadinh.click/branch/${ID}`,
        init = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`},
            redirect: 'follow'
        })
        return await response.json()
}

async function retrieveInfoEmployee(token, ID){
    const response = await fetch(
        resource = `https://tiemthuocgiadinh.click/employee?id=${ID}`,
        init = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`},
            redirect: 'follow'
        })
    return await response.json();
}

async function updateEmployeeInfo(token, employeeInfo){
    console.log('update function');
    const response = await fetch(
        resource = `https://tiemthuocgiadinh.click/employee/`,
        init = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`},
            redirect: 'follow',
            body: JSON.stringify(employeeInfo)
        })
}
