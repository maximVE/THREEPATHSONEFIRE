window.addEventListener("load", () => {
  const overlay = document.getElementById("fade-overlay");
  if (overlay)
    setTimeout(() => {
      overlay.style.opacity = 0;
    }, 500);
});

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. SEED DATA (Real Human Reflections) ---
  // These are "prefabricated" but feel real and personal.
  const seeds = {
    drifter: [
      "I spent my 20s chasing 'experiences' for Instagram, but I don't remember how any of them actually felt.",
      "I keep starting new projects because I'm terrified of finishing one and failing.",
      "Freedom isn't running away. It's staying still without panicking.",
      "I thought I was exploring the world, but I was just avoiding myself.",
      "The silence in the woods was the first time my brain stopped buzzing in years.",
    ],
    settler: [
      "I stayed in this job for 10 years because it was safe. Now I realize safe is just another word for stuck.",
      "I curate my life to look perfect online, but I feel empty when I put the phone down.",
      "I realized I was waiting for permission to be happy. No one is going to give it to me.",
      "Routine is comfortable, but it isn't living. I'm taking the art class.",
      "I worry so much about the future that I've missed the last five years of today.",
    ],
    keeper: [
      "I answer emails at 11 PM because I need them to like me. I'm exhausted.",
      "I feel guilty when I put my phone on Do Not Disturb. That's messed up.",
      "I fix everyone else's problems so I don't have to look at my own.",
      "Burnout isn't a badge of honor. It's just burnout.",
      "I realized today that I am allowed to say no.",
    ],
  };

  // --- 2. LOAD DATA ---
  function loadReflections(role) {
    // Retrieve persistent data for this browser
    const saved = JSON.parse(localStorage.getItem("reflections_" + role)) || [];
    // Combine User Data + Seed Data
    return [...saved, ...seeds[role]];
  }

  // --- 3. RENDER COLUMNS ---
  function renderColumn(role, elementId) {
    const container = document.getElementById(elementId);
    const data = loadReflections(role);

    container.innerHTML = ""; // Clear existing

    data.forEach((text) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerText = `"${text}"`;
      container.appendChild(card);
    });
  }

  // Initial Render of all 3 columns
  renderColumn("drifter", "feed-drifter");
  renderColumn("settler", "feed-settler");
  renderColumn("keeper", "feed-keeper");

  // --- 4. INTERACTION LOGIC ---
  const inputOverlay = document.getElementById("input-overlay");
  const textArea = document.getElementById("user-input");
  const modal = document.getElementById("role-selection-modal");
  let currentText = "";

  // DISCARD -> Just view the board
  document.getElementById("btn-discard").addEventListener("click", () => {
    inputOverlay.style.opacity = 0;
    setTimeout(() => inputOverlay.classList.add("hidden"), 800);
  });

  // POST -> Open Role Selection
  document.getElementById("btn-post").addEventListener("click", () => {
    currentText = textArea.value.trim();
    if (!currentText) {
      alert("Please write a reflection first.");
      return;
    }
    modal.classList.remove("hidden");
    modal.style.opacity = 1;
  });

  // ROLE SELECTION -> Save & Reveal Board
  document.querySelectorAll(".role-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const selectedRole = e.target.getAttribute("data-role");

      // 1. Save to LocalStorage (Persist for next user)
      const saved =
        JSON.parse(localStorage.getItem("reflections_" + selectedRole)) || [];
      saved.unshift(currentText); // Add to top
      localStorage.setItem(
        "reflections_" + selectedRole,
        JSON.stringify(saved)
      );

      // 2. Re-render that column
      renderColumn(selectedRole, "feed-" + selectedRole);

      // 3. Highlight the new card visually
      const col = document.getElementById("feed-" + selectedRole);
      if (col.firstChild) {
        col.firstChild.classList.add("new");
      }

      // 4. Hide Modal & Input Overlay
      modal.classList.add("hidden");
      inputOverlay.style.opacity = 0;
      setTimeout(() => inputOverlay.classList.add("hidden"), 800);
    });
  });

  // HOME BUTTON
  document.getElementById("btn-home").addEventListener("click", () => {
    document.getElementById("fade-overlay").style.opacity = 1;
    setTimeout(() => {
      // Adjust this path if your index is in a different folder
      window.location.href = "../index.html";
    }, 1500);
  });
});
