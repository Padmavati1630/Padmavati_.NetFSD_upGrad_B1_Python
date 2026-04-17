let isLogin = true;

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const submitBtn = document.getElementById("submitBtn");
const toggleLink = document.getElementById("toggleLink");
const toggleText = document.getElementById("toggleText");
const formTitle = document.getElementById("formTitle");

// 🔄 TOGGLE LOGIN / REGISTER
toggleLink.onclick = () => {
  isLogin = !isLogin;

  if (isLogin) {
    formTitle.textContent = "Login";
    submitBtn.textContent = "Login";
    toggleText.textContent = "Don't have an account?";
    toggleLink.textContent = "Register";
    nameInput.style.display = "none";
  } else {
    formTitle.textContent = "Register";
    submitBtn.textContent = "Register";
    toggleText.textContent = "Already have an account?";
    toggleLink.textContent = "Login";
    nameInput.style.display = "block";
  }
};

// 🚀 SUBMIT BUTTON
submitBtn.onclick = () => {

  const email = emailInput.value;
  const password = passwordInput.value;

  if (isLogin) {
    // 🔐 LOGIN
    fetch("http://localhost:5174/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        passwordHash: password
      })
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(user => {
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "index.html";
    })
    .catch(() => alert("Invalid credentials"));

  } else {
    // 📝 REGISTER
    const fullName = nameInput.value;

    fetch("http://localhost:5174/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName: fullName,
        email: email,
        passwordHash: password
      })
    })
    .then(res => res.json())
    .then(() => {
      alert("Registration successful! Please login.");

      // switch back to login
      toggleLink.click();
    })
    .catch(() => alert("Registration failed"));
  }
};
