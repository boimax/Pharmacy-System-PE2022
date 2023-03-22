/*--------------------------------- Token ---------------------------------*/
// token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsIm5hbWUiOiJWZXJvbmljYSBTa2lubmVyIiwicm9sZSI6IkNFTyIsInVybCI6bnVsbCwiYmlkIjoxLCJpYXQiOjE2NTUyMTg3NDIsImV4cCI6MTY1NTMwNTE0Mn0.F0oO3lu8OlwpWurPIbR1PPLb6rWeoWbE_0BLRZhwtqc";
// token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsIm5hbWUiOiJOZWtvIE5ndSIsInJvbGUiOiJDRU8iLCJ1cmwiOiJodHRwczovL2Nkbi5kb25tYWkudXMvb3JpZ2luYWwvM2QvOWYvX19vcmlnaW5hbF9kcmF3bl9ieV9mYXJ0aWFydF9fM2Q5ZjY2ZjhhMmYzMDlmYmMxMGIxMjc1ZmEyOGFmNzIucG5nIiwiYmlkIjoxLCJpYXQiOjE2NTUzNDkzOTUsImV4cCI6MTY1NTQzNTc5NX0.cSU28TkdWKHkxyv8QueAEn83t9RZPemQ93gEr6j_kKU"

async function retrieveToken(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "username": "1",
        "password": "123"
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const response = await fetch(resource = "https://tiemthuocgiadinh.click/login", requestOptions)
    return await response.text()
}

/*--------------------------------- Debugging ---------------------------------*/
function das (a, b=4){
    console.log(a, b)
}

async function test(){
    // console.log(await retrieveBranchData(token, "1"))

    // console.log(await retrieveAllBranchesData(token))

    // console.log(await retrieveCompanySaleLastYear(token=token))

    // console.log(getFormattedDate())

    // console.log(await retrieveToken())

    // console.log(await retrieveCompanyDrugSalesLastNMonths(token=token, n=100))

    // console.log(await retrieveCompanyRevenues(token=token, startYear=2001, startMonth=1, numMonth=6))

    // console.log(await retrieveBranchData(token, "1"))

    // console.log(await retrieveInfoEmployee(token=token, ID=1))

    // console.log(await retrieveTopSalerDrugs(token=token, startYear=2001, startMonth=12))

    // print(await retrieveTopSalerDrugs(token, new Date().getFullYear(), new Date().getMonth(), 10))

    // print(await retriveSaleDrugFromBranch(token, new Date().getFullYear(), new Date().getMonth(), 1, "188"))

    // print(await retrieveTopSaleBranchOfDrug(token, new Date().getFullYear(), new Date().getMonth(), "188"))

    // print(await retrieveRevenuesLastYear(token, new Date().getFullYear(), new Date().getMonth()))

    // print(new Date().getFullYear())

    // console.log(await retrieveCompanyRevenues(token=token, startYear=new Date().getFullYear(), startMonth=new Date().getMonth(), numMonth=1))
}
test();