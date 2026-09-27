import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccessibilityPreferences, isLearnerInterest, LEARNER_INTERESTS, LearnerInterest, LearnerProfile, ReadingFont } from '../../core/models/onoma.models';
import { AuthService, UserService } from '../../core/services/onoma.services';
import { InterestPickerComponent } from '../../shared/interest-picker.component';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, InterestPickerComponent],
  template: `
    <section class="page">
      <header class="page-header">
        <p class="eyebrow">YOUR SPACE</p>
        <h1 class="page-title">Your learning, your way.</h1>
        <p class="page-subtitle">Update your details and make your space feel right for you.</p>
      </header>
      <form [formGroup]="form" (ngSubmit)="save()" class="profile-form">
        <section class="profile-section surface-card">
          <div class="profile-heading"><span class="profile-icon" aria-hidden="true">○</span><div><h2>About you</h2><p>The basics that help make your learning personal.</p></div></div>
          <div class="profile-fields">
            <label class="field"><span class="field-label">Name</span><span class="field-hint" aria-hidden="true"></span><input type="text" formControlName="name" autocomplete="name" /></label>
            <label class="field"><span class="field-label">Email</span><span class="field-hint" aria-hidden="true"></span><input type="email" [value]="email" disabled /></label>
            <div class="field-row">
              <label class="field"><span class="field-label">Age group</span><span class="field-hint" aria-hidden="true"></span><select formControlName="ageGroup"><option>Under 12</option><option>12–15</option><option>16–18</option><option>19+</option></select></label>
              <label class="field"><span class="field-label">Preferred language</span><span class="field-hint" aria-hidden="true"></span><select formControlName="language"><option>English</option><option>Spanish</option><option>Other</option></select></label>
            </div>
          </div>
        </section>
        <section class="profile-section surface-card">
          <div class="profile-heading"><span class="profile-icon warm" aria-hidden="true">✳</span><div><h2>Your interests & goals</h2><p>We use these to make activities more relevant.</p></div></div>
          <div class="profile-fields">
            <label class="field"><span class="field-label">Learning focus</span><span class="field-hint" aria-hidden="true"></span><select formControlName="goal"><option>Reading faster</option><option>Reading words with confidence</option><option>Understanding texts</option><option>Spelling</option><option>General reading support</option><option>I'm not sure yet</option></select></label>
            <app-interest-picker
              [options]="interestOptions"
              [selected]="form.controls.interests.value"
              (selectedChange)="form.controls.interests.setValue($event)"
            />
          </div>
        </section>
        <section class="profile-section surface-card">
          <div class="profile-heading"><span class="profile-icon lavender" aria-hidden="true">Aa</span><div><h2>Reading preferences</h2><p>Adjust the way content looks and sounds.</p></div></div>
          <div class="profile-fields">
            <div class="field-row">
              <label class="field"><span class="field-label">Reading font</span><span class="field-hint" aria-hidden="true"></span><select formControlName="readingFont"><option value="default">Default</option><option value="lexend">Lexend</option><option value="opendyslexic">OpenDyslexic</option></select></label>
              <label class="field"><span class="field-label">Text size</span><span class="field-hint">Updates exercise text immediately</span><select formControlName="fontSize" (change)="applyFontSize()"><option value="comfortable">Comfortable</option><option value="large">Large</option><option value="extra-large">Extra large</option></select></label>
            </div>
            <div class="field-row">
              <label class="field"><span class="field-label">Line spacing</span><span class="field-hint" aria-hidden="true"></span><select formControlName="lineSpacing"><option value="standard">Standard</option><option value="relaxed">Relaxed</option><option value="wide">Wide</option></select></label>
              <label class="field"><span class="field-label">Letter spacing</span><span class="field-hint" aria-hidden="true"></span><select formControlName="letterSpacing"><option value="standard">Standard</option><option value="wide">Wide</option><option value="wider">Wider</option></select></label>
            </div>
            <div class="reading-preview" [style.font-family]="previewFont" [style.font-size]="previewSize" [style.letter-spacing]="previewLetterSpacing" [style.line-height]="previewLineHeight">
              <span>PREVIEW</span>
              <p>Small steps make a difference. Read at a pace that feels comfortable for you.</p>
            </div>
            <label class="field"><span class="field-label">Theme</span><span class="field-hint" aria-hidden="true"></span><select formControlName="theme"><option value="light">Light</option><option value="dark">Dark</option></select></label>
            <div class="preference-toggles">
              <label><span><strong>Text-to-speech</strong><small>Listen to reading content</small></span><input type="checkbox" formControlName="textToSpeech" /></label>
              <label><span><strong>Highlight current line</strong><small>Help keep your place while reading</small></span><input type="checkbox" formControlName="currentLineHighlight" /></label>
              <label><span><strong>Reduce visual clutter</strong><small>Keep screens focused and simple</small></span><input type="checkbox" formControlName="reducedClutter" /></label>
            </div>
          </div>
        </section>
        <div class="form-footer">
          @if (saved) { <span class="save-confirmation" role="status">Your preferences are saved.</span> }
          <button class="primary-button" type="submit">Save changes <span aria-hidden="true">→</span></button>
        </div>
      </form>
      <div class="logout-row"><span>Ready to take a break?</span><button class="text-button" type="button" (click)="logout()">Sign out</button></div>
    </section>
  `,
  styles: [`
    .page-header { margin-bottom: 23px; }
    .profile-form { display: grid; max-width: 880px; gap: 13px; }
    .profile-section { padding: 21px 23px; }
    .profile-heading { display: flex; align-items: center; gap: 11px; margin-bottom: 20px; }
    .profile-icon { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 12px; background: var(--selection-surface); color: var(--selection-text); font-size: 17px; }
    .profile-icon.warm { background: var(--mosaic-coral); color: var(--mosaic-rose); }
    .profile-icon.lavender { background: var(--mosaic-lilac); color: var(--mosaic-violet); font-size: 13px; font-weight: 700; }
    .profile-heading h2 { margin: 0; color: var(--ink); font-size: 15px; }
    .profile-heading p { margin: 2px 0 0; color: var(--muted); font-size: var(--profile-section-description-size); }
    .profile-fields { min-width: 0; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
    .reading-preview { margin: 0 0 14px; padding: 13px 15px; border: 1px solid var(--line); border-radius: 11px; background: var(--hover-surface); color: var(--muted); }
    .reading-preview span { color: var(--muted); font: 700 var(--profile-preview-label-size) 'DM Sans', sans-serif; letter-spacing: .1em; }
    .reading-preview p { margin: 7px 0 0; }
    .field { grid-template-rows: 18px 14px 48px; align-content: start; gap: 6px; margin-bottom: 14px; }
    .field:last-child { margin-bottom: 0; }
    .field-label { overflow: hidden; color: var(--ink); font-size: var(--profile-field-label-size); line-height: 1.4; text-overflow: ellipsis; white-space: nowrap; }
    .field-hint { min-height: 14px; overflow: hidden; color: var(--muted); font-size: var(--profile-field-hint-size); font-weight: 400; line-height: 1.4; text-overflow: ellipsis; white-space: nowrap; }
    .field input:disabled { background: var(--canvas); color: var(--muted); }
    .preference-toggles { display: grid; grid-template-columns: 1fr 1fr; gap: 0 15px; border-top: 1px solid var(--line); }
    .preference-toggles label { display: flex; min-height: 57px; align-items: center; justify-content: space-between; gap: 9px; border-bottom: 1px solid var(--line); cursor: pointer; }
    .preference-toggles label span { display: grid; min-width: 0; gap: 1px; }
    .preference-toggles strong { color: var(--ink); font-size: var(--profile-toggle-label-size); line-height: 1.4; }
    .preference-toggles small { color: var(--muted); font-size: var(--profile-toggle-description-size); line-height: 1.4; }
    .preference-toggles input { width: 16px; height: 16px; accent-color: var(--selection-control); }
    .form-footer { display: flex; min-height: 48px; align-items: center; justify-content: flex-end; gap: 14px; }
    .form-footer .primary-button { min-height: 43px; font-size: 12px; }
    .save-confirmation { color: var(--green-dark); font-size: 11px; }
    .logout-row { display: flex; align-items: center; justify-content: space-between; margin-top: 22px; padding: 13px 3px; border-top: 1px solid var(--line); color: var(--muted); font-size: 11px; }
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
  saved = false;
  readonly email = this.auth.currentUser.email;
  readonly form = new FormGroup({
    name: new FormControl(this.auth.currentUser.profile.name, { nonNullable: true, validators: [Validators.required] }),
    ageGroup: new FormControl(this.auth.currentUser.profile.ageGroup, { nonNullable: true }),
    language: new FormControl(this.auth.currentUser.profile.preferredLanguage, { nonNullable: true }),
    goal: new FormControl(this.auth.currentUser.profile.learningGoals[0] ?? 'General reading support', { nonNullable: true }),
    interests: new FormControl<LearnerInterest[]>(
      this.auth.currentUser.profile.interests.filter(isLearnerInterest),
      { nonNullable: true },
    ),
    readingFont: new FormControl<ReadingFont>(this.auth.currentUser.profile.preferences.readingFont, { nonNullable: true }),
    fontSize: new FormControl<AccessibilityPreferences['fontSize']>(this.auth.currentUser.profile.preferences.fontSize, { nonNullable: true }),
    letterSpacing: new FormControl<AccessibilityPreferences['letterSpacing']>(this.auth.currentUser.profile.preferences.letterSpacing, { nonNullable: true }),
    lineSpacing: new FormControl<AccessibilityPreferences['lineSpacing']>(this.auth.currentUser.profile.preferences.lineSpacing, { nonNullable: true }),
    textToSpeech: new FormControl(this.auth.currentUser.profile.preferences.textToSpeech, { nonNullable: true }),
    audioInstructions: new FormControl(this.auth.currentUser.profile.preferences.audioInstructions, { nonNullable: true }),
    currentLineHighlight: new FormControl(this.auth.currentUser.profile.preferences.currentLineHighlight, { nonNullable: true }),
    reducedClutter: new FormControl(this.auth.currentUser.profile.preferences.reducedClutter, { nonNullable: true }),
    theme: new FormControl<AccessibilityPreferences['theme']>(this.auth.currentUser.profile.preferences.theme, { nonNullable: true }),
  });
  readonly interestOptions = LEARNER_INTERESTS;

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
      large: '18px',
      'extra-large': '22px',
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

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const profile: LearnerProfile = {
      ...this.auth.currentUser.profile,
      name: value.name.trim(),
      ageGroup: value.ageGroup,
      preferredLanguage: value.language,
      learningGoals: [value.goal],
      interests: value.interests,
      preferences: {
        readingFont: value.readingFont,
        fontSize: value.fontSize,
        letterSpacing: value.letterSpacing,
        lineSpacing: value.lineSpacing,
        textToSpeech: value.textToSpeech,
        audioInstructions: value.audioInstructions,
        currentLineHighlight: value.currentLineHighlight,
        reducedClutter: value.reducedClutter,
        theme: value.theme,
      },
    };
    this.users.save(profile);
    this.auth.updateProfile(profile);
    this.saved = true;
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
