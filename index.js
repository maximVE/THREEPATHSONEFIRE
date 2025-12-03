const beginBtn = document.getElementById("beginBtn");
const storyRoot = document.getElementById("story-root");

if (beginBtn && storyRoot) {
  beginBtn.addEventListener("click", () => {
    storyRoot.scrollIntoView({ behavior: "smooth" });
  });
}

// Smooth scrolling helper
function smoothScrollTo(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// FIRST BUTTON: Landing → Info Section
document.getElementById("beginBtn").addEventListener("click", () => {
  const info = document.getElementById("info-section");
  info.classList.add("visible");

  smoothScrollTo("info-section");
});

// SECOND BUTTON: Info Section → Story Start (with fade)
document.getElementById("startStoryBtn").addEventListener("click", () => {
  const infoContent = document.getElementById("infoContent");
  const infoTransition = document.getElementById("infoTransition");
  const countdownEl = document.getElementById("countdown");
  const typingText = document.getElementById("typingText");
  const fadeOverlay = document.getElementById("fade-overlay"); // 🔥 NEW

  // Hide original content
  infoContent.style.opacity = "0";
  setTimeout(() => {
    infoContent.classList.add("hidden");
    infoTransition.classList.remove("hidden");

    // Fade in transition area
    setTimeout(() => infoTransition.classList.add("visible"), 100);

    // Start countdown
    let timeLeft = 10;
    countdownEl.textContent = timeLeft;

    const countdownInterval = setInterval(() => {
      timeLeft--;
      countdownEl.textContent = timeLeft;

      // When countdown ends → fade to black THEN go to story root
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);

        // 🔥 Black fade begins
        fadeOverlay.classList.add("active");

        // After fade is fully black → jump to story
        setTimeout(() => {
          smoothScrollTo("story-root");

          // Fade back out to reveal the story
          setTimeout(() => {
            fadeOverlay.classList.remove("active");
          }, 800);
        }, 900);
      }
    }, 1000);

    // Typing text effect
    const message =
      "Take a breath. Let everything else fall away for a moment. Your story begins shortly...";
    let index = 0;

    function typeNext() {
      if (index < message.length) {
        typingText.textContent += message[index];
        index++;
        typingText.style.opacity = 1;
        setTimeout(typeNext, 45);
      }
    }

    setTimeout(typeNext, 400); // Start typing after slight delay
  }, 450);
});

document.querySelectorAll(".story-card").forEach((card) => {
  card.addEventListener("click", () => {
    const target = card.getAttribute("data-target");
    if (target) {
      window.location.href = target;
    }
  });
});
