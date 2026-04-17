//main.js
const user = JSON.parse(localStorage.getItem("user"));

if (!user && !window.location.pathname.includes("login.html")) {
  window.location.href = "login.html";
}
if (user) {
  const navName = document.getElementById("userName");
  if (navName) navName.textContent = user.fullName;

  const profileName = document.getElementById("profileName");
  if (profileName) profileName.textContent = user.fullName;
}

// COURSE TABLE (Courses Page)

const tableBody = document.getElementById("courseTable");

if (tableBody) {
  fetch("http://localhost:5174/api/courses")
    .then(res => res.json())
    .then(courses => {
      console.log("COURSES DATA:", courses);
      tableBody.innerHTML = "";

      courses.forEach(async (course) => {

        const row = document.createElement("tr");

        // ✅ fetch lessons dynamically
        const lessons = await fetch(`http://localhost:5174/api/courses/${course.id}/lessons`)
          .then(res => res.json());

        const modules = `${lessons.length} Modules`;

        row.innerHTML = `
          <td>${course.name}</td>
          <td>${modules}</td>
        `;

        row.onclick = () => {
          window.location.href = `courseDetails.html?id=${course.id}`;
        };

        tableBody.appendChild(row);
      });
    });
}


// COURSE CARD DATA

/* const courseData = {
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

// RENDER COURSE DETAILS

function renderCourse(courseId) {
  const course = courseData[courseId];

  if (!course) return;

  document.getElementById("courseTitle").textContent = course.name;
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
} */

// GET COURSE FROM URL

function getCourseFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// RENDER COURSE CARDS

async function renderCourseCards() {

  const loader = document.getElementById("courseLoader");
  const container = document.getElementById("courseCards");

  if (!container) return;

  loader.style.display = "block";
  container.style.display = "none";

  try {
    const courses = await fetch("http://localhost:5174/api/courses")
      .then(res => res.json());

    localStorage.setItem("totalCourses", courses.length);

    container.innerHTML = "";

    for (let course of courses) {

      const lessons = await fetch(`http://localhost:5174/api/courses/${course.id}/lessons`)
        .then(res => res.json());

      const totalLessons = lessons.length;

      const key = `course-${course.id}-lessons`;
      const completedLessons =
        JSON.parse(localStorage.getItem(key)) || {};

      const completedCount = Object.keys(completedLessons).length;

      const isCompleted =
        completedCount === totalLessons && totalLessons > 0;

      const card = document.createElement("div");
      card.className = "col-md-4";

      card.innerHTML = `
        <div class="course-card-new glass-card p-4 h-100 d-flex flex-column justify-content-between">
          
          <div>
            <h5>${course.name}</h5>
            <p>${totalLessons} Modules</p>
          </div>

          <button class="btn w-100 ${isCompleted ? "btn-success" : "btn-primary"}" disabled>
            ${isCompleted ? "Completed" : "Start Course"}
          </button>

        </div>
      `;

      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        window.location.href = `courseDetails.html?id=${course.id}`;
      });

      container.appendChild(card);
    }

  } catch (err) {
    console.error("Error loading courses:", err);
    container.innerHTML = "<p class='text-danger'>Failed to load courses</p>";
  }

  loader.style.display = "none";
  container.style.display = "flex";
}

// Profile 
async function loadProfile() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch(`http://localhost:5174/api/results/${user.userId}`);
    const results = await res.json();

    console.log("Results:", results);

    const attemptEl = document.getElementById("attemptCount");
    const bestEl = document.getElementById("bestScore");
    const completionEl = document.getElementById("completion");
    const history = document.getElementById("attemptHistory");

    if (!attemptEl) return;

    attemptEl.textContent = results.length;

    if (!results.length) {
      bestEl.textContent = "-";
      completionEl.textContent = "0%";
      history.innerHTML = "<li>No attempts yet</li>";
      return;
    }

    const best = Math.max(...results.map(r => r.score));
    bestEl.textContent = best;

    const total = results[0]?.totalQuestions ?? 10;
    const percentage = Math.round((best / total) * 100);
    completionEl.textContent = percentage + "%";

    history.innerHTML = "";
    results
      .slice(-5)     // last 5
      .reverse()     // newest first
      .forEach((r, i) => {
      const li = document.createElement("li");
      li.textContent = `Attempt ${i + 1}: ${r.score}/${r.total || 10}`;
      history.appendChild(li);
    });

  } catch (err) {
    console.error("Profile load error:", err);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("bestScore")) {
    loadProfile();
  }

  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    const nameEl = document.getElementById("userName");
    if (nameEl) {
      nameEl.textContent = user.fullName;
    }
  }
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem("user");
      window.location.href = "login.html";
    };
  }

  // Courses Page
  if (document.getElementById("courseCards")) {
    setTimeout(() => {
      renderCourseCards();
    }, 0);
  }

  if (document.getElementById("finalBtn")) {
    checkFinalAssessment();
  }

  // Course Details Page
  if (document.getElementById("curriculum")) {
    const courseId =  Number(getCourseFromURL());

    if (courseId) {
      fetch(`http://localhost:5174/api/courses/${courseId}`)
        .then(res => res.json())
        .then(course => {
          document.getElementById("courseTitle").textContent = course.name;
          document.getElementById("courseDesc").textContent = course.description;
      });

      fetch(`http://localhost:5174/api/courses/${courseId}/lessons`)
        .then(res => res.json())
        .then(lessons => {
          const container = document.getElementById("curriculum");
          container.innerHTML = "";

          const key = `course-${courseId}-lessons`;

          //  MOVE THIS OUTSIDE LOOP
          let completedLessons =
            JSON.parse(localStorage.getItem(key)) || {};

          console.log("LESSONS:", lessons);
          console.log("STORED:", completedLessons);

          lessons.forEach((lesson, index) => {

            const div = document.createElement("div");
            div.className = "lesson";

            const lessonKey = lesson.lessonId || lesson.id;
            const isDone = completedLessons[lessonKey] === true;

            div.innerHTML = `
              <span>${index + 1}. ${lesson.title}</span>
              <button class="${isDone ? "completed" : ""}">
                ${isDone ? "Done" : "Mark Done"}
              </button>
            `;

            const btn = div.querySelector("button");

            btn.addEventListener("click", () => {

              //  update SAME object
              completedLessons[lessonKey] = true;

              //  save once
              localStorage.setItem(key, JSON.stringify(completedLessons));

              btn.textContent = "Done";
              btn.classList.add("completed");

              updateProgress(courseId, lessons.length);
            });

            container.appendChild(div);
          });
          updateProgress(courseId, lessons.length);
        });
    }
    // LOGOUT BUTTON
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
      logoutBtn.onclick = () => {
        localStorage.removeItem("user");
        window.location.href = "login.html";
      };
    }
  }
  const resetAllBtn = document.getElementById("resetAll");

  if (resetAllBtn) {
    resetAllBtn.addEventListener("click", async () => {

      if (!confirm("Are you sure you want to reset all progress?")) return;

      try {
        // 1. Clear backend quiz attempts
        const user = JSON.parse(localStorage.getItem("user"));

        await fetch(`http://localhost:5174/api/results/${user.userId}`, {
          method: "DELETE"
        });

        // 2. Clear ALL frontend progress
        localStorage.clear();

        // 3. Reload clean state
        alert("All progress has been reset!");
        window.location.href = "index.html";

      } catch (err) {
        console.error("Reset failed:", err);
        alert("Something went wrong while resetting.");
      }
    });
  }

});

// COMPLETE LESSON

/* function completeLesson(courseId, index) {
  let lessons = JSON.parse(localStorage.getItem(courseId + "-lessons")) || [];

  lessons[index] = true;

  localStorage.setItem(courseId + "-lessons", JSON.stringify(lessons));

  updateLessonUI(courseId, index);
  updateProgress(courseId);
} */

// UPDATE BUTTON UI

/* function updateLessonUI(courseId, index) {
  const btn = document.getElementById(`${courseId}-lesson-${index}`);

  if (btn) {
    btn.textContent = "Completed";
    btn.classList.add("completed");
    btn.disabled = true;
  }
} */

// UPDATE PROGRESS PANEL

function updateProgress(courseId, totalLessons) {

  const key = `course-${courseId}-lessons`;

  const completedLessons =
    JSON.parse(localStorage.getItem(key)) || {};

  const doneCount = Object.values(completedLessons)
    .filter(v => v === true).length;

  const percent = totalLessons === 0
    ? 0
    : Math.min(100, Math.floor((doneCount / totalLessons) * 100));

  document.getElementById("progressPercent").textContent = percent + "%";
  document.getElementById("courseProgressBar").value = percent;

  // NEW: mark course as completed
  if (percent === 100) {
    let completedCourses =
      JSON.parse(localStorage.getItem("completedCourses")) || [];

    if (!completedCourses.includes(courseId)) {
      completedCourses.push(courseId);
      localStorage.setItem("completedCourses", JSON.stringify(completedCourses));
    }
  }

  checkFinalAssessment();
}

function checkFinalAssessment() {
  const btn = document.getElementById("finalBtn");

  // ONLY run on courseDetails page
  if (!btn) return;

  const params = new URLSearchParams(window.location.search);
  const courseId = Number(params.get("id"));

  if (!courseId) return; // safety

  const completedCourses =
    JSON.parse(localStorage.getItem("completedCourses")) || [];

  if (completedCourses.includes(courseId)) {
    btn.disabled = false;
    btn.textContent = "Take Quiz";

    btn.onclick = () => {
      window.location.href = `quiz.html?courseId=${courseId}`;
    };
  } else {
    btn.disabled = true;
    btn.textContent = "Complete course to unlock quiz";
  }
}

// LOAD SAVED LESSON STATE

/* function loadLessons(courseId) {
  let lessons = JSON.parse(localStorage.getItem(courseId + "-lessons")) || [];

  lessons.forEach((done, index) => {
    if (done) {
      updateLessonUI(courseId, index);
    }
  });

  updateProgress(courseId, lessons.length);
} */

// DASHBOARD PROGRESS

const progress = document.getElementById("overallProgress");
const progressText = document.getElementById("progressText");
const completedList = document.getElementById("completedList");

if (progress) {

  const completed = JSON.parse(localStorage.getItem("completedCourses")) || [];
  const totalCourses = Number(localStorage.getItem("totalCourses")) || 0;

  const percent = totalCourses > 0
    ? Math.round((completed.length / totalCourses) * 100)
    : 0;

  document.getElementById("totalCourses").textContent = totalCourses;
  document.getElementById("completedCount").textContent = completed.length;
  document.getElementById("progressPercent").textContent = percent + "%";

  progress.value = percent;

  progressText.textContent =
    completed.length === 0
      ? "No courses completed yet"
      : percent + "% Completed";

  completedList.innerHTML = "";

  completed.forEach(courseId => {

    fetch(`http://localhost:5174/api/courses/${courseId}`)
      .then(res => res.json())
      .then(course => {

        const li = document.createElement("li");
        li.textContent = course.name; // ✅ real course name
        completedList.appendChild(li);

      });

  });
}


// QUIZ RESULT (PROFILE PAGE)

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

// COMPLETED COURSES (PROFILE)

const profileCourses = document.getElementById("profileCourses");

if (profileCourses) {
  let completed = JSON.parse(localStorage.getItem("completedCourses")) || [];

  profileCourses.innerHTML = "";

  if (completed.length === 0) {
    profileCourses.innerHTML = "<li>No courses completed</li>";
  } else {
    completed.forEach(courseId => {
      fetch(`http://localhost:5174/api/courses/${courseId}`)
        .then(res => res.json())
        .then(course => {

          const li = document.createElement("li");
          li.textContent = course.name;
          profileCourses.appendChild(li);

        });

    });
  }
}

// PROFILE COMPLETION FIX

const profileCompletion = document.getElementById("progressPercent");

if (profileCompletion) {
  let completed = JSON.parse(localStorage.getItem("completedCourses")) || [];

  const totalCourses = Number(localStorage.getItem("totalCourses")) || 0;

  let percent = totalCourses > 0
    ? Math.round((completed.length / totalCourses) * 100)
    : 0;

  profileCompletion.textContent = percent + "%";
}

