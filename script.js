function updateNumber(monthlypmt){
    $(".js-monthly-pmt").removeClass("hidden")
    $(".my-number").empty()
    $(".my-number").text(`$ ${monthlypmt}`)
}
function calculateData(){
    const loan = parseFloat($("#js-house-price").val()) - parseFloat($("#js-down-payment").val())
    const numberOfMonths = parseInt($("#js-amort-years").val())* 12
    const interestRate = parseFloat($("#js-interest").val())/12/100
    //console.log(loan,numberOfMonths,interestRate)
    const numerator = interestRate * Math.pow((1+interestRate),numberOfMonths) 
    const denominator = Math.pow((1+interestRate),numberOfMonths)-1
    const monthlypmt = Math.round(loan * numerator / denominator*100)/100
    updateNumber(monthlypmt)
}
function watchSubmit(){
    $(".js-mortgage-details").submit(event=>{
        event.preventDefault()
        calculateData()
    })
}
function readyfx(){
    watchSubmit()
}

$(readyfx)