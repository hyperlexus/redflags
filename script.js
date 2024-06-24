// url format:
// <img
//   src="https://flagcdn.com/160x120/ua.png"
//   width="160"
//   height="120"
//   alt="Ukraine">

// palestine and vatican city need an asterisk

console.log("what is blud doing in the console 💀😭💀");

const flagsEasy = document.getElementById('flags-easy');
const flagsMedium = document.getElementById('flags-medium');
const flagsHard = document.getElementById('flags-hard');
const insaneMode = document.getElementById('flags-insane');


const difficultySelectDiv = document.getElementById('difficulty-select');
const flagGameDiv = document.getElementById('flag-box');
const flagTitleDiv = document.getElementById('flag-title');
const flagImageDiv = document.getElementById('flag-image');
const flagGameOptions = document.getElementById('flag-options');
const flagAnswerDiv = document.getElementById('flag-answer');
const nextButtonDiv = document.getElementById('flag-next');

let score = 0;
let highscore = 0;

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

    return { firstCountryCode, countryNames };
}

function renderFlag(code, countryName) {
    let flag = document.createElement('img');
    flag.src = `https://flagcdn.com/w320/${code}.png`;
    flag.srcset = `https://flagcdn.com/w640/${code}.png 2x`;
    flag.width = 320;
    flag.alt = countryName;
    flag.className = 'centered';
    flagImageDiv.appendChild(flag);
}

function renderOptionButtons(countryNames, correctCountry) {
    const shuffledCountryNames = countryNames.sort(() => Math.random() - 0.5);
    const optionButtons = [];
    let isAnswered = false;

    shuffledCountryNames.forEach((country) => {
        let optionButton = document.createElement('button');
        optionButton.innerText = country;
        optionButton.classList.add('centered-button', 'game-button');
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

        flagGameOptions.appendChild(optionButton);
        optionButtons.push(optionButton);
    });
}

async function flagGame(difficulty) {
    flagTitleDiv.innerHTML = '';
    flagImageDiv.innerHTML = '';
    flagGameOptions.innerHTML = '';
    flagAnswerDiv.innerHTML = '';
    nextButtonDiv.innerHTML = '';

    difficultySelectDiv.style.display = 'none';
    flagGameDiv.style.display = '';

    let title = document.createElement('h1');
    title.innerText = `Flags - ${difficulty}`;
    title.className = 'centered';
    title.style.fontSize = '1rem';
    flagTitleDiv.appendChild(title);

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
    renderOptionButtons(countryNames, correctCountry);

    let nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.id = 'next-button';
    nextButton.classList.add('centered-button', 'game-button');
    nextButton.addEventListener('click', () => flagGame(difficulty));
    nextButton.style.display = 'none';
    nextButtonDiv.appendChild(nextButton);
}


flagsEasy.addEventListener('click', () => flagGame('easy'));
flagsMedium.addEventListener('click', () => flagGame('medium'));
flagsHard.addEventListener('click', () => flagGame('hard'));
insaneMode.addEventListener('click', () => flagGame('insane'));