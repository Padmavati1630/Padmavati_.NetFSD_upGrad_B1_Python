//quiz.js
import { quizQuestions } from "./data.js";

let time = 70; // sec
const timerEl = document.getElementById("timer");
let countdown;

const container = document.getElementById("quizContainer");
const reviewContainer = document.getElementById("answerReview");
const spinner = document.getElementById("loadingSpinner");

let currentQuiz = [];
let submitted = false;

function loadQuiz(){
  return new Promise(resolve=>{
    setTimeout(()=> resolve(quizQuestions), 800);
  });
}

function shuffleArray(array){
  return array.sort(()=>Math.random()-0.5);
}

async function displayQuiz(){

  time = 70;

  spinner.style.display = "block";
  container.style.display = "none";

  const questions = await loadQuiz();

  spinner.style.display = "none";
  container.style.display = "block";

  currentQuiz = shuffleArray([...questions]).slice(0,10);

  container.innerHTML="";

  currentQuiz.forEach((q,index)=>{

    const div=document.createElement("div");
    div.className = "card p-3 mb-3 shadow-sm"; 

    div.innerHTML = `
        <p><strong>Q${index+1}. ${q.question}</strong></p>

        ${q.options.map((opt,i)=>`
            <div>
            <input 
                id="q${index}-${i}" 
                type="radio" 
                name="q${index}" 
                value="${i}"
            >
            <label for="q${index}-${i}">
                ${opt}
            </label>
            </div>
        `).join("")}
    `;

    container.appendChild(div);
  });
  //Start Timer
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
  
  if (submitted) return; 
  submitted = true;
  document.getElementById("submitQuiz").disabled = true; 

  clearInterval(countdown);
  timerEl.textContent = "Submitted"; 

  let score=0;
  let answered=0;

  currentQuiz.forEach((q,index)=>{
    const selected=document.querySelector(`input[name="q${index}"]:checked`);

    if(selected){
      answered++;
      if(Number(selected.value)===q.answer) score++;
    }
  });

  if(!forceSubmit && answered < currentQuiz.length){
    alert("Please answer all questions");
    submitted = false; // allow retry
    document.getElementById("submitQuiz").disabled = false;
    return;
  }

  const grade=calculateGrade(score,currentQuiz.length);
  // Confetti for top performers
  const completedCourses = JSON.parse(localStorage.getItem("completedCourses")) || [];
  const totalCourses = 3;

  if (grade === "A" && completedCourses.length === totalCourses) {
      confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
      });
  }
  const percentage = calculatePercentage(score, currentQuiz.length);

  const result = { score, total: currentQuiz.length, percentage, grade };

  let attempts = JSON.parse(localStorage.getItem("quizAttempts")) || [];
  attempts.push(result);

  localStorage.setItem("quizAttempts", JSON.stringify(attempts));
  localStorage.setItem("quizResult", JSON.stringify(result));

  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${currentQuiz.length} | Grade: ${grade}`;

  document.getElementById("feedbackText").textContent =
    getFeedback(grade);

  document.getElementById("resultSection").style.display="block";

  setTimeout(() => {
    document.getElementById("resultSection").scrollIntoView({
        behavior: "smooth"
    });
  }, 300);


  //Certificate 

  if (grade === "A" && completedCourses.length === totalCourses) {
      const cert = document.createElement("div");
      cert.className = "alert alert-success mt-3";

      cert.innerHTML = `
          🎉 Congratulations!
          <br>
          You scored Grade A 🏆
          <br>
          <strong>Certificate of Completion Unlocked!</strong>
      `;

      document.getElementById("resultSection").appendChild(cert);
  }else if (grade === "A") {
    const msg = document.createElement("div");
    msg.className = "alert alert-warning mt-3";

    msg.innerHTML = `
        🎉 Great score!
        <br>
        Complete all courses to unlock certificate.
    `;

    document.getElementById("resultSection").appendChild(msg);
  }
  reviewContainer.innerHTML="";

  currentQuiz.forEach((q,index)=>{
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    let userAnswer = selected ? Number(selected.value) : null;

    const div = document.createElement("div");

    //Case 1:Not answered
    if(userAnswer === null){
        div.className = "text-warning";
        div.innerHTML = `
        Question ${index+1} ⚠️ Not Answered <br>
        Correct answer: ${q.options[q.answer]}
        `;
    }

    //Case 2:Correct
    else if(userAnswer === q.answer){
        div.className = "correct-answer";
        div.textContent = `Question ${index+1} ✔ Correct`;
    }

    //Case 3: Wrong
    else{
        div.className = "wrong-answer";
        div.innerHTML = `
        Question ${index+1} ❌ Incorrect <br>
        Correct answer: ${q.options[q.answer]}
        `;
    }

    reviewContainer.appendChild(div);
  });
};

document.getElementById("submitQuiz").onclick = () => submitQuiz(false);

displayQuiz();

