let monthlyCosts = {
    
}
function buildMonthlyCosts(){

}

function buildMonthlyCostsBase(pmt){
    $(".monthly-costs").removeClass("hidden")
    $("#js-mort-fees").val(pmt)

}

function buildPaymentRow(pmtObj){
    //create a row
    $(".js-amort-table").append(`
    <tr>
        <td>${`${pmtObj.DATE.getMonth()+1}/${pmtObj.DATE.getFullYear()}`}</td>
        <td>${pmtObj.PMT}</td>
        <td>${pmtObj.PRI}</td>
        <td>${pmtObj.INT}</td>
        <td>${pmtObj.NEW}</td>
    </tr>
    `)
}

function calculatePaymentRow(loanObj,lastDate){
    //Calculate Placeholder variables
    let pmtDate = new Date(lastDate)
    pmtDate = new Date(pmtDate.setMonth(pmtDate.getMonth()+1))
    const prev= loanObj["P"]
    const pmt = loanObj["PMT"]
    const msDiff= pmtDate-lastDate
    const day_diff = msDiff/1000/60/60/24
    const interestAcrued = Math.round(loanObj["I"]*12/365*day_diff*prev*100)/100
    const principalPaid = Math.round((pmt-interestAcrued)*100)/100
    const pmtObj = {
        "DATE":pmtDate,
        "PREV":Math.round(prev*100)/100,
        "PMT":pmt,
        "PRI":principalPaid,
        "INT":interestAcrued,
        "NEW":Math.round((loanObj["P"]-principalPaid)*100)/100
    }
    buildPaymentRow(pmtObj)
    loanObj["P"] -= Math.round(principalPaid*100)/100
    return loanObj
}

function buildAmortTable(loanObj){
    $(".js-amort-table").empty()
    //First row should reflect the initial loan payment disbursed today
    let currentTime = new Date()
    console.log(currentTime.getMonth())
    console.log(currentTime.getFullYear())
    
    $(".js-amort-table").append(`
    <tr>
        <td>${`${currentTime.getMonth()+1}/${currentTime.getFullYear()}`}</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>${loanObj["P"]}</td>
    </tr>
    `)
    while (loanObj["P"]>0){
        loanObj = calculatePaymentRow(loanObj,currentTime)
        currentTime = new Date(currentTime.setMonth(currentTime.getMonth()+1))
    }
}

function updatePmt(monthlypmt){
    $(".js-monthly-pmt").removeClass("hidden")
    $(".my-number").empty()
    $(".my-number").text(`$ ${monthlypmt}`)
}

//Will have to think about breaking up this function amort table and monthly build should not be here
//need to create a runner function
function calculateMortgagePayment(){
    const loan = parseFloat($("#js-house-price").val()) - parseFloat($("#js-down-payment").val())
    const numberOfMonths = parseInt($("#js-amort-years").val())* 12
    const interestRate = parseFloat($("#js-interest").val())/12/100
    //console.log(loan,numberOfMonths,interestRate)
    const numerator = interestRate * Math.pow((1+interestRate),numberOfMonths) 
    const denominator = Math.pow((1+interestRate),numberOfMonths)-1
    const monthlypmt = Math.round(loan * numerator / denominator*100)/100
    updatePmt(monthlypmt)
    buildMonthlyCostsBase(monthlypmt)
    const loanObj = {
        "P":loan,
        "PMT":monthlypmt,
        "I":interestRate,
        "N":monthlypmt,
    }
    buildAmortTable(loanObj)
}

function watchSubmit(){
    $(".js-mortgage-details").submit(event=>{
        event.preventDefault()
        calculateMortgagePayment()
    })
}

function watchToggleAmort(){
    $(".js-tgl-table").click(event=>{
        event.preventDefault()
        $(".amortization-table").toggleClass("hidden")
    })
}

function watchMonthlyForm(){
    $(".js-monthly-breakdown-form").submit(event=>{
        event.preventDefault()
    })
}

function readyfx(){
    watchSubmit()
    watchToggleAmort()
    watchMonthlyForm()
}

$(readyfx)