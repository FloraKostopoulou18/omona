import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  AccessibilityPreferences,
  LEARNER_INTERESTS,
  LearnerInterest,
  LearnerProfile,
  normalizeLearnerInterests,
  ReadingFont,
} from '../../core/models/onoma.models';
import { AuthService, UserService } from '../../core/services/onoma.services';
import { InterestPickerComponent } from '../../shared/interest-picker.component';

@Component({
  selector: 'app-onboarding-page',
  imports: [ReactiveFormsModule, RouterLink, InterestPickerComponent],
  template: `
    <main class="onboarding-page">
      <header class="onboarding-header">
        <a class="brand" routerLink="/dashboard" aria-label="Onoma"><span class="brand-mark" aria-hidden="true">o</span> onoma</a>
        <span>STEP {{ step() + 1 }} OF 4</span>
      </header>
      <section class="onboarding-content">
        <div class="onboarding-progress" aria-label="Onboarding progress">
          <span [class.current]="step() >= 0"></span><span [class.current]="step() >= 1"></span>
          <span [class.current]="step() >= 2"></span><span [class.current]="step() >= 3"></span>
        </div>
        <p class="eyebrow">LET’S MAKE IT YOURS</p>
        @switch (step()) {
          @case (0) {
            <h1 class="page-title">First, a little about you.</h1>
            <p class="page-subtitle">This helps us find the right words and pace for your practice.</p>
          }
          @case (1) {
            <h1 class="page-title">What would you like to work on?</h1>
            <p class="page-subtitle">Choose what matters to you right now. You can change this later.</p>
          }
          @case (2) {
            <h1 class="page-title">What are you into?</h1>
            <p class="page-subtitle">We can use your interests to make practice feel more familiar.</p>
          }
          @default {
            <h1 class="page-title">Make reading comfortable.</h1>
            <p class="page-subtitle">Choose the settings that feel best. These are always easy to change.</p>
          }
        }
        <form [formGroup]="form" (ngSubmit)="save()">
          @switch (step()) {
            @case (0) {
              <label class="field">Your name
                <input type="text" formControlName="name" autocomplete="given-name" />
                @if (form.controls.name.touched && form.controls.name.invalid) { <small class="field-error">Add your name to continue.</small> }
              </label>
              <div class="field-row">
                <label class="field">Age group
                  <select formControlName="ageGroup">
                    <option>Under 12</option><option>12–15</option><option>16–18</option><option>19+</option>
                  </select>
                </label>
              </div>
            }
            @case (1) {
              <div class="choice-list" role="radiogroup" aria-label="Learning goal">
                @for (goal of goals; track goal) {
                  <label class="choice-row" [class.chosen]="form.controls.goal.value === goal">
                    <input type="radio" formControlName="goal" [value]="goal" />
                    <span>{{ goal }}</span><span class="choice-check" aria-hidden="true">✓</span>
                  </label>
                }
              </div>
            }
            @case (2) {
              <app-interest-picker
                [options]="interestOptions"
                [selected]="form.controls.interests.value"
                (selectedChange)="form.controls.interests.setValue($event)"
              />
            }
            @default {
              <div class="field-row">
                <label class="field">Reading font
                  <select formControlName="readingFont" (change)="applyReadingFont()">
                    <option value="default">Default</option><option value="lexend">Lexend</option><option value="opendyslexic">OpenDyslexic</option>
                  </select>
                </label>
                <label class="field">Text size
                  <span class="field-hint">Also adjusts exercise text</span>
                  <select formControlName="fontSize"><option value="comfortable">Comfortable</option><option value="large">Large</option><option value="extra-large">Extra large</option></select>
                </label>
              </div>
              <div class="field-row">
                <label class="field">Line spacing
                  <select formControlName="lineSpacing"><option value="standard">Standard</option><option value="relaxed">Relaxed</option><option value="wide">Wide</option></select>
                </label>
                <label class="field">Letter spacing
                  <select formControlName="letterSpacing"><option value="standard">Standard</option><option value="wide">Wide</option><option value="wider">Wider</option></select>
                </label>
              </div>
              <div class="reading-preview" [style.--reading-font-family]="previewFont" [style.font-size]="previewSize" [style.letter-spacing]="previewLetterSpacing" [style.line-height]="previewLineHeight">
                <span>PREVIEW</span>
                <p>Small steps make a difference. Read at a pace that feels comfortable for you.</p>
              </div>
              <label class="field">Theme
                <select formControlName="theme"><option value="light">Light</option><option value="dark">Dark</option></select>
              </label>
              <div class="toggle-list">
                <label><span><strong>Text-to-speech</strong><small>Listen to reading content</small></span><input type="checkbox" formControlName="textToSpeech" /></label>
                <label><span><strong>Highlight the current line</strong><small>Keep your place while you read</small></span><input type="checkbox" formControlName="currentLineHighlight" /></label>
                <label><span><strong>Reduce visual clutter</strong><small>Keep the page extra simple</small></span><input type="checkbox" formControlName="reducedClutter" /></label>
              </div>
            }
          }
          <div class="form-actions">
            @if (step() > 0) { <button class="secondary-button" type="button" (click)="back()">Back</button> }
            <button class="primary-button" type="button" (click)="next()">{{ step() === 3 ? 'Continue to assessment' : 'Continue' }} <span aria-hidden="true">→</span></button>
          </div>
        </form>
        <p class="gentle-note">No labels, no pressure — just learning that adapts to you.</p>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #f7f8f5; }
    .onboarding-page { min-height: 100vh; }
    .onboarding-header { display: flex; height: 67px; align-items: center; justify-content: space-between; padding: 0 6vw; border-bottom: 1px solid #e8ece9; background: #fff; }
    .brand { display: inline-flex; align-items: center; gap: 9px; color: var(--ink); font: 800 21px 'Manrope', sans-serif; letter-spacing: -.06em; }
    .brand-mark { display: grid; width: 30px; height: 30px; place-items: center; border-radius: 10px; background: var(--green); color: #fff; }
    .onboarding-header > span { color: #94a098; font-size: 10px; font-weight: 700; letter-spacing: .08em; }
    .onboarding-content { width: min(100% - 34px, 530px); margin: 0 auto; padding: 42px 0 50px; }
    .onboarding-progress { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; margin-bottom: 35px; }
    .onboarding-progress span { height: 4px; border-radius: 9px; background: #e4e9e4; }
    .onboarding-progress span.current { background: #6b977a; }
    .onboarding-content > .page-subtitle { margin-bottom: 25px; line-height: 1.6; }
    .onboarding-content > .eyebrow { margin-bottom: 9px; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
    .reading-preview { margin: 0 0 17px; padding: 13px 15px; border: 1px solid #e5ebe6; border-radius: 11px; background: #fff; color: #526057; }
    .reading-preview span { color: #829287; font: 700 9px 'DM Sans', sans-serif; letter-spacing: .1em; }
    .reading-preview p { margin: 7px 0 0; }
    .field { margin-bottom: 17px; }
    .field-hint { margin-top: -5px; color: #97a198; font-size: 10px; font-weight: 400; }
    .field-error { color: #a45845; font-size: 11px; font-weight: 500; }
    .choice-list { display: grid; gap: 9px; }
    .choice-row { display: flex; min-height: 51px; align-items: center; gap: 12px; padding: 0 13px; border: 1px solid #e3e9e4; border-radius: 11px; background: #fff; color: #556259; cursor: pointer; font-size: 13px; }
    .choice-row.chosen { border-color: #77a084; background: #f3f7f3; color: #365b45; }
    .choice-row input { accent-color: #477e68; }
    .choice-check { margin-left: auto; color: #477e68; opacity: 0; }
    .chosen .choice-check { opacity: 1; }
    .toggle-list { overflow: hidden; border: 1px solid #e5ebe6; border-radius: 12px; background: #fff; }
    .toggle-list label { display: flex; min-height: 58px; align-items: center; justify-content: space-between; gap: 12px; padding: 9px 14px; border-bottom: 1px solid #edf0ed; cursor: pointer; }
    .toggle-list label:last-child { border-bottom: 0; }
    .toggle-list label span { display: grid; }
    .toggle-list strong { color: #46534a; font-size: 12px; }
    .toggle-list small { color: #9aa39c; font-size: 10px; }
    .toggle-list input { width: 17px; height: 17px; accent-color: #477e68; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 25px; }
    .gentle-note { margin: 24px 0 0; color: #99a39b; font-size: 10px; text-align: center; }
    @media (max-width: 540px) { .onboarding-header { height: 59px; padding-inline: 19px; } .onboarding-content { padding-top: 29px; } .field-row { grid-template-columns: 1fr; gap: 0; } }
  `],
})
export class OnboardingPage {
  private readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  private readonly router = inject(Router);
  readonly step = signal(0);
  readonly goals = ['Read faster', 'Read words with confidence', 'Understand what I read', 'Spelling', 'General reading support', 'I’m not sure yet'];
  readonly interestOptions = LEARNER_INTERESTS;
  readonly form = new FormGroup({
    name: new FormControl(this.auth.currentUser.profile.name, { nonNullable: true, validators: [Validators.required] }),
    ageGroup: new FormControl(this.auth.currentUser.profile.ageGroup, { nonNullable: true }),
    goal: new FormControl(this.auth.currentUser.profile.learningGoals[0] ?? this.goals[0], { nonNullable: true }),
    interests: new FormControl<LearnerInterest[]>(
      normalizeLearnerInterests(this.auth.currentUser.profile.interests),
      { nonNullable: true },
    ),
    fontSize: new FormControl<AccessibilityPreferences['fontSize']>('comfortable', { nonNullable: true }),
    readingFont: new FormControl<ReadingFont>('default', { nonNullable: true }),
    letterSpacing: new FormControl<AccessibilityPreferences['letterSpacing']>('standard', { nonNullable: true }),
    lineSpacing: new FormControl<AccessibilityPreferences['lineSpacing']>('relaxed', { nonNullable: true }),
    theme: new FormControl<AccessibilityPreferences['theme']>('light', { nonNullable: true }),
    textToSpeech: new FormControl(this.auth.currentUser.profile.preferences.textToSpeech, { nonNullable: true }),
    currentLineHighlight: new FormControl(true, { nonNullable: true }),
    reducedClutter: new FormControl(false, { nonNullable: true }),
  });

  get previewFont(): string {
    const fonts: Record<ReadingFont, string> = {
      default: "'DM Sans', sans-serif",
      lexend: "'Lexend', sans-serif",
      opendyslexic: "'OpenDyslexic', sans-serif",
    };
    return fonts[this.form.controls.readingFont.value];
  }

  applyReadingFont(): void {
    this.users.applyReadingFont(this.form.controls.readingFont.value);
  }

  get previewSize(): string {
    const sizes: Record<AccessibilityPreferences['fontSize'], string> = {
      comfortable: '14px',
      large: '16px',
      'extra-large': '18px',
    };
    return sizes[this.form.controls.fontSize.value];
  }

  get previewLetterSpacing(): string {
    const spacing: Record<AccessibilityPreferences['letterSpacing'], string> = {
      standard: 'normal',
      wide: '0.04em',
      wider: '0.08em',
    };
    return spacing[this.form.controls.letterSpacing.value];
  }

  get previewLineHeight(): string {
    const spacing: Record<AccessibilityPreferences['lineSpacing'], string> = {
      standard: '1.5',
      relaxed: '1.75',
      wide: '1.95',
    };
    return spacing[this.form.controls.lineSpacing.value];
  }

  back(): void {
    this.step.update((value) => Math.max(0, value - 1));
  }

  next(): void {
    if (this.step() === 0 && !this.form.controls.name.valid) {
      this.form.controls.name.markAsTouched();
      return;
    }
    if (this.step() < 3) {
      this.step.update((value) => value + 1);
      return;
    }
    this.save();
  }

  save(): void {
    if (this.step() !== 3 || !this.form.valid) return;
    const values = this.form.getRawValue();
    const profile: LearnerProfile = {
      ...this.auth.currentUser.profile,
      name: values.name.trim(),
      ageGroup: values.ageGroup,
      learningGoals: [values.goal],
      interests: values.interests,
      preferences: {
        ...this.auth.currentUser.profile.preferences,
        readingFont: values.readingFont,
        fontSize: values.fontSize,
        letterSpacing: values.letterSpacing,
        lineSpacing: values.lineSpacing,
        theme: values.theme,
        textToSpeech: values.textToSpeech,
        currentLineHighlight: values.currentLineHighlight,
        reducedClutter: values.reducedClutter,
      },
    };
    this.users.save(profile);
    this.auth.updateProfile(profile);
    void this.router.navigate(['/assessment']);
  }
}
