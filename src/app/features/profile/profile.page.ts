import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, InterestPickerComponent],
  template: `
    <section class="page">
      <header class="page-header">
        @if (afterAssessment) {
          <p class="eyebrow">MAKE IT COMFORTABLE</p>
          <h1 class="page-title">Choose what feels right for you.</h1>
          <p class="page-subtitle">Your starting point is set. Adjust how Mosaic looks and sounds while you learn. You can change these settings any time in your profile.</p>
        } @else {
          <p class="eyebrow">YOUR SPACE</p>
          <h1 class="page-title">Your learning, your way.</h1>
          <p class="page-subtitle">Update your details and make your space feel right for you.</p>
        }
      </header>
      <form [formGroup]="form" (ngSubmit)="save()" class="profile-form">
        @if (!afterAssessment) {
          <section class="profile-section surface-card">
            <div class="profile-heading"><span class="profile-icon" aria-hidden="true">○</span><div><h2>About you</h2><p>The basics that help make your learning personal.</p></div></div>
            <div class="profile-fields">
              <label class="field">Name<input type="text" formControlName="name" autocomplete="name" /></label>
              <label class="field">Email<input type="email" [value]="email" disabled /></label>
              <label class="field">Age group<select formControlName="ageGroup"><option>Under 12</option><option>12–15</option><option>16–18</option><option>19+</option></select></label>
            </div>
          </section>
          <section class="profile-section surface-card">
            <div class="profile-heading"><span class="profile-icon warm" aria-hidden="true">✳</span><div><h2>Your interests & goals</h2><p>We use these to make activities more relevant.</p></div></div>
            <div class="profile-fields">
              <label class="field">Learning focus<select formControlName="goal"><option>Reading faster</option><option>Reading words with confidence</option><option>Understanding texts</option><option>Spelling</option><option>General reading support</option><option>I'm not sure yet</option></select></label>
              <app-interest-picker
                [options]="interestOptions"
                [selected]="form.controls.interests.value"
                (selectedChange)="form.controls.interests.setValue($event)"
              />
            </div>
          </section>
        }
        <section class="profile-section surface-card">
          <div class="profile-heading"><span class="profile-icon lavender" aria-hidden="true">Aa</span><div><h2>Reading preferences</h2><p>Adjust the way content looks and sounds.</p></div></div>
          <div class="profile-fields">
            <div class="field-row">
              <label class="field">Reading font<select formControlName="readingFont" (change)="applyReadingFont()"><option value="default">Default</option><option value="lexend">Lexend</option><option value="opendyslexic">OpenDyslexic</option></select></label>
              <label class="field">Text size <span class="field-hint">Also adjusts exercise text</span><select formControlName="fontSize" (change)="applyFontSize()"><option value="comfortable">Comfortable</option><option value="large">Large</option><option value="extra-large">Extra large</option></select></label>
            </div>
            <div class="field-row">
              <label class="field">Line spacing<select formControlName="lineSpacing"><option value="standard">Standard</option><option value="relaxed">Relaxed</option><option value="wide">Wide</option></select></label>
              <label class="field">Letter spacing<select formControlName="letterSpacing"><option value="standard">Standard</option><option value="wide">Wide</option><option value="wider">Wider</option></select></label>
            </div>
            <div class="reading-preview" [style.--reading-font-family]="previewFont" [style.font-size]="previewSize" [style.letter-spacing]="previewLetterSpacing" [style.line-height]="previewLineHeight">
              <span>PREVIEW</span>
              <p>Small steps make a difference. Read at a pace that feels comfortable for you.</p>
            </div>
            <label class="field">Theme<select formControlName="theme"><option value="light">Light</option><option value="dark">Dark</option></select></label>
            <div class="preference-toggles">
              <label><span><strong>Text-to-speech</strong><small>Listen to reading content</small></span><input type="checkbox" formControlName="textToSpeech" /></label>
              <label><span><strong>Highlight current line</strong><small>Help keep your place while reading</small></span><input type="checkbox" formControlName="currentLineHighlight" /></label>
              <label><span><strong>Reduce visual clutter</strong><small>Keep screens focused and simple</small></span><input type="checkbox" formControlName="reducedClutter" /></label>
            </div>
          </div>
        </section>
        <div class="form-footer">
          @if (saved && !afterAssessment) { <span class="save-confirmation" role="status">Your preferences are saved.</span> }
          @if (afterAssessment) {
            <button class="text-button" type="button" (click)="continueToDashboard()">Skip for now</button>
            <button class="primary-button" type="submit">Save preferences and continue <span aria-hidden="true">→</span></button>
          } @else {
            <button class="primary-button" type="submit">Save changes <span aria-hidden="true">→</span></button>
          }
        </div>
      </form>
      @if (!afterAssessment) {
        <div class="logout-row"><span>Ready to take a break?</span><button class="text-button" type="button" (click)="logout()">Sign out</button></div>
      }
    </section>
  `,
  styles: [`
    .page-header { margin-bottom: 23px; }
    .profile-form { display: grid; gap: 13px; }
    .profile-section { padding: 21px 23px; }
    .profile-heading { display: flex; align-items: center; gap: 11px; margin-bottom: 20px; }
    .profile-icon { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 12px; background: #eaf2ed; color: #5c816a; font-size: 17px; }
    .profile-icon.warm { background: #f6eee2; color: #a8874f; }
    .profile-icon.lavender { background: #f0edf4; color: #837291; font-size: 13px; font-weight: 700; }
    .profile-heading h2 { margin: 0; color: #37453c; font-size: 15px; }
    .profile-heading p { margin: 2px 0 0; color: #929d95; font-size: 10px; }
    .profile-fields { max-width: 620px; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
    .reading-preview { margin: 0 0 14px; padding: 13px 15px; border: 1px solid #e5ebe6; border-radius: 11px; background: #f9faf8; color: #526057; }
    .reading-preview span { color: #829287; font: 700 9px 'DM Sans', sans-serif; letter-spacing: .1em; }
    .reading-preview p { margin: 7px 0 0; }
    .field { margin-bottom: 14px; }
    .field:last-child { margin-bottom: 0; }
    .field-hint { color: #9ca59e; font-size: 10px; font-weight: 400; }
    .field input:disabled { background: #f7f8f5; color: #a2aaa4; }
    .preference-toggles { display: grid; grid-template-columns: 1fr 1fr; gap: 0 15px; border-top: 1px solid #edf0ed; }
    .preference-toggles label { display: flex; min-height: 57px; align-items: center; justify-content: space-between; gap: 9px; border-bottom: 1px solid #edf0ed; cursor: pointer; }
    .preference-toggles label span { display: grid; gap: 1px; }
    .preference-toggles strong { color: #526057; font-size: 11px; }
    .preference-toggles small { color: #9ca59e; font-size: 9px; }
    .preference-toggles input { width: 16px; height: 16px; accent-color: #477e68; }
    .form-footer { display: flex; min-height: 48px; align-items: center; justify-content: flex-end; gap: 14px; }
    .form-footer .primary-button { min-height: 43px; font-size: 12px; }
    .save-confirmation { color: #4e7e5d; font-size: 11px; }
    .logout-row { display: flex; align-items: center; justify-content: space-between; margin-top: 22px; padding: 13px 3px; border-top: 1px solid #e8ece9; color: #929c94; font-size: 11px; }
    .text-button { color: #786d62; font-size: 11px; }
    @media (max-width: 600px) {
      .profile-section { padding: 17px; }
      .field-row, .preference-toggles { grid-template-columns: 1fr; gap: 0; }
      .profile-heading { margin-bottom: 16px; }
    }
  `],
})
export class ProfilePage {
  private readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly afterAssessment = this.route.snapshot.queryParamMap.get('afterAssessment') === 'true';
  readonly interestOptions = LEARNER_INTERESTS;
  saved = false;
  readonly email = this.auth.currentUser.email;
  readonly form = new FormGroup({
    name: new FormControl(this.auth.currentUser.profile.name, { nonNullable: true, validators: [Validators.required] }),
    ageGroup: new FormControl(this.auth.currentUser.profile.ageGroup, { nonNullable: true }),
    goal: new FormControl(this.auth.currentUser.profile.learningGoals[0] ?? 'General reading support', { nonNullable: true }),
    interests: new FormControl<LearnerInterest[]>(
      normalizeLearnerInterests(this.auth.currentUser.profile.interests),
      { nonNullable: true },
    ),
    readingFont: new FormControl<ReadingFont>(this.auth.currentUser.profile.preferences.readingFont, { nonNullable: true }),
    fontSize: new FormControl<AccessibilityPreferences['fontSize']>(this.auth.currentUser.profile.preferences.fontSize, { nonNullable: true }),
    letterSpacing: new FormControl<AccessibilityPreferences['letterSpacing']>(this.auth.currentUser.profile.preferences.letterSpacing, { nonNullable: true }),
    lineSpacing: new FormControl<AccessibilityPreferences['lineSpacing']>(this.auth.currentUser.profile.preferences.lineSpacing, { nonNullable: true }),
    textToSpeech: new FormControl(this.auth.currentUser.profile.preferences.textToSpeech, { nonNullable: true }),
    currentLineHighlight: new FormControl(this.auth.currentUser.profile.preferences.currentLineHighlight, { nonNullable: true }),
    reducedClutter: new FormControl(this.auth.currentUser.profile.preferences.reducedClutter, { nonNullable: true }),
    theme: new FormControl<AccessibilityPreferences['theme']>(this.auth.currentUser.profile.preferences.theme, { nonNullable: true }),
  });

  get previewFont(): string {
    const fonts: Record<ReadingFont, string> = {
      default: "'DM Sans', sans-serif",
      lexend: "'Lexend', sans-serif",
      opendyslexic: "'OpenDyslexic', sans-serif",
    };
    return fonts[this.form.controls.readingFont.value];
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

  applyFontSize(): void {
    this.users.applyFontSize(this.form.controls.fontSize.value);
  }

  applyReadingFont(): void {
    this.users.applyReadingFont(this.form.controls.readingFont.value);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (!this.afterAssessment && this.form.invalid) return;
    const value = this.form.getRawValue();
    const currentProfile = this.auth.currentUser.profile;
    const preferences: AccessibilityPreferences = {
      readingFont: value.readingFont,
      fontSize: value.fontSize,
      letterSpacing: value.letterSpacing,
      lineSpacing: value.lineSpacing,
      textToSpeech: value.textToSpeech,
      currentLineHighlight: value.currentLineHighlight,
      reducedClutter: value.reducedClutter,
      theme: value.theme,
    };
    const profile: LearnerProfile = this.afterAssessment
      ? {
          ...currentProfile,
          preferences,
        }
      : {
          ...currentProfile,
          name: value.name.trim(),
          ageGroup: value.ageGroup,
          learningGoals: [value.goal],
          interests: value.interests,
          preferences,
        };
    this.users.save(profile);
    this.auth.updateProfile(profile);
    if (this.afterAssessment) {
      this.continueToDashboard();
      return;
    }
    this.saved = true;
  }

  continueToDashboard(): void {
    this.users.apply(this.auth.currentUser.profile);
    void this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
