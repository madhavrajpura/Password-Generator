// Declaration part
const inputSlider = document.querySelector(".slider");
const lengthDisplay = document.querySelector("[data-length-number]");
const passwordDisplay = document.querySelector("[data-pass-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copy-msg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-btn");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = "!#$%&@_~";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set circle color to grey.
setIndicator('#ccc');

//password lenght ne UI upper reflect karave.
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    console.log(min, max);
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
    console.log(inputSlider);
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 5px 1px ${color}`;
}




function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function generateLowercase() {
    return String.fromCharCode((getRandomInteger(97, 123)));
}

function generateUppercase() {
    return String.fromCharCode((getRandomInteger(65, 91)));
}

function generateSymbol() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength > 0) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength > 4) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerHTML = "Copied";
    } catch (e) {
        copyMsg.innerHTML = "Failed";
    }

    // to make copy valu span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 1000);
}

//Shuffle function.
function shufflePassword(shufflePassword) {
    // Fisher yates method
    for (let i = shufflePassword.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shufflePassword[i];
        shufflePassword[i] = shufflePassword[j];
        shufflePassword[j] = temp;
    }
    let str = "";
    // bracket ma change karyo che.
    shufflePassword.forEach((ele) => { str += ele });
    return str;
}

//Handling Check box change.
function handleCheckboxCheck() {
    checkCount = 0;

    allCheckbox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount += 1;
    });
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// Event Listner on CheckBoxs.
allCheckbox.forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckboxCheck);
});

//  Event Listner on Slider
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

// Event Listner on Copy Btn
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})

// Event Listner on Generate Password 
generateBtn.addEventListener('click', () => {

    // none of the checkbox are selected. 
    if (checkCount == 0)
        return;

    if (passwordLength <= checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Find the new password.

    // remove old password.
    password = "";

    // let put the thing mentioned in checkboxes.

    // if(uppercaseCheck.checked){
    //     password += generateUppercase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowercase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateUppercase);

    if (lowercaseCheck.checked)
        funcArr.push(generateLowercase);

    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // Compulsory addition.

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Remaining addition.
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle the password.
    password = shufflePassword(Array.from(password));

    // Show in UI.
    passwordDisplay.value = password;

    //calculate strength.
    calcStrength();

})