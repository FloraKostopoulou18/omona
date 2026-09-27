import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressService, ExerciseService, AuthService } from '../../core/services/onoma.services';
import { NextActivityComponent } from './next-activity.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, NextActivityComponent],
  template: `
    <section class="page">
      <header class="welcome">
        <div>
          <p class="eyebrow">SUNDAY, SEPTEMBER 27</p>
          <h1 class="page-title">Good afternoon, {{ firstName }} <span aria-hidden="true">✳</span></h1>
          <p class="page-subtitle">A little practice today can take you a long way.</p>
        </div>
        @if (!assessmentCompleted) {
          <a class="assessment-link" routerLink="/assessment"><span aria-hidden="true">＋</span> Start an assessment</a>
        }
      </header>

      <div class="dashboard-grid">
        <app-next-activity [activity]="activity" />
        <section class="progress-card surface-card" aria-labelledby="progress-heading">
          <div class="section-heading">
            <div>
              <p class="eyebrow">YOUR PROGRESS</p>
              <h2 id="progress-heading">Growing, one step at a time</h2>
            </div>
            <a routerLink="/progress" aria-label="See all progress">↗</a>
          </div>
          <div class="skill-list">
            @for (skill of progress().skills.slice(0, 3); track skill.id) {
              <div class="skill-row">
                <div class="skill-label"><span>{{ skill.name }}</span><strong>{{ skill.progress }}%</strong></div>
                <div class="progress-track" role="progressbar" [attr.aria-valuenow]="skill.progress"
                  aria-valuemin="0" aria-valuemax="100" [attr.aria-label]="skill.name">
                  <div class="progress-fill" [style.width.%]="skill.progress"></div>
                </div>
                <small>↑ {{ skill.change }}% since you started</small>
              </div>
            }
          </div>
          <a class="text-button progress-link" routerLink="/progress">Explore your progress <span aria-hidden="true">→</span></a>
        </section>
      </div>

      <section class="quick-stats" aria-label="Your activity">
        <article class="stat-card surface-card">
          <span class="stat-icon warm" aria-hidden="true">↗</span>
          <div><strong>{{ progress().exercisesCompleted }}</strong><span>activities completed</span></div>
        </article>
        <article class="stat-card surface-card">
          <span class="stat-icon green" aria-hidden="true">✳</span>
          <div><strong>{{ progress().currentStreak }} days</strong><span>your current rhythm</span></div>
        </article>
        <a class="option-card surface-card" routerLink="/practice">
          <span class="option-symbol" aria-hidden="true">Aa</span>
          <span><strong>Practice</strong><small>Build skills at your pace</small></span>
          <span class="option-arrow" aria-hidden="true">→</span>
        </a>
        <a class="option-card surface-card real-life" routerLink="/real-world">
          <span class="option-symbol" aria-hidden="true">⌖</span>
          <span><strong>Real life</strong><small>Try everyday situations</small></span>
          <span class="option-arrow" aria-hidden="true">→</span>
        </a>
      </section>
      <p class="gentle-note"><span aria-hidden="true">✳</span> Your path is your own. Mosaic adapts learning to you.</p>
    </section>
  `,
  styles: [`
    .welcome { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 27px; }
    .welcome .eyebrow { color: var(--muted); font-size: 10px; }
    .welcome h1 span { color: var(--gold); font-size: 19px; vertical-align: 4px; }
    .assessment-link { display: inline-flex; align-items: center; gap: 7px; margin-bottom: 4px;
      color: var(--muted); font-size: 12px; font-weight: 600; }
    .assessment-link:hover { color: var(--green-dark); }
    .assessment-link span { display: grid; width: 23px; height: 23px; place-items: center; border-radius: 8px; background: var(--selection-surface); color: var(--selection-text); }
    .dashboard-grid { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(310px, .95fr); gap: 19px; align-items: stretch; }
    .progress-card { padding: 26px 24px 18px; }
    .section-heading { display: flex; justify-content: space-between; gap: 12px; }
    .section-heading .eyebrow { margin-bottom: 5px; }
    .section-heading h2 { margin: 0; font-size: 17px; }
    .section-heading > a { display: grid; width: 33px; height: 33px; place-items: center; border-radius: 10px;
      background: var(--hover-surface); color: var(--green-dark); }
    .skill-list { display: grid; gap: 17px; margin-top: 24px; }
    .skill-label { display: flex; justify-content: space-between; margin-bottom: 7px; color: var(--muted); font-size: 12px; }
    .skill-label strong { color: var(--ink); font-size: 12px; }
    .skill-row small { display: block; margin-top: 5px; color: var(--muted); font-size: 10px; }
    .progress-link { margin-top: 16px; padding-left: 0; font-size: 11px; }
    .quick-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 19px; }
    .stat-card, .option-card { display: flex; min-height: 84px; align-items: center; gap: 12px; padding: 15px; }
    .stat-icon, .option-symbol { display: grid; width: 37px; height: 37px; flex: 0 0 auto; place-items: center;
      border-radius: 12px; font-size: 17px; }
    .stat-icon.warm { background: var(--mosaic-lilac); color: var(--gold); }
    .stat-icon.green, .option-symbol { background: var(--selection-surface); color: var(--selection-text); }
    .stat-card div, .option-card > span:nth-child(2) { display: grid; gap: 2px; }
    .stat-card strong, .option-card strong { color: var(--ink); font: 700 17px 'Manrope', sans-serif; white-space: nowrap; }
    .stat-card div span, .option-card small { color: var(--muted); font-size: 10px; white-space: nowrap; }
    .option-card { position: relative; gap: 10px; transition: transform 150ms ease, box-shadow 150ms ease; }
    .option-card:hover { transform: translateY(-2px); box-shadow: 0 13px 30px rgb(49 62 103 / 9%); }
    .option-card strong { font-size: 14px; }
    .option-arrow { margin-left: auto; color: var(--muted); }
    .real-life .option-symbol { background: var(--mosaic-coral); color: var(--mosaic-rose); }
    .gentle-note { margin: 24px 0 0; color: var(--muted); font-size: 11px; text-align: center; }
    .gentle-note span { margin-right: 4px; color: var(--gold); }
    @media (max-width: 1040px) {
      .dashboard-grid { grid-template-columns: 1fr; }
      .quick-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 640px) {
      .welcome { display: block; }
      .assessment-link { margin-top: 15px; }
      .progress-card { padding: 21px 18px 15px; }
      .quick-stats { gap: 9px; }
      .stat-card, .option-card { min-height: 74px; gap: 9px; padding: 11px; }
      .stat-card strong { font-size: 15px; }
      .stat-card div span, .option-card small { font-size: 9px; }
      .stat-icon, .option-symbol { width: 32px; height: 32px; }
    }
  `],
})
export class DashboardPage {
  private readonly auth = inject(AuthService);
  private readonly progressService = inject(ProgressService);
  private readonly exerciseService = inject(ExerciseService);
  readonly progress = this.progressService.progress;
  readonly activity = this.exerciseService.nextActivity();

  get assessmentCompleted(): boolean {
    return this.auth.currentUser.assessmentCompleted;
  }

  get firstName(): string {
    return this.auth.currentUser.profile.name.split(/\s+/)[0] || 'there';
  }
}
