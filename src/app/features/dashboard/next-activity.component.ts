import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Activity } from '../../core/models/onoma.models';

@Component({
  selector: 'app-next-activity',
  imports: [RouterLink],
  template: `
    <article class="next-card surface-card">
      <div class="card-heading">
        <span class="eyebrow">YOUR NEXT ACTIVITY</span>
        <span class="duration"><span aria-hidden="true">◷</span> {{ activity().estimatedMinutes }} min</span>
      </div>
      <div class="activity-content">
        <div class="activity-icon" aria-hidden="true">Aa</div>
        <div class="activity-copy">
          <span class="skill-tag">{{ activity().skill }}</span>
          <h2>{{ activity().title }}</h2>
          <p>{{ activity().description }}</p>
        </div>
      </div>
      <div class="why-box">
        <span class="why-mark" aria-hidden="true">✳</span>
        <p><strong>Why this activity?</strong><br />{{ activity().reason }}</p>
      </div>
      <a
        class="primary-button start-button"
        [routerLink]="activity().type === 'real-world' ? '/real-world' : '/practice'"
      >Start activity <span aria-hidden="true">→</span></a>
      <div class="difficulty" aria-label="Gentle challenge">
        <span>Gentle challenge</span>
        <span class="difficulty-dots" aria-hidden="true">
          @for (dot of [1, 2, 3]; track dot) {
            <i [class.filled]="dot <= activity().difficulty"></i>
          }
        </span>
      </div>
    </article>
  `,
  styles: [`
    .next-card { position: relative; overflow: hidden; padding: 26px 28px 22px; }
    .next-card::after { position: absolute; top: -88px; right: -45px; width: 210px; height: 210px;
      border: 1px solid #f0f2ed; border-radius: 50%; content: ''; pointer-events: none; }
    .card-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .card-heading .eyebrow { margin: 0; }
    .duration { display: inline-flex; align-items: center; gap: 6px; color: #7d8981; font-size: 12px; }
    .activity-content { display: flex; align-items: flex-start; gap: 18px; margin: 27px 0 22px; }
    .activity-icon { display: grid; width: 54px; height: 54px; flex: 0 0 auto; place-items: center;
      border-radius: 17px; background: #f4e9dc; color: #9e7951; font: 700 20px 'Manrope', sans-serif; }
    .activity-copy { min-width: 0; }
    .skill-tag { color: var(--mosaic-indigo); font-size: 11px; font-weight: 700; }
    h2 { margin: 2px 0 5px; font-size: 21px; }
    .activity-copy p { margin: 0; color: #7d8981; font-size: 13px; }
    .why-box { display: flex; gap: 11px; padding: 13px 15px; border-radius: 12px; background: var(--hover-surface); }
    .why-mark { color: var(--gold); font-size: 18px; }
    .why-box p { margin: 0; color: var(--muted); font-size: 11px; line-height: 1.6; }
    .why-box strong { color: var(--ink); font-size: 11px; }
    .start-button { min-height: 45px; margin-top: 19px; padding-inline: 19px; font-size: 13px; }
    .difficulty { display: flex; align-items: center; gap: 9px; margin-top: 18px; color: #98a19a; font-size: 10px; }
    .difficulty-dots { display: flex; gap: 4px; }
    .difficulty-dots i { width: 7px; height: 7px; border-radius: 50%; background: var(--line); }
    .difficulty-dots i.filled { background: var(--mosaic-violet); }
    @media (max-width: 640px) {
      .next-card { padding: 21px 19px; }
      .activity-content { gap: 13px; margin-top: 21px; }
      .activity-icon { width: 46px; height: 46px; border-radius: 14px; }
    }
  `],
})
export class NextActivityComponent {
  readonly activity = input.required<Activity>();
}
