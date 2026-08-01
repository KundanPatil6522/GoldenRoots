/**
 * GoldenRoot - Premium Custom Turmeric Cursor & Curcumin Shimmer Trail
 * Self-contained logic for cursor physics, particles, and interactive hover effects.
 */

(function () {
  // 1. Mobile & Touch Bypass checks
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  const isMobileViewport = window.innerWidth <= 768;

  if (isTouchDevice || isMobileViewport) {
    // Gracefully exit and rely on the fallback standard CSS cursor
    return;
  }

  // 2. Initialize script variables
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX;
  let dotY = mouseY;
  let ringX = mouseX;
  let ringY = mouseY;
  
  let lastMouseX = mouseX;
  let lastMouseY = mouseY;
  
  let particles = [];
  let isHovered = false;
  let isMouseDown = false;
  let lastEmitTime = 0;

  // 3. Dynamic DOM Injection
  const container = document.createElement('div');
  container.className = 'custom-cursor-container';

  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  const dotImg = document.createElement('img');
  dotImg.src = 'assets/turmeric_cursor.png';
  dotImg.alt = 'Turmeric Cursor';
  dot.appendChild(dotImg);

  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';

  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-canvas';
  const ctx = canvas.getContext('2d');

  container.appendChild(canvas);
  container.appendChild(ring);
  container.appendChild(dot);
  document.body.appendChild(container);

  // Activate CSS to hide default cursor
  document.body.classList.add('js-cursor-active');

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // 4. Particle Constructor
  class CurcuminParticle {
    constructor(x, y, isBurst = false) {
      this.x = x;
      this.y = y;
      
      // Speed & Direction
      const angle = Math.random() * Math.PI * 2;
      const speed = isBurst ? (Math.random() * 2.5 + 1.2) : (Math.random() * 0.8 + 0.2);
      this.vx = Math.cos(angle) * speed;
      // Drift upwards slightly (warm air / organic dust effect)
      this.vy = Math.sin(angle) * speed - 0.4; 

      // Visuals: Organic warm golden hues of curcumin (saffron yellow, turmeric gold, deep orange)
      const colors = [
        'rgba(242, 159, 5, opacity)',   // Deep Golden Haldi
        'rgba(254, 215, 170, opacity)', // Warm Sandalwood Gold
        'rgba(251, 146, 60, opacity)',  // Radiant Saffron Orange
        'rgba(184, 107, 0, opacity)',   // Earthy Mustard Brown-Gold
        'rgba(253, 224, 71, opacity)'   // Pure Yellow Glow
      ];
      const selectedColor = colors[Math.floor(Math.random() * colors.length)];
      
      this.colorTemplate = selectedColor;
      this.size = isBurst ? (Math.random() * 6 + 4) : (Math.random() * 4 + 2);
      this.alpha = 1;
      this.decay = isBurst ? (Math.random() * 0.02 + 0.015) : (Math.random() * 0.015 + 0.01);
      
      // Spin for organic drift feel
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.05;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      this.size *= 0.98; // Shrink slightly over time
      this.angle += this.spin;
    }

    draw(context) {
      if (this.alpha <= 0) return;
      
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.angle);
      
      // Setup beautiful golden glow gradient for each particle
      const grad = context.createRadialGradient(0, 0, 0, 0, 0, this.size);
      const colorStart = this.colorTemplate.replace('opacity', this.alpha.toFixed(2));
      const colorEnd = this.colorTemplate.replace('opacity', '0');
      grad.addColorStop(0, colorStart);
      grad.addColorStop(1, colorEnd);
      
      context.fillStyle = grad;
      
      // Draw organic star/sparkle diamond shape
      context.beginPath();
      context.moveTo(0, -this.size);
      context.quadraticCurveTo(0, 0, this.size, 0);
      context.quadraticCurveTo(0, 0, 0, this.size);
      context.quadraticCurveTo(0, 0, -this.size, 0);
      context.quadraticCurveTo(0, 0, 0, -this.size);
      context.closePath();
      
      context.fill();
      context.restore();
    }
  }

  // 5. Track Mouse Input
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Check distance moved to emit particles
    const distance = Math.hypot(mouseX - lastMouseX, mouseY - lastMouseY);
    const now = performance.now();

    // Limit particles emission rate slightly on movement
    if (distance > 3 && now - lastEmitTime > 20) {
      // Scale particle count based on movement speed & hover status
      const count = isHovered ? 2 : 1;
      for (let i = 0; i < count; i++) {
        // Emit close to the turmeric piece
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;
        particles.push(new CurcuminParticle(mouseX + offsetX, mouseY + offsetY));
      }
      lastEmitTime = now;
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    }
  });

  // Track Mouse Clicks
  window.addEventListener('mousedown', () => {
    isMouseDown = true;
    container.classList.add('clicked');
    
    // Burst of 12 beautiful particles on click!
    for (let i = 0; i < 15; i++) {
      particles.push(new CurcuminParticle(mouseX, mouseY, true));
    }
  });

  window.addEventListener('mouseup', () => {
    isMouseDown = false;
    container.classList.remove('clicked');
  });

  // 6. Interactive Clicks & Hover Event Listeners
  function attachHoverListeners() {
    // Select all clickable/interactive items
    const clickables = document.querySelectorAll(
      'a, button, .btn, .btn-nav, .add-cart, .socials a, .logo, .hamburger, .faq-question, .cart-icon-wrapper, .close-cart, .remove-item, [role="button"], input[type="submit"]'
    );

    clickables.forEach(el => {
      // Skip if already attached
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = 'true';

      el.addEventListener('mouseenter', () => {
        isHovered = true;
        container.classList.add('hovered');
        
        // Dynamic mini burst on enter
        for (let i = 0; i < 5; i++) {
          particles.push(new CurcuminParticle(mouseX, mouseY, true));
        }
      });

      el.addEventListener('mouseleave', () => {
        isHovered = false;
        container.classList.remove('hovered');
      });
    });
  }

  // Initial attach
  attachHoverListeners();

  // Re-attach periodically in case DOM changes (e.g. cart sidebar updates dynamically)
  const hoverObserver = new MutationObserver(() => {
    attachHoverListeners();
  });
  hoverObserver.observe(document.body, { childList: true, subtree: true });

  // 7. RequestAnimationFrame Animation Loop
  function tick() {
    // Instant tracking for the main turmeric cursor so it has ZERO delay and feels highly responsive
    dotX = mouseX;
    dotY = mouseY;
    
    // Snappier luxury lag for the trailing golden ring
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    // Apply transforms
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    // Click shrink animation via scale
    if (isMouseDown) {
      dot.style.transform += ' scale(0.85)';
      ring.style.transform += ' scale(0.75)';
    }

    // Particle processing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw sparkles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      
      // Remove transparent particles
      if (p.alpha <= 0 || p.size <= 0.2) {
        particles.splice(i, 1);
      }
    }

    // Ambient floating sparkle emitter (slow continuous emission if mouse stands still)
    const now = performance.now();
    if (now - lastEmitTime > 300) {
      particles.push(new CurcuminParticle(dotX + (Math.random() - 0.5) * 8, dotY + (Math.random() - 0.5) * 8));
      lastEmitTime = now;
    }

    requestAnimationFrame(tick);
  }
  
  // Start the animation loop
  requestAnimationFrame(tick);

  // 8. Localized Ambient Hero Background Particles Emitter
  const heroCanvas = document.getElementById('hero-particles');
  if (heroCanvas) {
    const hCtx = heroCanvas.getContext('2d');
    let hParticles = [];
    let hWidth = 0;
    let hHeight = 0;

    function resizeHeroCanvas() {
      const rect = heroCanvas.getBoundingClientRect();
      hWidth = rect.width;
      hHeight = rect.height;
      heroCanvas.width = hWidth;
      heroCanvas.height = hHeight;
    }
    resizeHeroCanvas();
    
    // Automatically keep the canvas perfectly sized
    if (window.ResizeObserver) {
      new ResizeObserver(resizeHeroCanvas).observe(heroCanvas);
    } else {
      window.addEventListener('resize', resizeHeroCanvas);
    }

    class AmbientParticle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * hWidth;
        this.y = init ? Math.random() * hHeight : hHeight + 20;
        this.size = Math.random() * 4 + 1.5; // Glowing particle size
        this.speedY = -(Math.random() * 0.35 + 0.1); // Slow drifting upward drift
        this.speedX = (Math.random() - 0.5) * 0.12; // Slow horizontal sway
        
        // Cozy glowing golden-orange colors
        const colors = [
          'rgba(242, 159, 5, opacity)',   // Saffron Haldi
          'rgba(251, 146, 60, opacity)',  // Warm Orange
          'rgba(253, 224, 71, opacity)',  // Golden Sparkle
          'rgba(254, 215, 170, opacity)'  // Cream Glow
        ];
        this.colorTemplate = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = init ? Math.random() * 0.5 : 0;
        this.maxAlpha = Math.random() * 0.4 + 0.15; // Max opacity 15% to 55%
        this.fadeInSpeed = Math.random() * 0.004 + 0.0015;
        this.decay = Math.random() * 0.0015 + 0.0008;
        this.phase = Math.random() * Math.PI;
        this.frequency = Math.random() * 0.015 + 0.005;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.phase) * 0.12;
        this.phase += this.frequency;

        // Fade in
        if (this.alpha < this.maxAlpha && this.y > 0) {
          this.alpha += this.fadeInSpeed;
        }

        // Fade out at the top of the container
        if (this.y < 60) {
          this.alpha -= 0.008;
        }

        // Reset once off-screen or fully transparent
        if (this.y < -20 || this.alpha <= 0 || this.x < -20 || this.x > hWidth + 20) {
          this.reset(false);
        }
      }

      draw() {
        const a = Math.max(0, Math.min(this.maxAlpha, this.alpha));
        if (a <= 0) return;

        hCtx.save();
        
        // Radial gradient glow for each particle
        const grad = hCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, this.colorTemplate.replace('opacity', a.toFixed(3)));
        grad.addColorStop(1, this.colorTemplate.replace('opacity', '0'));
        
        hCtx.fillStyle = grad;
        hCtx.beginPath();
        hCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        hCtx.fill();
        hCtx.restore();
      }
    }

    // Spawn ambient particles
    const particleCount = 28;
    for (let i = 0; i < particleCount; i++) {
      hParticles.push(new AmbientParticle());
    }

    function animateHeroParticles() {
      hCtx.clearRect(0, 0, hWidth, hHeight);
      hParticles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateHeroParticles);
    }
    animateHeroParticles();
  }
  // 9. Compact Interactive Farm-to-Bottle Stepper/Slider Controller
  const journeySection = document.getElementById('farm-to-bottle');
  const stepperNodes = document.querySelectorAll('.stepper-node');
  const stepperProgress = document.getElementById('journey-stepper-progress');
  const slides = document.querySelectorAll('.journey-slide');
  const prevBtn = document.getElementById('journey-prev');
  const nextBtn = document.getElementById('journey-next');

  if (journeySection && stepperNodes.length > 0 && slides.length > 0) {
    let currentStep = 0;
    const totalSteps = slides.length;
    let autoPlayInterval = null;
    const autoPlayDelay = 5500; // 5.5 seconds per slide rotation

    // Update UI elements based on currentStep index
    function updateJourneyUI(index) {
      currentStep = index;

      // 1. Update active stepper node states
      stepperNodes.forEach((node, idx) => {
        if (idx === currentStep) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });

      // 2. Update active slide states
      slides.forEach((slide, idx) => {
        if (idx === currentStep) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // 3. Update timeline progress bar percentage width
      // Step 0 = 0%, Step 5 = 100%
      if (stepperProgress) {
        const percentage = (currentStep / (totalSteps - 1)) * 100;
        stepperProgress.style.width = `${percentage}%`;
      }
    }

    // Move to next step in loop
    function nextStep() {
      const target = (currentStep + 1) % totalSteps;
      updateJourneyUI(target);
    }

    // Move to previous step in loop
    function prevStep() {
      const target = (currentStep - 1 + totalSteps) % totalSteps;
      updateJourneyUI(target);
    }

    // Start auto-play cycle
    function startAutoPlay() {
      stopAutoPlay();
      autoPlayInterval = setInterval(nextStep, autoPlayDelay);
    }

    // Stop auto-play cycle
    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }

    // Attach click events to nodes
    stepperNodes.forEach((node, idx) => {
      node.addEventListener('click', () => {
        updateJourneyUI(idx);
        stopAutoPlay(); // Pause autoplay when user manually interacts
      });
    });

    // Attach chevron navigation controls
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevStep();
        stopAutoPlay(); // Pause autoplay when user manually interacts
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextStep();
        stopAutoPlay(); // Pause autoplay when user manually interacts
      });
    }

    // Hover listeners to pause/resume auto-play dynamically
    journeySection.addEventListener('mouseenter', stopAutoPlay);
    journeySection.addEventListener('mouseleave', () => {
      // Re-enable auto-play smoothly on mouseleave
      startAutoPlay();
    });

    // Initialize UI and start autoplay
    updateJourneyUI(0);
    startAutoPlay();
  }
})();
