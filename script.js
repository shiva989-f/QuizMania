const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

const progress = (value) => {
  // if value is 30 and time is 30 and we divide 30/30 then * by 100 then percentage is 100 time will decrease every second so percentage is decrease every second
  const percentage = (value / time) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = `${value}`;
};

let questions = [],
  time = 30,
  score = 0,
  currentQuestion,
  timer;

const startBtn = document.querySelector(".start"),
  numQuestionEl = document.querySelector("#num-questions"),
  categoryEl = document.querySelector("#category"),
  difficultyEl = document.querySelector("#difficulty"),
  timePerQuestionEl = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen");

const startQuiz = () => {
  const num = numQuestionEl.value,
    category = categoryEl.value,
    difficulty = difficultyEl.value;

  // Api
  const url = `https://opentdb.com/api.php?amount=${num}&category=${category}&difficulty=${difficulty}&type=multiple`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results;
      startScreen.classList.add("hide");
      quiz.classList.remove("hide");
      currentQuestion = 1;
      showQuestions(questions[0]);
    });
};

startBtn.addEventListener("click", () => {
  startQuiz();
});

const submitBtn = document.querySelector(".submit"),
      nextBtn = document.querySelector(".next");


const showQuestions = (question) => {
  let questionText = document.querySelector(".question"),
    answerWrapper = document.querySelector(".answer-wrapper"),
    questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question;

  // Correct and wrong answer are separated in api lets mix them. ...question.incorrect_answer means any number of data can be added in array
  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];

  // Correct answer will always in last so, lets shuffle all the array
  answers.sort(() => Math.random() - 0.5);
  answerWrapper.innerHTML = ""
  answers.forEach((answer) => {
    answerWrapper.innerHTML += `
      <div class="answer">
        <span class="text">${answer}</span>
        <span class="ans-checkbox">
          <span class="icon">√</span>
        </span>
      </div>`;
  });

  // Finding the index of question in questions array and adding one because array starts from 0
  questionNumber.innerHTML = `
    Question <span class="current-ques">${
      questions.indexOf(question) + 1
    }</span><span class="total-ques">/${questions.length}</span>`;

  // Lets add event listener on answers
  const answerDiv = document.querySelectorAll(".answer")
  answerDiv.forEach((answer)=> {
    answer.addEventListener("click", ()=> {
      // if answer selected and submitted then checked class will assigned to every answer so user can't select another answer after submitting
      if (!answer.classList.contains("checked")) {
        // Remove selected from other answers
        answerDiv.forEach((answer)=> {
          answer.classList.remove("selected")
        })
        // add selected to currently clicked answer
        answer.classList.add("selected")
        // after any answer selected enable submit button
        submitBtn.disabled = false;
      }
    })
  })

  // after updating question start timer
  time = timePerQuestionEl.value;
  startTimer(time)
};

const startTimer = (time)=> {
  timer = setInterval(() => {
    if(time >= 0){
      // if timer is more than 0 means time remaining
      // move progress timer
      progress(time);
      time--;
    }
    else {
      // automatically checks answer if time finishes, means less than 0 
      checkAnswer();
    }
  }, 1000);
}

submitBtn.addEventListener('click', ()=> {
  checkAnswer();
})
const checkAnswer = ()=>{
  // first clear timer interval when checkAnswer triggered
  clearInterval(timer)

  const selectedAnswer = document.querySelector(".answer.selected")
  // any answer is selected
  if(selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML
    if(answer === questions[currentQuestion-1].correct_answer){
      // if answer is matched with current question correct answer increase score
      score++;
      // add correct class to the selected answer div
      selectedAnswer.classList.add("correct")
    }
    else {
      // if wrong answer
      // add wrong class to the selected answer div and also add correct to the correct answer div
      selectedAnswer.classList.add("wrong")

      // adding correct class on correct answer 
      const correctAnswer = document.querySelectorAll(".answer")
      .forEach((answer)=>{
        if(
          answer.querySelector(".text").innerHTML === questions[currentQuestion-1].correct_answer
        ){
          // only add correct class to correct answer
          answer.classList.add("correct")
        }
      })
    }
  }
  // check answer function will be also triggered when time reaches 0
  // what if nothing is selected and time reaches 0
  // lets add correct class to correct answer
  else {
      const correctAnswer = document.querySelectorAll(".answer")
      .forEach((answer)=>{
        if(
          answer.querySelector(".text").innerHTML === questions[currentQuestion-1].correct_answer
        ){
          // only add correct class to correct answer
          answer.classList.add("correct")
        }
      })
  }

  // lets block user to select further
  const answerDiv = document.querySelectorAll(".answer")
  answerDiv.forEach((answer)=> {
    // add checked class on all as we check for it when on click answer
    answer.classList.add("checked")
  })

  // after submitting show next button to go to next question  
  submitBtn.style.display = "none"
  nextBtn.style.display = "block"
}

// on next button clicked show next question
nextBtn.addEventListener("click", ()=> {
  nextQuestion();
  // also show submit button and hide next button
  submitBtn.style.display = "block"
  nextBtn.style.display = "none"
})

const nextQuestion = () => {
  // if there is remaining question
  if(currentQuestion < questions.length) {
    currentQuestion++;
    // show question
    showQuestions(questions[currentQuestion -1])
  }
  else {
    // if no question remaining
    showScore();
  }
};

const endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score");

const showScore = ()=> {
  // show end screen and hide quiz screen
  endScreen.classList.remove("hide");
  quiz.classList.add("hide");
  // add score in final-score and total score in total-score span
  finalScore.innerHTML = score;
  totalScore.innerHTML = `/${questions.length}`;
}

const restartBtn = document.querySelector(".restart");

restartBtn.addEventListener("click", ()=> {
  // on end screen restart button clicked 
  // reload page to clear all variable contains previous data
  window.location.reload();
})