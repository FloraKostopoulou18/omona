import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Exercise, ExerciseAttempt } from '../../core/models/onoma.models';
import { AssessmentService, AuthService } from '../../core/services/onoma.services';
import { ExerciseContainerComponent, ExerciseFeedbackComponent } from '../../shared/exercise-container.component';

@Component({
  selector: 'app-assessment-page',
  imports: [ExerciseContainerComponent, ExerciseFeedbackComponent, RouterLink],
  template: `
    <main class="assessment-page">
      <header class="assessment-header">
        <a class="brand" routerLink="/dashboard"><img class="brand-mark" src="/mosaic/mosaic-logo.png" alt="" /> Mosaic</a>
        <a class="exit-link" routerLink="/dashboard">Save and leave</a>
      </header>
      <section class="assessment-main">
        <div class="assessment-intro">
          <p class="eyebrow">A QUICK STARTING POINT</p>
          <h1 class="page-title">Let’s find your learning rhythm.</h1>
          <p class="page-subtitle">A few short activities help us tailor practice to you. This isn’t a test — just a place to begin.</p>
        </div>
        <div class="step-progress">
          <div class="progress-caption"><span>Activity {{ index() + 1 }} of {{ exercises.length }}</span><span>About 10 minutes</span></div>
          <div class="progress-track" role="progressbar" [attr.aria-valuenow]="index() + 1"
            [attr.aria-valuemax]="exercises.length" aria-valuemin="1" aria-label="Assessment progress">
            <div class="progress-fill" [style.width.%]="((index() + 1) / exercises.length) * 100"></div>
          </div>
        </div>
        <div class="assessment-skill"><span class="skill-dot"></span>{{ exercise().skill }}</div>
        @if (feedback()) {
          <app-exercise-feedback [attempt]="lastAttempt()!" [exercise]="exercise()" (continued)="nextExercise()" />
        } @else {
          <app-exercise-container [exercise]="exercise()" mode="assessment" (completed)="onCompleted($event)" />
        }
        <p class="support-note"><span aria-hidden="true">◖</span> Need a hand? Select “Listen” to hear instructions.</p>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--canvas); }
    .assessment-page { min-height: 100vh; }
    .assessment-header { display: flex; height: 70px; align-items: center; justify-content: space-between; padding: 0 6vw;
      border-bottom: 1px solid var(--line); background: var(--paper); }
    .brand { display: inline-flex; align-items: center; gap: 10px; color: var(--ink); font: 800 21px 'Manrope', sans-serif; letter-spacing: -.045em; }
    .brand-mark { display: block; width: 32px; height: 32px; object-fit: contain; }
    .exit-link { color: #829087; font-size: 12px; font-weight: 600; }
    .assessment-main { width: min(100% - 34px, 760px); margin: 0 auto; padding: 53px 0 60px; }
    .assessment-intro { max-width: 620px; }
    .assessment-intro .page-title { max-width: 500px; }
    .assessment-intro .page-subtitle { max-width: 570px; line-height: 1.7; }
    .step-progress { margin: 30px 0 23px; }
    .progress-caption { display: flex; justify-content: space-between; margin-bottom: 8px; color: #77847b; font-size: 11px; }
    .assessment-skill { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; color: var(--mosaic-indigo); font-size: 12px; font-weight: 700; }
    .skill-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--mosaic-indigo); }
    .support-note { margin: 14px 0 0; color: #9aa39b; font-size: 10px; }
    @media (max-width: 640px) { .assessment-header { height: 59px; padding-inline: 19px; } .assessment-main { padding-top: 35px; } }
  `],
})
export class AssessmentPage {
  private readonly assessmentService = inject(AssessmentService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly exercises = this.assessmentService.getAssessment();
  readonly index = signal(0);
  readonly exercise = computed(() => this.exercises[this.index()]);
  readonly feedback = signal(false);
  readonly lastAttempt = signal<ExerciseAttempt | null>(null);

  onCompleted(attempt: ExerciseAttempt): void {
    this.lastAttempt.set(attempt);
    this.assessmentService.recordAttempt(attempt, this.exercise().skill);
    if (this.index() === this.exercises.length - 1) {
      this.auth.completeAssessment();
    }
    this.feedback.set(true);
  }

  nextExercise(): void {
    if (this.index() === this.exercises.length - 1) {
      void this.router.navigate(['/profile'], { queryParams: { afterAssessment: 'true' } });
      return;
    }
    this.index.update((value) => value + 1);
    this.feedback.set(false);
  }
}
