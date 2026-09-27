import { Component, inject, signal } from '@angular/core';
import { Exercise, ExerciseAttempt } from '../../core/models/onoma.models';
import { ExerciseService, ProgressService } from '../../core/services/onoma.services';
import { ExerciseContainerComponent, ExerciseFeedbackComponent } from '../../shared/exercise-container.component';

@Component({
  selector: 'app-practice-page',
  imports: [ExerciseContainerComponent, ExerciseFeedbackComponent],
  template: `
    <section class="page">
      <header class="page-header">
        <p class="eyebrow">PRACTICE</p>
        <h1 class="page-title">A moment for you</h1>
        <p class="page-subtitle">Choose a small activity and take it at your own pace.</p>
      </header>
      <div class="practice-layout">
        <div>
          <div class="exercise-meta">
            <span class="round-icon" aria-hidden="true">Aa</span>
            <div><strong>{{ exercise().skill }}</strong><small>About 5 minutes · A gentle challenge</small></div>
            <span class="session-count">{{ progress().exercisesCompleted }} activities<br />completed</span>
          </div>
          @if (feedback()) {
            <app-exercise-feedback [attempt]="lastAttempt()!" [exercise]="exercise()" (continued)="continuePractice()" />
          } @else {
            <app-exercise-container [exercise]="exercise()" mode="practice" (completed)="onCompleted($event)" />
          }
        </div>
        <aside class="practice-aside surface-card">
          <span class="aside-symbol" aria-hidden="true">✳</span>
          <h2>Make it your own</h2>
          <p>There’s no timer and no pressure. Every try helps Onoma understand what works for you.</p>
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
    .practice-aside { padding: 21px 19px; }
    .aside-symbol { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 11px;
      background: #f4eee1; color: #b38f4b; }
    .practice-aside h2 { margin: 15px 0 7px; font-size: 15px; }
    .practice-aside p { margin: 0; color: #7f8a82; font-size: 11px; line-height: 1.65; }
    .aside-divider { height: 1px; margin: 19px 0 14px; background: #edf0ec; }
    .aside-label { color: #a1aaa2; font-size: 9px; font-weight: 700; letter-spacing: .1em; }
    .practice-aside p.reminder { margin-top: 7px; color: #64766a; font-weight: 600; }
    @media (max-width: 900px) { .practice-layout { grid-template-columns: 1fr; } .practice-aside { display: none; } }
  `],
})
export class PracticePage {
  private readonly exercises = inject(ExerciseService);
  private readonly progressService = inject(ProgressService);
  readonly exercise = signal(this.exercises.nextExercise());
  readonly progress = this.progressService.progress;
  readonly feedback = signal(false);
  readonly lastAttempt = signal<ExerciseAttempt | null>(null);

  onCompleted(attempt: ExerciseAttempt): void {
    this.lastAttempt.set(attempt);
    this.progressService.recordAttempt(attempt, this.exercise().skill);
    this.feedback.set(true);
  }

  continuePractice(): void {
    this.feedback.set(false);
    this.exercise.set(this.exercises.nextExercise());
  }
}
