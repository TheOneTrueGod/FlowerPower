export const TIME_STATES = {
  DAWN: 'dawn',
  DAY: 'day',
  DUSK: 'dusk',
  NIGHT: 'night'
};

export class TimeManager {
  constructor(config = {}) {
    this.cycleDuration = config.cycleDuration || 30000; // 60 seconds in ms
    this.stateRatios = {
      [TIME_STATES.DAWN]: config.dawnRatio || 0.25,   // 20% of cycle
      [TIME_STATES.DAY]: config.dayRatio || 0.25,     // 40% of cycle
      [TIME_STATES.DUSK]: config.duskRatio || 0.25,   // 20% of cycle
      [TIME_STATES.NIGHT]: config.nightRatio || 0.25   // 20% of cycle
    };

    this.currentTime = 0;
    this.currentState = TIME_STATES.DAWN;

    // Get the canvas context for the time indicator
    const canvas = document.getElementById('timeIndicator');
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
  }

  update(deltaTime) {
    this.currentTime = (this.currentTime + deltaTime) % this.cycleDuration;
    this.updateTimeState();
  }

  updateTimeState() {
    const cycleProgress = this.currentTime / this.cycleDuration;
    let progressSum = 0;

    for (const [state, ratio] of Object.entries(this.stateRatios)) {
      progressSum += ratio;
      if (cycleProgress <= progressSum) {
        this.currentState = state;
        break;
      }
    }

    this.renderTimeIndicator();
  }

  renderTimeIndicator() {
    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Get colors based on time of day
    const skyColors = this.getSkyColors();

    // Draw the half circle background with gradient
    const skyGradient = ctx.createLinearGradient(0, 0, width, 0);
    skyColors.forEach(({ color, position }) => {
      skyGradient.addColorStop(position, color);
    });

    ctx.beginPath();
    ctx.fillStyle = skyGradient;
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.arc(width / 2, height, width / 2 - 10, Math.PI, 0);
    ctx.lineTo(width / 2 + width / 2 - 10, height);
    ctx.lineTo(width / 2 - width / 2 + 10, height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Calculate the position of the sun and moon
    const cycleProgress = this.currentTime / this.cycleDuration;
    const angle = Math.PI / 4 * 3 + (cycleProgress * Math.PI * 2);

    const radius = width / 2 - 20;
    const centerX = width / 2;
    const centerY = height;

    // Draw the sun
    const sunX = centerX + Math.cos(angle) * radius;
    const sunY = centerY + Math.sin(angle) * radius;

    // Draw sun glow
    const sunGlowGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 15);
    sunGlowGradient.addColorStop(0, 'rgba(255, 200, 50, 0.6)');
    sunGlowGradient.addColorStop(1, 'rgba(255, 200, 50, 0)');
    ctx.fillStyle = sunGlowGradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Draw sun
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw the moon (opposite to the sun)
    const moonX = centerX + Math.cos(angle + Math.PI) * radius;
    const moonY = centerY + Math.sin(angle + Math.PI) * radius;

    // Draw moon glow
    const moonGradient = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 12);
    moonGradient.addColorStop(0, 'rgba(200, 200, 255, 0.4)');
    moonGradient.addColorStop(1, 'rgba(200, 200, 255, 0)');
    ctx.fillStyle = moonGradient;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 12, 0, Math.PI * 2);
    ctx.fill();

    // Draw moon
    ctx.fillStyle = '#E6E6FA';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Add time of day label
    ctx.fillStyle = this.currentState === TIME_STATES.DAY ? '#333' : '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.currentState.toUpperCase(), width / 2, height - 5);
  }

  getSkyColors() {
    const stateProgress = this.getStateProgress();
    const SKY_BLUE = '#87CEEB';
    const MIDNIGHT_BLUE = '#191970';
    const SUNSET_RED = '#FF7F50';

    switch (this.currentState) {
      case TIME_STATES.DAWN:
        // Fade from midnight blue to sky blue
        return [
          { color: this.interpolateColor(MIDNIGHT_BLUE, SKY_BLUE, stateProgress), position: 0 },
          { color: this.interpolateColor(MIDNIGHT_BLUE, SKY_BLUE, stateProgress), position: 1 }
        ];

      case TIME_STATES.DAY:
        // Solid sky blue
        return [
          { color: SKY_BLUE, position: 0 },
          { color: SKY_BLUE, position: 1 }
        ];

      case TIME_STATES.DUSK:
        if (stateProgress < 0.5) {
          // First half: Sky blue to sunset red
          const p = stateProgress * 2;
          return [
            { color: this.interpolateColor(SKY_BLUE, SUNSET_RED, p), position: 0 },
            { color: this.interpolateColor(SKY_BLUE, SUNSET_RED, p), position: 1 }
          ];
        } else {
          // Second half: Sunset red to midnight blue
          const p = (stateProgress - 0.5) * 2;
          return [
            { color: this.interpolateColor(SUNSET_RED, MIDNIGHT_BLUE, p), position: 0 },
            { color: this.interpolateColor(SUNSET_RED, MIDNIGHT_BLUE, p), position: 1 }
          ];
        }

      case TIME_STATES.NIGHT:
        // Solid midnight blue
        return [
          { color: MIDNIGHT_BLUE, position: 0 },
          { color: MIDNIGHT_BLUE, position: 1 }
        ];
    }
  }

  // Helper function to interpolate between two colors
  interpolateColor(color1, color2, factor) {
    // Convert hex to RGB
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);

    // Interpolate each component
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);

    return `rgb(${r}, ${g}, ${b})`;
  }

  // Helper function to convert hex color to RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Returns light level (0-1) for a specific grid column
  getLightLevelForColumn(column, totalColumns) {
    const cycleProgress = this.currentTime / this.cycleDuration;
    const stateProgress = this.getStateProgress();

    switch (this.currentState) {
      case TIME_STATES.DAWN:
        // Light spreads from left to right
        const brightStart = column / totalColumns * 0.5
        const brightEnd = brightStart + 0.5

        return Math.min(100, Math.max(0, (stateProgress - brightStart) / (brightEnd - brightStart)) * 100);

      case TIME_STATES.DAY:
        return 100; // Full light during day

      case TIME_STATES.DUSK:
        // Light spreads from left to right
        const darkStart = column / totalColumns * 0.5
        const darkEnd = darkStart + 0.5

        return Math.min(100, Math.max(0, 100 - (stateProgress - darkStart) / (darkEnd - darkStart) * 100));

      case TIME_STATES.NIGHT:
        return 0; // No light during night
    }
  }

  getStateProgress() {
    let progressInState = this.currentTime;
    for (const [state, ratio] of Object.entries(this.stateRatios)) {
      const stateDuration = ratio * this.cycleDuration;
      if (state === this.currentState) {
        return (progressInState % stateDuration) / stateDuration;
      }
      progressInState -= stateDuration;
    }
    return 0;
  }

  getCurrentState() {
    return this.currentState;
  }
} 