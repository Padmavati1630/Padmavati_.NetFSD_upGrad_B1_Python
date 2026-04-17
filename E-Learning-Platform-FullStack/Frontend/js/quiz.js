//quiz.js
let currentQuizId = null;

let time = 40; // sec
const timerEl = document.getElementById("timer");
let countdown;

const container = document.getElementById("quizContainer");
const reviewContainer = document.getElementById("answerReview");
const spinner = document.getElementById("loadingSpinner");

let currentQuiz = [];
let submitted = false;

function getCourseIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("courseId") || 1; // fallback
}

async function loadQuiz() {

  const courseId = getCourseIdFromURL();

  //  get quiz for course
  const quizzes = await fetch(`http://localhost:5174/api/quizzes/${courseId}`)
    .then(res => res.json());

  if (!quizzes.length) {
    console.error("No quiz found for course");
    return [];
  }

  currentQuizId = quizzes[0].quizId;

  // get questions
  const questions = await fetch(`http://localhost:5174/api/quizzes/${currentQuizId}/questions`)
    .then(res => res.json());

  return questions;
}

function shuffleArray(array){
  return array.sort(()=>Math.random()-0.5);
}

function displayQuiz(questions){

  time = 40;

  spinner.style.display = "none";
  container.style.display = "block";

  currentQuiz = shuffleArray([...questions]).slice(0,10);

  container.innerHTML = "";

  currentQuiz.forEach((q,index)=>{

    const div = document.createElement("div");
    div.className = "card p-3 mb-3 shadow-sm"; 

    div.innerHTML = `
        <p><strong>Q${index+1}. ${q.questionText}</strong></p>

        ${q.options.map((opt, i) => `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="q${index}" value="${i}">
            <label class="form-check-label">
              ${opt.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
            </label>
          </div>
        `).join("")}
    `;

    container.appendChild(div);
  });

  // Timer
  countdown = setInterval(() => {
    time--;
    timerEl.textContent = `Time Left: ${time}s`;

    if (time === 0) {
        clearInterval(countdown);
        alert("Time's up! Auto-submitting quiz.");
        submitQuiz(true);
    }
  }, 1000);
}

export function calculateGrade(score,total){
  let percentage=(score/total)*100;
  if(percentage>=80) return "A";
  else if(percentage>=50) return "B";
  else return "Fail";
}

export function calculatePercentage(score, total){
  return (score/total)*100;
}

function getFeedback(grade){
  switch(grade){
    case "A": return "Excellent performance!";
    case "B": return "Good job!";
    default: return "Needs more practice.";
  }
}

function submitQuiz(forceSubmit = false){
  if (submitted && !forceSubmit) return;
  submitted = true;

  document.getElementById("submitQuiz").disabled = true;

  clearInterval(countdown);
  timerEl.textContent = "Submitted";

  // collect answers
  const answers = {};

  currentQuiz.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    if (selected) {
      const key = q.questionId ?? q.id ?? index;
      answers[key] = Number(selected.value);
    }
  });
  // check all answered
  if (!forceSubmit && Object.keys(answers).length < currentQuiz.length) {
    alert("Please answer all questions");
    submitted = false;
    document.getElementById("submitQuiz").disabled = false;
    return;
  }
  const user = JSON.parse(localStorage.getItem("user"));

  // send to backend (USE DYNAMIC QUIZ ID)
  const url = currentQuizId
    ? `http://localhost:5174/api/quizzes/${currentQuizId}/submit`
    : `http://localhost:5174/api/quizzes/mixed/submit`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: user.userId,
      answers: answers
    })
  })
  .then(async res => {
    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Backend error:", text);
      throw new Error("Submit failed");
    }
    return res.json();
  })
  .then(data => {

    //console.log("BACKEND RESULT:", data);

    console.log("BACKEND RESULT:", data); //  (debug)

    const score = data.score ?? data.Score ?? 0;
    const total = currentQuiz.length;

    // Highlight answers
    currentQuiz.forEach((q, index) => {
      const options = document.querySelectorAll(`input[name="q${index}"]`);

      options.forEach((opt, i) => {
        const label = opt.parentElement;

        //  Correct answer → GREEN
        if (i === q.correctAnswer) {
          label.style.backgroundColor = "#d4edda";
        }

        //  Wrong selected → RED
        if (opt.checked && i !== q.correctAnswer) {
          label.style.backgroundColor = "#f8d7da";
        }

        // disable all options
        opt.disabled = true;
      });
      if (options.length > 0) {
        const questionDiv = options[0].closest(".card");

        const correctText = q.options[q.correctAnswer]
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        const answerDiv = document.createElement("div");
        answerDiv.className = "mt-2 text-success fw-bold";

        answerDiv.innerHTML = `✔ Correct Answer: ${correctText}`;

        questionDiv.appendChild(answerDiv);
      }
    });

    const percent = Math.round((score / total) * 100);

    document.getElementById("scoreText").innerHTML =
      `<strong>${score}/${total}</strong> (${Math.round((score / total) * 100)}%)`;

    let message = "";

    if (percent === 100) message = "🔥 Perfect Score!";
    else if (percent >= 70) message = "👍 Great job!";
    else if (percent >= 40) message = "🙂 Keep practicing!";
    else message = "⚠️ Try again!";

    document.getElementById("feedbackText").textContent = message;

    document.getElementById("resultSection").style.display = "block";

    const retryBtn = document.createElement("button");
    retryBtn.className = "btn btn-secondary mt-3";
    retryBtn.textContent = "Retry Quiz";

    retryBtn.onclick = () => {
      location.reload();
    };

    document.getElementById("resultSection").appendChild(retryBtn);

    // confetti
    if (score >= currentQuiz.length * 0.8) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setTimeout(() => {
      document.getElementById("resultSection").scrollIntoView({
        behavior: "smooth"
      });
    }, 300);

    const completedCourses =
      JSON.parse(localStorage.getItem("completedCourses")) || [];

    const totalCourses =
      Number(localStorage.getItem("totalCourses")) || 0;

    // Certificate logic
    if (completedCourses.length === totalCourses && totalCourses > 0 && score >= currentQuiz.length * 0.8) {

      const cert = document.createElement("div");
      cert.className = "alert alert-success mt-3";

      cert.innerHTML = `
        🎉 Congratulations! <br>
        You scored high 🎯 <br>
        <strong>Certificate of Completion Unlocked!</strong>
      `;

      document.getElementById("resultSection").appendChild(cert);
    }
  });
}

const params = new URLSearchParams(window.location.search);
const courseId = params.get("courseId");

if (courseId) {
  //  Course-specific quiz
  fetch(`http://localhost:5174/api/quizzes/${courseId}`)
    .then(res => res.json())
    .then(async data => {

      if (!data.length) {
        container.innerHTML =
          "<p class='text-warning'>Quiz will be live in few days. Revise the topics.</p>";
        spinner.style.display = "none";
        return;
      }

      currentQuizId = data[0].quizId;

      const questions = await fetch(
        `http://localhost:5174/api/quizzes/${currentQuizId}/questions`
      ).then(res => res.json());

      displayQuiz(questions);
    });

} else {
  // ✅ Mixed quiz
  fetch("http://localhost:5174/api/courses")
    .then(res => res.json())
    .then(async courses => {

      let allQuestions = [];
      let quizIds = [];

      for (let course of courses) {
        const quizzes = await fetch(`http://localhost:5174/api/quizzes/${course.id}`)
          .then(res => res.json());

        if (quizzes.length) {
          quizIds.push(quizzes[0].quizId);

          const questions = await fetch(
            `http://localhost:5174/api/quizzes/${quizzes[0].quizId}/questions`
          ).then(res => res.json());

          allQuestions.push(...questions);
        }
      }

      currentQuizId = null;

      displayQuiz(allQuestions);
    });
}

document.getElementById("submitQuiz").onclick = () => submitQuiz(false);

