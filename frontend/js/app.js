// js/app.js - Enhanced routing, multi-step form, theme toggle, and recommendations

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = "smooth";

document.addEventListener("DOMContentLoaded", () => {
  // Fill current year
  const years = ["year", "year2", "year3", "year4", "year5", "year6"];
  years.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = new Date().getFullYear();
  });

  // Enhanced Theme toggle with smooth transition
  const themeToggleBtns = document.querySelectorAll("#themeToggle");
  themeToggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.body.style.transition =
        "background-color 0.3s ease, color 0.3s ease";
      document.body.classList.toggle("theme-dark");
      document.body.classList.toggle("theme-light");
      btn.textContent = document.body.classList.contains("theme-dark")
        ? "☀️"
        : "🌙";
      localStorage.setItem(
        "theme",
        document.body.classList.contains("theme-dark") ? "dark" : "light"
      );
    });
  });

  // Apply saved theme
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("theme-dark");
    document.body.classList.remove("theme-light");
    themeToggleBtns.forEach((b) => (b.textContent = "☀️"));
  }

  // Multi-step form setup
  const form = document.getElementById("multiStepForm");
  if (form) {
    setupMultiStepForm(form);
  }

  // Populate skill & interest chips with emojis
  const skills = [
    "JavaScript",
    "Python",
    "Data Analysis",
    "UI/UX Design",
    "Machine Learning",
    "Cloud Computing",
    "Communication",
    "Project Management",
    "Networking",
    "Graphic Design",
  ];
  const interests = [
    "Web Development",
    "AI/ML",
    "Systems Design",
    "Product Management",
    "Startups",
    "Mobile Dev",
    "Data Science",
    "Cybersecurity",
    "DevOps",
  ];

  const skillsList = document.getElementById("skillsList");
  const interestsList = document.getElementById("interestsList");

  if (skillsList) {
    skills.forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = s;
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        btn.classList.toggle("active");
      });
      skillsList.appendChild(btn);
    });
  }

  if (interestsList) {
    interests.forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = s;
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        btn.classList.toggle("active");
      });
      interestsList.appendChild(btn);
    });
  }

  // Contact form handler with validation
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.querySelector('input[type="email"]')?.value;
      const message = document.querySelector("textarea")?.value;

      if (!email || !message) {
        alert("Please fill in all fields");
        return;
      }

      // Show success message
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = "✓ Message sent!";
      btn.disabled = true;

      setTimeout(() => {
        contactForm.reset();
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2000);
    });
  }

  // If on result page, render recommendations
  const resultsGrid = document.getElementById("resultsGrid");
  if (resultsGrid) {
    const data = JSON.parse(localStorage.getItem("career_recs") || "null");
    const recs = data || mockRecommendations();
    renderRecommendations(recs);

    // Fill insight cards
    if (recs.length > 0) {
      document.getElementById("topSkill").textContent =
        recs[0]?.requiredSkills?.[0] || "—";
      document.getElementById("topCourse").textContent =
        recs[0]?.suggestedCourse || "—";
      document.getElementById("confidenceScore").textContent =
        Math.round(recs[0]?.score || 78) + "%";
    }
  }

  function mockRecommendations() {
    return [
      {
        "Job Title": "Frontend Developer",
        Company: "Tech Startup",
        Location: "Remote",
        score: 86,
        requiredSkills: ["HTML", "CSS", "JavaScript"],
        suggestedCourse: "Modern JavaScript Bootcamp",
      },
      {
        "Job Title": "Data Analyst",
        Company: "Finance Corp",
        Location: "New York",
        score: 78,
        requiredSkills: ["Python", "SQL", "Excel"],
        suggestedCourse: "Data Analysis Bootcamp",
      },
      {
        "Job Title": "Cloud Engineer",
        Company: "Cloud Provider",
        Location: "San Francisco",
        score: 72,
        requiredSkills: ["Linux", "Kubernetes", "AWS"],
        suggestedCourse: "Cloud Computing Basics",
      },
    ];
  }

  function renderRecommendations(list) {
    const grid = document.getElementById("resultsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    list.forEach((item) => {
      const card = document.createElement("article");
      card.className = "career-card";
      const score = Math.round(item.score || 75);
      card.innerHTML = `
        <div class="match-badge">${score}% Match</div>
        <h3>${item["Job Title"] || item.title || "Job Title"}</h3>
        <p class="muted"><strong>Company:</strong> ${
          item["Company"] || "Not specified"
        }</p>
        <p class="muted"><strong>Location:</strong> ${
          item["Location"] || "Remote"
        }</p>
        <p style="margin-top:12px; font-weight:500; color: var(--primary);">${
          item.suggestedCourse || "Career Path Available"
        }</p>
        <div style="margin-top:16px; display: flex; gap: 8px; flex-wrap: wrap;">
          <a href="details.html" class="button ghost" style="flex: 1;">View Roadmap →</a>
          <button class="button" onclick="saveAndOpen('${(
            item["Job Title"] ||
            item.title ||
            ""
          ).replace(/'/g, "\\'")}')">💾 Save</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Helper for saving selected career
  window.saveAndOpen = function (title) {
    localStorage.setItem("selectedCareer", title);
    const btn = event.target;
    btn.textContent = "✓ Saved!";
    setTimeout(() => {
      location.href = "details.html";
    }, 500);
  };

  // If on details page, fill with selected career
  const careerTitle = document.getElementById("careerTitle");
  if (careerTitle) {
    const sel = localStorage.getItem("selectedCareer") || "Frontend Developer";
    careerTitle.textContent = sel;

    const map = {
      "Frontend Developer": {
        desc: "Build responsive user interfaces using HTML, CSS, and JavaScript. Work with design teams and modern frameworks like React or Vue.",
        skills: ["HTML/CSS", "JavaScript", "React/Vue"],
        roadmap: [
          "🎯 HTML & CSS Fundamentals",
          "⚙️ JavaScript & DOM Manipulation",
          "📱 React/Vue Basics",
          "🚀 Build 5+ Projects & Portfolio",
        ],
        courses: [
          "Intro to Web Development",
          "Advanced JavaScript Bootcamp",
          "React Masterclass",
        ],
      },
      "Data Analyst": {
        desc: "Transform raw data into actionable insights. Build dashboards, perform statistical analysis, and support data-driven decisions.",
        skills: ["Python", "SQL", "Excel/Tableau"],
        roadmap: [
          "📊 Statistics & Data Analysis Fundamentals",
          "🗄️ SQL & Databases",
          "🐍 Python for Data Science",
          "📈 Data Visualization & Dashboards",
        ],
        courses: [
          "Statistics Bootcamp",
          "SQL Masterclass",
          "Tableau Dashboard Design",
        ],
      },
      "Cloud Engineer": {
        desc: "Design, deploy, and manage cloud infrastructure. Work with AWS, Azure, or Google Cloud to build scalable systems.",
        skills: ["AWS/Azure", "Kubernetes", "Infrastructure as Code"],
        roadmap: [
          "☁️ Cloud Fundamentals",
          "🔐 Security & Networking",
          "⚡ Containerization & Kubernetes",
          "🏗️ Infrastructure as Code (Terraform/Ansible)",
        ],
        courses: [
          "AWS Solutions Architect",
          "Kubernetes Deep Dive",
          "Infrastructure Automation",
        ],
      },
    };

    const info = map[sel] || map["Frontend Developer"];
    document.getElementById("careerDescription").textContent = info.desc;

    const skillsEl = document.getElementById("requiredSkills");
    skillsEl.innerHTML = "";
    info.skills.forEach((s) => (skillsEl.innerHTML += `<li>✓ ${s}</li>`));

    const road = document.getElementById("roadmapList");
    road.innerHTML = "";
    info.roadmap.forEach((r) => (road.innerHTML += `<li>${r}</li>`));

    const courses = document.getElementById("coursesList");
    courses.innerHTML = "";
    info.courses.forEach(
      (c) =>
        (courses.innerHTML += `<li><a href="#" class="back-link">📚 ${c}</a></li>`)
    );
  }
});

// Multi-step form implementation with enhanced UX
function setupMultiStepForm(form) {
  const steps = Array.from(form.querySelectorAll(".step"));
  let current = 0;
  const progressBar = document.getElementById("progressBar");

  function showStep(i) {
    steps.forEach((s) => s.classList.remove("active"));
    steps[i].classList.add("active");
    const pct = Math.round(((i + 1) / steps.length) * 100);
    if (progressBar) progressBar.style.width = pct + "%";

    // Scroll to top of form
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  showStep(current);

  // Next/Previous button handlers
  form.addEventListener("click", (e) => {
    if (e.target.matches("[data-next]")) {
      if (current < steps.length - 1) {
        current++;
        showStep(current);
      }
    } else if (e.target.matches("[data-prev]")) {
      if (current > 0) {
        current--;
        showStep(current);
      }
    }
  });

  // Form submission - send to Flask backend
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value || "User";
    const education = document.getElementById("education")?.value || "";
    const skills = Array.from(
      document.querySelectorAll("#skillsList .chip.active")
    ).map((n) => n.textContent);
    const interests = Array.from(
      document.querySelectorAll("#interestsList .chip.active")
    ).map((n) => n.textContent);
    const prefRemote = document.getElementById("prefRemote")?.checked || false;
    const prefFullTime =
      document.getElementById("prefFullTime")?.checked || false;

    if (skills.length === 0) {
      alert("Please select at least one skill");
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "⏳ Finding your matches...";
    submitBtn.disabled = true;

    // Send to Flask backend
    fetch("http://127.0.0.1:5000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skill: skills.join(", "),
        preferences: {
          location: "",
          experience_level: education,
          remote: prefRemote,
        },
        top_n: 10,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((recs) => {
        if (!Array.isArray(recs) || recs.length === 0) {
          throw new Error("No recommendations received");
        }
        localStorage.setItem("career_recs", JSON.stringify(recs));
        location.href = "result.html";
      })
      .catch((err) => {
        console.error("Error:", err);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        alert(
          "Unable to connect to the recommendation engine. Make sure the Python server is running on http://127.0.0.1:5000"
        );
      });
  });
}

function runMockModel(data) {
  // Simple heuristic mock: score based on count of matching skills
  const careersDB = [
    {
      title: "Frontend Developer",
      skills: ["JavaScript", "HTML", "CSS", "UI/UX"],
      course: "Modern JS from zero",
    },
    {
      title: "Data Analyst",
      skills: ["Python", "Data Analysis", "SQL", "Excel"],
      course: "Data Analysis Bootcamp",
    },
    {
      title: "Machine Learning Engineer",
      skills: ["Python", "Machine Learning", "Data Analysis"],
      course: "Intro ML",
    },
    {
      title: "Cloud Engineer",
      skills: ["Cloud", "Linux", "Networking"],
      course: "Intro to Cloud",
    },
    {
      title: "Product Manager",
      skills: ["Communication", "Project Management", "Design"],
      course: "Product Fundamentals",
    },
  ];
  const userSkills = new Set(data.skills || []);
  const recs = careersDB
    .map((c) => {
      const matchCount = c.skills.filter((s) => userSkills.has(s)).length;
      const base = 50 + matchCount * 12; // heuristic
      return {
        title: c.title,
        score: Math.min(95, base),
        requiredSkills: c.skills.slice(0, 3),
        suggestedCourse: c.course,
      };
    })
    .sort((a, b) => b.score - a.score);
  return recs;
}
