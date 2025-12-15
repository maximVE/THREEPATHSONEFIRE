// --- SAFETY NET ---
window.addEventListener("load", () => {
  const overlay = document.getElementById("fade-overlay");
  if (overlay)
    setTimeout(() => {
      overlay.style.opacity = 0;
    }, 500);
});

document.addEventListener("DOMContentLoaded", () => {
  // 1. DATA SETUP
  const urlParams = new URLSearchParams(window.location.search);
  const currentRole = urlParams.get("role") || "settler";

  archetypeData = {
    drifter: {
      name: "The Drifter",
      line: "“I always tought that gaming was the life made for me, thinking that it would be how I made my money in doing so I tought that nothing else was left for me to do. Thinking that i had no other path, this journey made me realize that It is a naïve way of thinking and that purpose comes from within not from out there”",
      color: 0x0088ff, // Deep Blue
    },
    settler: {
      name: "The Settler",
      line: "“I always thought that the steady rhythm of a 9-to-5 was the life made for me, thinking that because I grew up before the noise of the digital age, this standard path was the only 'real' way to live. In doing so, I thought purpose was simply about showing up and doing the work. This journey made me realize that routine isn’t the same as meaning, and that even without digital distractions, you can still lose yourself if you never ask what you actually want.”",
      color: 0xffaa00, // Warm Amber
    },
    keeper: {
      name: "The Keeper",
      line: "“I always thought that stability was the life made for me, thinking that my passion for digital creation was just a hobby, too risky to build a future on. In doing so, I buried the tools that made me feel alive to chase a safe paycheck. This journey made me realize that suppressing my spark isn't maturity, and that purpose comes from creating with the technology I love, not just surviving alongside it.”",
      color: 0x00ff88, // Spirit Green
    },
  };

  const roles = ["drifter", "settler", "keeper"];
  const waitingRoles = roles.filter((r) => r !== currentRole);

  // --- THREE.JS VARIABLES ---
  let scene, camera, renderer, raycaster, mouse;
  let figures = [];
  let fireLight,
    fireParticles = [];

  // State
  let canClickSpirits = false;
  let visitedRoles = new Set();
  let isBubbleOpen = false;

  function initThree() {
    const container = document.getElementById("canvas-container");
    scene = new THREE.Scene();
    // Deep blue/black fog for atmosphere
    scene.fog = new THREE.FogExp2(0x050510, 0.06);

    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    // Position camera lower for immersive feel
    camera.position.set(0, 1.2, 5.5);
    camera.lookAt(0, 0.5, 0);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadows
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambient = new THREE.HemisphereLight(0x111122, 0x050505, 0.3);
    scene.add(ambient);

    // Campfire Light (Casts shadows)
    fireLight = new THREE.PointLight(0xff6600, 1.5, 20);
    fireLight.position.set(0, 0.5, 0);
    fireLight.castShadow = true;
    scene.add(fireLight);

    // --- ENVIRONMENT ---
    createTerrain();
    createDetailedForest();
    createCampfire();

    // --- FIGURES (Humanoid) ---
    createHumanSpirit(waitingRoles[0], -2.2, 0.5); // Left
    createHumanSpirit(waitingRoles[1], 2.2, 0.5); // Right

    // --- RAYCASTER ---
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    window.addEventListener("click", onMouseClick);
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("resize", onWindowResize);

    animate();
  }

  function createTerrain() {
    const geo = new THREE.PlaneGeometry(60, 60, 64, 64);
    const posAttribute = geo.attributes.position;

    for (let i = 0; i < posAttribute.count; i++) {
      const x = posAttribute.getX(i);
      const y = posAttribute.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      let z = (Math.random() - 0.5) * 0.2; // Noise
      if (dist > 3) z += (dist - 3) * 0.2; // Rise at edges
      posAttribute.setZ(i, z);
    }

    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 1,
    });
    const ground = new THREE.Mesh(geo, mat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
  }

  function createDetailedForest() {
    const trunkGeo = new THREE.CylinderGeometry(0.1, 0.3, 4, 7);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 1,
    });
    const leavesGeo = new THREE.ConeGeometry(1.5, 5, 7);
    const leavesMat = new THREE.MeshStandardMaterial({
      color: 0x051a05,
      roughness: 1,
    });

    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 6 + Math.random() * 8;

      const tree = new THREE.Group();
      tree.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);

      const s = 0.8 + Math.random() * 0.6;
      tree.scale.set(s, s, s);

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 2;
      trunk.castShadow = true;
      tree.add(trunk);

      const leaves = new THREE.Mesh(leavesGeo, leavesMat);
      leaves.position.y = 4.5;
      leaves.castShadow = true;
      tree.add(leaves);

      scene.add(tree);
    }
  }

  function createCampfire() {
    // Logs
    const logMat = new THREE.MeshStandardMaterial({ color: 0x331100 });
    const l1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.7),
      logMat
    );
    l1.rotation.set(Math.PI / 2.5, Math.PI / 4, 0);
    l1.position.y = 0.1;
    const l2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.7),
      logMat
    );
    l2.rotation.set(-Math.PI / 2.5, -Math.PI / 4, 0);
    l2.position.y = 0.1;
    scene.add(l1, l2);

    // Fire Particles
    const pGeo = new THREE.TetrahedronGeometry(0.08);
    const pMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
    });

    for (let i = 0; i < 40; i++) {
      const p = new THREE.Mesh(pGeo, pMat);
      resetParticle(p);
      scene.add(p);
      fireParticles.push(p);
    }
  }

  function resetParticle(p) {
    p.position.set(
      (Math.random() - 0.5) * 0.3,
      Math.random() * 0.3,
      (Math.random() - 0.5) * 0.3
    );
    p.scale.setScalar(1);
    p.userData = {
      speed: 0.01 + Math.random() * 0.02,
      drift: (Math.random() - 0.5) * 0.01,
    };
  }

  // --- CREATE HUMANOID SPIRIT ---
  function createHumanSpirit(role, x, z) {
    const group = new THREE.Group();
    const color = archetypeData[role].color;

    const mat = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.7,
      roughness: 0.2,
      metalness: 0.1,
    });

    // 1. Head (Sphere)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), mat);
    head.position.y = 1.6;
    group.add(head);

    // 2. Body (Cloak - Tapered Cylinder)
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.45, 1.4, 16),
      mat
    );
    body.position.y = 0.7;
    group.add(body);

    group.position.set(x, 0, z);
    group.lookAt(0, 0.8, 0); // Face fire

    // Data for Raycasting
    group.userData = { role: role, isSpirit: true, initialY: 0 };

    // Personal Light
    const pLight = new THREE.PointLight(color, 0.8, 4);
    pLight.position.set(x, 1.5, z);
    scene.add(pLight);

    scene.add(group);
    figures.push(group);
  }

  function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    // 1. Fire Flicker
    fireLight.intensity =
      1.2 + Math.sin(time * 10) * 0.3 + Math.cos(time * 23) * 0.3;
    fireLight.position.x = Math.sin(time * 3) * 0.1;

    // 2. Particles
    fireParticles.forEach((p) => {
      p.position.y += p.userData.speed;
      p.position.x += p.userData.drift;
      p.rotation.x += 0.1;
      p.scale.setScalar(1 - p.position.y * 1.5);
      if (p.position.y > 0.8 || p.scale.x <= 0) resetParticle(p);
    });

    // 3. Spirits Breathing
    figures.forEach((fig, i) => {
      fig.position.y = Math.sin(time + i) * 0.03;
    });

    renderer.render(scene, camera);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // --- INTERACTION LOGIC ---
  function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    handleInteraction();
  }

  function onTouchStart(event) {
    event.preventDefault();
    mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    handleInteraction();
  }

  function handleInteraction() {
    if (!canClickSpirits || isBubbleOpen) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(figures, true);

    if (intersects.length > 0) {
      let target = intersects[0].object;
      // Traverse up to find Group
      while (target.parent && !target.userData.isSpirit) {
        target = target.parent;
      }
      if (target.userData.isSpirit) {
        openDialogue(target.userData.role);
      }
    }
  }

  // --- UI LOGIC ---
  const mainText = document.getElementById("main-text");
  const continueBtn = document.getElementById("continue-btn");
  const finalChoiceDiv = document.getElementById("final-choice-container");

  function openDialogue(role) {
    isBubbleOpen = true;
    visitedRoles.add(role);

    // Hide hint
    const hint = document.getElementById("interaction-hint");
    if (hint) hint.style.opacity = 0;

    const area = document.getElementById("dialogue-area");
    area.innerHTML = "";

    const bubble = document.createElement("div");
    bubble.className = "dialogue-bubble";

    // Close Button (X)
    const closeBtn = document.createElement("span");
    closeBtn.className = "close-btn";
    closeBtn.innerHTML = "✕";
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      closeDialogue();
    };

    const text = document.createElement("div");
    text.innerHTML = `<strong style="color:${
      "#" + archetypeData[role].color.toString(16)
    }">${archetypeData[role].name}</strong><br><br>${archetypeData[role].line}`;

    bubble.appendChild(closeBtn);
    bubble.appendChild(text);
    area.appendChild(bubble);
  }

  function closeDialogue() {
    const area = document.getElementById("dialogue-area");
    area.innerHTML = "";
    isBubbleOpen = false;

    // Show Continue if both visited
    if (visitedRoles.size === 2) {
      continueBtn.classList.remove("hidden");
    }
  }

  async function showLine(text) {
    const p = document.createElement("p");
    p.innerHTML = text;
    mainText.appendChild(p);
    void p.offsetWidth;
    p.classList.add("visible");
    await new Promise((r) => setTimeout(r, 2500));
  }

  async function startStory() {
    await new Promise((r) => setTimeout(r, 1000));
    await showLine("You step into the clearing.");
    await showLine("In the center: a small fire, steady and warm.");

    await new Promise((r) => setTimeout(r, 1000));
    mainText.innerHTML = "";

    await showLine("Two figures are waiting.");
    await showLine("They are the possibilities you didn't choose.");

    await new Promise((r) => setTimeout(r, 2000));
    mainText.innerHTML = "";

    const hint = document.createElement("p");
    hint.id = "interaction-hint";
    hint.innerHTML = "<em>(Tap the spirits to listen)</em>";
    hint.style.color = "#888";
    hint.style.fontSize = "0.9rem";
    hint.style.opacity = 0;
    hint.style.transition = "opacity 1s";
    mainText.appendChild(hint);
    setTimeout(() => (hint.style.opacity = 1), 100);

    canClickSpirits = true;
  }

  // --- BUTTONS ---
  continueBtn.addEventListener("click", async () => {
    canClickSpirits = false;
    continueBtn.classList.add("hidden");
    mainText.innerHTML = "";

    await showLine("They smile.");
    await showLine("They know you made the right choice.");

    await new Promise((r) => setTimeout(r, 1500));
    mainText.innerHTML = "";

    finalChoiceDiv.classList.remove("hidden");
  });

  document.getElementById("btn-yes").addEventListener("click", () => {
    window.location.href = "../reflection/reflection.html?role=" + currentRole;
  });

  document.getElementById("btn-no").addEventListener("click", () => {
    document.getElementById("fade-overlay").style.opacity = 1;
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
  });

  initThree();
  startStory();
});
