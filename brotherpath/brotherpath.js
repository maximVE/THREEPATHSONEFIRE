document.addEventListener("DOMContentLoaded", () => {
  const fadeOverlay = document.getElementById("fade-overlay");
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // --- TYPING EFFECT ---
  async function typeText(element, text, speed = 50) {
    element.innerHTML = "";
    element.style.opacity = 1;
    for (let i = 0; i < text.length; i++) {
      element.innerHTML += text.charAt(i);
      await wait(speed);
    }
  }

  // --- START ---
  async function startExperience() {
    // --- START AUDIO ---
    const audio = document.getElementById("bg-music");
    if (audio) {
      audio.volume = 0.4;
      audio
        .play()
        .catch((e) => console.log("Audio waiting for interaction..."));
    }

    await wait(500);
    fadeOverlay.style.opacity = 0;
    await runBeat1();
  }

  // --- BEAT 1: CLOCK ---
  async function runBeat1() {
    const section = document.getElementById("beat1");
    const bgVideo = section.querySelector("video");
    if (bgVideo) bgVideo.playbackRate = 0.6;

    section.classList.add("active-section");
    section.style.opacity = 1;

    const textContainer = document.getElementById("beat1Text");
    const clockContainer = document.getElementById("clockContainer");
    const clockDisplay = document.querySelector(".digital-clock");

    const lines = [
      "You turn the key and step into your apartment.",
      "It smells the same as yesterday.",
      "Your jacket goes on the same chair.",
      "You sit at the table. A thought flickers:",
      "'Is this... it?'",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(1500);
    }

    clockContainer.classList.remove("hidden");
    clockContainer.style.opacity = 1;

    return new Promise((resolve) => {
      let clicks = 0;
      let hour = 18;
      let minute = 42;

      const handleTick = async () => {
        clicks++;
        minute += Math.floor(Math.random() * 15) + 5;
        if (minute >= 60) {
          minute -= 60;
          hour++;
        }
        const minStr = minute < 10 ? "0" + minute : minute;
        clockDisplay.innerText = `${hour}:${minStr}`;
        clockDisplay.style.color = "#fff";
        setTimeout(
          () => (clockDisplay.style.color = "var(--accent-color)"),
          100
        );

        if (clicks >= 5) {
          document.removeEventListener("click", handleTick);
          document.removeEventListener("touchstart", handleTouch);
          clockContainer.style.opacity = 0;
          textContainer.style.opacity = 0;
          await wait(1000);
          section.classList.remove("active-section");
          runBeat2();
          resolve();
        }
      };

      const handleTouch = (e) => {
        e.preventDefault();
        handleTick();
      };
      document.addEventListener("click", handleTick);
      document.addEventListener("touchstart", handleTouch, { passive: false });
    });
  }

  // --- BEAT 2: VOLUME ---
  async function runBeat2() {
    const section = document.getElementById("beat2");
    section.classList.add("active-section");
    section.style.opacity = 1;
    await wait(500);

    const textContainer = document.getElementById("beat2Text");
    const volContainer = document.getElementById("volumeContainer");
    const volBar = document.getElementById("volBar");
    const volNum = document.getElementById("volNum");

    const lines = [
      "You sit on the couch with your plate.",
      "TV on, but barely watched.",
      "It's easy noise. Nothing that asks anything of you.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(1500);
    }

    volContainer.classList.remove("hidden");
    volContainer.style.opacity = 1;

    return new Promise((resolve) => {
      let currentVol = 12;

      const handleVol = async () => {
        if (currentVol <= 0) return;
        currentVol -= 2;
        if (currentVol < 0) currentVol = 0;
        volNum.innerText = currentVol;
        volBar.style.width = (currentVol / 12) * 100 + "%";

        if (currentVol === 8) {
          const p = document.createElement("p");
          p.innerText = "The silence creeps in...";
          p.style.color = "var(--accent-color)";
          textContainer.appendChild(p);
          typeText(p, "The silence creeps in...", 40);
        }

        if (currentVol === 0) {
          const p = document.createElement("p");
          p.innerText = "And you remember a version of you that felt awake.";
          p.style.color = "#fff";
          p.style.marginTop = "20px";
          textContainer.appendChild(p);
          await typeText(p, p.innerText, 40);

          document.removeEventListener("click", handleVol);
          document.removeEventListener("touchstart", handleTouch);
          await wait(3000);
          section.style.opacity = 0;
          await wait(1000);
          section.classList.remove("active-section");
          runBeat3();
          resolve();
        }
      };
      const handleTouch = (e) => {
        e.preventDefault();
        handleVol();
      };
      document.addEventListener("click", handleVol);
      document.addEventListener("touchstart", handleTouch, { passive: false });
    });
  }

  // --- BEAT 3: SCROLL ---
  async function runBeat3() {
    const section = document.getElementById("beat3");
    section.classList.add("active-section");
    section.style.opacity = 1;
    const textContainer = document.getElementById("beat3Text");
    const phoneFeed = document.getElementById("phoneFeed");
    const feedContent = document.querySelector(".feed-content");
    const hintOverlay = document.getElementById("scrollHintOverlay");

    const lines = [
      "You sit on the edge of your bed.",
      "The screen lights up your face.",
      "Same apps. Same feeds.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(1500);
    }

    phoneFeed.classList.remove("hidden");
    phoneFeed.style.opacity = 1;

    return new Promise((resolve) => {
      const onScroll = async () => {
        const scrollTop = phoneFeed.scrollTop;
        const maxScroll = phoneFeed.scrollHeight - phoneFeed.clientHeight;
        const scrollPercent = scrollTop / maxScroll;

        if (scrollTop > 10) hintOverlay.style.opacity = 0;
        if (feedContent) {
          feedContent.style.filter = `blur(${scrollPercent * 8}px)`;
        }

        if (scrollPercent > 0.8) {
          phoneFeed.removeEventListener("scroll", onScroll);
          const p = document.createElement("p");
          p.innerText = "Like watching life through a window you can't open.";
          textContainer.innerHTML = "";
          textContainer.appendChild(p);
          await typeText(p, p.innerText, 30);
          await wait(2500);
          section.style.opacity = 0;
          await wait(1000);
          section.classList.remove("active-section");
          runBeat4();
          resolve();
        }
      };
      phoneFeed.addEventListener("scroll", onScroll);
    });
  }

  // --- BEAT 4: THE CABINET ---
  async function runBeat4() {
    const section = document.getElementById("beat4");
    section.classList.add("active-section");
    section.style.opacity = 1;
    const textContainer = document.getElementById("beat4Text");
    const cabInteraction = document.getElementById("cabinetInteraction");
    const closeBtn = document.getElementById("takeSketchbookBtn");

    const part1 = [
      "You wash your plate. Wipe the counter.",
      "But when you open the cabinet...",
    ];

    for (let txt of part1) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(1500);
    }

    const highlight = document.createElement("p");
    highlight.innerText = "A sketchbook.";
    highlight.style.color = "var(--accent-color)";
    highlight.style.fontSize = "1.4rem";
    highlight.style.fontWeight = "bold";
    textContainer.appendChild(highlight);
    await typeText(highlight, "A sketchbook.", 60);
    await wait(1000);

    const pHesitate = document.createElement("p");
    pHesitate.innerText = "Your hand almost reaches for it. Almost.";
    pHesitate.style.fontStyle = "italic";
    textContainer.appendChild(pHesitate);
    await typeText(pHesitate, pHesitate.innerText, 40);

    await wait(500);
    cabInteraction.classList.remove("hidden");
    cabInteraction.style.opacity = 1;

    return new Promise((resolve) => {
      const handleButtonClick = async () => {
        closeBtn.disabled = true;
        closeBtn.style.opacity = 0.5;
        cabInteraction.style.opacity = 0;
        await wait(500);

        textContainer.innerHTML = "";
        const pAction = document.createElement("p");
        pAction.innerText = "You grab it before you can change your mind.";
        pAction.style.color = "#fff";
        textContainer.appendChild(pAction);
        await typeText(pAction, pAction.innerText, 40);

        await wait(2000);
        section.style.opacity = 0;
        await wait(1000);
        section.classList.remove("active-section");
        runBeat5();
        resolve();
      };
      closeBtn.addEventListener("click", handleButtonClick);
    });
  }

  // --- BEAT 5: THE SCRIBBLE ---
  async function runBeat5() {
    const section = document.getElementById("beat5");
    section.classList.add("active-section");
    section.style.opacity = 1;
    const textContainer = document.getElementById("beat5Text");
    const canvas = document.getElementById("scribbleCanvas");
    const hint = document.getElementById("scribbleHint");

    const lines = [
      "It feels strange to hold it again.",
      "Blank pages. Quiet. Possibility.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(1500);
    }

    const instr = document.createElement("p");
    instr.innerText = "You let the pencil move...";
    instr.style.color = "var(--accent-color)";
    textContainer.appendChild(instr);
    await typeText(instr, instr.innerText, 40);

    hint.classList.remove("hidden");
    hint.style.opacity = 1;
    canvas.classList.add("canvas-active");

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.strokeStyle = "rgba(246, 196, 106, 0.7)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    return new Promise((resolve) => {
      let isDrawing = false;
      let drawnAmount = 0;
      let finished = false;

      const getPos = (e) => {
        if (e.touches)
          return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        return { x: e.clientX, y: e.clientY };
      };
      const startDraw = (e) => {
        if (finished) return;
        isDrawing = true;
        const { x, y } = getPos(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
      };
      const draw = (e) => {
        if (!isDrawing || finished) return;
        const { x, y } = getPos(e);
        ctx.lineTo(x, y);
        ctx.stroke();
        drawnAmount++;
        if (drawnAmount > 10) hint.style.opacity = 0;
      };
      const endDraw = () => {
        isDrawing = false;
        if (drawnAmount > 30 && !finished) {
          finishBeat5();
        }
      };
      canvas.addEventListener("mousedown", startDraw);
      canvas.addEventListener("mousemove", draw);
      document.addEventListener("mouseup", endDraw);
      canvas.addEventListener("touchstart", startDraw);
      canvas.addEventListener("touchmove", draw);
      document.addEventListener("touchend", endDraw);

      async function finishBeat5() {
        finished = true;
        canvas.classList.remove("canvas-active");
        const finalP = document.createElement("p");
        finalP.innerText = "A calm you haven't felt in a long time settles in.";
        finalP.style.background = "rgba(0,0,0,0.8)";
        finalP.style.padding = "10px";
        finalP.style.borderRadius = "8px";
        textContainer.innerHTML = "";
        textContainer.appendChild(finalP);
        await typeText(finalP, finalP.innerText, 40);
        await wait(3000);
        section.style.opacity = 0;
        await wait(1000);
        section.classList.remove("active-section");
        runBeat6();
        resolve();
      }
    });
  }

  // --- BEAT 6: THE WALK ---
  async function runBeat6() {
    const section = document.getElementById("beat6");
    section.classList.add("active-section");
    section.style.opacity = 1;
    const textContainer = document.getElementById("beat6Text");
    const starsLayer = document.getElementById("stars-layer");
    const bgImage = section.querySelector(".bg-image");

    const lines = [
      "You close the sketchbook.",
      "The apartment suddenly feels too small.",
      "You slip on your shoes and step outside.",
      "The neighborhood is quiet. Streetlights buzz.",
      "You walk without thinking, sketchbook tucked under your arm.",
      "And then...",
    ];

    starsLayer.style.opacity = 0;

    for (let i = 0; i < lines.length; i++) {
      const p = document.createElement("p");
      p.innerText = lines[i];
      p.style.opacity = 0;
      p.style.transition = "opacity 1.5s ease";
      textContainer.appendChild(p);
      void p.offsetWidth;
      p.style.opacity = 1;

      // STARS APPEAR ON THE LAST LINE
      if (i === lines.length - 1) {
        starsLayer.style.transition = "opacity 4s ease-in";
        starsLayer.style.opacity = 1;
        if (bgImage) {
          bgImage.style.transition = "opacity 4s ease-in";
          bgImage.style.opacity = 0;
        }
      }

      await wait(4000);
    }

    await wait(3000);
    section.style.opacity = 0;
    await wait(1500);
    section.classList.remove("active-section");
    runBeat7();
  }

  // --- BEAT 7: THE PATH ---
  async function runBeat7() {
    const section = document.getElementById("beat7");
    section.classList.add("active-section");
    section.style.opacity = 1;
    const vid = section.querySelector("video");
    if (vid) vid.play();
    const textContainer = document.getElementById("beat7Text");
    const branchOverlay = document.getElementById("branch-overlay");
    const leftBranch = document.querySelector(".branch-left");
    const rightBranch = document.querySelector(".branch-right");

    const lines = [
      "You walk past the last row of houses.",
      "The warm windows glow behind you like small islands.",
      "The streetlights thin out.",
      "The sidewalk gives way to a narrow footpath.",
      "You haven't opened the book again — but holding it feels grounding.",
      "You follow the path without thinking too hard.",
      "Letting your steps decide for you.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(2000);
    }

    await wait(500);
    textContainer.style.opacity = 0.5;
    branchOverlay.classList.add("branch-active");

    return new Promise((resolve) => {
      let startX = 0;
      let currentX = 0;
      let cleared = false;
      const handleStart = (x) => {
        startX = x;
      };
      const handleMove = (x) => {
        if (cleared) return;
        currentX = x - startX;
        let spread = Math.abs(currentX);
        if (spread > 300) spread = 300;
        leftBranch.style.transform = `translateX(-${spread}px)`;
        rightBranch.style.transform = `translateX(${spread}px)`;
        branchOverlay.style.opacity = 1 - spread / 400;
        if (spread > 220) finishBeat7();
      };
      const finishBeat7 = async () => {
        if (cleared) return;
        cleared = true;
        branchOverlay.style.opacity = 0;
        textContainer.style.opacity = 0;
        section.style.opacity = 0;
        await wait(1500);
        section.classList.remove("active-section");
        branchOverlay.style.display = "none";
        runBeat8();
        resolve();
      };
      window.addEventListener("mousedown", (e) => handleStart(e.clientX));
      window.addEventListener("mousemove", (e) => {
        if (e.buttons === 1) handleMove(e.clientX);
      });
      window.addEventListener("touchstart", (e) =>
        handleStart(e.touches[0].clientX)
      );
      window.addEventListener("touchmove", (e) =>
        handleMove(e.touches[0].clientX)
      );
    });
  }

  // --- BEAT 8: THE CLEARING ---
  async function runBeat8() {
    const section = document.getElementById("beat8");
    section.classList.add("active-section");
    section.style.opacity = 1;
    const textContainer = document.getElementById("beat8Text");
    const bookInteraction = document.getElementById("bookInteraction");
    const cover = document.querySelector(".book-cover");
    const glow = document.querySelector(".book-glow");

    const lines = [
      "The air shifts — cooler, cleaner.",
      "A quiet reminder of something you haven't let yourself feel in years.",
      "A small clearing appears ahead.",
      "It feels open. Safe. Like it's been waiting.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(2000);
    }

    const pStop = document.createElement("p");
    pStop.innerText = "You stop, look around... and let yourself breathe.";
    textContainer.appendChild(pStop);
    await typeText(pStop, pStop.innerText, 50);
    await wait(1000);

    bookInteraction.classList.remove("hidden");
    bookInteraction.style.opacity = 1;

    return new Promise((resolve) => {
      let startX = 0;
      let opened = false;
      const handleStart = (x) => {
        startX = x;
      };
      const handleMove = (x) => {
        if (opened) return;
        const delta = startX - x;
        if (delta > 0) {
          let rotation = delta / 1.5;
          if (rotation > 170) rotation = 170;
          cover.style.transform = `rotateY(-${rotation}deg)`;
          glow.style.opacity = 0.2 + rotation / 100;
          if (rotation >= 160) finishBeat8();
        }
      };
      const finishBeat8 = async () => {
        if (opened) return;
        opened = true;
        cover.style.transition = "transform 0.5s ease-out";
        cover.style.transform = `rotateY(-180deg)`;
        glow.style.boxShadow = "0 0 100px rgba(200, 230, 255, 1)";
        await wait(1000);
        textContainer.innerHTML = "";
        const finalP = document.createElement("p");
        finalP.innerText =
          "The pages catch the blue light, inviting you to stay here a moment.";
        finalP.style.color = "#fff";
        finalP.style.textShadow = "0 0 10px rgba(255,255,255,0.5)";
        textContainer.appendChild(finalP);
        await typeText(finalP, finalP.innerText, 40);

        await wait(3000);
        section.style.opacity = 0;
        await wait(1500);
        section.classList.remove("active-section");
        initThreeJSBeats();
        resolve();
      };
      bookInteraction.addEventListener(
        "mousedown",
        (e) => (startX = e.clientX)
      );
      window.addEventListener("mousemove", (e) => {
        if (e.buttons === 1) handleMove(e.clientX);
      });
      bookInteraction.addEventListener("touchstart", (e) =>
        handleStart(e.touches[0].clientX)
      );
      window.addEventListener("touchmove", (e) =>
        handleMove(e.touches[0].clientX)
      );
    });
  }

  // ==========================================
  //  THREE.JS LOGIC FOR BEAT 9 & 10
  // ==========================================
  let scene, camera, renderer, raycaster, mouse;
  let pageMesh, drawingTexture, drawingContext;
  let forestGroup, campfireLight;
  let isBeat9Active = false;
  let isBeat10Active = false;
  window.drawnStrokesCount = 0;
  let isThreeMouseDown = false;
  let canDraw3D = false;

  async function initThreeJSBeats() {
    // 1. Setup Three.js
    const container = document.getElementById("three-container");
    container.classList.add("three-active");

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020205, 0.04);

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Camera Height adjusted (Eye level)
    camera.position.set(0, 1.7, 5);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambientLight);

    campfireLight = new THREE.PointLight(0xff6600, 0, 50);
    campfireLight.position.set(0, 0, -20);
    scene.add(campfireLight);

    // 3. Create Better Trees
    forestGroup = new THREE.Group();

    // Attempt to load textures
    const textureLoader = new THREE.TextureLoader();
    const barkTexture = textureLoader.load(
      "bark.jpg",
      undefined,
      undefined,
      (err) => {}
    );
    const leafTexture = textureLoader.load(
      "leaves.jpg",
      undefined,
      undefined,
      (err) => {}
    );

    const createPineTree = (x, z) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, 0, z);

      // Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
      const trunkMat = new THREE.MeshLambertMaterial({
        color: 0x3d2817,
        map: barkTexture ? barkTexture : null,
      });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1;
      treeGroup.add(trunk);

      // Foliage
      const leafMat = new THREE.MeshLambertMaterial({
        color: 0x0d2b12,
        map: leafTexture ? leafTexture : null,
      });

      const cone1 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3, 8), leafMat);
      cone1.position.y = 2.5;
      treeGroup.add(cone1);

      const cone2 = new THREE.Mesh(
        new THREE.ConeGeometry(1.2, 2.5, 8),
        leafMat
      );
      cone2.position.y = 4.0;
      treeGroup.add(cone2);

      const cone3 = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2, 8), leafMat);
      cone3.position.y = 5.2;
      treeGroup.add(cone3);

      return treeGroup;
    };

    for (let i = 0; i < 60; i++) {
      const x = (Math.random() - 0.5) * 40;
      const z = -Math.random() * 60;
      if (Math.abs(x) < 2.5) continue;

      const tree = createPineTree(x, z);
      const scale = 0.8 + Math.random() * 0.4;
      tree.scale.set(scale, scale, scale);
      forestGroup.add(tree);
    }
    scene.add(forestGroup);

    setupBeat9Page();
    animateThree();
    runBeat9();
  }

  function setupBeat9Page() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    drawingContext = canvas.getContext("2d");

    drawingContext.fillStyle = "#f0f0f0";
    drawingContext.fillRect(0, 0, 512, 512);

    drawingTexture = new THREE.CanvasTexture(canvas);

    const geometry = new THREE.PlaneGeometry(3, 4);
    const material = new THREE.MeshBasicMaterial({ map: drawingTexture });
    pageMesh = new THREE.Mesh(geometry, material);
    pageMesh.position.set(0, 1.7, 2);
    pageMesh.rotation.x = -0.1;
    scene.add(pageMesh);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Listeners for drawing
    window.addEventListener("mousedown", () => (isThreeMouseDown = true));
    // NOTE: mouseup handled in Promise logic for Beat 9
    window.addEventListener("touchstart", () => (isThreeMouseDown = true));
    // NOTE: touchend handled in Promise logic for Beat 9

    window.addEventListener("mousemove", onThreeMouseMove);
    window.addEventListener("touchmove", onThreeTouchMove, { passive: false });
  }

  function animateThree() {
    requestAnimationFrame(animateThree);

    if (isBeat10Active) {
      camera.position.z -= 0.02;
      camera.position.y = 1.7 + Math.sin(Date.now() * 0.003) * 0.05;

      if (campfireLight.intensity < 2) campfireLight.intensity += 0.005;

      if (pageMesh && pageMesh.position.y > -10) {
        pageMesh.position.y -= 0.05;
        pageMesh.rotation.x += 0.01;
      }
    }

    if (drawingTexture) drawingTexture.needsUpdate = true;
    renderer.render(scene, camera);
  }

  // --- BEAT 9: 3D SKETCH ---
  async function runBeat9() {
    isBeat9Active = true;
    canDraw3D = false;

    const section = document.getElementById("beat9");
    section.classList.add("active-section");
    section.style.opacity = 1;
    const textContainer = document.getElementById("beat9Text");

    // HINT IS REMOVED as requested

    const lines = [
      "You step deeper into the trees, the air cooler now.",
      "The world behind you feels far away.",
      "You stop for a moment. Open the sketchbook. A blank page waits.",
      "For the first time in a long while, you let your hand move without thinking.",
      "Just for you.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(2000);
    }

    // Explicit Instruction -> UNLOCK DRAWING
    textContainer.innerHTML = "";
    const pPrompt = document.createElement("p");
    pPrompt.innerText = "Go ahead. Draw.";
    pPrompt.style.fontSize = "1.5rem";
    pPrompt.style.color = "var(--accent-color)";
    textContainer.appendChild(pPrompt);
    await typeText(pPrompt, "Go ahead. Draw.", 60);

    canDraw3D = true;
    textContainer.style.opacity = 0.8;

    return new Promise((resolve) => {
      // Function to check completion ON RELEASE
      const checkRelease = () => {
        isThreeMouseDown = false;
        // If the user has drawn enough AND released the mouse...
        if (canDraw3D && window.drawnStrokesCount > 20) {
          // CLEANUP LISTENERS
          window.removeEventListener("mouseup", checkRelease);
          window.removeEventListener("touchend", checkRelease);
          window.removeEventListener("mousemove", onThreeMouseMove);
          window.removeEventListener("touchmove", onThreeTouchMove);

          canDraw3D = false; // Lock
          finishBeat9(resolve);
        }
      };

      // Attach release listeners specific to this beat
      window.addEventListener("mouseup", checkRelease);
      window.addEventListener("touchend", checkRelease);
    });
  }

  async function finishBeat9(resolve) {
    const textContainer = document.getElementById("beat9Text");
    const section = document.getElementById("beat9");

    textContainer.innerHTML = "";
    const p = document.createElement("p");
    p.innerText =
      "When you let go, the path ahead glows faintly between the trees.";
    p.style.textShadow = "0 0 10px #fff";
    textContainer.style.opacity = 1;
    textContainer.appendChild(p);
    await typeText(p, p.innerText, 40);

    scene.fog.color.setHex(0x1a1a2e);

    await wait(3000);
    section.style.opacity = 0;
    section.classList.remove("active-section");
    runBeat10();
    resolve();
  }

  // --- BEAT 10: THE FIRE ---
  async function runBeat10() {
    isBeat10Active = true;
    isBeat9Active = false;

    const section = document.getElementById("beat10");
    section.classList.add("active-section");
    section.style.opacity = 1;
    const textContainer = document.getElementById("beat10Text");

    campfireLight.intensity = 0.5;

    const lines = [
      "You step deeper into the trees.",
      "Through the branches ahead, a soft orange glow flickers.",
      "Not a streetlight. Not a house. Something alive.",
      "You pause for a moment, listening.",
      "No cars. No chatter. Just the faint crackle of fire.",
      "Like someone waiting.",
      "Like a place meant for endings... and beginnings.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(3000);
    }

    await wait(2000);
    fadeOverlay.style.opacity = 1;
    await wait(2000);
    window.location.href = "../campfire/campfire.html?role=keeper";
  }

  // --- 3D INTERACTION HELPERS ---
  function performRaycast() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(pageMesh);

    if (intersects.length > 0) {
      const uv = intersects[0].uv;
      const x = Math.floor(uv.x * 512);
      const y = Math.floor((1 - uv.y) * 512);

      drawingContext.fillStyle = "#333";
      drawingContext.beginPath();
      drawingContext.arc(x, y, 5, 0, Math.PI * 2);
      drawingContext.fill();

      window.drawnStrokesCount++;
    }
  }

  function onThreeMouseMove(event) {
    if (!isBeat9Active) return;
    if (!canDraw3D) return;
    if (!isThreeMouseDown) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    performRaycast();
  }

  function onThreeTouchMove(event) {
    if (!isBeat9Active) return;
    if (!canDraw3D) return;
    if (!isThreeMouseDown) return;

    event.preventDefault();
    mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    performRaycast();
  }

  // START
  startExperience();
});
