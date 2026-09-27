import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/onoma.services';

@Component({
  selector: 'app-auth-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-page">
      <section class="auth-story">
        <a class="brand" routerLink="/dashboard"><span class="brand-mark" aria-hidden="true">o</span> onoma</a>
        <div class="story-copy">
          <span class="story-kicker">LEARNING, YOUR WAY</span>
          <h1>A little more you<br />in every lesson.</h1>
          <p>Build reading confidence with practice that adapts to your interests, your pace, and the way you learn.</p>
          <div class="story-art" aria-hidden="true">
            <span class="art-orbit orbit-one"></span><span class="art-orbit orbit-two"></span>
            <span class="art-sun"></span><span class="art-leaf leaf-one"></span><span class="art-leaf leaf-two"></span>
            <span class="art-spark spark-one">✳</span><span class="art-spark spark-two">✦</span>
          </div>
        </div>
        <p class="story-footer">A calm space to grow, one step at a time.</p>
      </section>
      <section class="auth-form-wrap">
        <div class="auth-form-card">
          <p class="eyebrow">{{ isRegister ? 'YOUR NEXT CHAPTER' : 'WELCOME BACK' }}</p>
          <h2>{{ isRegister ? 'Create your space' : 'Good to see you' }}</h2>
          <p class="form-intro">{{ isRegister ? 'Let’s make learning feel a little more like you.' : 'Pick up right where you left off.' }}</p>
          <form [formGroup]="form" (ngSubmit)="submit()">
            @if (isRegister) {
              <label class="field">
                Your name
                <input type="text" formControlName="name" autocomplete="name" placeholder="What should we call you?" />
                @if (form.controls.name.touched && form.controls.name.invalid) {
                  <small class="field-error">Please enter your name.</small>
                }
              </label>
            }
            <label class="field">
              Email address
              <input type="email" formControlName="email" autocomplete="email" placeholder="you@example.com" />
              @if (form.controls.email.touched && form.controls.email.invalid) {
                <small class="field-error">Enter a valid email address.</small>
              }
            </label>
            <label class="field">
              Password
              <input type="password" formControlName="password" [autocomplete]="isRegister ? 'new-password' : 'current-password'" placeholder="At least 6 characters" />
              @if (form.controls.password.touched && form.controls.password.invalid) {
                <small class="field-error">Use at least 6 characters.</small>
              }
            </label>
            <button class="primary-button submit-button" type="submit">
              {{ isRegister ? 'Create account' : 'Sign in' }} <span aria-hidden="true">→</span>
            </button>
          </form>
          <p class="switch-auth">
            {{ isRegister ? 'Already have a space?' : 'New to Onoma?' }}
            <a [routerLink]="isRegister ? '/login' : '/register'">{{ isRegister ? 'Sign in' : 'Create an account' }}</a>
          </p>
          <p class="privacy-note">Your learning journey is personal. Your details stay private.</p>
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .auth-page { display: grid; min-height: 100vh; grid-template-columns: .9fr 1.1fr; background: #fff; }
    .auth-story { position: relative; display: flex; min-height: 100vh; flex-direction: column; overflow: hidden; padding: 31px 8%; background: #edf3ed; }
    .brand { display: inline-flex; width: fit-content; align-items: center; gap: 9px; font: 800 22px 'Manrope', sans-serif; letter-spacing: -.06em; }
    .brand-mark { display: grid; width: 31px; height: 31px; place-items: center; border-radius: 10px; background: var(--green); color: #fff; }
    .story-copy { position: relative; z-index: 1; width: min(100%, 390px); margin: auto 0; }
    .story-kicker { color: #718b77; font-size: 10px; font-weight: 700; letter-spacing: .12em; }
    .story-copy h1 { margin: 12px 0 14px; color: #2f4d3a; font-size: clamp(35px, 4vw, 52px); line-height: 1.1; }
    .story-copy p { max-width: 340px; color: #738578; font-size: 14px; line-height: 1.7; }
    .story-art { position: relative; width: 100%; height: 205px; margin-top: 32px; }
    .art-sun { position: absolute; top: 37px; left: 37%; width: 94px; height: 94px; border-radius: 50%; background: #eadfc8; }
    .art-orbit { position: absolute; top: 6px; left: 22%; width: 220px; height: 145px; border: 1px solid #cbd9ca; border-radius: 50%; transform: rotate(-25deg); }
    .orbit-two { top: 18px; left: 13%; width: 270px; height: 130px; transform: rotate(22deg); }
    .art-leaf { position: absolute; top: 111px; left: 47%; width: 42px; height: 75px; border-radius: 100% 0 100% 0; background: #8da98d; transform: rotate(35deg); }
    .leaf-two { top: 123px; left: 36%; width: 30px; height: 57px; background: #b5c6a9; transform: rotate(-29deg) scaleX(-1); }
    .art-spark { position: absolute; top: 40px; left: 72%; color: #be9b57; font-size: 23px; }
    .spark-two { top: 124px; left: 17%; color: #86a28a; font-size: 16px; }
    .story-footer { margin: auto 0 0; color: #8a9b8b; font-size: 11px; }
    .auth-form-wrap { display: grid; place-items: center; padding: 45px 28px; }
    .auth-form-card { width: min(100%, 385px); }
    .auth-form-card h2 { margin: 0; font-size: 29px; }
    .form-intro { margin: 7px 0 27px; color: #849087; font-size: 13px; }
    .field { gap: 8px; }
    .field-error { color: #a45845; font-size: 11px; font-weight: 500; }
    .submit-button { width: 100%; margin-top: 8px; }
    .switch-auth { margin: 19px 0; color: #7f8a82; font-size: 12px; text-align: center; }
    .switch-auth a { color: var(--green-dark); font-weight: 700; }
    .privacy-note { margin-top: 37px; color: #a2aaa4; font-size: 10px; text-align: center; }
    @media (max-width: 760px) {
      .auth-page { grid-template-columns: 1fr; }
      .auth-story { min-height: 245px; padding: 21px 23px; }
      .story-copy { margin: 28px 0 0; }
      .story-copy h1 { margin: 8px 0; font-size: 31px; }
      .story-copy p { max-width: 460px; margin-bottom: 0; font-size: 12px; }
      .story-art { position: absolute; right: 8px; bottom: -94px; width: 190px; height: 180px; opacity: .65; }
      .story-footer { display: none; }
      .auth-form-wrap { align-items: start; padding: 36px 24px; }
    }
  `],
})
export class AuthPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get isRegister(): boolean {
    return this.route.snapshot.data['mode'] === 'register';
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const { name, email, password } = this.form.getRawValue();
    if (this.isRegister) {
      this.auth.register(name.trim(), email.trim());
      void this.router.navigate(['/onboarding']);
      return;
    }
    this.auth.login(email.trim(), password);
    void this.router.navigate(['/dashboard']);
  }
}
