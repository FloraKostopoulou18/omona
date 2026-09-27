import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
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
      </div>
      @if (exercise().content.instruction) {
        <p class="instruction">{{ exercise().content.instruction }}</p>
      }
      @if (users.profile().preferences.currentLineHighlight) {
        <div class="prompt-lines" role="heading" aria-level="2" aria-label="Exercise prompt">
          @for (line of promptLines(); track $index; let i = $index) {
            <button
              type="button"
              class="prompt-line"
              [style.font-size]="promptFontSize()"
              [class.current-line]="i === currentLine()"
              [attr.aria-pressed]="i === currentLine()"
              [attr.aria-label]="'Highlight line ' + (i + 1) + ': ' + line"
              (click)="currentLine.set(i)"
            >{{ line }}</button>
          }
        </div>
        @if (promptLines().length > 1) {
          <div class="line-controls" aria-label="Reading line controls">
            <button type="button" class="line-step" [disabled]="currentLine() === 0"
              (click)="moveLine(-1)" aria-label="Highlight previous line">← Previous line</button>
            <span aria-live="polite">Line {{ currentLine() + 1 }} of {{ promptLines().length }}</span>
            <button type="button" class="line-step" [disabled]="currentLine() === promptLines().length - 1"
              (click)="moveLine(1)" aria-label="Highlight next line">Next line →</button>
          </div>
        }
      } @else {
        <h2 class="prompt" [style.font-size]="promptFontSize()">{{ exercise().content.prompt }}</h2>
      }
      <div class="answer-list" role="group" aria-label="Choose an answer">
        @for (option of exercise().content.options; track option) {
          <button
            type="button"
            class="answer-option"
            [style.font-size]="choiceFontSize()"
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
        <p class="reassurance" [style.font-size]="supportFontSize()">There’s no rush. Choose the answer that feels right.</p>
        <button class="primary-button" type="button" [disabled]="!selected()" (click)="submit()">
          Check answer <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .exercise-card { padding: 28px; border: 1px solid var(--line); border-radius: 18px; background: var(--paper); }
    .exercise-card.real-world-mode { border-color: #eee5d8; background: #fffdfa; }
    .exercise-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .mode-label { color: #789180; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    .audio-button { display: inline-flex; min-height: 36px; align-items: center; gap: 7px; padding: 0 11px;
      border: 1px solid var(--line); border-radius: 9px; background: var(--paper); color: var(--muted); cursor: pointer; font-size: 11px; }
    .audio-button:hover { background: var(--hover-surface); }
    .audio-unavailable { color: #929d95; font-size: 10px; }
    .instruction { margin: 22px 0 5px; color: #8a958e; font-size: calc(var(--reader-support-size, 11px) + 1px); }
    .prompt, .prompt-lines { max-width: 570px; margin: 22px 0 24px; color: #27343b; font-size: var(--reader-prompt-size, clamp(19px, 2.2vw, 25px)); line-height: 1.45; white-space: pre-line; }
    .instruction + .prompt, .instruction + .prompt-lines { margin-top: 5px; }
    .prompt-lines { display: grid; justify-items: stretch; gap: 7px; }
    .prompt-line { width: fit-content; max-width: 100%; padding: 3px 8px; border: 0; border-left: 3px solid transparent;
      border-radius: 4px; background: transparent; color: inherit; cursor: pointer; font: inherit; line-height: inherit; text-align: left; }
    .prompt-line:hover { background: var(--hover-surface); }
    .prompt-line.current-line { border-left-color: var(--selection-control); background: var(--selection-surface); }
    .line-controls { display: flex; max-width: 570px; align-items: center; justify-content: space-between; gap: 8px; margin: -17px 0 20px; color: #89948c; font-size: 10px; }
    .line-step { min-height: 32px; padding: 0 7px; border: 0; border-radius: 7px; background: transparent; color: var(--green-dark); cursor: pointer; font: inherit; font-weight: 600; }
    .line-step:hover:not(:disabled) { background: var(--hover-surface); }
    .line-step:disabled { color: var(--muted); cursor: not-allowed; }
    .answer-list { display: grid; gap: 10px; }
    .answer-option { display: flex; min-height: 51px; align-items: center; gap: 12px; padding: 0 14px;
      border: 1px solid #e6ebe7; border-radius: 11px; background: #fff; color: #47534b; cursor: pointer;
      font-size: var(--reader-choice-size, 14px); text-align: left; transition: border-color 140ms ease, background 140ms ease; }
    .answer-option:hover { border-color: var(--selection-border); background: var(--hover-surface); }
    .answer-option.selected { border-color: var(--selection-border); background: var(--selection-surface); color: var(--selection-text); }
    .radio-mark { display: grid; width: 17px; height: 17px; flex: 0 0 auto; place-items: center;
      border: 1.5px solid #c8d0ca; border-radius: 50%; }
    .selected .radio-mark { border-color: var(--selection-control); }
    .selected .radio-mark::after { width: 7px; height: 7px; border-radius: 50%; background: var(--selection-control); content: ''; }
    .exercise-actions { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-top: 23px; }
    .reassurance { margin: 0; color: #98a29b; font-size: var(--reader-support-size, 11px); }
    .primary-button { flex: 0 0 auto; min-height: 43px; font-size: 12px; }
    .primary-button:disabled { background: var(--disabled-surface); color: var(--disabled-text); cursor: not-allowed; }
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
  readonly promptLines = computed(() => this.exercise().content.prompt.split('\n'));
  readonly currentLine = signal(0);
  readonly promptFontSize = computed(() => {
    const sizes = { comfortable: '24px', large: '30px', 'extra-large': '36px' };
    return sizes[this.users.fontSize()];
  });
  readonly choiceFontSize = computed(() => {
    const sizes = { comfortable: '14px', large: '18px', 'extra-large': '22px' };
    return sizes[this.users.fontSize()];
  });
  readonly supportFontSize = computed(() => {
    const sizes = { comfortable: '11px', large: '13px', 'extra-large': '15px' };
    return sizes[this.users.fontSize()];
  });
  private startedAt = Date.now();
  readonly audioSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  constructor() {
    effect(() => {
      this.exercise().id;
      this.selected.set(null);
      this.currentLine.set(0);
      this.startedAt = Date.now();
    });
  }

  choose(answer: string): void {
    this.selected.set(answer);
  }

  moveLine(direction: -1 | 1): void {
    this.currentLine.update((line) => Math.max(0, Math.min(this.promptLines().length - 1, line + direction)));
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
    .feedback-card { display: flex; align-items: center; gap: 15px; padding: 20px; border: 1px solid var(--feedback-border);
      border-radius: 16px; background: var(--feedback-surface); }
    .feedback-card.encouraging { border-color: var(--feedback-positive-border); background: var(--feedback-positive-surface); }
    .feedback-icon { display: grid; width: 39px; height: 39px; flex: 0 0 auto; place-items: center;
      border-radius: 13px; background: var(--mosaic-coral); color: var(--mosaic-rose); font-size: 17px; font-weight: 700; }
    .encouraging .feedback-icon { background: var(--feedback-positive-border); color: var(--feedback-positive-icon); }
    .feedback-copy { flex: 1; }
    h2 { margin: 0 0 3px; font: 700 15px 'Manrope', sans-serif; }
    p { margin: 0; color: var(--muted); font-size: 12px; }
    .feedback-card .primary-button { min-height: 41px; padding-inline: 15px; background: var(--primary-action); font-size: 12px; }
    .feedback-card .primary-button:hover { background: var(--primary-action-hover); }
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
