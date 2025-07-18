<template>
  <div>
    <header class="l-header">
      <div class="header-container">
        <div class="header-content">
          <div class="site-info logo">
            <h1 class="site-title">uwablog</h1>
            <p class="site-description">thoughts and notes</p>
          </div>
          <div class="menu-button-container">
            <!-- Menu Trigger (Hamburger) -->
            <span 
              class="menu-trigger"
              @click="openMenu"
            >
              <i class="menu-trigger-bar top"></i>
              <i class="menu-trigger-bar middle"></i>
              <i class="menu-trigger-bar bottom"></i>
            </span>
            
            <!-- Close Trigger (X) -->
            <span 
              class="close-trigger"
              @click="closeMenu"
            >
              <i class="close-trigger-bar left"></i>
              <i class="close-trigger-bar right"></i>
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Menu Container -->
    <div class="menu-container">
      <div class="menu-bg top"></div>
      <div class="menu-bg middle"></div>
      <div class="menu-bg bottom"></div>
      
      <nav class="menu">
        <NuxtLink 
          to="/works" 
          class="menu-link"
          @click="closeMenu"
        >
          Works
        </NuxtLink>
        <NuxtLink 
          to="/" 
          class="menu-link"
          @click="closeMenu"
        >
          Blog
        </NuxtLink>
        <NuxtLink 
          to="/about" 
          class="menu-link"
          @click="closeMenu"
        >
          About
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const isMenuOpen = ref(false)
let tlOpen = null
let tlClose = null

onMounted(() => {
  // Elements
  const openTrigger = document.querySelector('.menu-trigger')
  const openTriggerTop = document.querySelector('.menu-trigger-bar.top')
  const openTriggerMiddle = document.querySelector('.menu-trigger-bar.middle')
  const openTriggerBottom = document.querySelector('.menu-trigger-bar.bottom')
  
  const closeTrigger = document.querySelector('.close-trigger')
  const closeTriggerLeft = document.querySelector('.close-trigger-bar.left')
  const closeTriggerRight = document.querySelector('.close-trigger-bar.right')
  
  const logo = document.querySelector('.logo')
  const menuContainer = document.querySelector('.menu-container')
  const menu = document.querySelector('.menu')
  const menuTop = document.querySelector('.menu-bg.top')
  const menuMiddle = document.querySelector('.menu-bg.middle')
  const menuBottom = document.querySelector('.menu-bg.bottom')
  
  // OPEN TIMELINE
  tlOpen = gsap.timeline({ paused: true })
  
  tlOpen
    .add("preOpen")
    .set(menuContainer, {
      visibility: 'visible'
    })
    .to(logo, {
      duration: 0.4,
      scale: 0.8,
      opacity: 0,
      ease: "power2.out"
    }, "preOpen")
    .to(openTriggerTop, {
      duration: 0.4,
      x: 80,
      y: -80,
      delay: 0.1,
      ease: "power4.in",
      onComplete: function() {
        closeTrigger.style.zIndex = '35'
        closeTrigger.style.opacity = '1'
        closeTrigger.style.visibility = 'visible'
      }
    }, "preOpen")
    .to(openTriggerMiddle, {
      duration: 0.4,
      x: 80,
      y: -80,
      ease: "power4.in",
      onComplete: function() {
        openTrigger.style.visibility = 'hidden'
      }
    }, "preOpen")
    .to(openTriggerBottom, {
      duration: 0.4,
      x: 80,
      y: -80,
      delay: 0.2,
      ease: "power4.in"
    }, "preOpen")
    .add("open", "-=0.4")
    .to(menuTop, {
      duration: 0.8,
      y: "13%",
      ease: "power4.inOut"
    }, "open")
    .to(menuMiddle, {
      duration: 0.8,
      scaleY: 1,
      ease: "power4.inOut"
    }, "open")
    .to(menuBottom, {
      duration: 0.8,
      y: "-114%",
      ease: "power4.inOut"
    }, "open")
    .fromTo(menu, {
      y: 30,
      opacity: 0,
      visibility: 'hidden'
    }, {
      duration: 0.6,
      y: 0,
      opacity: 1,
      visibility: 'visible',
      ease: "power4.out"
    }, "-=0.2")
    .add("preClose", "-=0.8")
    .to(closeTriggerLeft, {
      duration: 0.8,
      x: -100,
      y: 100,
      ease: "power4.out"
    }, "preClose")
    .to(closeTriggerRight, {
      duration: 0.8,
      x: 100,
      y: 100,
      delay: 0.2,
      ease: "power4.out"
    }, "preClose")
  
  // CLOSE TIMELINE
  tlClose = gsap.timeline({ paused: true })
  
  tlClose
    .add("close")
    .to(menuTop, {
      duration: 0.2,
      backgroundColor: "#6295ca",
      ease: "power4.inOut",
      onComplete: function() {
        logo.style.zIndex = '26'
        closeTrigger.style.zIndex = '5'
        closeTrigger.style.opacity = '0'
        closeTrigger.style.visibility = 'hidden'
        openTrigger.style.visibility = 'visible'
      }
    }, "close")
    .to(menuMiddle, {
      duration: 0.2,
      backgroundColor: "#6295ca",
      ease: "power4.inOut"
    }, "close")
    .to(menuBottom, {
      duration: 0.2,
      backgroundColor: "#6295ca",
      ease: "power4.inOut"
    }, "close")
    .to(menu, {
      duration: 0.6,
      y: 20,
      opacity: 0,
      ease: "power4.out",
      onComplete: function() {
        menu.style.visibility = 'hidden'
      }
    }, "close")
    .to(logo, {
      duration: 0.8,
      scale: 1,
      opacity: 1,
      ease: "power4.inOut"
    }, "close+=0.2")
    .to(menuTop, {
      duration: 0.8,
      y: "-113%",
      ease: "power4.inOut"
    }, "close+=0.2")
    .to(menuMiddle, {
      duration: 0.8,
      scaleY: 0,
      ease: "power4.inOut"
    }, "close+=0.2")
    .to(menuBottom, {
      duration: 0.8,
      y: "23%",
      ease: "power4.inOut",
      onComplete: function() {
        menuTop.style.backgroundColor = ''
        menuMiddle.style.backgroundColor = ''
        menuBottom.style.backgroundColor = ''
        menuContainer.style.visibility = 'hidden'
      }
    }, "close+=0.2")
    .to(closeTriggerLeft, {
      duration: 0.2,
      x: 0,
      y: 0,
      ease: "power4.in"
    }, "close")
    .to(closeTriggerRight, {
      duration: 0.2,
      x: 0,
      y: 0,
      delay: 0.1,
      ease: "power4.in"
    }, "close")
    .to(openTriggerTop, {
      duration: 1,
      x: 0,
      y: 0,
      delay: 0.2,
      ease: "power4.out"
    }, "close")
    .to(openTriggerMiddle, {
      duration: 1,
      x: 0,
      y: 0,
      ease: "power4.out"
    }, "close")
    .to(openTriggerBottom, {
      duration: 1,
      x: 0,
      y: 0,
      delay: 0.1,
      ease: "power4.out"
    }, "close")
})

const openMenu = () => {
  if (tlOpen) {
    if (tlOpen.progress() < 1) {
      tlOpen.play()
    } else {
      tlOpen.restart()
    }
  }
  isMenuOpen.value = true
}

const closeMenu = () => {
  if (tlClose) {
    if (tlClose.progress() < 1) {
      tlClose.play()
    } else {
      tlClose.restart()
    }
  }
  isMenuOpen.value = false
}
</script>

<style scoped>
.l-header {
  padding: 3rem 0 2rem;
  background-color: var(--bg-color);
  position: relative;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.site-info {
  flex: 1;
  z-index: 26;
  position: relative;
}

.site-title {
  font-size: 1.5rem;
  font-weight: normal;
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.site-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Menu Button Container */
.menu-button-container {
  position: relative;
  width: 42px;
  height: 42px;
  z-index: 50;
}

/* Menu Trigger (Hamburger) */
.menu-trigger {
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  width: 42px;
  height: 42px;
  cursor: pointer;
  z-index: 333;
  opacity: 1;
  visibility: visible;
}

.menu-trigger:hover .menu-trigger-bar::before {
  width: 100%;
}

.menu-trigger-bar {
  display: block;
  width: 100%;
  height: 4px;
  background-color: var(--text-color);
  margin-bottom: 6px;
  transform: rotate(-45deg);
  position: relative;
}

.menu-trigger-bar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 0%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(.55,0,.1,1);
}

.menu-trigger-bar.top {
  width: 50%;
  position: absolute;
  top: 10px;
  left: 0;
}

.menu-trigger-bar.middle {
  position: absolute;
  top: 19px;
  left: 0;
}

.menu-trigger-bar.middle::before {
  left: auto;
  right: 0;
}

.menu-trigger-bar.bottom {
  width: 50%;
  margin-left: 50%;
  position: absolute;
  top: 28px;
  left: 0;
}

/* Close Trigger (X) */
.close-trigger {
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  width: 42px;
  height: 42px;
  cursor: pointer;
  z-index: 35;
  opacity: 0;
  visibility: hidden;
}

.close-trigger:hover .close-trigger-bar::before {
  width: 100%;
}

.close-trigger-bar {
  display: block;
  width: 25px;
  height: 4px;
  background-color: #222222;
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
}

.close-trigger-bar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 0%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(.55,0,.1,1);
}

.close-trigger-bar.left {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close-trigger-bar.right {
  transform: translate(-50%, -50%) rotate(-45deg);
}

/* Hover Effects */
.menu-trigger:hover .menu-trigger-bar,
.close-trigger:hover .close-trigger-bar {
  background-color: var(--primary-color);
}

/* Focus Styles */
.menu-trigger:focus,
.close-trigger:focus {
  outline: none;
}

.menu-trigger:focus-visible,
.close-trigger:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 4px;
  border-radius: 4px;
}

/* Menu Container */
.menu-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 20;
  pointer-events: none;
  visibility: hidden;
}

/* Menu Background Layers */
.menu-bg {
  position: absolute;
  display: block;
  width: 200%;
  left: -53%;
  height: 40%;
  background-color: #ffffff;
}

.menu-bg.top {
  left: -34%;
  top: 0;
  transform: rotate(-45deg) translateY(-152%);
}

.menu-bg.middle {
  top: 29%;
  left: -53%;
  transform: rotate(-45deg) scaleY(0);
}

.menu-bg.bottom {
  top: 105%;
  transform: rotate(-45deg) translateY(25%);
  left: -20%;
}

/* Menu */
.menu {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  visibility: hidden;
  opacity: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  pointer-events: auto;
  z-index: 30;
}

.menu-link {
  text-decoration: none;
  color: var(--text-color);
  display: inline-block;
  padding: 10px 0;
  position: relative;
  font-size: 1.5rem;
  font-weight: 400;
}

.menu-link::before {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 18px;
  height: 4px;
  opacity: 0;
  background-color: var(--text-color);
  transform: translateX(100px);
  transition: all 0.3s cubic-bezier(.55,0,.1,1);
}

.menu-link:hover::before {
  opacity: 1;
  transform: translateX(0px);
}

.menu-link.router-link-exact-active {
  font-weight: 700;
}

@media (max-width: 768px) {
  .l-header {
    padding: 2rem 0 1.5rem;
  }
  
  .header-container {
    padding: 0 1rem;
  }
  
  .site-title {
    font-size: 1.25rem;
  }
  
  .side-sheet {
    width: 280px;
    right: -280px;
  }
  
  .close-trigger {
    top: 2rem;
    right: 1rem;
  }
}
</style>