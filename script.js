//monthly inputs:
let rent, mortgagePmt, tax, insurance, hoa, prop, lease, repair, vac, add, cashflow
//One time
let closingCost, expectedRepair, downPayment, housePrice

function buildSummary(){
    /** Given the mortgage payment builds the monthly summary table */
    //gather data
    rent = parseFloat($("#js-rent-expected").val())
    vac = parseFloat($("#js-vac-fees").val())
    prop = parseFloat($("#js-prop-fees").val())
    lease =parseFloat($("#js-lease-fees").val())
    hoa = parseFloat($("#js-hoa-fees").val())
    insurance = parseFloat($("#js-ins-fees").val())
    add = parseFloat($("#js-add-fees").val())
    repair = parseFloat($("#js-repair-fees").val())
    tax = Math.round(parseFloat($("#js-taxes-fees").val())*100)/100
    //calculate
    cashflow = Math.round((rent- mortgagePmt-vac-prop-lease-hoa-insurance-add-tax)*100)/100
    //input data
    $(".js-sumTable-rent").html(rent)
    $(".js-sumTable-mort").html(mortgagePmt)
    $(".js-sumTable-taxes").html(tax)
    $(".js-sumTable-ins").html(insurance)
    $(".js-sumTable-hoa").html(hoa)
    $(".js-sumTable-prop").html(prop)
    $(".js-sumTable-lease").html(lease)
    $(".js-sumTable-repair").html(repair)
    $(".js-sumTable-vac").html(vac)
    $(".js-sumTable-add").html(add)
    $(".js-sumTable-flow").html(cashflow)

    //reveal
    $(".summary").removeClass("hidden")
}

function buildMonthlyCostsBase(){
    const housePrice = $("#js-house-price").val()
    const monthlyTaxes = Math.round(housePrice*0.025/12*100)/100
    console.log("here",housePrice,monthlyTaxes)
    $(".monthly-costs").removeClass("hidden")
    $("#js-mort-fees").val(mortgagePmt)
    $("#js-taxes-fees").val(monthlyTaxes)
}
function updateMonthlyCosts(){
    /* Updates Monthly breakdown form based on the expected rent. 
    Calculates: 
        1.Property management
        2.Vacancry reserve
        3.Repair and maintenance reserve
     */
    vac = Math.round(rent*0.05*100)/100
    prop = Math.round(rent*0.10*100)/100
    lease = Math.round(rent*0.05*100)/100
    repair = Math.round(rent*0.08*100)/100
    mortgage = parseFloat($("#js-mort-fees").val())
    $("#js-vac-fees").val(vac)
    $("#js-prop-fees").val(prop)
    $("#js-lease-fees").val(lease)
    $("#js-repair-fees").val(repair)
    buildSummary()
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

function updatePmt(){
    $(".js-monthly-pmt").removeClass("hidden")
    $(".my-number").empty()
    $(".my-number").text(`$ ${mortgagePmt}`)
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
    mortgagePmt = Math.round(loan * numerator / denominator*100)/100
    updatePmt()
    buildMonthlyCostsBase()
    const loanObj = {
        "P":loan,
        "PMT":mortgagePmt,
        "I":interestRate,
    }
    buildAmortTable(loanObj)
    buildSummary()
    
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
        buildSummary()
    })
    $(".js-rent-push").click(event=>{
        event.preventDefault()
        rent = $("#js-rent-expected").val()
        updateMonthlyCosts()

    })
}

function readyfx(){
    watchSubmit()
    watchToggleAmort()
    watchMonthlyForm()
}

$(readyfx)