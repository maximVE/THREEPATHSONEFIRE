// --- SAFETY NET: IMMEDIATE FADE OUT ---
window.addEventListener("load", () => {
  const overlay = document.getElementById("fade-overlay");
  if (overlay) {
    setTimeout(() => {
      overlay.style.opacity = 0;
    }, 500);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // --- STRICT VIDEO MANAGER ---
  function stopAllVideos() {
    document.querySelectorAll("video").forEach((vid) => vid.pause());
  }
  function playVideoIn(section) {
    const vid = section.querySelector("video");
    if (vid) {
      vid.currentTime = 0;
      vid.play().catch((e) => console.log("Play error:", e));
    }
  }
  function pauseVideoIn(section) {
    const vid = section.querySelector("video");
    if (vid) vid.pause();
  }

  // --- TYPING EFFECT ---
  async function typeText(element, text, speed = 45) {
    if (!element) return;
    element.innerHTML = "";
    element.style.opacity = 1;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;
    const plainText = tempDiv.innerText;
    for (let i = 0; i < plainText.length; i++) {
      element.textContent += plainText.charAt(i);
      await wait(speed);
    }
    element.innerHTML = text;
  }

  // --- START ---
  async function startExperience() {
    try {
      stopAllVideos();

      // --- START AUDIO ---
      const audio = document.getElementById("bg-music");
      if (audio) {
        audio.volume = 0.4; // Set volume level (0.0 to 1.0)
        audio
          .play()
          .catch((e) => console.log("Audio waiting for interaction..."));
      }
      await wait(500);
      const overlay = document.getElementById("fade-overlay");
      if (overlay) overlay.style.opacity = 0;
      await runBeat1();
    } catch (e) {
      console.error("Error:", e);
    }
  }

  // --- BEAT 1 (Shop) ---
  async function runBeat1() {
    const section = document.getElementById("beat1");
    if (!section) return;
    playVideoIn(section);
    section.classList.add("active-section");
    section.style.opacity = 1;
    const textContainer = document.getElementById("beat1Text");
    const latchArea = document.getElementById("latchInteraction");
    const latchVisual = document.getElementById("latch-visual");

    const lines = [
      "You turn off the shop lights one by one.",
      "The silence that follows feels heavier than the tools you handled all day.",
      "Lock the door. Check it twice. You always do.",
      "As you walk to your car, a familiar thought presses in:",
      "<em>“People count on me… but what do I actually want?”</em>",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(1200);
    }

    if (latchArea) {
      latchArea.classList.remove("hidden");
      latchArea.style.opacity = 1;
    }

    return new Promise((resolve) => {
      let taps = 0;
      const handleTap = async () => {
        taps++;
        const clickMsg = document.createElement("div");
        clickMsg.innerText = "CLICK";
        clickMsg.className = "latch-message";
        if (latchVisual) {
          latchVisual.innerHTML = "";
          latchVisual.appendChild(clickMsg);
        }
        const hint = document.querySelector("#beat1 .click-hint");
        if (taps === 1 && hint) hint.innerText = "Check again";
        else if (taps === 2 && hint) hint.innerText = "Just to be sure";
        else if (taps >= 3) {
          section.removeEventListener("click", handleTap);
          if (hint) hint.style.opacity = 0;
          const p = document.createElement("p");
          p.innerText = "Habit. Just habit.";
          p.style.fontStyle = "italic";
          p.style.marginTop = "20px";
          textContainer.appendChild(p);
          await typeText(p, "Habit. Just habit.", 40);
          await wait(2000);
          section.style.opacity = 0;
          pauseVideoIn(section);
          await wait(1000);
          section.classList.remove("active-section");
          runBeat2();
          resolve();
        }
      };
      section.addEventListener("click", handleTap);
    });
  }

  // --- BEAT 2 (Drive) ---
  async function runBeat2() {
    const section = document.getElementById("beat2");
    if (!section) return;
    section.classList.add("active-section");
    section.style.opacity = 1;
    const textContainer = document.getElementById("beat2Text");
    const lightContainer = document.getElementById("lightInteraction");
    const redLight = document.querySelector(".light.red");
    const greenLight = document.querySelector(".light.green");

    const lines = [
      "The road home is quiet.",
      "Street after street passes with that same orange glow of tired streetlights.",
      "You roll your shoulders; they’re always tense.",
      "Being reliable has a way of settling into the body.",
      "You stop at a red light.",
      "For a second, with the engine humming beneath you, you wonder:",
      "<strong>“When was the last time I did something just for myself?”</strong>",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(1500);
    }

    if (lightContainer) {
      lightContainer.classList.remove("hidden");
      lightContainer.style.opacity = 1;
    }

    return new Promise((resolve) => {
      let clicked = false;
      const handleLightClick = async () => {
        if (clicked) return;
        clicked = true;
        if (redLight) redLight.classList.remove("active");
        if (greenLight) greenLight.classList.add("active");
        const hint = document.querySelector("#beat2 .click-hint");
        if (hint) hint.style.opacity = 0;
        await wait(1000);
        const p = document.createElement("p");
        p.innerText = "Green. Time to go. Always moving.";
        textContainer.appendChild(p);
        await typeText(p, p.innerText, 40);
        await wait(2500);
        section.style.opacity = 0;
        await wait(1000);
        section.classList.remove("active-section");
        runBeat3();
        resolve();
      };
      if (lightContainer)
        lightContainer.addEventListener("click", handleLightClick);
    });
  }

  // --- BEAT 3 (House) ---
  async function runBeat3() {
    const section = document.getElementById("beat3");
    if (!section) return;
    playVideoIn(section);
    section.classList.add("active-section");
    section.style.opacity = 1;
    const textContainer = document.getElementById("beat3Text");
    const nextBtn = document.getElementById("kitchenNext");

    const lines = [
      "You step inside and lock the door behind you.",
      "The house is quiet — not peaceful, just <em>quiet</em>.",
      "You place your keys in the same bowl, shrug off your coat, loosen your shoes.",
      "The kitchen light feels too bright.",
      "Realizing you’ve gone straight from carrying things at work...",
      "To carrying things here.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(1500);
    }

    if (nextBtn) {
      nextBtn.classList.remove("hidden");
      nextBtn.style.opacity = 1;
      const handleClick = async () => {
        nextBtn.removeEventListener("click", handleClick);
        nextBtn.style.opacity = 0;
        await wait(500);
        section.style.opacity = 0;
        pauseVideoIn(section);
        await wait(1000);
        section.classList.remove("active-section");
        runBeat4();
        resolve();
      };
      nextBtn.addEventListener("click", handleClick);
    }
  }

  // --- BEAT 4 (Counter) ---
  async function runBeat4() {
    const section = document.getElementById("beat4");
    if (!section) return;
    section.classList.add("active-section");
    section.style.opacity = 1;
    const textContainer = document.getElementById("beat4Text");
    const wipeInteraction = document.getElementById("wipeInteraction");
    const rag = document.getElementById("rag");
    const track = document.getElementById("wipe-track");

    const lines = [
      "You move through the house on instinct.",
      "Coat on the hook. Shoes by the door.",
      "You wipe the counter even though it’s already clean.",
      "It’s not obligation. It’s habit.",
      "You pause with your hand still on the cloth.",
      "For a moment, your body feels heavier than the task.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(1500);
    }

    if (wipeInteraction) {
      wipeInteraction.classList.remove("hidden");
      wipeInteraction.style.opacity = 1;
    }

    return new Promise((resolve) => {
      let isDragging = false;
      let startX = 0;
      let ragStartLeft = 0;
      let completed = false;
      let maxDist = 0;

      const updateDimensions = () => {
        if (track && rag) maxDist = track.clientWidth - rag.clientWidth;
      };
      const startDrag = (clientX) => {
        if (completed) return;
        updateDimensions();
        if (maxDist <= 0) maxDist = 300;
        isDragging = true;
        startX = clientX;
        if (rag) ragStartLeft = rag.offsetLeft;
      };
      const onDrag = (clientX) => {
        if (!isDragging || completed || !rag) return;
        const delta = clientX - startX;
        let newLeft = ragStartLeft + delta;
        if (newLeft < 0) newLeft = 0;
        if (newLeft > maxDist) newLeft = maxDist;
        rag.style.left = newLeft + "px";
        const hint = document.getElementById("wipe-hint-text");
        if (hint) hint.style.opacity = 1 - newLeft / maxDist;
        if (newLeft > maxDist * 0.9) completeWipe();
      };
      const stopDrag = () => {
        isDragging = false;
      };
      const completeWipe = async () => {
        if (completed) return;
        completed = true;
        isDragging = false;
        if (rag) rag.style.left = maxDist + "px";
        await wait(300);
        if (wipeInteraction) wipeInteraction.style.opacity = 0;
        await wait(500);
        if (textContainer) {
          textContainer.innerHTML = "";
          const p = document.createElement("p");
          p.innerText = "This was never really about the counter.";
          p.style.color = "#fff";
          p.style.fontSize = "1.3rem";
          textContainer.appendChild(p);
          await typeText(p, p.innerText, 40);
        }
        await wait(3000);
        section.style.opacity = 0;
        await wait(1000);
        section.classList.remove("active-section");
        runBeat6();
        resolve();
      };
      if (rag) {
        rag.addEventListener("mousedown", (e) => startDrag(e.clientX));
        window.addEventListener("mousemove", (e) => onDrag(e.clientX));
        window.addEventListener("mouseup", stopDrag);
        rag.addEventListener("touchstart", (e) =>
          startDrag(e.touches[0].clientX)
        );
        window.addEventListener("touchmove", (e) =>
          onDrag(e.touches[0].clientX)
        );
        window.addEventListener("touchend", stopDrag);
      }
    });
  }

  // --- BEAT 6 (Porch) ---
  async function runBeat6() {
    const section = document.getElementById("beat6");
    if (!section) return;
    playVideoIn(section);
    section.classList.add("active-section");
    section.style.opacity = 1;
    const textContainer = document.getElementById("beat6Text");
    const holdInteraction = document.getElementById("holdInteraction");
    const innerCircle = document.querySelector(".hold-circle-inner");
    const bgVideo = document.getElementById("porchVideo");

    const lines = [
      "You grab the trash bag almost out of habit and step outside.",
      "But you don’t go back in.",
      "The door stays behind you, half-closed.",
      "Out here, the air is cooler.",
      "You take a few slow steps down the driveway.",
      "You don't want to return inside yet.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(1800);
    }

    if (holdInteraction) {
      holdInteraction.classList.remove("hidden");
      holdInteraction.style.opacity = 1;
    }

    return new Promise((resolve) => {
      let holding = false;
      let progress = 0;
      let animFrame;

      const updateHold = () => {
        if (holding) progress += 1.5;
        else progress -= 3.0;
        if (progress < 0) progress = 0;
        if (progress > 100) progress = 100;

        if (innerCircle) {
          const scale = 1 + progress / 10;
          innerCircle.style.transform = `scale(${scale})`;
        }
        if (bgVideo) {
          const vidScale = 1 - progress * 0.003;
          const vidOpacity = 1 - progress * 0.01;
          bgVideo.style.transform = `scale(${vidScale})`;
          bgVideo.style.opacity = vidOpacity;
        }
        if (textContainer) textContainer.style.opacity = 1 - progress / 80;

        if (progress >= 100) {
          cancelAnimationFrame(animFrame);
          completeBeat6();
        } else {
          animFrame = requestAnimationFrame(updateHold);
        }
      };

      const startHold = (e) => {
        if (e.cancelable) e.preventDefault();
        holding = true;
      };
      const endHold = () => {
        holding = false;
      };
      const circleBtn = document.querySelector(".hold-circle-outer");
      if (circleBtn) {
        circleBtn.addEventListener("mousedown", startHold);
        window.addEventListener("mouseup", endHold);
        circleBtn.addEventListener("touchstart", startHold);
        window.addEventListener("touchend", endHold);
      }
      updateHold();

      const completeBeat6 = async () => {
        if (circleBtn) {
          circleBtn.removeEventListener("mousedown", startHold);
          circleBtn.removeEventListener("touchstart", startHold);
        }
        if (holdInteraction) holdInteraction.style.opacity = 0;
        await wait(1500);
        section.style.opacity = 0;
        pauseVideoIn(section);
        await wait(1000);
        section.classList.remove("active-section");
        runBeat7();
        resolve();
      };
    });
  }

  // --- BEAT 7 (Threshold) ---
  async function runBeat7() {
    const section = document.getElementById("beat7");
    if (!section) return;
    section.classList.add("active-section");
    section.style.opacity = 1;
    const textContainer = document.getElementById("beat7Text");
    const sliderHint = document.getElementById("sliderHint");
    const streetLayer = document.getElementById("streetLayer");
    const sliderHandle = document.getElementById("slider-handle");

    const lines = [
      "You walk past the edge of your driveway.",
      "The night feels wider out here.",
      "You follow the sidewalk until the houses thin out.",
      "A small path breaks off into the trees.",
      "One you’ve never taken.",
      "One you never had the time to take.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(1800);
    }

    if (sliderHint) {
      sliderHint.classList.remove("hidden");
      sliderHint.style.opacity = 1;
    }

    return new Promise((resolve) => {
      let isDragging = false;
      let finished = false;
      const updateSlider = (clientX) => {
        if (finished) return;
        const width = window.innerWidth;
        let percentage = (clientX / width) * 100;
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        const streetWidth = 100 - percentage;
        if (streetLayer) streetLayer.style.width = streetWidth + "%";
        if (sliderHandle) sliderHandle.style.left = streetWidth + "%";
        if (sliderHint) sliderHint.style.opacity = 1 - percentage / 30;
        if (percentage > 90) finishBeat7();
      };
      const startDrag = (e) => {
        if (finished) return;
        isDragging = true;
        if (e.type !== "touchstart") e.preventDefault();
      };
      const onMove = (e) => {
        if (!isDragging) return;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        updateSlider(x);
      };
      const stopDrag = () => {
        isDragging = false;
      };

      if (sliderHandle) {
        sliderHandle.addEventListener("mousedown", startDrag);
        sliderHandle.addEventListener("touchstart", startDrag);
      }
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", stopDrag);
      window.addEventListener("touchmove", onMove);
      window.addEventListener("touchend", stopDrag);

      const finishBeat7 = async () => {
        if (finished) return;
        finished = true;
        if (streetLayer) {
          streetLayer.style.transition = "width 0.8s ease";
          streetLayer.style.width = "0%";
        }
        if (sliderHandle) sliderHandle.style.opacity = 0;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("touchmove", onMove);
        await wait(1000);
        if (textContainer) {
          textContainer.innerHTML = "";
          const p = document.createElement("p");
          p.innerText =
            "You hesitate only for a second before stepping onto it.";
          p.style.color = "#fff";
          p.style.fontSize = "1.3rem";
          textContainer.appendChild(p);
          await typeText(p, p.innerText, 40);
        }
        await wait(3000);
        section.style.opacity = 0;
        await wait(1000);
        section.classList.remove("active-section");
        runBeat8();
        resolve();
      };
    });
  }

  // --- BEAT 8: THE DARK WOODS ---
  async function runBeat8() {
    const section = document.getElementById("beat8");
    if (!section) {
      console.error("Beat 8 missing");
      return;
    }
    playVideoIn(section); // PLAY VIDEO
    section.classList.add("active-section");
    section.style.opacity = 1;

    const textContainer = document.getElementById("beat8Text");
    const pullInteraction = document.getElementById("pullInteraction");
    const handle = document.getElementById("pull-handle");
    const track = document.getElementById("pull-track");
    const blueOverlay = document.getElementById("blue-overlay");

    const lines = [
      "The canopy swallows the last bits of streetlight.",
      "Each step feels softer, like slipping out of the role you play every day.",
      "Crickets hum. Leaves shift.",
      "The deeper you go, the more the world behind you feels like a place that can wait.",
      "Ahead, you notice the trees beginning to thin...",
      "Their silhouettes glowing faintly with the final stretch of blue hour light.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(1500);
    }

    if (pullInteraction) {
      pullInteraction.classList.remove("hidden");
      pullInteraction.style.opacity = 1;
    }

    return new Promise((resolve) => {
      let isDragging = false;
      let startX = 0;
      let startLeft = 0;
      let finished = false;
      const maxDist = track ? track.clientWidth - 40 : 200;

      const onStart = (x) => {
        if (finished) return;
        isDragging = true;
        startX = x;
        startLeft = handle.offsetLeft;
      };

      const onMove = (x) => {
        if (!isDragging || finished) return;
        const delta = x - startX;
        let newLeft = startLeft + delta;

        if (newLeft < 0) newLeft = 0;
        if (newLeft > maxDist) newLeft = maxDist;

        handle.style.left = newLeft + "px";

        if (blueOverlay) blueOverlay.style.opacity = newLeft / maxDist;

        if (newLeft > maxDist * 0.9) {
          finishBeat8();
        }
      };

      const onEnd = () => {
        isDragging = false;
      };

      if (handle) {
        handle.addEventListener("mousedown", (e) => onStart(e.clientX));
        window.addEventListener("mousemove", (e) => onMove(e.clientX));
        window.addEventListener("mouseup", onEnd);
        handle.addEventListener("touchstart", (e) =>
          onStart(e.touches[0].clientX)
        );
        window.addEventListener("touchmove", (e) =>
          onMove(e.touches[0].clientX)
        );
        window.addEventListener("touchend", onEnd);
      }

      const finishBeat8 = async () => {
        if (finished) return;
        finished = true;
        if (pullInteraction) pullInteraction.style.opacity = 0;
        if (blueOverlay) blueOverlay.style.opacity = 1;

        await wait(1000);
        textContainer.innerHTML = "";
        const p = document.createElement("p");
        p.innerText = "Something is waiting beyond them.";
        p.style.color = "#fff";
        textContainer.appendChild(p);
        await typeText(p, p.innerText, 40);

        await wait(2500);
        section.style.opacity = 0;
        pauseVideoIn(section);
        await wait(1000);
        section.classList.remove("active-section");

        initThreeJSBeats();
        resolve();
      };
    });
  }

  // --- THREE.JS LOGIC ---
  let scene, camera, renderer;
  let forestGroup, campfireLight;
  let isBeat9Active = false;
  let isBeat10Active = false;
  let isHoldingBreath = false;

  async function initThreeJSBeats() {
    const container = document.getElementById("three-container");
    container.classList.add("three-active");
    container.style.opacity = 1;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a0b2e, 0.04);

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.7, 5);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404080, 0.5);
    scene.add(ambientLight);

    // 🔥 FLICKERING LIGHT SETUP
    campfireLight = new THREE.PointLight(0xff6600, 0, 80); // Orange, start off, range 80
    campfireLight.position.set(0, 1, -20);
    scene.add(campfireLight);

    forestGroup = new THREE.Group();
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 60;
      const z = -Math.random() * 80;
      if (Math.abs(x) < 3) continue;

      const tree = new THREE.Group();
      tree.position.set(x, 0, z);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.4, 4, 6),
        new THREE.MeshLambertMaterial({ color: 0x111111 })
      );
      trunk.position.y = 2;
      tree.add(trunk);

      const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(2, 8, 6),
        new THREE.MeshLambertMaterial({ color: 0x051a05 })
      );
      leaves.position.y = 6;
      tree.add(leaves);

      forestGroup.add(tree);
    }
    scene.add(forestGroup);

    animateThree();
    runBeat9();
  }

  function animateThree() {
    requestAnimationFrame(animateThree);

    // Beat 9: Breathing moves camera
    if (isBeat9Active) {
      if (isHoldingBreath) {
        camera.position.z -= 0.04;
        if (camera.fov < 90) {
          camera.fov += 0.2;
          camera.updateProjectionMatrix();
        }
      } else {
        if (camera.fov > 75) {
          camera.fov -= 0.3;
          camera.updateProjectionMatrix();
        }
      }
    }

    // Beat 10: Auto Walk + FLICKERING LIGHT
    if (isBeat10Active) {
      camera.position.z -= 0.05;

      // Flicker Logic
      // Base intensity increases as we get closer
      const baseIntensity = 3.0; // Strong base
      const flicker = Math.random() * 1.5 - 0.75; // Chaotic random range

      // Only apply if it's supposed to be on
      if (campfireLight.intensity < baseIntensity) {
        campfireLight.intensity += 0.05; // Fade in
      } else {
        campfireLight.intensity = baseIntensity + flicker;
      }

      // Jitter position slightly
      campfireLight.position.x = Math.random() * 0.2 - 0.1;
    }

    renderer.render(scene, camera);
  }

  // --- BEAT 9: BLUE HOUR ---
  async function runBeat9() {
    isBeat9Active = true;
    const section = document.getElementById("beat9");
    section.classList.add("active-section");
    section.style.opacity = 1;
    const textContainer = document.getElementById("beat9Text");
    const breatheInteraction = document.getElementById("breatheInteraction");
    const circle = document.querySelector(".breath-circle");

    const lines = [
      "The air smells like pine and cold soil.",
      "Your footsteps crunch softly on the ground.",
      "You pause at a small break in the trees.",
      "A deep blue, almost violet. Blue hour.",
      "The kind of light you never notice when you’re rushing through life.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(2000);
    }

    if (breatheInteraction) {
      breatheInteraction.classList.remove("hidden");
      breatheInteraction.style.opacity = 1;

      const start = () => {
        isHoldingBreath = true;
        if (circle) circle.style.transform = "scale(1.8)";
      };
      const end = () => {
        isHoldingBreath = false;
        if (circle) circle.style.transform = "scale(1)";
      };

      breatheInteraction.addEventListener("mousedown", start);
      window.addEventListener("mouseup", end);
      breatheInteraction.addEventListener("touchstart", start);
      window.addEventListener("touchend", end);
    }

    await wait(6000);

    if (breatheInteraction) breatheInteraction.style.opacity = 0;
    textContainer.innerHTML = "";

    const p = document.createElement("p");
    p.innerText =
      "For a second, you just stand there, breathing in a version of yourself that isn’t busy, responsible, or needed by anyone.";
    p.style.color = "#aaddff";
    textContainer.appendChild(p);
    await typeText(p, p.innerText, 40);

    await wait(4000);
    section.style.opacity = 0;
    section.classList.remove("active-section");
    runBeat10();
  }

  // --- BEAT 10: THE FIRE ---
  async function runBeat10() {
    isBeat9Active = false;
    isBeat10Active = true; // STARTS THE FLICKER

    const section = document.getElementById("beat10");
    section.classList.add("active-section");
    section.style.opacity = 1;
    const textContainer = document.getElementById("beat10Text");

    const lines = [
      "Then, you see it.",
      "A flicker of orange cutting through the violet dark.",
      "Someone is there.",
      "Waiting.",
      "For the first time all day... you feel like you're heading home.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(2500);
    }

    await wait(2000);
    const overlay = document.getElementById("fade-overlay");
    if (overlay) overlay.style.opacity = 1;
    await wait(2000);
    window.location.href = "../campfire/campfire.html?role=settler";
  }

  startExperience();
});
