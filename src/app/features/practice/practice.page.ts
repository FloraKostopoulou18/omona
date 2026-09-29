import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Exercise, ExerciseAttempt } from '../../core/models/onoma.models';
import { ExerciseService, ProgressService } from '../../core/services/onoma.services';
import { ExerciseContainerComponent, ExerciseFeedbackComponent } from '../../shared/exercise-container.component';

@Component({
  selector: 'app-practice-page',
  imports: [ExerciseContainerComponent, ExerciseFeedbackComponent, RouterLink],
  template: `
    <section class="page">
      <header class="page-header">
        <p class="eyebrow">PRACTICE</p>
        <h1 class="page-title">A moment for you</h1>
        <p class="page-subtitle">Choose a small activity and take it at your own pace.</p>
      </header>
      <div class="practice-layout">
        <div>
          @if (setComplete()) {
            <section class="set-complete surface-card" aria-live="polite">
              <span class="complete-icon" aria-hidden="true">✓</span>
              <p class="eyebrow">PRACTICE SET COMPLETE</p>
              <h2>That’s six activities done.</h2>
              <p>You can finish here or start another set whenever you’re ready.</p>
              <div class="complete-actions">
                <a class="secondary-button" routerLink="/dashboard">Finish for now</a>
                <button class="primary-button" type="button" (click)="startAnotherSet()">Start another set <span aria-hidden="true">→</span></button>
              </div>
            </section>
          } @else {
            <div class="exercise-meta">
              <span class="round-icon" aria-hidden="true">Aa</span>
              <div><strong>{{ exercise().skill }}</strong><small>Activity {{ completedInSet() + 1 }} of {{ sessionSize }}</small></div>
              <span class="session-count">{{ progress().exercisesCompleted }} activities<br />completed</span>
            </div>
            @if (feedback()) {
              <app-exercise-feedback [attempt]="lastAttempt()!" [exercise]="exercise()"
                [continueLabel]="completedInSet() === sessionSize ? 'Finish this set' : 'Next activity'"
                (continued)="continuePractice()" />
            } @else {
              <app-exercise-container [exercise]="exercise()" mode="practice" (completed)="onCompleted($event)" />
            }
          }
        </div>
        <aside class="practice-aside surface-card">
          <span class="aside-symbol" aria-hidden="true">✳</span>
          <h2>Make it your own</h2>
          <p>There’s no timer and no pressure. Every try helps Mosaic understand what works for you.</p>
          <div class="aside-divider"></div>
          <span class="aside-label">TODAY'S REMINDER</span>
          <p class="reminder">Progress is built from practice, not perfection.</p>
        </aside>
      </div>
    </section>
  `,
  styles: [`
    .page-header { margin-bottom: 27px; }
    .practice-layout { display: grid; grid-template-columns: minmax(0, 1fr) 235px; gap: 20px; align-items: start; }
    .exercise-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 13px; padding: 0 3px; }
    .round-icon { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 13px;
      background: #f4e9dc; color: #9e7951; font: 700 15px 'Manrope', sans-serif; }
    .exercise-meta div { display: grid; }
    .exercise-meta strong { color: #39463e; font-size: 13px; }
    .exercise-meta small { color: #929d95; font-size: 10px; }
    .session-count { margin-left: auto; color: #919d94; font-size: 10px; line-height: 1.5; text-align: right; }
    .set-complete { padding: 34px; text-align: center; }
    .complete-icon { display: grid; width: 48px; height: 48px; place-items: center; margin: 0 auto 17px;
      border-radius: 16px; background: var(--selection-surface); color: var(--selection-text); font-size: 21px; }
    .set-complete .eyebrow { margin-bottom: 7px; }
    .set-complete h2 { margin: 0; color: var(--ink); font-size: 22px; }
    .set-complete > p:not(.eyebrow) { color: var(--muted); font-size: 13px; }
    .complete-actions { display: flex; justify-content: center; gap: 10px; margin-top: 22px; }
    .complete-actions a { display: inline-flex; align-items: center; }
    .practice-aside { padding: 21px 19px; }
    .aside-symbol { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 11px;
      background: #f4eee1; color: #b38f4b; }
    .practice-aside h2 { margin: 15px 0 7px; font-size: 15px; }
    .practice-aside p { margin: 0; color: #7f8a82; font-size: 11px; line-height: 1.65; }
    .aside-divider { height: 1px; margin: 19px 0 14px; background: var(--line); }
    .aside-label { color: #a1aaa2; font-size: 9px; font-weight: 700; letter-spacing: .1em; }
    .practice-aside p.reminder { margin-top: 7px; color: #64766a; font-weight: 600; }
    @media (max-width: 900px) { .practice-layout { grid-template-columns: 1fr; } .practice-aside { display: none; } }
  `],
})
export class PracticePage {
  readonly sessionSize = 6;
  private readonly exercises = inject(ExerciseService);
  private readonly progressService = inject(ProgressService);
  readonly exercise = signal(this.exercises.nextExercise());
  readonly progress = this.progressService.progress;
  readonly feedback = signal(false);
  readonly completedInSet = signal(0);
  readonly setComplete = signal(false);
  readonly lastAttempt = signal<ExerciseAttempt | null>(null);

  onCompleted(attempt: ExerciseAttempt): void {
    this.lastAttempt.set(attempt);
    this.progressService.recordAttempt(attempt, this.exercise().skill);
    this.completedInSet.update((count) => Math.min(this.sessionSize, count + 1));
    this.feedback.set(true);
  }

  continuePractice(): void {
    if (this.completedInSet() === this.sessionSize) {
      this.feedback.set(false);
      this.setComplete.set(true);
      return;
    }
    this.feedback.set(false);
    this.exercise.set(this.exercises.nextExercise());
  }

  startAnotherSet(): void {
    this.completedInSet.set(0);
    this.setComplete.set(false);
    this.feedback.set(false);
    this.lastAttempt.set(null);
    this.exercise.set(this.exercises.nextExercise());
  }
}
