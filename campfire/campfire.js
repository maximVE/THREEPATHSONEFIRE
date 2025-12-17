// --- SAFETY NET ---
window.addEventListener('load', () => {
    const overlay = document.getElementById("fade-overlay");
    if(overlay) setTimeout(() => { overlay.style.opacity = 0; }, 500);
});

document.addEventListener("DOMContentLoaded", () => {
    
    // --- PREVENT DOUBLE RUNNING ---
    if (window.hasCampfireStarted) return;
    window.hasCampfireStarted = true;

    // 1. DATA SETUP
    const urlParams = new URLSearchParams(window.location.search);
    const currentRole = urlParams.get('role') || 'settler'; 

    const archetypeData = {
        drifter: {
            name: "The Drifter",
            line: "I always tought that gaming was the life made for me, thinking that it would be how I made my money in doing so I tought that nothing else was left for me to do. Thinking that i had no other path, this journey made me realize that It is a naïve way of thinking and that purpose comes from within not from out there",
            color: 0x0088ff 
        },
        settler: {
            name: "The Settler",
            line: "I always thought that stability was the life made for me, thinking that my passion for digital creation was just a hobby, too risky to build a future on. In doing so, I buried the tools that made me feel alive to chase a safe paycheck. This journey made me realize that suppressing my spark isn't maturity, and that purpose comes from creating with the technology I love, not just surviving alongside it.",
            color: 0xffaa00 
        },
        keeper: {
            name: "The Keeper", 
            line: "I always thought that stability was the life made for me, thinking that my passion for digital creation was just a hobby, too risky to build a future on. In doing so, I buried the tools that made me feel alive to chase a safe paycheck. This journey made me realize that suppressing my spark isn't maturity, and that purpose comes from creating with the technology I love, not just surviving alongside it",
            color: 0x00ff88 
        }
    };

    const roles = ['drifter', 'settler', 'keeper'];
    const waitingRoles = roles.filter(r => r !== currentRole);

    // --- THREE.JS VARIABLES ---
    let scene, camera, renderer, raycaster, mouse;
    let figures = [];
    let fireLight, fireParticles = [];
    let spiritParticles = [];
    
    // Camera Animation State
    let targetCameraPos = new THREE.Vector3();
    let targetLookAt = new THREE.Vector3();
    // Define explicit default vectors
    const defaultLookAt = new THREE.Vector3(0, 0.5, 0); 
    let defaultCamPos = new THREE.Vector3(0, 1.2, 5.5);

    // Interaction State
    let canClickSpirits = false;
    let visitedRoles = new Set();
    let isBubbleOpen = false;

    function initThree() {
        const container = document.getElementById("canvas-container");
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050508, 0.04); 

        const aspect = window.innerWidth / window.innerHeight;
        camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
        
        // Mobile Adjustment
        if(aspect < 1.0) {
            defaultCamPos.set(0, 1.5, 8.5); 
        } else {
            defaultCamPos.set(0, 1.2, 5.5); 
        }

        // Initialize Camera
        camera.position.copy(defaultCamPos);
        targetCameraPos.copy(defaultCamPos);
        targetLookAt.copy(defaultLookAt);

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // LIGHTING
        const ambient = new THREE.HemisphereLight(0x111122, 0x050505, 0.4);
        scene.add(ambient);

        fireLight = new THREE.PointLight(0xff6600, 1.5, 25);
        fireLight.position.set(0, 1, 0);
        fireLight.castShadow = true;
        scene.add(fireLight);

        // ENVIRONMENT
        createTerrain();
        createPineForest();
        createDetailedCampfire();

        // FIGURES
        const spread = aspect < 1.0 ? 1.8 : 2.5; 
        createSittingMannequin(waitingRoles[0], -spread, 0, 0.6); // Left
        createSittingMannequin(waitingRoles[1], spread, 0, -0.6);  // Right

        // RAYCASTER
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        
        // Listeners (Passive false for touch to allow preventDefault)
        window.addEventListener('click', onMouseClick);
        window.addEventListener('touchstart', onTouchStart, {passive: false});
        window.addEventListener('resize', onWindowResize);

        animate();
    }

    function createSittingMannequin(role, x, z, rotY) {
        const color = archetypeData[role].color;
        const group = new THREE.Group();

        // LOG
        const logGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8);
        const logMat = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 1 });
        const log = new THREE.Mesh(logGeo, logMat);
        log.rotation.x = Math.PI / 2; 
        log.rotation.z = Math.PI / 2; 
        log.position.y = 0.2; 
        log.castShadow = true;
        log.receiveShadow = true;
        
        const logGroup = new THREE.Group();
        logGroup.position.set(x, 0, z);
        logGroup.rotation.y = rotY; 
        logGroup.add(log);
        scene.add(logGroup);

        // MATERIAL
        const mat = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.6,
            roughness: 0.2,
            metalness: 0.5,
            transparent: true,
            opacity: 0.9
        });

        // BODY PARTS
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.25), mat);
        torso.position.y = 0.7; 
        torso.castShadow = true;
        group.add(torso);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), mat);
        head.position.y = 1.15;
        group.add(head);

        const upperLegGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.5);
        const lowerLegGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.5);

        const legL1 = new THREE.Mesh(upperLegGeo, mat);
        legL1.position.set(-0.12, 0.45, 0.25);
        legL1.rotation.x = -Math.PI / 2; 
        legL1.rotation.z = 0.1;
        group.add(legL1);

        const legL2 = new THREE.Mesh(lowerLegGeo, mat);
        legL2.position.set(-0.15, 0.2, 0.5); 
        group.add(legL2);

        const legR1 = new THREE.Mesh(upperLegGeo, mat);
        legR1.position.set(0.12, 0.45, 0.25);
        legR1.rotation.x = -Math.PI / 2;
        legR1.rotation.z = -0.1;
        group.add(legR1);

        const legR2 = new THREE.Mesh(lowerLegGeo, mat);
        legR2.position.set(0.15, 0.2, 0.5);
        group.add(legR2);

        const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.55);
        const armL = new THREE.Mesh(armGeo, mat);
        armL.position.set(-0.25, 0.7, 0.1);
        armL.rotation.x = -Math.PI / 4; 
        armL.rotation.z = 0.2;
        group.add(armL);

        const armR = new THREE.Mesh(armGeo, mat);
        armR.position.set(0.25, 0.7, 0.1);
        armR.rotation.x = -Math.PI / 4;
        armR.rotation.z = -0.2;
        group.add(armR);

        group.position.set(x, 0, z);
        group.rotation.y = rotY;

        group.userData = { role: role, isSpirit: true };
        
        const pLight = new THREE.PointLight(color, 1.2, 5);
        pLight.position.set(x, 1.2, z);
        scene.add(pLight);

        // SMOKE
        const particleGeo = new THREE.TetrahedronGeometry(0.05);
        const particleMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.6 });
        for(let i=0; i<15; i++) {
            const p = new THREE.Mesh(particleGeo, particleMat);
            p.position.set(x + (Math.random()-0.5)*0.5, Math.random()*1.5, z + (Math.random()-0.5)*0.5);
            p.userData = { originX: x, originZ: z, speed: 0.005 + Math.random()*0.01 };
            scene.add(p);
            spiritParticles.push(p);
        }

        scene.add(group);
        figures.push(group);
    }

    // --- ENVIRONMENT ---
    function createTerrain() {
        const geo = new THREE.PlaneGeometry(80, 80, 64, 64);
        const pos = geo.attributes.position;
        for(let i=0; i<pos.count; i++){
            const x = pos.getX(i);
            const y = pos.getY(i);
            const dist = Math.sqrt(x*x + y*y);
            let z = (Math.random() - 0.5) * 0.2;
            if(dist > 4) z += (Math.random()) * 0.5; 
            pos.setZ(i, z);
        }
        geo.computeVertexNormals();
        const mat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.9 });
        const ground = new THREE.Mesh(geo, mat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);
    }

    function createPineForest() {
        const trunkGeo = new THREE.CylinderGeometry(0.1, 0.2, 1.5);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x2a1d15 });
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x0a1f0a });
        const c1g = new THREE.ConeGeometry(1.5, 3, 7);
        const c2g = new THREE.ConeGeometry(1.2, 2.5, 7);
        const c3g = new THREE.ConeGeometry(0.9, 2, 7);

        for(let i=0; i<60; i++) {
            const angle = (i / 60) * Math.PI * 2 + (Math.random()*0.2);
            const dist = 7 + Math.random() * 15; 
            const tree = new THREE.Group();
            tree.position.set(Math.cos(angle)*dist, 0, Math.sin(angle)*dist);
            
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.y = 0.75; trunk.castShadow = true; tree.add(trunk);
            const c1 = new THREE.Mesh(c1g, leavesMat); c1.position.y = 2.0; tree.add(c1);
            const c2 = new THREE.Mesh(c2g, leavesMat); c2.position.y = 3.5; tree.add(c2);
            const c3 = new THREE.Mesh(c3g, leavesMat); c3.position.y = 5.0; tree.add(c3);

            const s = 0.8 + Math.random()*0.5;
            tree.scale.set(s,s,s);
            scene.add(tree);
        }
    }

    function createDetailedCampfire() {
        const logMat = new THREE.MeshStandardMaterial({ color: 0x442211, roughness: 1 });
        const logGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.2, 6);
        const l1 = new THREE.Mesh(logGeo, logMat); l1.position.set(0.2, 0.3, 0); l1.rotation.set(0, 0, -0.5);
        const l2 = new THREE.Mesh(logGeo, logMat); l2.position.set(-0.2, 0.3, 0.2); l2.rotation.set(0.5, 0, 0.5);
        const l3 = new THREE.Mesh(logGeo, logMat); l3.position.set(0, 0.3, -0.3); l3.rotation.set(-0.5, 0, 0.5);
        
        const group = new THREE.Group();
        group.add(l1, l2, l3);
        scene.add(group);

        const pGeo = new THREE.OctahedronGeometry(0.08, 0);
        const pMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true });
        for(let i=0; i<80; i++){
            const p = new THREE.Mesh(pGeo, pMat);
            resetParticle(p);
            scene.add(p);
            fireParticles.push(p);
        }
    }

    function resetParticle(p) {
        p.position.set((Math.random()-0.5)*0.4, Math.random()*0.5, (Math.random()-0.5)*0.4);
        p.scale.setScalar(Math.random() * 1.5);
        p.material.opacity = 1;
        p.userData = { speed: 0.02 + Math.random()*0.03, drift: (Math.random()-0.5)*0.01 };
    }

    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;

        // Camera Animation (Lerp)
        camera.position.lerp(targetCameraPos, 0.05);
        
        // Look At Interpolation
        const currentLook = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion).add(camera.position);
        currentLook.lerp(targetLookAt, 0.05);
        camera.lookAt(currentLook);

        // Fire
        if(fireLight) {
            fireLight.intensity = 1.5 + Math.sin(time * 15) * 0.3 + Math.random() * 0.2;
            fireLight.position.x = Math.sin(time * 3) * 0.05;
        }
        
        fireParticles.forEach(p => {
            p.position.y += p.userData.speed;
            p.position.x += p.userData.drift;
            p.scale.setScalar(1 - (p.position.y * 1.2));
            if(p.position.y > 0.8 || p.scale.x <= 0) resetParticle(p);
        });

        spiritParticles.forEach(p => {
            p.position.y += p.userData.speed;
            p.position.x = p.userData.originX + Math.sin(time + p.position.y*5) * 0.1;
            p.rotation.x += 0.02;
            p.material.opacity -= 0.01;
            if(p.material.opacity <= 0) {
                p.position.y = 0.5 + Math.random() * 0.5;
                p.material.opacity = 0.6;
            }
        });

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Recalculate Default Pos for Mobile
        if(camera.aspect < 1.0) {
            defaultCamPos.set(0, 1.5, 8.5); 
        } else {
            defaultCamPos.set(0, 1.2, 5.5);
        }
        
        // If no bubble is open, snap target to default immediately
        if(!isBubbleOpen) {
            targetCameraPos.copy(defaultCamPos);
        }
    }

    // --- INTERACTION ---
    function onMouseClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        handleInteraction();
    }

    function onTouchStart(event) {
        // Stop if clicking UI
        if(event.target.closest('.dialogue-bubble') || event.target.closest('button')) return;
        
        // Stop "Ghost Clicks"
        if(event.cancelable) event.preventDefault();
        
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
            // Walk up to parent
            while(target.parent && !target.userData.isSpirit) {
                target = target.parent;
            }
            if (target.userData.isSpirit) {
                openDialogue(target.userData.role, target.position);
            }
        }
    }

    // --- UI LOGIC ---
    const mainText = document.getElementById("main-text");
    const continueBtn = document.getElementById("continue-btn");
    const finalChoiceDiv = document.getElementById("final-choice-container");

    function openDialogue(role, position) {
        isBubbleOpen = true;
        visitedRoles.add(role);

        // Zoom Camera In
        targetCameraPos.set(position.x * 0.6, 1.2, 2.5);
        targetLookAt.copy(position);
        targetLookAt.y = 1.0; 

        const hint = document.getElementById("interaction-hint");
        if(hint) hint.style.opacity = 0;

        const area = document.getElementById("dialogue-area");
        area.innerHTML = "";

        const bubble = document.createElement("div");
        bubble.className = "dialogue-bubble";
        
        const closeBtn = document.createElement("span");
        closeBtn.className = "close-btn";
        closeBtn.innerHTML = "✕";
        
        // IMPORTANT: Stop propagation on close button
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault(); // Stop touch ghost clicks
            closeDialogue();
        };

        const text = document.createElement("div");
        text.innerHTML = `<strong style="color:${'#'+archetypeData[role].color.toString(16)}">${archetypeData[role].name}</strong><br><br>${archetypeData[role].line}`;

        bubble.appendChild(closeBtn);
        bubble.appendChild(text);
        area.appendChild(bubble);
        
        setTimeout(() => bubble.classList.add("active"), 500); 
    }

    function closeDialogue() {
        const area = document.getElementById("dialogue-area");
        area.innerHTML = "";
        
        // Zoom Camera Out
        targetCameraPos.copy(defaultCamPos);
        targetLookAt.copy(defaultLookAt);

        // Allow camera to pull back before enabling click
        setTimeout(() => {
            isBubbleOpen = false;
        }, 500);

        if (visitedRoles.size === 2) {
            setTimeout(() => {
                continueBtn.classList.remove("hidden");
            }, 800);
        }
    }

    async function showLine(text) {
        const p = document.createElement("p");
        p.innerHTML = text;
        mainText.appendChild(p);
        void p.offsetWidth;
        p.classList.add("visible");
        await new Promise(r => setTimeout(r, 2500));
    }

    async function startStory() {
        // AUDIO START
        const audio = document.getElementById("bg-music");
        if(audio) {
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Audio waiting for interaction"));
        }

        await new Promise(r => setTimeout(r, 1000));
        await showLine("You step into the clearing.");
        await showLine("In the center: a small fire, steady and warm.");
        
        await new Promise(r => setTimeout(r, 1000));
        mainText.innerHTML = "";
        
        await showLine("Two figures are waiting.");
        await showLine("They are the possibilities you didn't choose.");
        
        await new Promise(r => setTimeout(r, 2000));
        mainText.innerHTML = ""; 
        
        const hint = document.createElement("p");
        hint.id = "interaction-hint";
        hint.innerHTML = "<em>(Tap the spirits to listen)</em>";
        hint.style.color = "#888";
        hint.style.fontSize = "0.9rem";
        hint.style.opacity = 0;
        hint.style.transition = "opacity 1s";
        mainText.appendChild(hint);
        setTimeout(() => hint.style.opacity = 1, 100);

        canClickSpirits = true;
    }

    // --- BUTTONS ---
    if(continueBtn) {
        continueBtn.addEventListener("click", async () => {
            canClickSpirits = false;
            continueBtn.classList.add("hidden");
            mainText.innerHTML = "";
            
            await showLine("They smile.");
            await showLine("They know you made the right choice.");
            
            await new Promise(r => setTimeout(r, 1500));
            mainText.innerHTML = "";

            finalChoiceDiv.classList.remove("hidden");
        });
    }

    const btnYes = document.getElementById("btn-yes");
    if(btnYes) btnYes.addEventListener("click", () => {
        window.location.href = "../reflection/reflection.html?role=" + currentRole; 
    });

    const btnNo = document.getElementById("btn-no");
    if(btnNo) btnNo.addEventListener("click", () => {
        document.getElementById("fade-overlay").style.opacity = 1;
        setTimeout(() => {
            window.location.href = "../index.html"; 
        }, 2000);
    });

    initThree();
    startStory();
});
