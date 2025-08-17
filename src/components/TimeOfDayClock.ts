import { TIME_STATES, TimeManager } from "../managers/TimeManager.js";

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Helper function to interpolate between two colors
function interpolateColor(color1: string, color2: string, factor: number): string {
  // Convert hex to RGB
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  if (!c1 || !c2) {
    throw new Error('Invalid color format');
  }

  // Interpolate each component
  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);
  return `rgb(${r}, ${g}, ${b})`
}


export class TimeOfDayClock {
  constructor(private timeManager: TimeManager) {
  }

  getSkyColors() {
    const stateProgress = this.timeManager.getPercentThroughPhase();
    const SKY_BLUE = '#87CEEB';
    const MIDNIGHT_BLUE = '#191970';
    const SUNSET_RED = '#FF7F50';

    switch (this.timeManager.getPhaseOfDay()) {
      case TIME_STATES.DAWN:
        // Fade from midnight blue to sky blue
        return [
          { color: interpolateColor(MIDNIGHT_BLUE, SKY_BLUE, stateProgress), position: 0 },
          { color: interpolateColor(MIDNIGHT_BLUE, SKY_BLUE, stateProgress), position: 1 }
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
            { color: interpolateColor(SKY_BLUE, SUNSET_RED, p), position: 0 },
            { color: interpolateColor(SKY_BLUE, SUNSET_RED, p), position: 1 }
          ];
        } else {
          // Second half: Sunset red to midnight blue
          const p = (stateProgress - 0.5) * 2;
          return [
            { color: interpolateColor(SUNSET_RED, MIDNIGHT_BLUE, p), position: 0 },
            { color: interpolateColor(SUNSET_RED, MIDNIGHT_BLUE, p), position: 1 }
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

  renderTimeIndicator(ctx: CanvasRenderingContext2D, width: number, height: number) {
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
    const cycleProgress = this.timeManager.getDayPercent();
    const angle = (cycleProgress * Math.PI * 2) + Math.PI / 2.0;

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

    ctx.fillStyle = this.timeManager.getPhaseOfDay() === TIME_STATES.DAY ? '#333' : '#fff';
    // Add game hour display
    ctx.font = '12px Arial';
    ctx.fillText(`${this.timeManager.getCurrentGameHour()}:00`, width / 2, height - 20);

    // Add time of day label
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.timeManager.getPhaseOfDay().toUpperCase(), width / 2, height - 5);
  }
}