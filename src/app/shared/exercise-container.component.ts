import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Exercise, ExerciseAttempt, ExerciseMode } from '../core/models/onoma.models';
import { UserService } from '../core/services/onoma.services';

@Component({
  selector: 'app-exercise-container',
  template: `
    <section class="exercise-card" [class.real-world-mode]="mode() === 'real-world'">
      <div class="exercise-topline">
        <span class="mode-label">
          @switch (mode()) {
            @case ('assessment') { Getting to know you }
            @case ('real-world') { Out in the world }
            @default { A moment to practice }
          }
        </span>
        @if (audioSupported && (users.profile().preferences.audioInstructions || users.profile().preferences.textToSpeech)) {
          <button class="audio-button" type="button" (click)="readPrompt()" aria-label="Read the instructions aloud">
            <span aria-hidden="true">◖</span> Listen
          </button>
        } @else if (users.profile().preferences.audioInstructions || users.profile().preferences.textToSpeech) {
          <span class="audio-unavailable" role="status">Audio isn’t available in this browser</span>
        }
      </div>
      @if (exercise().content.instruction) {
        <p class="instruction">{{ exercise().content.instruction }}</p>
      }
      <h2 class="prompt" [class.line-highlight]="users.profile().preferences.currentLineHighlight">{{ exercise().content.prompt }}</h2>
      <div class="answer-list" role="group" aria-label="Choose an answer">
        @for (option of exercise().content.options; track option) {
          <button
            type="button"
            class="answer-option"
            [class.selected]="selected() === option"
            [attr.aria-pressed]="selected() === option"
            (click)="choose(option)"
          >
            <span class="radio-mark" aria-hidden="true"></span>
            <span>{{ option }}</span>
          </button>
        }
      </div>
      <div class="exercise-actions">
        <p class="reassurance">There’s no rush. Choose the answer that feels right.</p>
        <button class="primary-button" type="button" [disabled]="!selected()" (click)="submit()">
          Check answer <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .exercise-card { padding: 28px; border: 1px solid #e8eeea; border-radius: 18px; background: #fff; }
    .exercise-card.real-world-mode { border-color: #eee5d8; background: #fffdfa; }
    .exercise-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .mode-label { color: #789180; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    .audio-button { display: inline-flex; min-height: 36px; align-items: center; gap: 7px; padding: 0 11px;
      border: 1px solid #e8ece8; border-radius: 9px; background: #fff; color: #66756b; cursor: pointer; font-size: 11px; }
    .audio-button:hover { background: #f6f8f5; }
    .audio-unavailable { color: #929d95; font-size: 10px; }
    .instruction { margin: 22px 0 5px; color: #8a958e; font-size: 12px; }
    .prompt { max-width: 570px; margin: 22px 0 24px; color: #27343b; font-size: clamp(19px, 2.2vw, 25px); line-height: 1.45; white-space: pre-line; }
    .prompt.line-highlight { padding: 5px 8px; border-radius: 6px; background: #f4f7ef; box-decoration-break: clone; }
    .instruction + .prompt { margin-top: 5px; }
    .answer-list { display: grid; gap: 10px; }
    .answer-option { display: flex; min-height: 51px; align-items: center; gap: 12px; padding: 0 14px;
      border: 1px solid #e6ebe7; border-radius: 11px; background: #fff; color: #47534b; cursor: pointer;
      font-size: 14px; text-align: left; transition: border-color 140ms ease, background 140ms ease; }
    .answer-option:hover { border-color: #a8c2b1; background: #fbfdfb; }
    .answer-option.selected { border-color: #6d9a7e; background: #f2f7f3; color: #365b45; }
    .radio-mark { display: grid; width: 17px; height: 17px; flex: 0 0 auto; place-items: center;
      border: 1.5px solid #c8d0ca; border-radius: 50%; }
    .selected .radio-mark { border-color: #588367; }
    .selected .radio-mark::after { width: 7px; height: 7px; border-radius: 50%; background: #588367; content: ''; }
    .exercise-actions { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-top: 23px; }
    .reassurance { margin: 0; color: #98a29b; font-size: 11px; }
    .primary-button { flex: 0 0 auto; min-height: 43px; font-size: 12px; }
    .primary-button:disabled { background: #b8c8bd; cursor: not-allowed; }
    @media (max-width: 640px) {
      .exercise-card { padding: 21px 17px; }
      .exercise-actions { align-items: stretch; flex-direction: column; }
      .exercise-actions .primary-button { width: 100%; }
    }
  `],
})
export class ExerciseContainerComponent {
  readonly users = inject(UserService);
  readonly exercise = input.required<Exercise>();
  readonly mode = input.required<ExerciseMode>();
  readonly completed = output<ExerciseAttempt>();
  readonly selected = signal<string | null>(null);
  private startedAt = Date.now();
  readonly audioSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  constructor() {
    effect(() => {
      this.exercise().id;
      this.selected.set(null);
      this.startedAt = Date.now();
    });
  }

  choose(answer: string): void {
    this.selected.set(answer);
  }

  submit(): void {
    const answer = this.selected();
    if (!answer) return;
    this.completed.emit({
      exerciseId: this.exercise().id,
      answer,
      correct: answer === this.exercise().content.correctAnswer,
      responseTime: Date.now() - this.startedAt,
      hintsUsed: 0,
    });
  }

  readPrompt(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(
      new SpeechSynthesisUtterance(
        `${this.exercise().content.instruction ?? ''} ${this.exercise().content.prompt}`,
      ),
    );
  }
}

@Component({
  selector: 'app-exercise-feedback',
  template: `
    <section class="feedback-card" [class.encouraging]="attempt().correct" aria-live="polite">
      <span class="feedback-icon" aria-hidden="true">{{ attempt().correct ? '✓' : '↗' }}</span>
      <div class="feedback-copy">
        <h2>{{ attempt().correct ? 'Nice work!' : 'Not quite — keep exploring' }}</h2>
        <p>{{ attempt().correct ? exercise().content.explanation : 'The answer was “' + exercise().content.correctAnswer + '”. ' + exercise().content.explanation }}</p>
      </div>
      <button class="primary-button" type="button" (click)="continued.emit()">
        Continue <span aria-hidden="true">→</span>
      </button>
    </section>
  `,
  styles: [`
    .feedback-card { display: flex; align-items: center; gap: 15px; padding: 20px; border: 1px solid #eee9df;
      border-radius: 16px; background: #fbf8f1; }
    .feedback-card.encouraging { border-color: #e0ebe1; background: #f3f8f3; }
    .feedback-icon { display: grid; width: 39px; height: 39px; flex: 0 0 auto; place-items: center;
      border-radius: 13px; background: #f0e7d6; color: #9d7b42; font-size: 17px; font-weight: 700; }
    .encouraging .feedback-icon { background: #e1eee4; color: #4f7e5e; }
    .feedback-copy { flex: 1; }
    h2 { margin: 0 0 3px; font: 700 15px 'Manrope', sans-serif; }
    p { margin: 0; color: #758079; font-size: 12px; }
    .primary-button { min-height: 41px; padding-inline: 15px; font-size: 12px; }
    @media (max-width: 640px) {
      .feedback-card { align-items: flex-start; flex-wrap: wrap; padding: 15px; }
      .feedback-copy { min-width: calc(100% - 58px); }
      .feedback-card .primary-button { width: 100%; }
    }
  `],
})
export class ExerciseFeedbackComponent {
  readonly attempt = input.required<ExerciseAttempt>();
  readonly exercise = input.required<Exercise>();
  readonly continued = output<void>();
}
