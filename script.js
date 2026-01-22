/* Typing Animation */
const roles = ["AEM Developer", "DevOps Engineer", "Adobe Consultant"];
let roleIndex = 0, charIndex = 0;
const typingEl = document.getElementById("typing");

function type() {
  if (charIndex < roles[roleIndex].length) {
    typingEl.textContent += roles[roleIndex][charIndex++];
    setTimeout(type, 80);
  } else {
    setTimeout(erase, 1500);
  }
}

function erase() {
  if (charIndex > 0) {
    typingEl.textContent = roles[roleIndex].substring(0, --charIndex);
    setTimeout(erase, 50);
  } else {
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(type, 300);
  }
}
type();

/* Scroll Reveal */
const reveals = document.querySelectorAll(".reveal");
window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});

/* Scroll Progress */
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const height = document.body.scrollHeight - window.innerHeight;
  document.getElementById("progress-bar").style.width =
    (scrollTop / height) * 100 + "%";
});

/* Active Nav Highlight */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    if (scrollY >= section.offsetTop - 150) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

/* Magnetic Hover */
document.querySelectorAll(".magnetic").forEach(el => {
  el.addEventListener("mousemove", e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.06}px, ${y * 0.06}px)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "translate(0,0)";
  });
});

/* Profile Tilt */
const profile = document.querySelector(".profile-img");
profile.addEventListener("mousemove", e => {
  const rect = profile.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  profile.style.transform =
    `rotateX(${ -y / 15 }deg) rotateY(${ x / 15 }deg)`;
});
profile.addEventListener("mouseleave", () => {
  profile.style.transform = "rotateX(0) rotateY(0)";
});

const scrollHelper = document.getElementById("scroll-helper");
const scrollIcon = document.getElementById("scroll-icon");
const scrollText = document.getElementById("scroll-text");

function updateScrollHelper() {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= docHeight - 10) {
    // Bottom reached
    scrollIcon.textContent = "⬆";
    scrollText.textContent = "Go to top";
    scrollHelper.title = "Go to top";
    scrollIcon.style.animation = "none";
  } else {
    // Default state
    scrollIcon.textContent = "⬇";
    scrollText.textContent = "Scroll down";
    scrollHelper.title = "Scroll down";
    scrollIcon.style.animation = "bounce 1.5s infinite";
  }
}

scrollHelper.addEventListener("click", () => {
  if (scrollIcon.textContent === "⬆") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  }
});

window.addEventListener("scroll", updateScrollHelper);
window.addEventListener("load", updateScrollHelper);
