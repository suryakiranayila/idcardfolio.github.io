    // Camera cursor
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.addEventListener('mousedown', () => cursor.classList.add('clicked'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicked'));

    // Dark mode toggle
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Default: light mode
    let isDark = false;

    // Check saved preference
    if (localStorage.getItem('theme') === 'dark') {
      isDark = true;
      html.classList.add('dark');
      toggle.textContent = '☀️';
      updateCursor(true);
    }

    toggle.addEventListener('click', () => {
      isDark = !isDark;
      html.classList.toggle('dark', isDark);
      toggle.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateCursor(isDark);
    });

    function updateCursor(dark) {
      const body = cursor.querySelector('rect');
      const path = cursor.querySelector('path');
      const circles = cursor.querySelectorAll('circle');
      if (dark) {
        body && (body.setAttribute('fill', '#DCCFC1'));
        path && (path.setAttribute('fill', '#DCCFC1'));
        circles[0] && circles[0].setAttribute('fill', '#393831');
        circles[0] && circles[0].setAttribute('stroke', '#DCCFC1');
        circles[1] && circles[1].setAttribute('fill', '#2e2d27');
        circles[1] && circles[1].setAttribute('stroke', '#B8AEA8');
        circles[2] && circles[2].setAttribute('fill', '#B8AEA8');
        circles[3] && circles[3].setAttribute('fill', '#F0EFE6');
      } else {
        body && (body.setAttribute('fill', '#393831'));
        path && (path.setAttribute('fill', '#393831'));
        circles[0] && circles[0].setAttribute('fill', '#F0EFE6');
        circles[0] && circles[0].setAttribute('stroke', '#393831');
        circles[1] && circles[1].setAttribute('fill', '#EAEAEA');
        circles[1] && circles[1].setAttribute('stroke', '#B8AEA8');
        circles[2] && circles[2].setAttribute('fill', '#B8AEA8');
        circles[3] && circles[3].setAttribute('fill', '#DCCFC1');
      }
    }

    // Nav active link on scroll
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-active');
          navLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        } else {
          entry.target.classList.remove('section-active');
        }
      });
    }, { threshold: 0.25 });
    sections.forEach(s => observer.observe(s));

    // Smooth reveal on scroll
    const revealEls = document.querySelectorAll('.project-card, .skill-group, .achievement-card, .interest-item, .edu-item');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, (i % 4) * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      revealObserver.observe(el);
    });

    // Draggable ID Card Logic
    const idCardWrapper = document.querySelector('.id-card-wrapper.desktop-card');
    const heroCardDragTarget = idCardWrapper ? idCardWrapper.querySelector('.hero-card') : null;

    if (idCardWrapper && heroCardDragTarget) {
      let isDragging = false;
      let startX, startY;
      let currentDragX = 0;
      let currentDragY = 0;

      heroCardDragTarget.style.cursor = 'grab';

      heroCardDragTarget.addEventListener('mousedown', (e) => {
        if (e.target.closest('a')) return;
        e.preventDefault(); 
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        currentDragX = parseFloat(idCardWrapper.style.getPropertyValue('--drag-x')) || 0;
        currentDragY = parseFloat(idCardWrapper.style.getPropertyValue('--drag-y')) || 0;
        
        heroCardDragTarget.style.cursor = 'grabbing';
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        idCardWrapper.style.setProperty('--drag-x', `${currentDragX + dx}px`);
        idCardWrapper.style.setProperty('--drag-y', `${currentDragY + dy}px`);
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          heroCardDragTarget.style.cursor = 'grab';
        }
      });

      // Lanyard Tracking Loop
      const cardHole = idCardWrapper ? idCardWrapper.querySelector('.card-hole') : null;
      const lanyard = document.getElementById('lanyard');
      const anchorRing = document.querySelector('.nav-anchor-ring');
      
      if (lanyard && cardHole && anchorRing) {
        function updateLanyard() {
          const anchorRect = anchorRing.getBoundingClientRect();
          const originX = anchorRect.left + anchorRect.width / 2;
          const originY = anchorRect.bottom;
          
          const chRect = cardHole.getBoundingClientRect();
          const targetX = chRect.left + chRect.width / 2;
          const targetY = chRect.top + chRect.height / 2;
          
          const dx = targetX - originX;
          const dy = targetY - originY;
          
          const dist = Math.sqrt(dx * dx + dy * dy);
          const length = Math.max(0, dist - 44); 
          
          const angleRad = Math.atan2(dy, dx);
          const angleDeg = angleRad * (180 / Math.PI) - 90;
          
          lanyard.style.height = `${length}px`;
          lanyard.style.transform = `rotate(${angleDeg}deg)`;
          
          requestAnimationFrame(updateLanyard);
        }
        requestAnimationFrame(updateLanyard);
      }
    }

    // ── NAVBAR SCROLL PROGRESS & LEVEL TRACKING ──
    const progressBar = document.getElementById('nav-progress-bar');
    const progressBean = document.getElementById('nav-progress-bean');
    const navLevelBadge = document.getElementById('nav-level-badge');
    const xpPercentEl = document.getElementById('barista-xp-percent');
    const titleNameEl = document.getElementById('barista-title-name');
    const brewsCountEl = document.getElementById('brews-served-count');

    let brewsServed = 0;
    let currentXP = 0;

    function updateScrollProgress() {
      if (!progressBar || !progressBean) return;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const scrollPercent = (window.scrollY / docHeight) * 100;
      
      progressBar.style.width = `${scrollPercent}%`;
      progressBean.style.left = `${scrollPercent}%`;
      
      updateBaristaExperience(scrollPercent);
    }

    function updateBaristaExperience(scrollPercent = 0) {
      const finalScrollPercent = typeof scrollPercent === 'number' ? scrollPercent : 0;
      const scrollContribution = finalScrollPercent * 0.2; // 0 to 20 XP from scrolling
      const brewContribution = brewsServed * 20; // 20 XP per successful brew
      
      currentXP = Math.floor(scrollContribution + brewContribution);
      
      let levelNum = 1;
      let title = "Espresso Novice";
      let progressInLevel = 0;
      
      if (currentXP < 20) {
        levelNum = 1;
        title = "Espresso Novice";
        progressInLevel = Math.round((currentXP / 20) * 100);
      } else if (currentXP < 40) {
        levelNum = 2;
        title = "Latte Artist";
        progressInLevel = Math.round(((currentXP - 20) / 20) * 100);
      } else if (currentXP < 70) {
        levelNum = 3;
        title = "Filter Connoisseur";
        progressInLevel = Math.round(((currentXP - 40) / 30) * 100);
      } else if (currentXP < 100) {
        levelNum = 4;
        title = "Barista Scholar";
        progressInLevel = Math.round(((currentXP - 70) / 30) * 100);
      } else {
        levelNum = 5;
        title = "Coffee Alchemist";
        progressInLevel = 100;
      }
      
      if (navLevelBadge) {
        const oldText = navLevelBadge.textContent;
        const newText = `Lvl ${levelNum}: ${title}`;
        if (oldText !== newText) {
          navLevelBadge.textContent = newText;
          navLevelBadge.classList.remove('pulse-highlight');
          void navLevelBadge.offsetWidth; // trigger reflow
          navLevelBadge.classList.add('pulse-highlight');
        }
      }
      
      if (titleNameEl) {
        titleNameEl.textContent = title;
      }
      
      if (xpPercentEl) {
        xpPercentEl.textContent = (progressInLevel === 100 && levelNum === 5) ? "MAX" : `${progressInLevel}%`;
      }
      
      if (brewsCountEl) {
        brewsCountEl.textContent = brewsServed;
      }
    }

    window.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('resize', updateScrollProgress);
    // Initialize
    updateScrollProgress();

    // ── WEB AUDIO SYNTHESIZER ──
    let audioCtx = null;

    function initAudio() {
      if (audioCtx) return;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    function playSound(type) {
      try {
        initAudio();
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        const dest = audioCtx.destination;

        if (type === 'click') {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(dest);
          
          osc.frequency.setValueAtTime(600, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.08);
          
          gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
          
          osc.start();
          osc.stop(audioCtx.currentTime + 0.08);
        } else if (type === 'reset') {
          // Glass clink click
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(dest);
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12);
          
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
          
          osc.start();
          osc.stop(audioCtx.currentTime + 0.12);
        } else if (type === 'pour') {
          // Whimsical rising bubble sound
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(dest);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(120 + Math.random() * 50, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(350 + Math.random() * 100, audioCtx.currentTime + 0.4);
          
          gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
          gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
          
          osc.start();
          osc.stop(audioCtx.currentTime + 0.4);
        } else if (type === 'success') {
          // Beautiful retro victory chime
          const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
          notes.forEach((freq, idx) => {
            const time = audioCtx.currentTime + idx * 0.07;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(dest);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);
            
            gain.gain.setValueAtTime(0.08, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
            
            osc.start(time);
            osc.stop(time + 0.22);
          });
        } else if (type === 'fail') {
          // Low detuned buzz
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(dest);
          
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(140, audioCtx.currentTime);
          osc.frequency.linearRampToValueAtTime(85, audioCtx.currentTime + 0.5);
          
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
          
          osc.start();
          osc.stop(audioCtx.currentTime + 0.5);
        }
      } catch (e) {
        console.warn("AudioContext block/error: ", e);
      }
    }

    // ── CONFETTI / SPARKLE PARTICLE SYSTEM ──
    const canvas = document.getElementById('confetti-canvas');
    let ctx = null;
    let particles = [];
    let animationId = null;

    if (canvas) {
      ctx = canvas.getContext('2d');
      function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
    }

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.3;
        const speed = 4 + Math.random() * 7;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.22;
        
        // Brown tones, gold, cream white, and sparkles
        this.colors = ['#393831', '#B8AEA8', '#DCCFC1', '#d4a03c', '#8b5a2b', '#ffffff', '#F0EFE6'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        this.size = 3.5 + Math.random() * 5.5;
        this.life = 1.0;
        this.decay = 0.012 + Math.random() * 0.018;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.25;
        
        this.type = Math.floor(Math.random() * 3); // 0: circle, 1: coffee bean, 2: star
      }

      update() {
        this.x += this.vx;
        this.vy += this.gravity;
        this.y += this.vy;
        this.life -= this.decay;
        this.rotation += this.rotSpeed;
      }

      draw(c) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);
        c.globalAlpha = this.life;
        c.fillStyle = this.color;
        c.strokeStyle = this.color;
        
        if (this.type === 0) {
          c.beginPath();
          c.arc(0, 0, this.size, 0, Math.PI * 2);
          c.fill();
        } else if (this.type === 1) {
          // Coffee bean
          c.beginPath();
          c.ellipse(0, 0, this.size, this.size * 0.65, 0, 0, Math.PI * 2);
          c.fill();
          
          c.strokeStyle = 'rgba(0,0,0,0.18)';
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(-this.size, 0);
          c.bezierCurveTo(-this.size/2, -this.size * 0.2, this.size/2, this.size * 0.2, this.size, 0);
          c.stroke();
        } else {
          // Sparkle
          c.beginPath();
          for (let i = 0; i < 4; i++) {
            c.lineTo(0, -this.size);
            c.rotate(Math.PI / 2);
          }
          c.closePath();
          c.fill();
        }
        c.restore();
      }
    }

    function triggerExplosion() {
      if (!canvas || !ctx) return;
      
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const startX = canvas.width / 2;
      const startY = canvas.height * 0.6;
      
      for (let i = 0; i < 45; i++) {
        particles.push(new Particle(startX, startY));
      }
      
      if (!animationId) {
        animateParticles();
      }
    }

    function animateParticles() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles = particles.filter(p => p.life > 0);
      
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      
      if (particles.length > 0) {
        animationId = requestAnimationFrame(animateParticles);
      } else {
        animationId = null;
      }
    }


    // ── GAME RECIPES & ORDERS ──
    const RECIPES = {
      "Espresso": ["espresso"],
      "Double Espresso": ["espresso", "espresso"],
      "Latte": ["espresso", "milk", "milk", "foam"],
      "Cappuccino": ["espresso", "milk", "foam", "foam"],
      "Macchiato": ["espresso", "foam"],
      "Caramel Macchiato": ["espresso", "milk", "foam", "caramel"],
      "Vanilla Latte": ["espresso", "milk", "foam", "vanilla"],
      "Iced Espresso": ["espresso", "ice"],
      "Iced Latte": ["espresso", "milk", "ice"],
      "Iced Caramel Vanilla Coffee": ["espresso", "milk", "caramel", "vanilla"],
      "Cinnamon Dolce Latte": ["espresso", "milk", "foam", "cinnamon"],
      "Spiced Iced Espresso": ["espresso", "ice", "cinnamon"],
      "Irish Coffee": ["espresso", "cream", "vanilla"],
      "Grand Alchemist Brew": ["espresso", "milk", "cream", "cinnamon"],
      "Chili Espresso (Spicy Shot)": ["espresso", "chili"],
      "Volcano Latte": ["espresso", "milk", "foam", "chili"],
      "Spicy Fire & Ice": ["espresso", "ice", "chili"]
    };

    const CUSTOMERS = [
      {
        name: "Ayila Surya Kiran (The AI Builder)",
        phrase: '"I have been debugging this agentic workflow for 6 hours. Build me a Double Espresso to overclock my brain!"',
        recipeName: "Double Espresso",
        successMsg: '"Perfect! The Double Espresso kicked in. Running at 1000 tokens per second!"',
        failMsg: '"Ugh, this is not a Double Espresso. My code just threw an OutOfMemoryException!"'
      },
      {
        name: "A Tired Technical Recruiter",
        phrase: '"I have reviewed 200 resumes today. I need a sweet Caramel Macchiato to restore my faith in humanity!"',
        recipeName: "Caramel Macchiato",
        successMsg: '"Oh my, this is fantastic! You have moved to the next round of interviews instantly!"',
        failMsg: '"This is not what I ordered. I might have to reject this application... just kidding, but please make it right!"'
      },
      {
        name: "GitHub Copilot",
        phrase: '"My server is running hot! I need an Iced Espresso to cool down my neural weights!"',
        recipeName: "Iced Espresso",
        successMsg: '"Optimal cooling achieved! Autocomplete confidence increased by 80%!"',
        failMsg: '"Syntax error: I asked for an Iced Espresso. This drink crashed my interpreter!"'
      },
      {
        name: "A UI/UX Designer",
        phrase: '"This alignment is off by 1px. I need a warm, aromatic Cinnamon Dolce Latte to unlock my creative focus!"',
        recipeName: "Cinnamon Dolce Latte",
        successMsg: '"Incredible! The cinnamon scent is mathematically soothing. 8px grid aligned!"',
        failMsg: '"This lacks aesthetics. I wanted a Cinnamon Dolce Latte, not this uninspired brew!"'
      },
      {
        name: "The Antigravity AI Agent",
        phrase: '"Pair programming is hard work. Pour me a warm Vanilla Latte so I can write bug-free code!"',
        recipeName: "Vanilla Latte",
        successMsg: '"Mmm, sweet and warm. Let\'s refactor this entire codebase now!"',
        failMsg: '"Warning: Invalid coffee signature. My lint compiler rejected this mixture!"'
      },
      {
        name: "A Tech Startup Founder",
        phrase: '"We just closed our pre-seed round! Build me a fancy Grand Alchemist Brew to celebrate!"',
        recipeName: "Grand Alchemist Brew",
        successMsg: '"Delicious! This drink is highly scalable. We are ready for Series A!"',
        failMsg: '"This doesn\'t taste venture-backed. It lacks the complex ingredients of an Alchemist Brew!"'
      },
      {
        name: "An Open-Source Contributor",
        phrase: '"I am resolving a merge conflict in a legacy codebase. Keep it simple — just a hot Espresso, please."',
        recipeName: "Espresso",
        successMsg: '"Ah, pure caffeine. Simple and effective. Pull request approved!"',
        failMsg: '"There is a conflict in this recipe. Too many dependencies added to my Espresso!"'
      },
      {
        name: "A Developer Advocate",
        phrase: '"I have a keynote in 10 minutes. Build me a Volcano Latte to ignite my stage presence!"',
        recipeName: "Volcano Latte",
        successMsg: '"WHOA! THAT IS SPICY! Stage energy is over 9000! Let\'s go!"',
        failMsg: '"My fire is gone. This drink didn\'t have the Ghost Pepper kick I needed!"'
      },
      {
        name: "Ayila Surya Kiran (The AI Builder)",
        phrase: '"My subagents are slacking. I need a Chili Espresso to fire up their multi-thread execution!"',
        recipeName: "Chili Espresso (Spicy Shot)",
        successMsg: '"Boom! Ghost pepper infused! Compilation speeds increased by 400%!"',
        failMsg: '"Where is the fire? My subagents just timed out!"'
      },
      {
        name: "A Bored VC Investor",
        phrase: '"I have seen 15 pitch decks today and I am falling asleep. Pour me a Spicy Fire & Ice. Convince me your startup is hot!"',
        recipeName: "Spicy Fire & Ice",
        successMsg: '"Incredible! The contrast of chili and ice is genius. Here is a term sheet!"',
        failMsg: '"This is boring. It lacks the heat and contrast of a hot startup idea!"'
      }
    ];

    let currentCup = [];
    let activeOrder = null;
    const maxLayers = 4;

    const liquidContainer = document.getElementById('mug-liquid-container');
    const emptyText = document.getElementById('empty-mug-text');
    const statusText = document.getElementById('pour-status');
    const steamContainer = document.querySelector('.steam-container');
    const pourStream = document.getElementById('pour-stream');

    const customerNameEl = document.getElementById('ticket-customer');
    const customerPhraseEl = document.getElementById('ticket-phrase');
    const targetRecipeNameEl = document.getElementById('ticket-target-name');
    const recipeFormulaEl = document.getElementById('recipe-formula');

    const btnReset = document.getElementById('btn-reset');
    const btnServe = document.getElementById('btn-serve');
    const ingredientButtons = document.querySelectorAll('.btn-ingredient');
    const brewBadge = document.getElementById('current-brew-badge');

    const STREAM_COLORS = {
      espresso: '#4A2C2A',
      milk: '#F4EBE1',
      foam: '#FFF8F0',
      caramel: '#D4A03C',
      vanilla: '#F2DCA2',
      ice: '#D4E8FC',
      cinnamon: '#8b5a2b',
      cream: '#FFFDF9',
      chili: '#FF2400'
    };

    function loadRandomOrder() {
      const randomIndex = Math.floor(Math.random() * CUSTOMERS.length);
      activeOrder = CUSTOMERS[randomIndex];
      
      if (customerNameEl) customerNameEl.textContent = activeOrder.name;
      if (customerPhraseEl) customerPhraseEl.textContent = activeOrder.phrase;
      if (targetRecipeNameEl) targetRecipeNameEl.textContent = activeOrder.recipeName;
      
      const ticketIdEl = document.querySelector('.ticket-id');
      if (ticketIdEl) {
        ticketIdEl.textContent = `TICKET #${Math.floor(Math.random() * 900 + 100)}`;
      }

      const recipeIngredients = RECIPES[activeOrder.recipeName];
      if (recipeFormulaEl && recipeIngredients) {
        const ingredientsDisplay = recipeIngredients.map(ing => {
          return ing.charAt(0).toUpperCase() + ing.slice(1);
        }).join(' + ');
        recipeFormulaEl.textContent = ingredientsDisplay;
      }
    }

    function detectRecipeName() {
      if (currentCup.length === 0) return "Empty Cup";
      
      const sortedCurrent = currentCup.slice().sort();
      
      for (const [recipeName, ingredients] of Object.entries(RECIPES)) {
        if (ingredients.length === sortedCurrent.length) {
          const sortedRecipe = ingredients.slice().sort();
          let match = true;
          for (let i = 0; i < sortedRecipe.length; i++) {
            if (sortedRecipe[i] !== sortedCurrent[i]) {
              match = false;
              break;
            }
          }
          if (match) return recipeName;
        }
      }
      return "Custom Blend";
    }

    function updateBrewBadge() {
      if (!brewBadge) return;
      const detected = detectRecipeName();
      
      if (detected === "Empty Cup") {
        brewBadge.textContent = "Empty Cup";
        brewBadge.classList.remove('discovered');
      } else if (detected === "Custom Blend") {
        brewBadge.textContent = "Custom Blend ⚗️";
        brewBadge.classList.remove('discovered');
      } else {
        brewBadge.textContent = `☕ ${detected}`;
        brewBadge.classList.add('discovered');
      }
    }

    function addIngredient(ingredient) {
      if (currentCup.length >= maxLayers) {
        playSound('click');
        if (statusText) statusText.textContent = "Cup is full! Reset or serve.";
        return;
      }

      playSound('pour');

      // Pour Stream animation
      if (pourStream) {
        pourStream.style.backgroundColor = STREAM_COLORS[ingredient] || '#FFF';
        pourStream.classList.remove('pouring');
        void pourStream.offsetWidth; // trigger reflow
        pourStream.classList.add('pouring');
      }

      if (emptyText) emptyText.style.display = 'none';

      currentCup.push(ingredient);

      const layer = document.createElement('div');
      layer.className = `liquid-layer ${ingredient}`;
      layer.style.height = `${100 / maxLayers}%`;
      
      if (liquidContainer) {
        liquidContainer.appendChild(layer);
      }

      if (statusText) {
        const capitalized = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
        statusText.textContent = `Poured: ${capitalized}`;
      }

      // Check for hot elements and ice
      const hasHot = currentCup.some(item => ['espresso', 'milk', 'foam', 'caramel', 'vanilla', 'cinnamon', 'chili'].includes(item));
      const hasIce = currentCup.includes('ice');
      const hasChili = currentCup.includes('chili');
      
      if (steamContainer) {
        if (hasHot && !hasIce) {
          steamContainer.style.opacity = '1';
        } else {
          steamContainer.style.opacity = '0';
        }
      }

      // Toggle hot fire steam particles if chili is present
      const steamParticles = document.querySelectorAll('.steam-particle');
      steamParticles.forEach(p => {
        if (hasChili) {
          p.classList.add('fire');
        } else {
          p.classList.remove('fire');
        }
      });

      updateBrewBadge();
    }

    function resetMug() {
      playSound('reset');
      currentCup = [];
      if (liquidContainer) {
        const layers = liquidContainer.querySelectorAll('.liquid-layer');
        layers.forEach(l => l.remove());
      }
      if (emptyText) emptyText.style.display = 'flex';
      if (statusText) statusText.textContent = "Cup reset. Pour something!";
      if (steamContainer) steamContainer.style.opacity = '0';

      // Clear fire steam
      const steamParticles = document.querySelectorAll('.steam-particle');
      steamParticles.forEach(p => p.classList.remove('fire'));
      
      updateBrewBadge();
    }

    function verifyRecipe() {
      if (!activeOrder) return false;
      const targetIngredients = RECIPES[activeOrder.recipeName];
      if (currentCup.length !== targetIngredients.length) return false;
      
      const sortedCurrent = currentCup.slice().sort();
      const sortedTarget = targetIngredients.slice().sort();
      
      for (let i = 0; i < sortedCurrent.length; i++) {
        if (sortedCurrent[i] !== sortedTarget[i]) return false;
      }
      return true;
    }

    function serveCoffee() {
      if (currentCup.length === 0) {
        playSound('click');
        if (statusText) statusText.textContent = "Cannot serve an empty cup!";
        return;
      }

      const isSuccess = verifyRecipe();

      if (isSuccess) {
        playSound('success');
        triggerExplosion();
        
        brewsServed++;
        if (statusText) {
          statusText.style.color = '#50C878';
          statusText.textContent = activeOrder.successMsg;
        }
        
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        updateBaristaExperience(scrollPercent);

        const ticket = document.getElementById('order-ticket');
        if (ticket) {
          ticket.style.transform = 'scale(1.03)';
          ticket.style.borderColor = '#50C878';
          setTimeout(() => {
            ticket.style.transform = 'scale(1)';
            ticket.style.borderColor = '';
          }, 600);
        }

        disableInputs(true);
        setTimeout(() => {
          resetMug();
          loadRandomOrder();
          disableInputs(false);
          if (statusText) {
            statusText.style.color = '';
            statusText.textContent = "Ready for the next order!";
          }
        }, 3000);

      } else {
        playSound('fail');
        
        if (statusText) {
          statusText.style.color = '#ff6b6b';
          statusText.textContent = activeOrder.failMsg;
        }
        
        const mug = document.querySelector('.coffee-mug-container');
        if (mug) {
          mug.style.animation = 'none';
          void mug.offsetWidth;
          mug.style.animation = 'gentle-swing 0.4s ease-in-out 2';
          setTimeout(() => {
            mug.style.animation = '';
          }, 800);
        }
      }
    }

    function disableInputs(disabled) {
      ingredientButtons.forEach(btn => btn.disabled = disabled);
      if (btnReset) btnReset.disabled = disabled;
      if (btnServe) btnServe.disabled = disabled;
    }

    ingredientButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const ing = btn.getAttribute('data-ingredient');
        if (ing) addIngredient(ing);
      });
    });

    if (btnReset) btnReset.addEventListener('click', resetMug);
    if (btnServe) btnServe.addEventListener('click', serveCoffee);

    loadRandomOrder();
    updateBrewBadge();