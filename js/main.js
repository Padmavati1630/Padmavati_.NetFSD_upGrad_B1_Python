//main.js
import { courses } from "./data.js";


// ===============================
// 📊 COURSE TABLE (Courses Page)
// ===============================
const tableBody = document.getElementById("courseTable");

if (tableBody) {
  courses.forEach(course => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${course.name}</td><td>${course.duration}</td>`;
    tableBody.appendChild(row);
  });
}


// ===============================
// 🎯 COURSE CARD DATA
// ===============================
const courseData = {
  html: {
    title: "HTML Basics",
    tag: "Programming",
    desc: "Master HTML fundamentals",
    lessons: ["Introduction", "Core Concepts", "Project"]
  },
  css: {
    title: "CSS Advanced",
    tag: "Design",
    desc: "Learn Flexbox, Grid, UI/UX",
    lessons: ["Selectors", "Flexbox", "Grid"]
  },
  js: {
    title: "JavaScript Mastery",
    tag: "Backend",
    desc: "Advanced JS concepts",
    lessons: ["Basics", "DOM", "Async JS"]
  }
};

// ===============================
// 📚 RENDER COURSE DETAILS
// ===============================
function renderCourse(courseId) {
  const course = courseData[courseId];

  if (!course) return;

  document.getElementById("courseTitle").textContent = course.title;
  document.getElementById("courseDesc").textContent = course.desc;

  const container = document.getElementById("curriculum");
  container.innerHTML = "";

  course.lessons.forEach((lesson, index) => {
    const div = document.createElement("div");
    div.className = "lesson";

    div.innerHTML = `
      <span>${String(index + 1).padStart(2, "0")} ${lesson}</span>
      <button 
        class="lesson-btn"
        data-course="${courseId}" 
        data-index="${index}"
        id="${courseId}-lesson-${index}">
        Mark Lesson Complete
      </button>
    `;
    container.appendChild(div);
  });

  container.addEventListener("click", function(e) {

    if (e.target.classList.contains("lesson-btn")) {

      const courseId = e.target.dataset.course;
      const index = Number(e.target.dataset.index);

      completeLesson(courseId, index);
    }

  });
}

// ===============================
// 🔗 GET COURSE FROM URL
// ===============================
function getCourseFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// ===============================
// 🧩 RENDER COURSE CARDS
// ===============================
async function renderCourseCards() {

  const loader = document.getElementById("courseLoader");
  const container = document.getElementById("courseCards");

  if (!container) return;

  loader.style.display = "block";
  container.style.display = "none";

  await new Promise(resolve => setTimeout(resolve, 800));

  loader.style.display = "none";
  container.style.display = "flex";

  container.innerHTML = "";

  Object.keys(courseData).forEach(courseId => {
    const course = courseData[courseId];

    let lessons = JSON.parse(localStorage.getItem(courseId + "-lessons")) || [];
    const completed = lessons.filter(Boolean).length;
    const total = course.lessons.length;
    const percent = Math.round((completed / total) * 100);

    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
      <div class="course-card-new glass-card p-4">
        <h5>${course.title}</h5>
        <p>${percent}% Completed</p>
        <a href="courseDetails.html?id=${courseId}" class="btn btn-primary w-100">
          Start Course
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}


// ===============================
// 🚀 INIT
// ===============================
window.addEventListener("DOMContentLoaded", () => {

  // Courses Page
  if (document.getElementById("courseCards")) {
    renderCourseCards();
  }

  // Course Details Page
  if (document.getElementById("curriculum")) {
    const courseId = getCourseFromURL();

    if (courseId && courseData[courseId]) {
      renderCourse(courseId);
      loadLessons(courseId);
    }
  }
  const resetBtn = document.getElementById("resetBtn");

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset all progress?")) {
        localStorage.clear();
        location.reload();
      }
    });
  }

});


// ===============================
// 🎯 COMPLETE LESSON
// ===============================
function completeLesson(courseId, index) {
  let lessons = JSON.parse(localStorage.getItem(courseId + "-lessons")) || [];

  lessons[index] = true;

  localStorage.setItem(courseId + "-lessons", JSON.stringify(lessons));

  updateLessonUI(courseId, index);
  updateProgress(courseId);
}


// ===============================
// 🎨 UPDATE BUTTON UI
// ===============================
function updateLessonUI(courseId, index) {
  const btn = document.getElementById(`${courseId}-lesson-${index}`);

  if (btn) {
    btn.textContent = "Completed";
    btn.classList.add("completed");
    btn.disabled = true;
  }
}


// ===============================
// 📊 UPDATE PROGRESS PANEL
// ===============================
function updateProgress(courseId) {
  let lessons = JSON.parse(localStorage.getItem(courseId + "-lessons")) || [];

  const total = courseData[courseId].lessons.length;
  const completed = lessons.filter(Boolean).length;

  const percent = Math.round((completed / total) * 100);

  // 🔹 Update UI
  const progressEl = document.getElementById("progressPercent");
  if (progressEl) {
    progressEl.textContent = percent + "%";
  }

  const bar = document.getElementById("courseProgressBar");
  if (bar){
    bar.value = 0;

    setTimeout(() => {
      bar.value = percent;
    }, 200);
  }
  // 🔹 Save completed course
  if (percent === 100) {
    let completedCourses = JSON.parse(localStorage.getItem("completedCourses")) || [];

    if (!completedCourses.includes(courseId)) {
      completedCourses.push(courseId);
      localStorage.setItem("completedCourses", JSON.stringify(completedCourses));
    }
  }

  checkFinalAssessment(); 
}

function checkFinalAssessment() {
  const btn = document.getElementById("finalBtn");

  if (!btn) return;

  let completed = JSON.parse(localStorage.getItem("completedCourses")) || [];

  if (completed.length === Object.keys(courseData).length) {
    btn.disabled = false;
    btn.textContent = "Take Final Assessment";

    btn.onclick = () => {
      window.location.href = "quiz.html";
    };

  } else {
    btn.disabled = true;
    btn.textContent = "Complete all courses to unlock";
  }
}

// ===============================
// 🔄 LOAD SAVED LESSON STATE
// ===============================
function loadLessons(courseId) {
  let lessons = JSON.parse(localStorage.getItem(courseId + "-lessons")) || [];

  lessons.forEach((done, index) => {
    if (done) {
      updateLessonUI(courseId, index);
    }
  });

  updateProgress(courseId);
}


// ===============================
// 📈 DASHBOARD PROGRESS
// ===============================
const progress = document.getElementById("overallProgress");
const progressText = document.getElementById("progressText");
const completedList = document.getElementById("completedList");

if (progress) {
  let completed = JSON.parse(localStorage.getItem("completedCourses")) || [];

  let percent = courses.length > 0
    ? Math.round((completed.length / courses.length) * 100)
    : 0;

  document.getElementById("totalCourses").textContent = courses.length;
  document.getElementById("completedCount").textContent = completed.length;
  document.getElementById("progressPercent").textContent = percent + "%";

  progress.value = percent;

  progressText.textContent =
    completed.length === 0
      ? "No courses completed yet"
      : percent + "% Completed";

  completed.forEach(courseId => {
    let li = document.createElement("li");

    const courseName = courseData[courseId]?.title || courseId;

    li.textContent = courseName;
    completedList.appendChild(li);
  });
}


// ===============================
// 🧠 QUIZ RESULT (PROFILE PAGE)
// ===============================
const totalScore = document.getElementById("totalScore");
const progressBar = document.getElementById("quizProgress");
const percentageEl = document.getElementById("percentage");
const gradeEl = document.getElementById("grade");

if (totalScore) {
  const result = JSON.parse(localStorage.getItem("quizResult"));

  if (result) {
    totalScore.textContent = `${result.score} / ${result.total}`;

    if (progressBar) progressBar.value = result.percentage;

    percentageEl.textContent = result.percentage + "%";
    gradeEl.textContent = result.grade;

    if (result.grade === "A") gradeEl.style.color = "green";
    else if (result.grade === "B") gradeEl.style.color = "orange";
    else gradeEl.style.color = "red";

  } else {
    totalScore.textContent = "No quiz taken";
    percentageEl.textContent = "-";
    gradeEl.textContent = "-";
  }
}


// ===============================
// 📜 COMPLETED COURSES (PROFILE)
// ===============================
const profileCourses = document.getElementById("profileCourses");

if (profileCourses) {
  let completed = JSON.parse(localStorage.getItem("completedCourses")) || [];

  profileCourses.innerHTML = "";

  if (completed.length === 0) {
    profileCourses.innerHTML = "<li>No courses completed</li>";
  } else {
    completed.forEach(course => {
      let li = document.createElement("li");
      const courseName = courseData[course]?.title || course;
      li.textContent = courseName;
      profileCourses.appendChild(li);
    });
  }
}

// ===============================
// 📊 PROFILE COMPLETION FIX
// ===============================
const profileCompletion = document.getElementById("progressPercent");

if (profileCompletion) {
  let completed = JSON.parse(localStorage.getItem("completedCourses")) || [];

  let percent = Math.round(
    (completed.length / Object.keys(courseData).length) * 100
  );

  profileCompletion.textContent = percent + "%";
}

// ===============================
// 📊 QUIZ ATTEMPTS
// ===============================
const attemptCount = document.getElementById("attemptCount");
let attempts = JSON.parse(localStorage.getItem("quizAttempts")) || [];

if (attemptCount) {
  attemptCount.textContent = attempts.length;
}

const bestScoreEl = document.getElementById("bestScore");
const attemptHistory = document.getElementById("attemptHistory");

if (attempts.length > 0) {
  let best = Math.max(...attempts.map(a => a.score));

  if (bestScoreEl) bestScoreEl.textContent = best;

  if (attemptHistory) {
    attemptHistory.innerHTML = "";

    attempts.forEach((a, index) => {
      let li = document.createElement("li");
      li.textContent = `Attempt ${index + 1}: ${a.score}/${a.total} (${a.grade})`;
      attemptHistory.appendChild(li);
    });
  }

} else {
  if (bestScoreEl) bestScoreEl.textContent = "-";
}
