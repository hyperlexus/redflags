// init
console.log("what is blud doing in the console 💀😭💀");

const flagsEasy = document.getElementById('flags-easy');
const flagsMedium = document.getElementById('flags-medium');
const flagsHard = document.getElementById('flags-hard');
const flagsInsane = document.getElementById('flags-insane');


const difficultySelectDiv = document.getElementById('difficulty-select');
const flagGameDiv = document.getElementById('flag-box');
const flagTitleDiv = document.getElementById('flag-title');
const flagImageDiv = document.getElementById('flag-image');
const flagOptionsDiv = document.getElementById('flag-options');
const flagInputDiv = document.getElementById('flag-input');
const flagAnswerDiv = document.getElementById('flag-answer');
const nextButtonDiv = document.getElementById('flag-next');

let score = 0;
let highscore = 0;


// returns an object that has the country code of the country to be guessed
// and an array of random countries as options, including the correct one
async function getRandomCountryCodes(n) {
    const response = await fetch('data/flags.json');
    const data = await response.json();

    const keys = Object.keys(data);
    let firstCountryCode;
    const countryNames = [];

    while (countryNames.length < n) {
        const randomIndex = Math.floor(Math.random() * keys.length);
        const countryCode = keys[randomIndex];

        if (!countryNames.includes(data[countryCode])) {
            if (!firstCountryCode) {
                firstCountryCode = countryCode;
            }
            countryNames.push(data[countryCode]);
        }
    }

    firstCountryCode = "ro";
    countryNames[0] = "Romania";
    return { firstCountryCode, countryNames };
}

function renderTitle(mode, difficulty) {
    let title = document.createElement('a');
    title.href = 'index.html';
    title.innerText = `${mode} - ${difficulty}`;
    title.classList.add('centered', 'flagGame-title');
    title.style.fontSize = '1rem';
    flagTitleDiv.appendChild(title);
}


// inserts the image of the target flag
function renderFlag(code, countryName) {
    let flag = document.createElement('img');
    flag.src = `https://flagcdn.com/w320/${code}.png`;
    flag.srcset = `https://flagcdn.com/w640/${code}.png 2x`;
    flag.width = 320;
    flag.alt = countryName;
    flag.className = 'centered';
    flagImageDiv.appendChild(flag);
}


// called for easy and medium mode
function renderOptionButtons(countryNames, correctCountry) {
    const shuffledCountryNames = countryNames.sort(() => Math.random() - 0.5);
    const optionButtons = [];

    let isAnswered = false;

    shuffledCountryNames.forEach((country) => {
        let optionButton = document.createElement('button');
        optionButton.innerText = country;
        optionButton.classList.add('centered-button');
        optionButton.addEventListener('click', () => {
            if (isAnswered) return;

            if (country === correctCountry) {
                score++;
                if (score > highscore) {
                    highscore = score;
                }
                flagAnswerDiv.innerText = 'Correct! Streak: ' + score + ' Best: ' + highscore;
                flagAnswerDiv.style.color = 'lightgreen';
            } else {
                flagAnswerDiv.innerText = 'Incorrect! Streak: ' + score + ' Best: ' + highscore;
                score = 0;
                flagAnswerDiv.style.color = 'red';
            }

            optionButtons.forEach((button) => {
                button.style.backgroundColor = button.innerText === correctCountry ? 'green' : 'red';
            });

            isAnswered = true;
            document.getElementById('next-button').style.display = 'block';
        });

        flagOptionsDiv.appendChild(optionButton);
        optionButtons.push(optionButton);
    });
}
async function renderDropdown(correctCountry) {
    const response = await fetch('data/flags.json');
    const data = await response.json();
    const allCountries = Object.values(data);

    let isAnswered = false;

    let dropdown = document.createElement('select');
    dropdown.classList.add('centered-button');
    dropdown.id = 'country-dropdown';
    dropdown.size = 1;

    let defaultOption = document.createElement('option');
    defaultOption.innerText = 'Select a country';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    dropdown.appendChild(defaultOption);

    allCountries.forEach((country) => {
        let option = document.createElement('option');
        option.innerText = country;
        dropdown.appendChild(option);
    });

    flagInputDiv.appendChild(dropdown);


    let submitButton = document.createElement('button');
    submitButton.innerText = 'Submit';
    submitButton.classList.add('centered-button');

    function dupeFlagHandler(mode, correctCountry) {
        if (mode === "wrong") {
            flagAnswerDiv.innerText = `Incorrect! Streak: ${score} Best: ${highscore}
                However, these flags are identical. Your streak will not be reset.`;
            flagAnswerDiv.style.color = 'yellow';
            submitButton.style.backgroundColor = 'yellow';
            submitButton.innerText = `This is the flag of ${correctCountry}. This is so stupid.`;
        } else if (mode === "right" || mode === "standard correct") {
            score++;
            if (score > highscore) {
                highscore = score;
            }
            flagAnswerDiv.innerText = `Correct! Streak: ${score} Best: ${highscore}`;
            flagAnswerDiv.style.color = 'lightgreen';
            submitButton.style.backgroundColor = 'green';
            if (mode === "right") {
                submitButton.innerText = `Lucky! You won the coinflip xD`;
            }
        } else if (mode === "else") {
            flagAnswerDiv.innerText = 'Incorrect! Streak: ' + score + ' Best: ' + highscore;
            score = 0;
            flagAnswerDiv.style.color = 'red';
            submitButton.style.backgroundColor = 'red';
            submitButton.innerText = `This is the flag of ${correctCountry}.`;
        }
    }

    submitButton.addEventListener('click', () => {
        if (dropdown.value === 'Select a country') return;
        if (correctCountry === 'Romania' || correctCountry === 'Chad') {
            if (isAnswered) return;
            console.log("a");
            if (dropdown.value !== correctCountry && (dropdown.value === 'Romania' || dropdown.value === 'Chad')) {
                dupeFlagHandler("wrong", correctCountry);
            } else {
                dupeFlagHandler("right", correctCountry);
            }
        } else if (correctCountry === 'Indonesia' || correctCountry === 'Monaco') {
            if (isAnswered) return;
            if (dropdown.value !== correctCountry && (dropdown.value === 'Indonesia' || dropdown.value === 'Monaco')) {
                dupeFlagHandler("wrong", correctCountry);
            } else {
                dupeFlagHandler("right", correctCountry);
            }
        } else if (dropdown.value === correctCountry) {
            if (isAnswered) return;
            dupeFlagHandler("standard correct", correctCountry);
        } else {
            if (isAnswered) return;
            dupeFlagHandler("else", correctCountry);
        }

        isAnswered = true;
        document.getElementById('next-button').style.display = 'block';
    });

    flagOptionsDiv.appendChild(submitButton);
}

async function flagGame(difficulty) {
    flagTitleDiv.innerHTML = '';
    flagImageDiv.innerHTML = '';
    flagOptionsDiv.innerHTML = '';
    flagInputDiv.innerHTML = '';
    flagAnswerDiv.innerHTML = '';
    nextButtonDiv.innerHTML = '';

    difficultySelectDiv.style.display = 'none';
    flagGameDiv.style.display = '';

    renderTitle("Flags", difficulty);

    let amount_options;
    if (difficulty === 'easy') {
        amount_options = 3;
    } else if (difficulty === 'medium') {
        amount_options = 4;
    } else {
        amount_options = 1;
    }

    const { firstCountryCode, countryNames } = await getRandomCountryCodes(amount_options);
    let correctCountry = countryNames[0];

    renderFlag(firstCountryCode, correctCountry);
    if (difficulty === "easy" || difficulty === "medium") {
        renderOptionButtons(countryNames, correctCountry);
    } else if (difficulty === "hard") {
        renderDropdown(correctCountry);
    }

    let nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.id = 'next-button';
    nextButton.classList.add('centered-button');
    nextButton.addEventListener('click', () => flagGame(difficulty));
    nextButton.style.display = 'none';
    nextButtonDiv.appendChild(nextButton);
}


flagsEasy.addEventListener('click', () => flagGame('easy'));
flagsMedium.addEventListener('click', () => flagGame('medium'));
flagsHard.addEventListener('click', () => flagGame('hard'));
flagsInsane.addEventListener('click', () => flagGame('insane'));