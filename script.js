/* Typing Animation */
const roles = ["AEM Developer", "DevOps Engineer", "Adobe AEM Consultant"];
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

// Premium Loader
window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  setTimeout(() => {
    loader.classList.add("hide");
  }, 900);
});


// Chatbot logic
const toggleBtn = document.getElementById("chatbot-toggle");
const chatbotBox = document.getElementById("chatbot-box");
const input = document.getElementById("chatbot-input");
const sendBtn = document.getElementById("chatbot-send");
const messages = document.getElementById("chatbot-messages");

toggleBtn.onclick = () => {
  const isOpen = chatbotBox.classList.toggle("active");
  toggleBtn.textContent = isOpen ? "❌" : "💬";
};


const knowledge = {
  skills: "Aditya is skilled in AEM, Java, Sling, OSGi, Dispatcher, Jenkins, Docker, Kubernetes, React, and Generative AI.",
  experience: "Aditya works at Adobe as a Technical Product Consultant II with 3+ years experience in AEM Cloud, DevOps, performance optimization, and enterprise deployments.",
  projects: "Key projects include AEM On-call Scheduler, Genie Navigator, AEM Instance Hub, and a React Medical Portal.",
  email: "You can reach Aditya at adiusingh127@gmail.com.",
  github: "Aditya's GitHub: https://github.com/AdiSR127/",
  linkedin: "Aditya's LinkedIn: https://www.linkedin.com/in/aditya-s-b29ab0120/"
};

function botReply(text) {
  text = text.toLowerCase();

  if (text.includes("skill")) return knowledge.skills;
  if (text.includes("experience") || text.includes("work")) return knowledge.experience;
  if (text.includes("project")) return knowledge.projects;
  if (text.includes("email") || text.includes("contact")) return knowledge.email;
  if (text.includes("github")) return knowledge.github;
  if (text.includes("linkedin")) return knowledge.linkedin;

  return "You can ask about Aditya's skills, experience, projects, or contact info 🙂";
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

sendBtn.onclick = sendMessage;
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  setTimeout(() => {
    addMessage(botReply(text), "bot");
  }, 400);
}
