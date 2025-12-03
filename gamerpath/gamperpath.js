// -----------------------------
// TEXT LINES
// -----------------------------

const lines = [
  "You finish another late shift and start the car.",
  "Same road, same streetlights, same playlist you don’t listen to anymore.",
  "The engine hums. The night feels flat.",
  "Somewhere between two lights… you think:",
  "“Is this all there is now?”",
];

const textContainer = document.getElementById("text-container");
const breathContainer = document.getElementById("breath-container");
const fadeOverlay = document.getElementById("fade-overlay");

let currentLine = 0;

function showNextLine() {
  if (currentLine >= lines.length) {
    fadeOutText();
    return;
  }

  textContainer.textContent = lines[currentLine];
  textContainer.classList.add("line-visible");

  setTimeout(() => {
    textContainer.classList.remove("line-visible");
    textContainer.classList.add("line-hidden");

    setTimeout(() => {
      textContainer.classList.remove("line-hidden");
      currentLine++;
      showNextLine();
    }, 900);
  }, 2400);
}

function fadeOutText() {
  setTimeout(() => {
    textContainer.style.opacity = 0;

    setTimeout(() => {
      startBreathingCircle();
    }, 800);
  }, 300);
}

setTimeout(showNextLine, 1000);

// -----------------------------
// BREATH CIRCLE
// -----------------------------

function startBreathingCircle() {
  breathContainer.classList.remove("hidden");

  const circle = document.getElementById("breath-circle");

  // Create fill element
  const fill = document.createElement("div");
  fill.id = "breath-fill";
  circle.appendChild(fill);

  let holding = false;

  circle.addEventListener("pointerdown", () => {
    holding = true;
    fill.style.height = "100%";

    setTimeout(() => {
      if (holding) triggerFadeOut();
    }, 2600);
  });

  circle.addEventListener("pointerup", () => {
    holding = false;
    fill.style.height = "0%";
  });
}

function triggerFadeOut() {
  fadeOverlay.classList.add("active");

  setTimeout(() => {
    document.getElementById("beat2").scrollIntoView({ behavior: "instant" });
    fadeOverlay.classList.remove("active");
  }, 1200);
}

function startBeat2() {
  const section = document.getElementById("beat2");
  const lines = document.querySelectorAll("#beat2Text .line");
  const textContainer = document.getElementById("beat2Text");
  const hint = document.getElementById("beat2ClickHint");
  const darken = document.getElementById("beat2Darken");

  let clicks = 0;
  let opacityLevel = 0;

  // Fade in the text container
  setTimeout(() => (textContainer.style.opacity = 1), 400);

  // Animate lines one by one
  lines.forEach((line, i) => {
    setTimeout(() => {
      line.style.opacity = 1;

      // when final line appears, show hint
      if (i === lines.length - 1) {
        setTimeout(() => (hint.style.opacity = 1), 1200);
      }
    }, i * 1800); // spacing between lines
  });

  // CLICK TO DARKEN
  section.addEventListener("click", () => {
    clicks++;

    // stronger darkening per click
    opacityLevel += 0.15;
    if (opacityLevel > 1) opacityLevel = 1;

    darken.style.opacity = opacityLevel;

    // once fully black → move to next beat
    if (opacityLevel >= 1) {
      hint.style.opacity = 0;
      textContainer.style.opacity = 0;

      setTimeout(() => {
        section.classList.add("fade-out");

        // After fade-out, activate Beat 3 section
        setTimeout(() => {
          document.getElementById("beat3").classList.add("visible");
          window.scrollTo({
            top: document.getElementById("beat3").offsetTop,
            behavior: "smooth",
          });
        }, 900);
      }, 500);
    }
  });
}
startBeat2();
