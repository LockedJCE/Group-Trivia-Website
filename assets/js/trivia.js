const questionHeader = $("#question");
const quizOptions = $(".quiz-options");
const settingsModal = $("#trivia-settings");
const resultDiv = $("#result");
let score = parseInt(localStorage.getItem('quizScore')) || 0;

// Get trivia question
function fetchTriviaQuestion() {
    // Re-enable answer buttons
    $('.quiz-option-button').prop('disabled', false).removeClass('is-disabled');

    let apiURL = 'https://opentdb.com/api.php?amount=1';
    const selectedCategory = $('#category-dropdown').val();
    const selectedDifficulty = $('#difficulty-dropdown').val();
    
    // Check for the "any" Category selection, 
    // if not selected, get the category that is selected
    if (selectedCategory !== 'any') {
        apiURL += `&category=${selectedCategory}`;
    }

    // Same thing for the difficulty, 
    if (selectedDifficulty !== 'any') {
        apiURL += `&difficulty=${selectedDifficulty}`;
    }

    fetch(apiURL)
    .then(response => response.json())
    .then(function (data) {
        if (data.response_code !== 0) {
            // 0 - success, 1 - no results, 2 - invalid parameter, 3 - token not found, 4 - token empty, 5 - rate limit
            throw new Error('Error from the Trivia API. Response code: ' + data.response_code);
        }
        // Decode all the text
        const questionData = data.results[0];
        questionData.question = decodeHtmlEntities(questionData.question);
        questionData.correct_answer = decodeHtmlEntities(questionData.correct_answer);
        questionData.incorrect_answers = questionData.incorrect_answers.map(answer => decodeHtmlEntities(answer));
        displayQuestion(questionData);
    });
}

// For displaying the question text and answer buttons
function displayQuestion(questionData) {
    questionHeader.text(questionData.question);
    quizOptions.empty();
    resultDiv.empty()

    // Get all of our answer choices into an array, then shuffle it
    const options = [questionData.correct_answer, ...questionData.incorrect_answers];
    shuffleArray(options);

    // create a button in the list for each of our answers, whether it's 1 answer or 10!
    options.forEach(option => {
        const listItem = $('<li>');
        const button = $('<button>')
        .addClass('quiz-option-button button is-rounded')
        .text(option);

        // Event listener for answer checking
        button.on('click', function() {
            checkAnswer(option, questionData.correct_answer);
            disableOptions(); // if any button is pressed, disable all the buttons
        });

        listItem.append(button);
        quizOptions.append(listItem);
    });
}

// Disable all option buttons
function disableOptions() {
    $('.quiz-option-button').prop('disabled', true).addClass('is-disabled');
}

// Check if the answer is correct or not
function checkAnswer(selectedOption, correctAnswer) {
    resultDiv.empty();
    const resultHeader = $('<h2>').addClass('result-header');

    if (selectedOption === correctAnswer) {
        resultHeader.text('Correct, good job!').addClass('has-text-success');
        score++;
    } else {
        resultHeader.text(`Incorrect, the correct answer was: ${correctAnswer}`).addClass('has-text-danger');
        score--;
    }
    fetchDogImage();

    // Set and get score
    localStorage.setItem('quizScore', score);
    displayScore();

    resultDiv.append(resultHeader);
}

function displayScore() {
    let score = parseInt(localStorage.getItem('quizScore')) || 0;
    $("#total-score").text(`Score: ${score}`);
}