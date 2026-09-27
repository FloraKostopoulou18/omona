import { TestBed } from '@angular/core/testing';
import { LEARNER_INTERESTS } from '../core/models/onoma.models';
import { InterestPickerComponent } from './interest-picker.component';

describe('InterestPickerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestPickerComponent],
    }).compileComponents();
  });

  it('emits only the selected curated interests', async () => {
    const fixture = TestBed.createComponent(InterestPickerComponent);
    fixture.componentRef.setInput('options', LEARNER_INTERESTS);
    fixture.componentRef.setInput('selected', ['Music']);
    const selections: string[][] = [];
    fixture.componentInstance.selectedChange.subscribe((value) => selections.push(value));
    await fixture.whenStable();
    fixture.detectChanges();

    const animalChoice = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    animalChoice.click();

    expect(selections).toEqual([['Music', 'Animals']]);
  });
});
