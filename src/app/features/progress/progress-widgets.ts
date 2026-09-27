import { Component, input } from '@angular/core';
import { LearnerSkill } from '../../core/models/onoma.models';

@Component({
  selector: 'app-progress-bar',
  template: `
    <div class="bar-wrap">
      <div class="bar-track" role="progressbar" [attr.aria-valuenow]="value()" aria-valuemin="0" aria-valuemax="100" [attr.aria-label]="label()">
        <div class="bar-fill" [style.width.%]="value()"></div>
      </div>
      <strong>{{ value() }}%</strong>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .bar-wrap { display: flex; align-items: center; gap: 11px; }
    .bar-track { height: 8px; flex: 1; overflow: hidden; border-radius: 99px; background: #edf0ec; }
    .bar-fill { height: 100%; border-radius: inherit; background: #638b70; }
    strong { min-width: 34px; color: #425047; font-size: 12px; text-align: right; }
  `],
})
export class ProgressBarComponent {
  readonly value = input.required<number>();
  readonly label = input.required<string>();
}

@Component({
  selector: 'app-skill-card',
  imports: [ProgressBarComponent],
  template: `
    <article class="skill-card">
      <div class="skill-heading"><span class="skill-dot" aria-hidden="true"></span><h3>{{ skill().name }}</h3></div>
      <app-progress-bar [value]="skill().progress" [label]="skill().name" />
      <p>↑ {{ skill().change }}% since you started</p>
    </article>
  `,
  styles: [`
    .skill-card { padding: 17px 18px; border: 1px solid #edf0ed; border-radius: 14px; background: #fff; }
    .skill-heading { display: flex; align-items: center; gap: 9px; margin-bottom: 13px; }
    .skill-heading h3 { margin: 0; color: #3d4a42; font-size: 14px; }
    .skill-dot { width: 8px; height: 8px; border-radius: 50%; background: #82a58b; }
    p { margin: 10px 0 0; color: #8b978e; font-size: 10px; }
  `],
})
export class SkillCardComponent {
  readonly skill = input.required<LearnerSkill>();
}

@Component({
  selector: 'app-progress-chart',
  template: `
    <div class="chart-wrap">
      <div class="chart-heading"><div><span class="eyebrow">OVER THE LAST FEW WEEKS</span><h3>Your steady progress</h3></div><span class="chart-key"><i></i> Reading fluency</span></div>
      <svg viewBox="0 0 620 190" role="img" aria-label="Reading fluency has steadily improved over the last six weeks">
        <line x1="35" y1="30" x2="600" y2="30" /><line x1="35" y1="75" x2="600" y2="75" />
        <line x1="35" y1="120" x2="600" y2="120" /><line x1="35" y1="165" x2="600" y2="165" />
        <text x="0" y="34">80%</text><text x="0" y="79">60%</text><text x="0" y="124">40%</text><text x="0" y="169">20%</text>
        <path class="area" d="M45 133 L150 118 L255 110 L360 91 L465 75 L575 55 L575 165 L45 165 Z" />
        <polyline class="trend" points="45,133 150,118 255,110 360,91 465,75 575,55" />
        <circle cx="45" cy="133" r="4" /><circle cx="150" cy="118" r="4" /><circle cx="255" cy="110" r="4" />
        <circle cx="360" cy="91" r="4" /><circle cx="465" cy="75" r="4" /><circle cx="575" cy="55" r="4" />
        <text x="34" y="184">WEEK 1</text><text x="140" y="184">WEEK 2</text><text x="245" y="184">WEEK 3</text>
        <text x="350" y="184">WEEK 4</text><text x="455" y="184">WEEK 5</text><text x="565" y="184">NOW</text>
      </svg>
    </div>
  `,
  styles: [`
    .chart-wrap { padding: 21px 20px 13px; border: 1px solid #edf0ed; border-radius: 15px; background: #fff; }
    .chart-heading { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .chart-heading .eyebrow { margin-bottom: 3px; color: #9ba49d; font-size: 9px; }
    .chart-heading h3 { margin: 0; font-size: 15px; }
    .chart-key { display: flex; align-items: center; gap: 6px; color: #849087; font-size: 9px; }
    .chart-key i { width: 7px; height: 7px; border-radius: 50%; background: #638b70; }
    svg { width: 100%; margin-top: 13px; overflow: visible; }
    line { stroke: #edf0ed; stroke-width: 1; }
    svg text { fill: #a1aaa3; font: 8px 'DM Sans', sans-serif; }
    .area { fill: #eaf2ed; opacity: .9; }
    .trend { fill: none; stroke: #638b70; stroke-linecap: round; stroke-linejoin: round; stroke-width: 3; }
    circle { fill: #638b70; stroke: #fff; stroke-width: 2; }
  `],
})
export class ProgressChartComponent {}

@Component({
  selector: 'app-achievement-card',
  template: `
    <article class="achievement-card">
      <span class="achievement-icon" aria-hidden="true">{{ icon() }}</span>
      <span><strong>{{ title() }}</strong><small>{{ description() }}</small></span>
      <span class="achievement-check" aria-label="Achieved">✓</span>
    </article>
  `,
  styles: [`
    .achievement-card { display: flex; align-items: center; gap: 11px; padding: 12px; border: 1px solid #edf0ed; border-radius: 12px; background: #fff; }
    .achievement-icon { display: grid; width: 35px; height: 35px; flex: 0 0 auto; place-items: center; border-radius: 11px; background: #f4eee1; color: #a5874a; }
    .achievement-card > span:nth-child(2) { display: grid; gap: 2px; }
    strong { color: #49564d; font-size: 11px; }
    small { color: #97a098; font-size: 9px; }
    .achievement-check { margin-left: auto; color: #72927a; font-size: 13px; }
  `],
})
export class AchievementComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly icon = input.required<string>();
}
