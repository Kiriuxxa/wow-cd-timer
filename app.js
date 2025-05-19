// app.js

const { createApp } = Vue;

createApp({
  data() {
    return {
      variants: [
        { name: 'Mooncloth', duration: 4 * 24 * 60 * 60 * 1000 }, // 4 days
        { name: 'Cured Rugged Hide', duration: 3 * 24 * 60 * 60 * 1000 }, // 3 days
        { name: 'Arcanite Bar', duration: 3 * 24 * 60 * 60 * 1000 }, // 3 days
        // Add variants with days: e.g. duration: days * 24*60*60*1000
      ],
      selectedVariant: null,
      charName: "",
      timers: []
    };
  },
  methods: {
    addTimer() {
      if (!this.selectedVariant) return;
      const { name, duration } = this.selectedVariant;
      const charName = this.charName;
      const id = Date.now().toString();
      this.timers.push({
        id,
        name,
        duration,
        charName, 
        remaining: duration,
        isRunning: false,
        isFinished: false
      });
      this.saveTimers();
      this.selectedVariant = null;
    },
    toggleTimer(timer) {
      if (timer.isFinished) {
        // Restart finished timer
        timer.remaining = timer.duration;
        timer.isFinished = false;
        timer.isRunning = true;
      } else {
        // Toggle between running and paused
        timer.isRunning = !timer.isRunning;
      }
      if (timer.isRunning) {
        // Recompute endTime based on remaining
        timer.endTime = Date.now() + timer.remaining;
      }
      this.saveTimers();
    },
    removeTimer(timer) {
      this.timers = this.timers.filter(t => t.id !== timer.id);
      this.saveTimers();
    },
    formatRemaining(ms) {
      const totalSec = Math.max(0, Math.floor(ms / 1000));
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;
      const daysPart = days > 0 ? `${days}d ` : '';
      const hStr = hours.toString().padStart(2, '0');
      const mStr = mins.toString().padStart(2, '0');
      const sStr = secs.toString().padStart(2, '0');
      return `${daysPart}${hStr}:${mStr}:${sStr}`;
    },
    saveTimers() {
      localStorage.setItem('timers', JSON.stringify(this.timers));
    },
    loadTimers() {
      const data = localStorage.getItem('timers');
      if (data) {
        this.timers = JSON.parse(data);
      }
    }
  },
  mounted() {
    this.loadTimers();
    setInterval(() => {
      const now = Date.now();
      this.timers.forEach(timer => {
        if (timer.isRunning) {
          const rem = timer.endTime - now;
          if (rem <= 0) {
            timer.remaining = 0;
            timer.isRunning = false;
            timer.isFinished = true;
          } else {
            timer.remaining = rem;
          }
        }
      });
      this.saveTimers();
    }, 500);
  }
}).mount('#app');
