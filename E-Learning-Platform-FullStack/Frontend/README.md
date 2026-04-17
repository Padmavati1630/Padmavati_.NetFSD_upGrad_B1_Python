# Multi-Page E-Learning Platform

## Project Description

This is a **frontend multi-page e-learning web application** built using **HTML, CSS, Bootstrap, and JavaScript**.

The platform allows users to explore courses, attempt quizzes, track their learning progress, and view performance — all without a backend server.

The application uses **LocalStorage** to persist user data and simulates **asynchronous data loading** to provide a dynamic user experience.

Added backend implementation and updated frontend for full-stack integration

---

## Features

### Dashboard

* Displays total courses, completed courses, and progress percentage
* Visual progress bar using `<progress>`
* Completed courses list
* Reset progress functionality

---

### Courses Page

* Course list displayed in table format
* Dynamic course cards
* Loading spinner (async simulation)

---

### Course Details

* Structured lessons using ordered lists
* Mark lessons as completed
* Progress tracking per course

---

### Quiz System

* Dynamically generated quiz questions
* Asynchronous loading using `Promise`, `async/await`, `setTimeout()`
* Countdown timer with auto-submit
* Prevents double submission
* Displays:

  * Score
  * Grade
  * Feedback
  * Answer review
* Confetti animation for high performance 🎉

---

### Profile Page

* Best score tracking
* Attempt history
* Completed courses display
* Overall progress summary

---

## Technologies Used

* HTML5 (Semantic structure)
* CSS3 (Grid, Flexbox, Media Queries)
* Bootstrap 5
* JavaScript (ES6+)
* LocalStorage (Web Storage API)
* Jest (Unit Testing)

---

## Concepts Implemented

* Arrays & Objects
* DOM Manipulation
* Event Handling
* Control Flow (`if-else`, `switch`)
* Asynchronous JavaScript
* State Management using LocalStorage

---

## Testing

Jest test cases implemented for:

* Grade calculation
* Percentage calculation
* Pass/Fail logic

---

## Project Structure

```
project/
│
├── index.html
├── courses.html
├── courseDetails.html
├── quiz.html
├── profile.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── main.js
│   ├── quiz.js
│   └── data.js
│
└── tests/
    └── grade.test.js
```

---

## How to Run

1. Download or clone the repository
2. Open `login.html` in browser
3. Navigate using navbar

---

## Future Improvements

* Dark mode
* Certificate download feature
* Backend integration
* Leaderboard system

---

## Author

Padmavati M Shivanagutti



