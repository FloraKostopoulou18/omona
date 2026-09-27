import { Component, inject } from '@angular/core';
import { ProgressService } from '../../core/services/onoma.services';
import { AchievementComponent, ProgressChartComponent, SkillCardComponent } from './progress-widgets';

@Component({
  selector: 'app-progress-page',
  imports: [AchievementComponent, ProgressChartComponent, SkillCardComponent],
  template: `
    <section class="page">
      <header class="page-header">
        <p class="eyebrow">YOUR PROGRESS</p>
        <h1 class="page-title">Look how far you’ve come.</h1>
        <p class="page-subtitle">Every bit of practice counts. Here’s what you’ve been building.</p>
      </header>
      <div class="summary-row">
        <article class="summary-card surface-card"><span class="summary-symbol" aria-hidden="true">↗</span><div><strong>{{ progress().exercisesCompleted }}</strong><span>activities completed</span></div></article>
        <article class="summary-card surface-card"><span class="summary-symbol sun" aria-hidden="true">✳</span><div><strong>{{ progress().currentStreak }} days</strong><span>current streak</span></div></article>
        <article class="focus-card"><span class="focus-label">CURRENT FOCUS</span><strong>{{ focus }}</strong><span>You’re making steady progress here.</span></article>
      </div>
      <section class="section-block">
        <div class="section-title"><div><p class="eyebrow">SKILLS YOU’RE GROWING</p><h2>Your progress, in many ways</h2></div><span>Only skills with activity are shown</span></div>
        <div class="skill-grid">
          @for (skill of progress().skills; track skill.id) { <app-skill-card [skill]="skill" /> }
        </div>
      </section>
      <div class="lower-grid">
        <app-progress-chart />
        <section class="milestones">
          <div class="section-title"><div><p class="eyebrow">MILESTONES</p><h2>Little wins along the way</h2></div></div>
          @for (achievement of progress().achievements; track achievement.id) {
            <app-achievement-card [title]="achievement.title" [description]="achievement.description" [icon]="achievement.icon" />
          }
        </section>
      </div>
      <p class="gentle-note">Progress looks different for everyone. This is your journey, at your pace.</p>
    </section>
  `,
  styles: [`
    .page-header { margin-bottom: 23px; }
    .summary-row { display: grid; grid-template-columns: 1fr 1fr 1.3fr; gap: 12px; }
    .summary-card { display: flex; align-items: center; gap: 12px; padding: 15px; }
    .summary-symbol { display: grid; width: 39px; height: 39px; place-items: center; border-radius: 13px; background: var(--selection-surface); color: var(--selection-text); font-size: 17px; }
    .summary-symbol.sun { background: #f6eee2; color: #ac8747; }
    .summary-card div { display: grid; }
    .summary-card strong { color: #35443b; font: 700 18px 'Manrope', sans-serif; }
    .summary-card span:last-child { color: #929d95; font-size: 10px; }
    .focus-card { display: grid; align-content: center; gap: 2px; padding: 13px 17px; border-radius: 16px; background: var(--selection-surface); }
    .focus-label { color: var(--muted); font-size: 9px; font-weight: 700; letter-spacing: .09em; }
    .focus-card strong { color: var(--selection-text); font: 700 16px 'Manrope', sans-serif; }
    .focus-card > span:last-child { color: var(--muted); font-size: 10px; }
    .section-block { margin-top: 28px; }
    .section-title { display: flex; align-items: flex-end; justify-content: space-between; gap: 14px; margin-bottom: 13px; }
    .section-title .eyebrow { margin-bottom: 3px; color: #9ba49d; font-size: 9px; }
    .section-title h2 { margin: 0; font-size: 17px; }
    .section-title > span { color: #9aa39c; font-size: 9px; }
    .skill-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 11px; }
    .lower-grid { display: grid; grid-template-columns: 1.35fr .85fr; gap: 16px; margin-top: 18px; }
    .milestones { display: grid; align-content: start; gap: 8px; }
    .milestones .section-title { margin-bottom: 1px; }
    .gentle-note { margin: 25px 0 0; color: #9ba49d; font-size: 10px; text-align: center; }
    @media (max-width: 900px) { .lower-grid { grid-template-columns: 1fr; } .summary-row { grid-template-columns: 1fr 1fr; } .focus-card { grid-column: 1 / -1; } }
    @media (max-width: 600px) { .skill-grid { grid-template-columns: 1fr; } .summary-card { padding: 12px; } }
  `],
})
export class ProgressPage {
  private readonly progressService = inject(ProgressService);
  readonly progress = this.progressService.progress;
  readonly focus = 'Reading fluency';
}
