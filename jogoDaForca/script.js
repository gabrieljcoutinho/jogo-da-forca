const themeSelect = document.getElementById('theme-select');
const startButton = document.getElementById('start-button');
const gameArea = document.getElementById('game-area');
const wordDisplay = document.getElementById('word-display');
const hangmanImage = document.getElementById('hangman-image');
const letterInput = document.getElementById('letter-input');
const guessButton = document.getElementById('guess-button');
const message = document.getElementById('message');
const usedLettersDisplay = document.getElementById('used-letters');
const resetButton = document.getElementById('reset-button');

const themes = {
frutas: ["banana", "maçã", "laranja", "uva", "morango", "abacaxi", "melancia", "manga", "kiwi", "coco", "pera"],
animais: ["cachorro", "gato", "elefante", "leao", "tigre", "girafa", "zebra", "macaco", "urso", "raposa", "coelho", "lobo"],
paises: ["brasil", "argentina", "portugal", "italia", "japao", "canada", "australia", "mexico", "espanha", "franca", "alemanha", "inglaterra"],
objetos: ["mesa", "cadeira", "computador", "livro", "caneta", "celular", "lampada", "relogio", "televisao", "carro", "bicicleta", "sofa", "geladeira"],
};

let selectedWord = '';
let wordToGuess = [];
let guessedLetters = [];
let incorrectGuesses = 0;
const maxIncorrectGuesses = 6;

function startGame() {
    const selectedTheme = themeSelect.value;
    const words = themes[selectedTheme];
    selectedWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
    wordToGuess = Array(selectedWord.length).fill('_');
    guessedLetters = [];
    incorrectGuesses = 0;

    updateWordDisplay();
    updateHangmanImage();
    updateUsedLetters();
    message.textContent = '';
    gameArea.classList.remove('hidden');
    resetButton.classList.add('hidden');
    letterInput.value = '';
    letterInput.focus();
    themeSelect.parentNode.classList.add('hidden');
}

function updateWordDisplay() {
    wordDisplay.textContent = wordToGuess.join(' ');
}

function updateHangmanImage() {
    hangmanImage.src = `forca${incorrectGuesses}.png`;
}

function updateUsedLetters() {
    usedLettersDisplay.textContent = `Letras usadas: ${guessedLetters.sort().join(', ')}`;
}

function guessLetter() {
    const letter = letterInput.value.toLowerCase();
    letterInput.value = '';

    if (!letter || !/^[a-z]$/.test(letter)) {
        message.textContent = 'Por favor, digite uma letra válida.';
        return;
    }

    if (guessedLetters.includes(letter)) {
        message.textContent = 'Você já tentou essa letra.';
        return;
    }

    guessedLetters.push(letter);

    if (selectedWord.includes(letter)) {
        for (let i = 0; i < selectedWord.length; i++) {
            if (selectedWord[i] === letter) {
                wordToGuess[i] = letter;
            }
        }
        updateWordDisplay();
        if (!wordToGuess.includes('_')) {
            message.textContent = `Parabéns! Você acertou a palavra: ${selectedWord}`;
            gameEnd(true);
        }
    } else {
        incorrectGuesses++;
        updateHangmanImage();
        if (incorrectGuesses >= maxIncorrectGuesses) {
            message.textContent = `Você perdeu! A palavra era: ${selectedWord}`;
            gameEnd(false);
        }
    }

    updateUsedLetters();
}

function gameEnd(win) {
    guessButton.removeEventListener('click', guessLetter);
    letterInput.removeEventListener('keypress', handleEnter);
    resetButton.classList.remove('hidden');
}

function resetGame() {
    startGame();
    guessButton.addEventListener('click', guessLetter);
    letterInput.addEventListener('keypress', handleEnter);
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        guessButton.click();
    }
}

startButton.addEventListener('click', startGame);
guessButton.addEventListener('click', guessLetter);
letterInput.addEventListener('keypress', handleEnter);
resetButton.addEventListener('click', resetGame);

// Pré-carregar as imagens da forca
for (let i = 0; i <= maxIncorrectGuesses; i++) {
    const img = new Image();
    img.src = `forca${i}.png`;
}