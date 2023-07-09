/* Global */

let numberA, numberB, oldNumberA;
let oldSign, newSign;
let switchEqual, switchOutput;

const message = "No way."



/* DOM elements */

const memory = document.getElementById("memory");
const output = document.getElementById("output");

const numberKeys = document.querySelectorAll(".number");

const addition = document.getElementById("addition");
const subtraction = document.getElementById("subtraction");
const multiplication = document.getElementById("multiplication");
const division = document.getElementById("division");

const plusminus = document.getElementById("plusminus");
const decimal = document.getElementById("decimal");
const equal = document.getElementById("equal");

const backspace = document.getElementById("backspace");
const clearentry = document.getElementById("clearentry");
const clear = document.getElementById("clear");



/* Keyboard */

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "Backspace":
            backspace.dispatchEvent(new Event("click"));
            break;
        case "Delete":
            clearentry.dispatchEvent(new Event("click"));
            break;
        case "Escape":
            clear.dispatchEvent(new Event("click"));
            break;        
        // Fallthrough: 0 to 9
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            // Limits input up to 10
            if (output.textContent.length < 10 || 
            (memory.textContent.includes("=") === true &&
            output.textContent.length >= 10)) {
                replaceOutput(e.key);
                output.textContent += e.key;
            } else {
                e.preventDefault();
            }
            break;
        case ".":
            decimal.dispatchEvent(new Event("click"));
            break;
        // Fallthrough: + and -
        case "+":
        case "-":
            getSign(e.key);
            break;        
        case "*":
            getSign("\u00D7");
            break;
        case "/":
            e.preventDefault(); // Disables Firefox Quick Find
            getSign("\u00F7");
            break;      
        case "Enter":
            e.preventDefault(); // Removes focus on last clicked button
            equal.dispatchEvent(new Event("click"));
            break;
    } 
});



/* Backspace */

backspace.addEventListener("click", () => {
    let temp;

    if (memory.textContent.includes("=") === true ||
    output.textContent === message) {
        // Clears everything after result
        clear.dispatchEvent(new Event("click"));
    } else if (output.textContent != "0" &&
    output.textContent.length > 1) {
        // Deletes one digit at a time
        output.textContent = output.textContent.slice(0, -1);
    } else if (output.textContent.length === 1) {    
        // Clears output only if one digit is left
        output.textContent = "0";
    }    
    
    // Prevents -0.
    if (output.textContent === "-0.") {        
        output.textContent = "0";
    }
    
    // Deletes sign
    if (memory.textContent != "" && output.textContent === "") {        
        temp = memory.textContent.slice(0, -2);        
        clear.dispatchEvent(new Event("click"));
        output.textContent = temp;
    }
});



/* Clear */

clearentry.addEventListener("click", () => {    
    if (memory.textContent.includes("=") === true) {
        // Clears everything after result
        clear.dispatchEvent(new Event("click")); 
    } else {
        // Clears output
        output.textContent = "0";
    }
});


clear.addEventListener("click", () => {
    // Clears everything    
    memory.textContent = "";
    output.textContent = "0";
    numberA = undefined;
    numberB = undefined;
    oldNumberA = undefined;
    oldSign = undefined;
    newSign = undefined;
    switchEqual = undefined;
    switchOutput = undefined;
});



/* Numbers */

Array.from(numberKeys).forEach((key) => {
    key.addEventListener("click", (e) => {
        // Limits input up to 10 digits
        // Allows new input if result >= 10 digits
        if (output.textContent.length < 10 ||
        (memory.textContent.includes("=") === true &&
        output.textContent.length >= 10)) {
            replaceOutput(key.textContent);
            output.textContent += key.textContent;
        } else {
            e.preventDefault();
        }
    });
});



/* Decimal point */

decimal.addEventListener("click", () => {
    // Clears output after result
    if (memory.textContent.includes("=") === true ||
    output.textContent === message) {
        replaceOutput();
        output.textContent = "0.";    
    } else if (output.textContent === "") {
        switchOutput = 1;
        output.textContent = "0."; 
    } else if (output.textContent === "-") {
        switchOutput = 1;
        output.textContent += "0.";
    }

    // Limits number of decimal points
    if (output.textContent.includes(".") === false) {
        output.textContent += ".";
    }
});



/* Negative sign */

plusminus.addEventListener("click", () => {    
    if (memory.textContent.includes("=") === false &&
    output.textContent.includes("-") === false &&
    output.textContent != message &&
    output.textContent != "0") {
        output.textContent = "-" + output.textContent;
    } else if (memory.textContent.includes("=") === false && 
    output.textContent.includes("-") === true) {
        output.textContent = output.textContent.slice(1);
    }
});



/* Signs */

function getSign(sign) {
    // Prevents sign change once one of them is selected
    // Prevents considering message as numberA
    if (output.textContent != "" &&
    output.textContent != message) {
        // Usual procedure
        if (memory.textContent.includes("=") === false &&
        String(numberA).length < 15) {            
            newSign = sign;            
            getNumber();
            getResult();
        }
        
        // Stops if result is expressed in scientific notation
        if (String(numberA).length > 14) {
            getEqual();
        }
    }
}


addition.addEventListener("click", () => {
    getSign("+");
});


subtraction.addEventListener("click", () => {
    getSign("-");
});


multiplication.addEventListener("click", () => {
    getSign("\u00D7");
});


division.addEventListener("click", () => {
    getSign("\u00F7");
});



/* Equal */

equal.addEventListener("click", () => {
    if (memory.textContent.includes("=") === false &&
    (numberA || numberA === 0)) {
        numberB = +output.textContent;

        if (oldSign === "\u00F7" && numberB === 0) {
            divideZero();
        } else {
            doMath();
            getEqual();
        }
    }
});



/* Functions */

function replaceOutput(key) {
    switchEqual++;
    switchOutput++;    
    
    // Clears everything after result
    if (switchEqual === 1) {
        clear.dispatchEvent(new Event("click"));
    }

    // Clears output upon new input
    if ((output.textContent === "0" || switchOutput === 1) &&
    output.textContent != "-") {
        // Allows - at the beginning
        output.textContent = "";
    } else if (output.textContent === "-" && key === "0") {
        // Prevents -0
        output.textContent = "";
    }
}


function getNumberA() { 
    numberA = +output.textContent;
    oldSign = newSign;
    memory.textContent = `${numberA} ${newSign}`;
}


function getNumber() {
    switchOutput = 0;

    if (numberA || numberA === 0) {
        numberB = +output.textContent;
    } else {        
        getNumberA();
        output.textContent = "";
        oldNumberA = numberA;
    }
}


function divideZero() {
    clear.dispatchEvent(new Event("click"));
    output.textContent = message;
    switchEqual = 0;
}


function doMath() {   
    output.textContent = operate(numberA, numberB, oldSign);
    oldNumberA = numberA;
    getNumberA();
}


function getResult() {
    if (numberB || numberB === 0) {
        if (oldSign === "\u00F7" && numberB === 0) {
            divideZero();
        } else {
            doMath();
        }
    }
}


function getEqual() {
    memory.textContent = `${oldNumberA} ${oldSign} ${numberB} =`;
    
    // Convert to scientific notation if needed
    if (String(numberA).length > 14) {
        output.textContent = numberA.toExponential(4);
    } else {
        output.textContent = numberA;
    }

    switchEqual = 0;
}



/* Operations */

const add = function(a, b) {
    return a + b;
};


const subtract = function(a, b) {
    return a - b;
};


const multiply = function(a, b) {
    return a * b;
};


const divide = function(a, b) {
    return a / b;
};


const operate = function (a, b, newSign) {
    let result;    

    switch (newSign) {
        case "+":
            result = add(a, b);
            break;
        case "-":
            result = subtract(a, b);
            break;
        case "\u00D7":
            result = multiply(a, b);
            break;
        case "\u00F7":
            result = divide(a, b);
            break;
    }

    // Limits number of decimals
    if (Number.isInteger(result) === false) {
        result = result.toFixed(11);
        result = result.slice(0, -1);
        result = parseFloat(result);
    }

    return result;
};