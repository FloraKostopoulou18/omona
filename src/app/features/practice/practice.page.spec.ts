import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PracticePage } from './practice.page';

describe('PracticePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticePage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('ends a six-activity set and offers a deliberate new set', async () => {
    const fixture = TestBed.createComponent(PracticePage);
    fixture.detectChanges();
    await fixture.whenStable();

    const page = fixture.componentInstance;
    for (let activity = 0; activity < page.sessionSize; activity += 1) {
      page.onCompleted({
        exerciseId: page.exercise().id,
        answer: page.exercise().content.options[0],
        correct: false,
        responseTime: 100,
      });
      page.continuePractice();
    }
    fixture.detectChanges();

    expect(page.setComplete()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('PRACTICE SET COMPLETE');
    expect(fixture.nativeElement.textContent).toContain('That’s six activities done.');
    expect(fixture.nativeElement.textContent).toContain('Finish for now');

    page.startAnotherSet();
    fixture.detectChanges();

    expect(page.setComplete()).toBe(false);
    expect(page.completedInSet()).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('Activity 1 of 6');
  });
});
