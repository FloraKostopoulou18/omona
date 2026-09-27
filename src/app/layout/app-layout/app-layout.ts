import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService, UserService } from '../../core/services/onoma.services';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="app-shell">
      <aside class="sidebar" aria-label="Main navigation">
        <a class="brand" routerLink="/dashboard" aria-label="Onoma home">
          <span class="brand-mark" aria-hidden="true">o</span>
          <span>onoma</span>
        </a>
        <p class="nav-caption">YOUR SPACE</p>
        <nav class="primary-nav">
          @for (item of navItems; track item.path) {
            <a
              class="nav-link"
              [routerLink]="item.path"
              routerLinkActive="active"
              ariaCurrentWhenActive="page"
            >
              <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>
        <div class="sidebar-note">
          <span class="note-spark" aria-hidden="true">✳</span>
          <p>Small steps add up.<br /><strong>Keep going at your pace.</strong></p>
        </div>
        <a class="sidebar-profile" routerLink="/profile">
          <span class="avatar">{{ initials }}</span>
          <span class="profile-label">
            <strong>{{ name }}</strong>
            <small>Your learning space</small>
          </span>
          <span class="profile-arrow" aria-hidden="true">↗</span>
        </a>
      </aside>

      <div class="workspace">
        <header class="topbar">
          <div class="topbar-message">
            <span class="status-dot" aria-hidden="true"></span>
            A little progress, every day
          </div>
          <button class="topbar-user" type="button" (click)="goToProfile()">
            <span class="avatar avatar-small">{{ initials }}</span>
            <span>{{ name }}</span>
            <span aria-hidden="true">⌄</span>
          </button>
        </header>
        <main class="main-content">
          <router-outlet />
        </main>
      </div>

      <nav class="mobile-nav" aria-label="Main navigation">
        @for (item of navItems; track item.path) {
          <a [routerLink]="item.path" routerLinkActive="active" ariaCurrentWhenActive="page">
            <span aria-hidden="true">{{ item.icon }}</span>
            <small>{{ item.label }}</small>
          </a>
        }
      </nav>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .app-shell { min-height: 100vh; }
    .sidebar {
      position: fixed; inset: 0 auto 0 0; z-index: 3; display: flex; width: 246px;
      flex-direction: column; padding: 29px 17px 20px; border-right: 1px solid #e9eeea;
      background: #fff;
    }
    .brand { display: flex; align-items: center; gap: 11px; margin: 0 0 48px 9px;
      font: 800 23px/1 'Manrope', sans-serif; letter-spacing: -.06em; }
    .brand-mark { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 11px;
      background: #477e68; color: white; font: 700 23px/1 'Manrope', sans-serif; }
    .nav-caption { margin: 0 12px 12px; color: #a0aaa4; font-size: 10px; font-weight: 700; letter-spacing: .13em; }
    .primary-nav { display: grid; gap: 5px; }
    .nav-link { display: flex; min-height: 46px; align-items: center; gap: 13px; padding: 0 13px;
      border-radius: 11px; color: #737e78; font-size: 14px; font-weight: 600; transition: .15s ease; }
    .nav-link:hover { background: #f6f8f5; color: #356b56; }
    .nav-link.active { background: #eaf2ed; color: #356b56; }
    .nav-icon { display: grid; width: 22px; place-items: center; font-size: 19px; line-height: 1; }
    .sidebar-note { display: flex; gap: 11px; margin: auto 1px 18px; padding: 14px 12px;
      border-radius: 13px; background: #f7f8f5; color: #748078; font-size: 11px; line-height: 1.55; }
    .sidebar-note p { margin: 0; }
    .sidebar-note strong { color: #44544b; font-weight: 600; }
    .note-spark { color: #c79f4c; font-size: 18px; }
    .sidebar-profile { display: flex; align-items: center; gap: 10px; padding: 12px 7px 2px;
      border-top: 1px solid #edf0ed; }
    .avatar { display: grid; width: 35px; height: 35px; flex: 0 0 auto; place-items: center;
      border-radius: 50%; background: #f0e5d9; color: #785c42; font-size: 12px; font-weight: 700; }
    .profile-label { display: grid; gap: 1px; min-width: 0; }
    .profile-label strong { overflow: hidden; color: #344139; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
    .profile-label small { color: #9aa39d; font-size: 10px; }
    .profile-arrow { margin-left: auto; color: #9aa39d; }
    .workspace { min-height: 100vh; margin-left: 246px; }
    .topbar { position: sticky; top: 0; z-index: 2; display: flex; height: 67px; align-items: center;
      justify-content: space-between; padding: 0 42px; border-bottom: 1px solid #e9eeea;
      background: rgb(247 248 245 / 92%); backdrop-filter: blur(12px); }
    .topbar-message { display: flex; align-items: center; gap: 9px; color: #8a958e; font-size: 12px; }
    .status-dot { width: 7px; height: 7px; border-radius: 50%; background: #79a98e; }
    .topbar-user { display: flex; align-items: center; gap: 9px; border: 0; background: transparent;
      color: #56635a; cursor: pointer; font-size: 12px; font-weight: 600; }
    .avatar-small { width: 31px; height: 31px; font-size: 11px; }
    .main-content { width: min(100%, 1160px); margin: 0 auto; padding: 37px 42px 64px; }
    .mobile-nav { display: none; }
    @media (max-width: 820px) {
      .sidebar { width: 205px; padding-inline: 12px; }
      .workspace { margin-left: 205px; }
      .topbar { padding-inline: 24px; }
      .main-content { padding: 29px 24px 52px; }
    }
    @media (max-width: 640px) {
      .sidebar { display: none; }
      .workspace { margin-left: 0; }
      .topbar { height: 57px; padding: 0 19px; }
      .topbar-user { font-size: 0; }
      .topbar-user span:last-child { display: none; }
      .main-content { padding: 25px 17px 100px; }
      .mobile-nav { position: fixed; inset: auto 0 0; z-index: 4; display: grid; grid-template-columns: repeat(5, 1fr);
        padding: 8px 5px max(8px, env(safe-area-inset-bottom)); border-top: 1px solid #e8ece9;
        background: rgb(255 255 255 / 97%); }
      .mobile-nav a { display: grid; min-height: 48px; place-content: center; justify-items: center; gap: 2px;
        border-radius: 10px; color: #89938d; font-size: 18px; }
      .mobile-nav a.active { background: #eaf2ed; color: #356b56; }
      .mobile-nav small { font-size: 9px; font-weight: 600; }
    }
  `],
})
export class AppLayout {
  private readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  private readonly router = inject(Router);
  readonly navItems = [
    { label: 'Home', path: '/dashboard', icon: '⌂' },
    { label: 'Practice', path: '/practice', icon: '◷' },
    { label: 'Real Life', path: '/real-world', icon: '⌖' },
    { label: 'Progress', path: '/progress', icon: '↗' },
    { label: 'Profile', path: '/profile', icon: '○' },
  ];

  constructor() {
    this.users.apply(this.auth.currentUser.profile);
  }

  get name(): string {
    return this.auth.currentUser.profile.name;
  }

  get initials(): string {
    return this.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  }

  goToProfile(): void {
    void this.router.navigate(['/profile']);
  }
}
