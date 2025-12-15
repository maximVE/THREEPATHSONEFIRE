document.addEventListener("DOMContentLoaded", () => {
  const beginBtn = document.getElementById("beginBtn");
  const infoSection = document.getElementById("info-section");
  const startStoryBtn = document.getElementById("startStoryBtn");
  const fadeOverlay = document.getElementById("fade-overlay");

  const loreContinueBtn = document.getElementById("loreContinueBtn");
  const loreContinueContainer = document.getElementById(
    "loreContinueContainer"
  );

  // --- AUDIO HELPER ---
  function playBackgroundAudio() {
    const audio = document.getElementById("bg-music");
    if (audio) {
      audio.volume = 0.4; // Set reasonable volume
      audio
        .play()
        .catch((e) => console.log("Audio waiting for interaction..."));
    }
  }

  // --- FADE OUT AUDIO (Optional, for when leaving page) ---
  function fadeOutAudio() {
    const audio = document.getElementById("bg-music");
    if (audio) {
      let fadePoint = audio.volume;
      const fadeInterval = setInterval(() => {
        if (fadePoint > 0.05) {
          fadePoint -= 0.05;
          audio.volume = fadePoint;
        } else {
          audio.volume = 0;
          audio.pause();
          clearInterval(fadeInterval);
        }
      }, 100);
    }
  }

  function smoothScrollTo(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  }

  /* 1. LANDING → INFO SECTION */
  if (beginBtn && infoSection) {
    beginBtn.addEventListener("click", () => {
      // 🔊 START AUDIO HERE (First Interaction)
      playBackgroundAudio();

      infoSection.classList.add("visible");
      smoothScrollTo("info-section");
    });
  }

  /* 2. INFO → LORE SECTION (Via Countdown) */
  if (startStoryBtn) {
    startStoryBtn.addEventListener("click", () => {
      // Backup audio start (in case they missed the first button somehow)
      playBackgroundAudio();

      const infoContent = document.getElementById("infoContent");
      const infoTransition = document.getElementById("infoTransition");
      const countdownEl = document.getElementById("countdown");
      const typingText = document.getElementById("typingText");

      infoContent.style.opacity = "0";

      setTimeout(() => {
        infoContent.classList.add("hidden");
        infoTransition.classList.remove("hidden");
        setTimeout(() => infoTransition.classList.add("visible"), 50);

        let timeLeft = 10;
        countdownEl.textContent = timeLeft;

        const countdownInterval = setInterval(() => {
          timeLeft--;
          countdownEl.textContent = timeLeft;

          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            fadeOverlay.classList.add("active");

            setTimeout(() => {
              smoothScrollTo("story-root");
              // Wait for scroll + black fade, then reveal Lore
              setTimeout(() => {
                fadeOverlay.classList.remove("active");
                startLoreSequence();
              }, 800);
            }, 900);
          }
        }, 1000);

        // Typing text during countdown
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
        setTimeout(typeNext, 400);
      }, 450);
    });
  }

  /* 3. LORE SEQUENCE */
  function startLoreSequence() {
    const loreSection = document.getElementById("lore-section");
    const loreLines = Array.from(document.querySelectorAll(".lore-line"));

    loreSection.classList.remove("hidden");
    loreSection.classList.add("visible");

    loreLines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add("visible");

        // If last line, show button
        if (index === loreLines.length - 1) {
          setTimeout(() => {
            if (loreContinueContainer) {
              loreContinueContainer.classList.remove("hidden");
              setTimeout(() => {
                loreContinueContainer.style.opacity = 1;
              }, 50);
            }
          }, 1500);
        }
      }, index * 2000);
    });
  }

  /* 4. CONTINUE → INTRO (Choices + Subtitles) */
  if (loreContinueBtn) {
    loreContinueBtn.addEventListener("click", () => {
      fadeOverlay.classList.add("active");
      setTimeout(() => {
        document
          .getElementById("intro-section")
          .scrollIntoView({ behavior: "smooth" });

        setTimeout(() => {
          fadeOverlay.classList.remove("active");
          startIntroSequence();
        }, 800);
      }, 900);
    });
  }

  /* 5. INTRO SUBTITLES */
  async function startIntroSequence() {
    const subText = document.getElementById("subtitleText");
    const lines = [
      "Tonight isn’t about fixing your whole life.",
      "It’s just a small pause between who you’ve been and who you might become.",
      "As you sit with yourself for a moment, notice what feels the loudest inside.",
      "When you’re honest about what you need in this moment, one path will open.",
    ];

    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    for (let i = 0; i < lines.length; i++) {
      subText.innerText = lines[i];
      subText.style.opacity = 1;

      // Read time
      await wait(3500);

      // Fade out (unless last one, optional)
      if (i < lines.length - 1) {
        subText.style.opacity = 0;
        await wait(600);
      } else {
        // Keep last line or fade it? Let's fade it to clear screen for choice focus
        subText.style.opacity = 0;
      }
    }
  }

  /* 6. NAVIGATION */
  document.querySelectorAll(".choice-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      if (!target) return;

      // 🔊 FADE OUT MUSIC before leaving
      fadeOutAudio();

      fadeOverlay.classList.add("active");
      setTimeout(() => {
        window.location.href = target;
      }, 700);
    });
  });
});
