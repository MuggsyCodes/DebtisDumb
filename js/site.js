// master function to perform calculation and return result
//NOTE: this is an amortized loan

function interestCalculator(r, balance, n, monthly_payment){
    
    //put all results in arrays to return out of the function
    let interest_array = [];
    let principal_array = [];
    //let remainder_array = [];
    let month_array = [];
    let balance_array = [];
    let total_interest_array = [];

    var interest_payment;
    var remainder;
    var x;
    let costObj = {};

    //iterate over the number of payment periods 
    for (let i = 0; i < n; i++) {

        //what month are you paying?
        month_array.push(i+1);

        //how much interest are you paying this month?
        if (balance_array.length == 0) {
            interest_payment = r*balance.toFixed(2);
            interest_array.push(interest_payment);
        }
        else {
            interest_payment = r*balance_array[i-1].toFixed(2);
            interest_array.push(interest_payment);
        }
        
        
        //how much of payment goes towards principal?
        let prince_payment = monthly_payment - interest_payment;
        principal_array.push(prince_payment);
        
        //how much principal do you still owe? 
        if (balance_array.length == 0) {
            remainder = balance - prince_payment;
            balance_array.push(remainder); // 0th item in balance remainder
        }
        else {
            remainder = balance_array[i-1] - prince_payment;
            balance_array.push(remainder); // 0th item in balance remainder
        }
        
        //update balance array that was passed into function
        //balance_array.push(remainder.toFixed(2));
        //check this out!
        x = balance_array.length;

        }

    //sum all the values in the interest array
    let int_length = interest_array.length;
    let total_interest = 0;

    for (let i = 0; i < int_length; i++) {
        //add the interest value for the ith, month, to the total interest
        total_interest += interest_array[i];
        //accumulated total interest
        total_interest_array.push(total_interest);
    }

    //Calculate total cost
    //let total_cost = balance[0] + total_interest;

    costObj.remaining_balance = balance_array;
    costObj.total_interest = total_interest;
    //costObj.total_cost = total_cost.toFixed(2);
    costObj.interest_payments = interest_array;
    costObj.principal_payment = principal_array;
    costObj.months = month_array;
    costObj.total_interest_array = total_interest_array;
    //costObj.principal_balance = remainder_array;

    return costObj;

    //am I allowed to return different data types from one function?
    //return [interest_array, principal_array, remainder_array, total_cost];

}


function displayData(monthly_payment, cost_Obj){

    let loanAmount = document.getElementById("loan_amount").value;
    loanAmount = parseFloat(loanAmount);
    let totalInterest = cost_Obj.total_interest;
    totalInterest = parseFloat(totalInterest);
    
    let totalCost = (loanAmount + totalInterest);

    //apply the toLocaleString method to STRINGS
    monthlyPayment = monthly_payment.toLocaleString(undefined, { maximumFractionDigits: 2 });
    //monthlyPayment = monthlyPayment.toLocaleString();
    loanAmount = loanAmount.toLocaleString(undefined, { maximumFractionDigits: 2 });

    totalInterest = totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 });
    
    //have to access the DOM
    document.getElementById("monthly_payment").innerHTML = `$${monthlyPayment}`;

    //document.getElementById("monthly_payment").innerHTML = `$${monthly_payment.toFixed(2)}`;
    document.getElementById("total_principal").innerHTML = `$${loanAmount}`; 
    document.getElementById("total_interest").innerHTML = `$${totalInterest}`;
    document.getElementById("total_cost").innerHTML = `$${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;


    //create table data for id = table_data
    //table columns, td, nested inside table row - 6 total columns

    let n = cost_Obj.months.length;
    var row; 

    for (let i = 0; i<n; i++){
        
        row = `<tr>
                    <td>${cost_Obj.months[i]}</td>
                    <td>$${monthly_payment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td>$${cost_Obj.principal_payment[i].toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td>$${cost_Obj.interest_payments[i].toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td>$${cost_Obj.total_interest_array[i].toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td>$${cost_Obj.remaining_balance[i].toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                </tr>`;
        //fill out table using newly created row from template literal
        document.getElementById("table_data").innerHTML += row;
    }



    // document.getElementById("month").innerHTML = `${cost_Obj.months[0]}`;
    // document.getElementById("payment").innerHTML = `${monthly_payment}`;
    // document.getElementById("principal").innerHTML = `${cost_Obj.principal_payment[0]}`;
    // document.getElementById("interest").innerHTML = `${cost_Obj.interest_payments[0]}`;
    // document.getElementById("interest_data").innerHTML = `${cost_Obj.interest_payments[0]}`;
    // document.getElementById("balance").innerHTML = `${cost_Obj.remaining_balance[0]}`;

}    

function doMyMath(){

    //object from paymentCalculator 
    mathData = paymentCalculator();
    
    let r = mathData.int_rate;
    let n = mathData.term;
    //this should NOT be an array - in order to rectify incorrect lengths in final output
    let balance = mathData.principal;
    let monthly_payment = mathData.monthly_payment;

    //call interestCalculator
    cost_Obj = interestCalculator(r, balance, n, monthly_payment);

    //call displayData
    displayData(monthly_payment, cost_Obj);

    // document.getElementById("monthly_payment").innerHTML = `$${monthly_payment}`;
    // document.getElementById("total_principal").innerHTML = `$${balance[0]}`;
    // document.getElementById("total_interest").innerHTML = `$${cost_Obj.total_interest}`;
    // document.getElementById("total_cost").innerHTML = `$${cost_Obj.total_cost}`;

    // //fill out table data beginning here
    // document.getElementById("month").innerHTML = `1`;
    // document.getElementById("payment").innerHTML = `${monthly_payment}`;
    // document.getElementById("principal").innerHTML = `${cost_Obj.principal_payment[0]}`;
    // document.getElementById("interest").innerHTML = `${cost_Obj.interest_payments[0]}`;
    // document.getElementById("interest_data").innerHTML = `${cost_Obj.interest_payments[0]}`;
    // document.getElementById("balance").innerHTML = `${cost_Obj.principal_balance[0]}`;

}


function paymentCalculator(){
    //calculates monthly payment based on variables

    data_array = {};

    //get user input
    userInput = getUserInput();
    
    //execute loan calutions
    let P = parseFloat(userInput.loan); //initial loan amount
    let n = parseFloat(userInput.payments); // term - no of payments
    let int_rate = parseFloat(userInput.rate); // interest rate % per month

    //monthly interest rate - FIXED
    let r = (int_rate/12)/100; // this is monthly interest %
    
    //Master monthly payment formula: a = P/((1+r)^n-1)/(r(1+r)^n)
    let a1 = (1+r)**n-1;
    let a2 = r*(1+r)**n;
    let a3 = a1/a2;

    //a = monthly payment - FIXED
    let a = (P/a3);
    //a = Math.round(a);

    //return all of this out of the function paymentCalculator
    data_array.int_rate = r;
    data_array.term = n;
    data_array.principal = P;
    data_array.monthly_payment = a;

    return data_array;
}

function getUserInput(){
    //get user input
    //only numbers allowed according to the form
    let loanAmount = document.getElementById("loan_amount").value;
    let payments = document.getElementById("payments").value;
    let rate = document.getElementById("rate").value;

    //return an object with all the user input as data
    let inputData = {};
    //think - key, value pair
    inputData.loan = loanAmount;
    inputData.payments = payments;
    inputData.rate = rate;

    return inputData;

}
