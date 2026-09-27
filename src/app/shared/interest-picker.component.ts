import { Component, input, output } from '@angular/core';
import { LearnerInterest } from '../core/models/onoma.models';

@Component({
  selector: 'app-interest-picker',
  template: `
    <fieldset class="interest-picker">
      <legend class="sr-only">Choose your interests</legend>
      <p class="picker-hint">Choose any that interest you.</p>
      <div class="interest-grid">
        @for (interest of options(); track interest) {
          <label class="interest-option" [class.selected]="selected().includes(interest)">
            <input
              type="checkbox"
              [checked]="selected().includes(interest)"
              (change)="toggle(interest)"
            />
            <span class="interest-check" aria-hidden="true">✓</span>
            <span>{{ interest }}</span>
          </label>
        }
      </div>
      <p class="selection-count" aria-live="polite">
        {{ selected().length }} selected
      </p>
    </fieldset>
  `,
  styles: [`
    .interest-picker { min-width: 0; margin: 0; padding: 0; border: 0; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden;
      clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
    .picker-hint { margin: 0 0 11px; color: var(--muted); font-size: 11px; }
    .interest-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 9px; }
    .interest-option { position: relative; display: flex; min-width: 0; min-height: 50px; align-items: center; gap: 9px;
      padding: 8px 11px; border: 1px solid #e3e9e4; border-radius: 11px; background: #fff;
      color: var(--ink); cursor: pointer; font-size: 11px; line-height: 1.35; transition: border-color 140ms ease, background 140ms ease; }
    .interest-option:hover { border-color: var(--selection-border); background: var(--hover-surface); }
    .interest-option.selected { border-color: var(--selection-border); background: var(--selection-surface); color: var(--selection-text); }
    .interest-option input { position: absolute; width: 1px; height: 1px; opacity: 0; }
    .interest-option:focus-within { outline: 3px solid var(--focus-ring); outline-offset: 2px; }
    .interest-check { display: grid; width: 16px; height: 16px; flex: 0 0 auto; place-items: center;
      border: 1px solid var(--line); border-radius: 5px; color: transparent; font-size: 10px; }
    .interest-option > span:last-child { min-width: 0; }
    .interest-option.selected .interest-check { border-color: var(--selection-control); background: var(--selection-control); color: #fff; }
    .selection-count { margin: 9px 0 0; color: var(--muted); font-size: 10px; }
    @media (max-width: 540px) { .interest-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; } }
  `],
})
export class InterestPickerComponent {
  readonly options = input.required<readonly LearnerInterest[]>();
  readonly selected = input.required<LearnerInterest[]>();
  readonly selectedChange = output<LearnerInterest[]>();

  toggle(interest: LearnerInterest): void {
    const selected = this.selected();
    this.selectedChange.emit(
      selected.includes(interest)
        ? selected.filter((item) => item !== interest)
        : [...selected, interest],
    );
  }
}
