import { Component, inject, signal } from '@angular/core';
import { Exercise, ExerciseAttempt } from '../../core/models/onoma.models';
import { RealWorldService } from '../../core/services/onoma.services';
import { ExerciseContainerComponent, ExerciseFeedbackComponent } from '../../shared/exercise-container.component';

@Component({
  selector: 'app-real-world-page',
  imports: [ExerciseContainerComponent, ExerciseFeedbackComponent],
  template: `
    <section class="page">
      <header class="page-header">
        <p class="eyebrow">REAL LIFE</p>
        <h1 class="page-title">Reading for the everyday</h1>
        <p class="page-subtitle">Practice the little reading moments that help life run smoothly.</p>
      </header>
      <div class="scenario-layout">
        <div>
          <div class="scenario-heading">
            <span class="scenario-icon" aria-hidden="true">⌖</span>
            <div><span class="eyebrow">GETTING AROUND</span><h2>A bus to the city</h2></div>
          </div>
          <article class="travel-board" aria-label="Bus departure information">
            <div class="board-top"><strong>LIVE DEPARTURES</strong><span>● ON TIME</span></div>
            <div class="route-name"><span class="route-number">12</span><span>City Centre</span><span class="route-arrow" aria-hidden="true">→</span></div>
            <div class="travel-details">
              <div><small>DEPARTURE</small><strong>08:35</strong></div>
              <div><small>PLATFORM</small><strong>4</strong></div>
              <div><small>DESTINATION</small><strong>City Centre</strong></div>
            </div>
            <div class="board-footer">Next bus · 09:05 &nbsp; Platform 2</div>
          </article>
          @if (feedback()) {
            <app-exercise-feedback [attempt]="lastAttempt()!" [exercise]="exercise" (continued)="tryAnother()" />
          } @else {
            <app-exercise-container [exercise]="exercise" mode="real-world" (completed)="onCompleted($event)" />
          }
        </div>
        <aside class="real-life-aside">
          <span class="aside-label">A REAL-WORLD MOMENT</span>
          <h3>Plans for the morning</h3>
          <p>You’re heading into town and checking the departure board before you go.</p>
          <div class="aside-divider"></div>
          <p class="kind-note">Real life gives us lots of chances to use reading skills. Take this one at your own pace.</p>
        </aside>
      </div>
    </section>
  `,
  styles: [`
    .page-header { margin-bottom: 28px; }
    .scenario-layout { display: grid; grid-template-columns: minmax(0, 1fr) 230px; align-items: start; gap: 22px; }
    .scenario-heading { display: flex; align-items: center; gap: 12px; margin: 0 0 16px 2px; }
    .scenario-icon { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 13px; background: #f5ecdf; color: #a07b48; font-size: 20px; }
    .scenario-heading .eyebrow { margin: 0 0 2px; color: #a08a69; font-size: 9px; }
    .scenario-heading h2 { margin: 0; font-size: 16px; }
    .travel-board { overflow: hidden; margin-bottom: 14px; border: 1px solid #e9e2d6; border-radius: 16px; background: #fff; box-shadow: var(--shadow); }
    .board-top { display: flex; justify-content: space-between; padding: 14px 18px; background: #fbf8f1; color: #82765d; font-size: 9px; font-weight: 700; letter-spacing: .1em; }
    .board-top span { color: #62836c; letter-spacing: .02em; }
    .route-name { display: flex; align-items: center; gap: 13px; padding: 21px 19px 17px; color: #344139; font: 700 18px 'Manrope', sans-serif; }
    .route-number { display: grid; width: 38px; height: 35px; place-items: center; border-radius: 8px; background: #506d5a; color: #fff; font: 700 15px 'DM Sans', sans-serif; }
    .route-arrow { margin-left: auto; color: #bd9a5c; }
    .travel-details { display: grid; grid-template-columns: .8fr .7fr 1.5fr; gap: 8px; padding: 14px 19px 17px; border-top: 1px solid #f0eee9; }
    .travel-details div { display: grid; gap: 5px; }
    .travel-details small { color: #a49b8b; font-size: 8px; font-weight: 700; letter-spacing: .07em; }
    .travel-details strong { color: #3d4b41; font-size: 13px; }
    .board-footer { padding: 10px 19px; background: #faf9f6; color: #8d918b; font-size: 10px; }
    .real-life-aside { margin-top: 58px; padding: 19px; border: 1px solid #eee6d8; border-radius: 15px; background: #fbf8f1; }
    .aside-label { color: #aa956f; font-size: 9px; font-weight: 700; letter-spacing: .08em; }
    .real-life-aside h3 { margin: 12px 0 6px; font-size: 15px; }
    .real-life-aside p { margin: 0; color: #827e72; font-size: 11px; line-height: 1.65; }
    .aside-divider { height: 1px; margin: 16px 0; background: #ece4d7; }
    .real-life-aside p.kind-note { color: #788276; }
    @media (max-width: 900px) { .scenario-layout { grid-template-columns: 1fr; } .real-life-aside { display: none; } }
    @media (max-width: 440px) { .travel-details { grid-template-columns: .8fr .7fr 1.3fr; padding-inline: 13px; } .travel-details strong { font-size: 11px; } }
  `],
})
export class RealWorldPage {
  private readonly realWorld = inject(RealWorldService);
  readonly exercise: Exercise = this.realWorld.nextScenario();
  readonly feedback = signal(false);
  readonly lastAttempt = signal<ExerciseAttempt | null>(null);

  onCompleted(attempt: ExerciseAttempt): void {
    this.lastAttempt.set(attempt);
    this.realWorld.recordAttempt(attempt, this.exercise.skill);
    this.feedback.set(true);
  }

  tryAnother(): void {
    this.feedback.set(false);
    this.lastAttempt.set(null);
  }
}
