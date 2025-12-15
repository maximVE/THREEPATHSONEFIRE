// gamperpath.js - FINAL (Full Screen Beat 10 Interaction)

document.addEventListener("DOMContentLoaded", () => {
  const fadeOverlay = document.getElementById("fade-overlay");
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Balanced Typing Speed (55ms)
  async function typeText(element, text, speed = 55) {
    element.innerHTML = "";
    element.style.opacity = 1;
    for (let i = 0; i < text.length; i++) {
      element.innerHTML += text.charAt(i);
      await wait(speed);
    }
  }

  // --- START ---
  async function startExperience() {
    const audio = document.getElementById("bg-music");
    if (audio) {
      audio.volume = 0.5;
      audio
        .play()
        .catch((e) => console.log("Audio waiting for interaction..."));
    }
    // -------------------

    await wait(800);
    fadeOverlay.style.opacity = 0;
    await runIntro();
  }

  // --- BEAT 1: INTRO (Hold) ---
  async function runIntro() {
    const section = document.getElementById("drifter-intro");
    section.classList.add("active-section");
    section.style.opacity = 1;

    const textContainer = document.getElementById("text-container");
    const holdContainer = document.getElementById("intro-hold-container");
    const circleFill = document.getElementById("intro-circle-fill");
    const label = document.getElementById("intro-label");

    const lines = [
      "You finish another late shift.",
      "Same road. Same streetlights.",
      "The engine hums. The night feels flat.",
      "You think: 'Is this really all there is for me?'",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(2000);
    }

    holdContainer.classList.remove("hidden");
    holdContainer.style.opacity = 1;

    return new Promise((resolve) => {
      let progress = 0;
      let holding = false;
      let completed = false;

      const updateBreath = () => {
        if (completed) return;
        if (holding) {
          progress += 0.7;
          label.innerText = "Inhale...";
        } else {
          progress -= 1.2;
          if (progress > 0) label.innerText = "Exhale...";
          else label.innerText = "Hold to Breathe";
        }
        if (progress < 0) progress = 0;

        const scaleValue = progress / 100;
        circleFill.style.transform = `scale(${scaleValue})`;
        circleFill.style.opacity = 0.2 + scaleValue * 0.5;

        if (progress >= 100) {
          completed = true;
          label.innerText = "Connected.";
          circleFill.style.transform = `scale(1.2)`;

          document.removeEventListener("mousedown", startHold);
          document.removeEventListener("mouseup", endHold);
          document.removeEventListener("touchstart", startHold);
          document.removeEventListener("touchend", endHold);

          setTimeout(async () => {
            textContainer.style.opacity = 0;
            holdContainer.style.opacity = 0;
            await wait(1200);
            section.classList.remove("active-section");
            runBeat2();
            resolve();
          }, 1000);
        } else {
          requestAnimationFrame(updateBreath);
        }
      };

      const startHold = () => {
        holding = true;
      };
      const endHold = () => {
        holding = false;
      };

      holdContainer.addEventListener("mousedown", startHold);
      document.addEventListener("mouseup", endHold);
      holdContainer.addEventListener("touchstart", (e) => {
        e.preventDefault();
        startHold();
      });
      document.addEventListener("touchend", endHold);
      requestAnimationFrame(updateBreath);
    });
  }

  // --- BEAT 2: THE DARKENING (Click) ---
  async function runBeat2() {
    const section = document.getElementById("beat2");
    section.classList.add("active-section");
    const textContainer = document.getElementById("beat2Text");
    const lines = textContainer.querySelectorAll(".line");

    lines.forEach((l) => (l.style.opacity = 0));
    for (let line of lines) {
      line.style.transition = "opacity 2s ease";
      line.style.opacity = 1;
      await wait(2200);
    }

    const clickHint = document.getElementById("beat2ClickHint");
    const darkOverlay = document.getElementById("beat2Darken");

    return new Promise((resolve) => {
      let clickCount = 0;
      const totalClicks = 4;

      const handleClick = async () => {
        clickCount++;
        darkOverlay.style.opacity = clickCount / totalClicks;
        clickHint.style.transform = "scale(0.9)";
        setTimeout(() => (clickHint.style.transform = "scale(1)"), 100);

        if (clickCount >= totalClicks) {
          document.removeEventListener("click", handleClick);
          clickHint.style.opacity = 0;
          await wait(1500);
          section.classList.remove("active-section");
          runBeat3();
          resolve();
        }
      };
      document.addEventListener("click", handleClick);
    });
  }

  // --- BEAT 3: THE CHOICE (Buttons) ---
  async function runBeat3() {
    const section = document.getElementById("beat3");
    section.classList.add("active-section");

    const lines = section.querySelectorAll(".beat-line");
    lines.forEach((l) => (l.style.opacity = 0));
    for (let i = 0; i < lines.length; i++) {
      lines[i].style.transition = "opacity 1.5s ease";
      lines[i].style.opacity = 1;
      await wait(2000);
    }

    const choicesBox = document.getElementById("beat3Choices");
    choicesBox.classList.remove("hidden");
    choicesBox.style.opacity = 1;

    const btnExcited = document.getElementById("choiceExcited");
    const btnAvoiding = document.getElementById("choiceAvoiding");

    return new Promise((resolve) => {
      const handleChoice = async (e) => {
        e.target.style.background = "#fff";
        e.target.style.color = "#000";
        await wait(800);
        section.style.opacity = 0;
        await wait(1200);
        section.classList.remove("active-section");
        runBeat4();
        resolve();
      };

      btnExcited.addEventListener("click", handleChoice);
      btnAvoiding.addEventListener("click", handleChoice);
    });
  }

  // --- BEAT 4: AIM (PASSIVE) ---
  async function runBeat4() {
    const section = document.getElementById("beat4");
    section.style.opacity = 0;
    section.classList.add("active-section");
    void section.offsetWidth;
    section.style.opacity = 1;
    section.classList.add("shaking");

    const textContainer = document.getElementById("beat4Text");

    const lines = [
      "The match starts.",
      "Your fingers move on their own.",
      "Aim. Reload. Sprint.",
      "You know this map better than your own neighborhood.",
      "But your mind is somewhere else completely.",
      "Winning doesn't feel like winning anymore.",
      "No spark. No rush. Just routine.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      textContainer.appendChild(p);
      await typeText(p, txt);
      await wait(2800);
    }

    await wait(1500);
    section.classList.remove("shaking");
    section.classList.remove("active-section");
    runBeat5();
  }

  // --- BEAT 5: RUSH (Click Fast) ---
  async function runBeat5() {
    const section = document.getElementById("beat5");
    section.classList.remove("hidden");
    section.classList.add("active-section");

    const lines = section.querySelectorAll(".beat-line");
    lines.forEach((l) => (l.style.opacity = 0));

    for (let line of lines) {
      line.style.transition = "opacity 2s ease";
      setTimeout(() => {
        line.style.opacity = 1;
      }, 50);
      await wait(2500);
    }

    const holdContainer = document.getElementById("holdBarContainer");
    const label = document.getElementById("rushLabel");
    const letGoMsg = document.getElementById("letGoMessage");

    holdContainer.classList.remove("hidden");
    holdContainer.style.opacity = 1;

    const fillBar = document.getElementById("holdFill");
    let progress = 0;
    let clickCount = 0;
    let finished = false;

    const frameUpdate = () => {
      if (finished) return;
      progress -= 0.4;
      if (progress < 0) progress = 0;
      fillBar.style.width = progress + "%";
      requestAnimationFrame(frameUpdate);
    };

    const handleClick = () => {
      if (finished) return;

      clickCount++;
      progress += 12;
      if (progress > 100) progress = 100;

      label.style.transform = "scale(1.05)";
      setTimeout(() => (label.style.transform = "scale(1)"), 50);

      if (clickCount >= 15) {
        triggerLetGo();
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        handleClick();
      },
      { passive: false }
    );
    requestAnimationFrame(frameUpdate);

    async function triggerLetGo() {
      finished = true;
      document.removeEventListener("mousedown", handleClick);

      if (letGoMsg) {
        letGoMsg.classList.remove("hidden");
        letGoMsg.style.opacity = 0;
        void letGoMsg.offsetWidth;
        letGoMsg.style.opacity = 1;
      }

      label.style.opacity = 0.3;

      await wait(3500);

      fadeOverlay.style.opacity = 1;
      await wait(2000);
      section.classList.remove("active-section");
      runBeat6();
    }
  }

  // --- BEAT 6: REALITY (PASSIVE) ---
  async function runBeat6() {
    const section = document.getElementById("beat6");
    section.classList.add("active-section");
    fadeOverlay.style.opacity = 0;
    await wait(1000);

    const textContainer = document.getElementById("beat6Text");
    const starsLayer = document.getElementById("stars-layer");

    const lines = [
      "You push the chair back and stand up.",
      "The screen glow fades, leaving the room dark.",
      "You open the window.",
      "The air hits you different out here. Cool. Real.",
      "You look up.",
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

      if (i === lines.length - 1) {
        await wait(1000);
        starsLayer.style.transition = "opacity 6s ease-in";
        starsLayer.style.opacity = 1;
      }

      await wait(3000);
    }

    await wait(3000);
    fadeOverlay.style.opacity = 1;
    await wait(2000);
    section.classList.remove("active-section");
    runBeat7();
  }

  // --- BEAT 7: COMPASS (Drag) ---
  async function runBeat7() {
    const section = document.getElementById("beat7");
    section.classList.add("active-section");
    fadeOverlay.style.opacity = 0;
    await wait(1000);

    const textContainer = document.getElementById("beat7Text");
    const compassBox = document.getElementById("compassContainer");
    const needle = document.querySelector(".compass-needle");

    const lines = [
      "Just a hoodie, hands in pockets.",
      "Walking without a map.",
      "You step past the streetlights where you usually turn back.",
      "For the first time in a long while...",
      "You aren't chasing a checkpoint.",
      "You wonder what might be waiting beyond the habits you always repeat.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      p.innerText = txt;
      p.style.opacity = 0;
      p.style.transition = "opacity 1.5s ease";
      textContainer.appendChild(p);
      void p.offsetWidth;
      p.style.opacity = 1;
      await wait(3000);
    }

    compassBox.classList.remove("hidden");
    compassBox.style.opacity = 1;

    let isDragging = false;
    let totalRotation = 0;
    let lastAngle = 0;
    let hasStarted = false;

    const getAngle = (x, y) => {
      const rect = compassBox.getBoundingClientRect();
      return (
        Math.atan2(
          y - (rect.top + rect.height / 2),
          x - (rect.left + rect.width / 2)
        ) *
        (180 / Math.PI)
      );
    };

    const updateRotation = (currentAngle) => {
      let delta = currentAngle - lastAngle;
      if (delta < -180) delta += 360;
      if (delta > 180) delta -= 360;
      totalRotation += delta;
      lastAngle = currentAngle;
      needle.style.transform = `rotate(${totalRotation}deg)`;
      if (Math.abs(totalRotation) > 10) hasStarted = true;
    };

    const startDrag = (e) => {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      lastAngle = getAngle(clientX, clientY);
    };

    const doDrag = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      updateRotation(getAngle(clientX, clientY));
    };

    const stopDrag = () => {
      isDragging = false;
      if (hasStarted) finishBeat7();
    };

    compassBox.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
    compassBox.addEventListener("touchstart", startDrag);
    document.addEventListener("touchmove", doDrag, { passive: false });
    document.addEventListener("touchend", stopDrag);

    let finished = false;
    async function finishBeat7() {
      if (finished) return;
      finished = true;
      compassBox.querySelector(".compass-label").innerText = "Path Found.";
      needle.style.transition = "transform 2s cubic-bezier(0.25, 1, 0.5, 1)";
      needle.style.transform = `rotate(${totalRotation + 360}deg)`;
      await wait(2500);
      fadeOverlay.style.opacity = 1;
      await wait(2000);
      section.classList.remove("active-section");
      runBeat8();
    }
  }

  // --- BEAT 8: TRAIL (PASSIVE) ---
  async function runBeat8() {
    const section = document.getElementById("beat8");
    section.classList.add("active-section");
    fadeOverlay.style.opacity = 0;

    const textContainer = document.getElementById("beat8Text");
    const darkOverlay = document.getElementById("beat8-darkness");
    const canvasContainer = document.getElementById("forest-canvas-container");

    // THREE JS SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a1d2e, 0.06);
    scene.background = new THREE.Color(0x1a1d2e);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 5);
    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.innerHTML = "";
    canvasContainer.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const barkTex = loader.load("bark.jpg");
    barkTex.wrapS = THREE.RepeatWrapping;
    barkTex.wrapT = THREE.RepeatWrapping;
    barkTex.repeat.set(1, 4);
    const groundTex = loader.load("ground.jpg");
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(10, 10);

    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    const treeMat = new THREE.MeshStandardMaterial({
      map: barkTex,
      color: 0x666666,
    });
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      color: 0x444444,
    });

    const treeGeo = new THREE.CylinderGeometry(0.2, 0.4, 4.5, 8);
    for (let i = 0; i < 200; i++) {
      const tree = new THREE.Mesh(treeGeo, treeMat);
      let x = (Math.random() - 0.5) * 30;
      if (x > -1.5 && x < 1.5) x += 3.5;
      tree.position.set(x, 0, -(Math.random() * 80) + 5);
      scene.add(tree);
    }
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    scene.add(ground);

    let speed = 0.05;
    const animate = () => {
      if (!section.classList.contains("active-section")) return;
      requestAnimationFrame(animate);
      camera.position.z -= speed;

      ground.position.z = camera.position.z;
      groundTex.offset.y -= speed * 0.2;

      scene.children.forEach((child) => {
        if (
          child.geometry &&
          child.geometry.type === "CylinderGeometry" &&
          child.position.z > camera.position.z + 5
        ) {
          child.position.z -= 80;
        }
      });
      renderer.render(scene, camera);
    };
    animate();

    await wait(1500);

    const lines = [
      "You step off the road.",
      "The sidewalk ends here. The dirt begins.",
      "The noise of the city fades behind you.",
      "The air shifts. Quieter. Cooler.",
      "It’s darker here, but your eyes adjust.",
      "You are walking away from who you were an hour ago.",
      "Deeper in. Just you and the trees.",
      "You keep moving forward.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      p.innerText = txt;
      p.style.opacity = 0;
      p.style.transition = "opacity 1.5s ease";
      textContainer.appendChild(p);
      void p.offsetWidth;
      p.style.opacity = 1;
      await wait(3500);
    }

    darkOverlay.style.transition = "opacity 3s";
    darkOverlay.style.opacity = 0;

    await wait(4000);
    fadeOverlay.style.opacity = 1;
    await wait(2000);
    renderer.dispose();
    section.classList.remove("active-section");
    runBeat9();
  }

  // --- BEAT 9: GLOW (Hold) ---
  async function runBeat9() {
    const section = document.getElementById("beat9");
    section.classList.add("active-section");
    fadeOverlay.style.opacity = 0;
    const textContainer = document.getElementById("beat9Text");
    const glowBox = document.getElementById("glowContainer");
    const glowUI = document.getElementById("glowCircle");
    const canvasContainer = document.getElementById(
      "clearing-canvas-container"
    );

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a1d2e, 0.05);
    scene.background = new THREE.Color(0x1a1d2e);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 5);
    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.innerHTML = "";
    canvasContainer.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const barkTex = loader.load("bark.jpg");
    barkTex.wrapS = THREE.RepeatWrapping;
    barkTex.wrapT = THREE.RepeatWrapping;
    barkTex.repeat.set(1, 4);
    const groundTex = loader.load("ground.jpg");
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(10, 10);

    const treeMat = new THREE.MeshStandardMaterial({
      map: barkTex,
      color: 0x666666,
    });
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      color: 0x444444,
    });
    const fireLight = new THREE.PointLight(0xff6600, 1.5, 60);
    fireLight.position.set(0, 2, -15);
    scene.add(fireLight);
    scene.add(new THREE.AmbientLight(0x404040, 1.0));

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    scene.add(ground);

    const treeGeo = new THREE.CylinderGeometry(0.2, 0.5, 5, 8);
    for (let i = 0; i < 100; i++) {
      const tree = new THREE.Mesh(treeGeo, treeMat);
      let x = (Math.random() - 0.5) * 60;
      if (x > -6 && x < 6) continue;
      tree.position.set(x, 0.5, -(Math.random() * 50) + 5);
      scene.add(tree);
    }

    const partGeo = new THREE.BufferGeometry();
    const partCount = 200;
    const pPos = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i++)
      pPos[i] = (Math.random() - 0.5) * 30;
    partGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const partMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffaa00 });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    let holding = false;
    let flickerTime = 0;

    const statusText = glowBox.querySelector("p");

    const animate = () => {
      if (!section.classList.contains("active-section")) return;
      requestAnimationFrame(animate);
      flickerTime += 0.1;

      particles.rotation.y += 0.002;

      if (holding) {
        fireLight.intensity = 2.5;
        camera.position.z -= 0.04;
        particles.rotation.y += 0.01;

        scene.fog.color.lerp(new THREE.Color(0x3a2010), 0.02);

        glowUI.style.transform = "scale(0.9)";
        glowUI.style.borderColor = "#ffffff";
        glowUI.style.boxShadow = "0 0 20px #ffaa00";
      } else {
        fireLight.intensity = 1.5 + Math.sin(flickerTime) * 0.5;
        glowUI.style.transform = "scale(1)";
        glowUI.style.borderColor = "#ffaa00";
        glowUI.style.boxShadow = "none";
      }
      renderer.render(scene, camera);
    };
    animate();

    await wait(1000);
    const lines = [
      "The trees part.",
      "A clearing opens up, bathed in a strange, quiet light.",
      "The air smells like rain and woodsmoke.",
      "Ahead, past the tall grass...",
      "A faint orange glow flickers.",
      "You feel a pull in your chest—magnetic, ancient.",
    ];

    for (let txt of lines) {
      const p = document.createElement("p");
      p.innerText = txt;
      p.style.opacity = 0;
      p.style.transition = "opacity 1s ease";
      textContainer.appendChild(p);
      void p.offsetWidth;
      p.style.opacity = 1;
      await wait(2500);
    }

    glowBox.classList.remove("hidden");
    glowBox.style.opacity = 1;

    return new Promise((resolve) => {
      let progress = 0;
      let finished = false;
      const updateState = () => {
        if (finished) return;
        if (holding) progress += 0.4;
        else progress -= 1;
        if (progress < 0) progress = 0;

        if (progress > 20 && progress < 50) statusText.innerText = "Walking...";
        else if (progress >= 50 && progress < 80)
          statusText.innerText = "The light grows...";
        else if (progress >= 80) statusText.innerText = "Almost there...";
        else if (progress === 0)
          statusText.innerText = "Hold to steady the signal";

        if (progress >= 100) {
          finished = true;
          finishBeat9();
        } else requestAnimationFrame(updateState);
      };
      const start = () => {
        holding = true;
      };
      const end = () => {
        holding = false;
      };
      glowBox.addEventListener("mousedown", start);
      document.addEventListener("mouseup", end);
      glowBox.addEventListener("touchstart", (e) => {
        e.preventDefault();
        start();
      });
      document.addEventListener("touchend", end);
      requestAnimationFrame(updateState);

      async function finishBeat9() {
        statusText.innerText = "Here.";
        await wait(2000);
        fadeOverlay.style.opacity = 1;
        await wait(2000);
        renderer.dispose();
        section.classList.remove("active-section");
        runBeat10();
        resolve();
      }
    });
  }

  // --- BEAT 10: EMBER (Full Screen Click) ---
  async function runBeat10() {
    const section = document.getElementById("beat10");
    section.classList.add("active-section");
    fadeOverlay.style.opacity = 0;
    const textContainer = document.getElementById("beat10Text");
    const emberBox = document.getElementById("emberContainer");
    const canvasContainer = document.getElementById("ember-canvas-container");

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050200);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.innerHTML = "";
    canvasContainer.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const fireTex = loader.load("fire_particle.png");
    const geometry = new THREE.BufferGeometry();
    const positions = [],
      colors = [],
      sizes = [];
    for (let i = 0; i < 800; i++) {
      const r = Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      colors.push(1, 0.5, 0);
      sizes.push(Math.random() * 1.5);
    }
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
    const material = new THREE.PointsMaterial({
      size: 0.5,
      map: fireTex,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.8,
    });
    const fireParticles = new THREE.Points(geometry, material);

    // 🔥 FIRE POSITION AT BOTTOM
    fireParticles.position.y = -1.5;

    scene.add(fireParticles);

    let holding = false;
    let intensity = 1;
    const animate = () => {
      if (!section.classList.contains("active-section")) return;
      requestAnimationFrame(animate);
      fireParticles.rotation.y += 0.002 * intensity;
      if (holding) {
        intensity += 0.05;
        if (intensity > 4) intensity = 4;
        camera.position.z = 5 - intensity * 0.6;
      } else {
        intensity -= 0.1;
        if (intensity < 1) intensity = 1;
        camera.position.z = 5;
      }
      renderer.render(scene, camera);
    };
    animate();

    await wait(1000);
    const lines = ["You see it close now.", "A soft orange flicker.", "Reach."];
    for (let txt of lines) {
      const p = document.createElement("p");
      p.innerText = txt;
      p.style.opacity = 0;
      p.style.transition = "opacity 1s ease";
      textContainer.appendChild(p);
      void p.offsetWidth;
      p.style.opacity = 1;
      await wait(2000);
    }
    emberBox.classList.remove("hidden");
    emberBox.style.opacity = 1;

    return new Promise((resolve) => {
      let progress = 0;
      let finished = false;
      const updateEmber = () => {
        if (finished) return;
        if (holding) progress += 0.6;
        else progress -= 1;
        if (progress < 0) progress = 0;
        if (progress >= 100) {
          finished = true;
          finishBeat10();
        } else requestAnimationFrame(updateEmber);
      };
      const start = () => {
        holding = true;
      };
      const end = () => {
        holding = false;
      };

      // 🔥 GLOBAL EVENT LISTENER FOR FULL SCREEN CLICK
      document.addEventListener("mousedown", start);
      document.addEventListener("mouseup", end);
      document.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          start();
        },
        { passive: false }
      );
      document.addEventListener("touchend", end);

      requestAnimationFrame(updateEmber);

      async function finishBeat10() {
        // Clean up listeners
        document.removeEventListener("mousedown", start);
        document.removeEventListener("touchstart", start);

        emberBox.querySelector("p").innerText = "Reach.";
        material.size = 5.0;
        scene.background = new THREE.Color(0xffaa00);
        await wait(1500);
        fadeOverlay.style.opacity = 1;
        await wait(2000);
        window.location.href = "../campfire/campfire.html?role=drifter";
        resolve();
      }
    });
  }

  startExperience();
});
