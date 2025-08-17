import { TimeOfDayClock } from '../components/TimeOfDayClock.js';
import { REAL_TIME_PER_GAME_HOUR, GAME_HOURS_PER_DAY } from '../constants.js';
export enum TIME_STATES {
  DAWN = 'dawn',
  DAY = 'day',
  DUSK = 'dusk',
  NIGHT = 'night'
};
const DAY_CYCLE_DURATION = GAME_HOURS_PER_DAY * REAL_TIME_PER_GAME_HOUR;

interface TimeManagerConfig {
  cycleDuration?: number;
  dawnStart?: number;
  dayStart?: number;
  duskStart?: number;
  nightStart?: number;
}

export class TimeManager {
  private cycleDuration: number;
  private phaseStarts: Record<TIME_STATES, number>;
  private gameHour: number;
  private currentTime: number;
  private phaseOfDay: TIME_STATES;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private timeOfDayClock: TimeOfDayClock

  constructor(config: TimeManagerConfig = {}) {
    this.cycleDuration = DAY_CYCLE_DURATION;
    this.phaseStarts = {
      [TIME_STATES.DAWN]: config.dawnStart || 3,
      [TIME_STATES.DAY]: config.dayStart || 7,
      [TIME_STATES.DUSK]: config.duskStart || 20,
      [TIME_STATES.NIGHT]: config.nightStart || 22
    };

    this.currentTime = 0;
    this.gameHour = 3; // Track current in-game hour (0-23)
    this.phaseOfDay = this.calculatePhaseOfDay()

    // Get the canvas context for the time indicator
    const canvas = document.getElementById('timeIndicator') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error("Canvas element with id 'timeIndicator' not found");
    }
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.width = canvas.width;
    this.height = canvas.height;

    this.timeOfDayClock = new TimeOfDayClock(this)
  }

  public getPhaseOfDay(): TIME_STATES {
    return this.phaseOfDay
  }

  public getGameHour() {
    return this.gameHour;
  }

  public getCycleTime() {
    return this.gameHour * REAL_TIME_PER_GAME_HOUR + this.currentTime
  }

  /**
   * Returns the percentage of the way through the day
   */
  public getDayPercent() {
    return this.getCycleTime() / this.cycleDuration;
  }
  
  /**
   * Returns the percentage of the way through the current hour we are
   */
  public getPercentThroughHour() {
    return this.currentTime / REAL_TIME_PER_GAME_HOUR
  }

  private calculatePhaseOfDay() {
    let previousPhase = TIME_STATES.NIGHT
    for (const [phase, phaseStart] of Object.entries(this.phaseStarts)) {
      if (this.gameHour < phaseStart) {
        return previousPhase
      }
      previousPhase = phase as TIME_STATES
    }
    return TIME_STATES.NIGHT
  }

  private getNextPhaseOfDay(phaseOfDay: TIME_STATES) {
    switch (phaseOfDay) {
      case TIME_STATES.DAWN:
        return TIME_STATES.DAY
      case TIME_STATES.DAY:
        return TIME_STATES.DUSK
      case TIME_STATES.DUSK:
        return TIME_STATES.NIGHT
      case TIME_STATES.NIGHT:
        return TIME_STATES.DAWN
      default:
        throw new Error(`Trying to get next phase for unidentified current phase ${phaseOfDay}`)
    }
  }

  /**
   * Returns the percentage of the way through the current phase of the day
   */
  public getPercentThroughPhase() {
    const nextPhase = this.getNextPhaseOfDay(this.phaseOfDay)
    let currentPhaseStart = this.phaseStarts[this.phaseOfDay]
    let nextPhaseStart = this.phaseStarts[nextPhase]

    if (this.phaseOfDay === TIME_STATES.NIGHT) {
      if (this.gameHour < this.phaseStarts[TIME_STATES.DAWN]) {
        // It's after midnight
        currentPhaseStart = currentPhaseStart - GAME_HOURS_PER_DAY
      } else {
        // It's before midnight
        nextPhaseStart += GAME_HOURS_PER_DAY
      }
    }

    const currentTime = this.gameHour + this.currentTime / REAL_TIME_PER_GAME_HOUR
    const stateProgress = (currentTime - currentPhaseStart) / (nextPhaseStart - currentPhaseStart)

    return stateProgress
  }

  update(deltaTime: number) {
    // Update real-time for animations
    this.currentTime = (this.currentTime + deltaTime);

    // Check if we should advance the game hour
    if (this.currentTime >= REAL_TIME_PER_GAME_HOUR) {
      this.gameHour = (this.gameHour + 1) % GAME_HOURS_PER_DAY;
      this.currentTime = 0
      this.phaseOfDay = this.calculatePhaseOfDay()
    }

    this.timeOfDayClock.renderTimeIndicator(this.ctx, this.width, this.height);
  }

  // Returns light level (0-1) for a specific grid column
  getLightLevelForColumn(column, totalColumns) {
    const stateProgress = this.getPercentThroughPhase()
    switch (this.phaseOfDay) {
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
}
