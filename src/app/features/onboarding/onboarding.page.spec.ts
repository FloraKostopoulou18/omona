import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OnboardingPage } from './onboarding.page';

describe('OnboardingPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('offers curated multi-select interests before the assessment', async () => {
    const fixture = TestBed.createComponent(OnboardingPage);
    fixture.componentInstance.step.set(2);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('input[formControlName="interests"]')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.interest-option').length).toBe(12);

    const options = Array.from(
      fixture.nativeElement.querySelectorAll('.interest-option'),
    ) as HTMLElement[];
    const animals = options.find((option) => option.textContent?.includes('Animals'));
    expect(animals).toBeDefined();
    (animals!.querySelector('input') as HTMLInputElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.selection-count').textContent).toContain('4 selected');
    expect(fixture.componentInstance.form.controls.interests.value).toContain('Animals');
  });
});
