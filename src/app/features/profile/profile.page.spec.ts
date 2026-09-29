import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { afterEach } from 'vitest';
import { AuthService, UserService } from '../../core/services/onoma.services';
import { ProfilePage } from './profile.page';

describe('ProfilePage', () => {
  afterEach(() => {
    const root = document.documentElement;
    root.removeAttribute('data-font-size');
    root.style.removeProperty('--profile-field-label-size');
    root.style.removeProperty('--profile-field-hint-size');
    root.style.removeProperty('--profile-toggle-label-size');
    root.style.removeProperty('--profile-toggle-description-size');
    root.style.removeProperty('--profile-section-description-size');
    root.style.removeProperty('--profile-preview-label-size');
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('applies a changed text size immediately and saves it with the profile', async () => {
    const fixture = TestBed.createComponent(ProfilePage);
    fixture.detectChanges();
    await fixture.whenStable();

    const size = fixture.nativeElement.querySelector(
      'select[formControlName="fontSize"]',
    ) as HTMLSelectElement;
    size.value = 'extra-large';
    size.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(document.documentElement.dataset['fontSize']).toBe('extra-large');
    expect(document.documentElement.style.getPropertyValue('--profile-toggle-label-size')).toBe('15px');
    expect(document.documentElement.style.getPropertyValue('--profile-toggle-description-size')).toBe('13px');

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(TestBed.inject(UserService).profile().preferences.fontSize).toBe('extra-large');
  });

  it('updates the app font and preview when returning from OpenDyslexic to Default', async () => {
    const fixture = TestBed.createComponent(ProfilePage);
    fixture.detectChanges();
    await fixture.whenStable();

    const font = fixture.nativeElement.querySelector(
      'select[formControlName="readingFont"]',
    ) as HTMLSelectElement;
    const preview = fixture.nativeElement.querySelector('.reading-preview') as HTMLElement;

    font.value = 'opendyslexic';
    font.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(preview.style.getPropertyValue('--reading-font-family')).toBe("'OpenDyslexic', sans-serif");
    expect(document.documentElement.style.getPropertyValue('--reading-font-family')).toBe("'OpenDyslexic', sans-serif");

    font.value = 'default';
    font.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(preview.style.getPropertyValue('--reading-font-family')).toBe("'DM Sans', sans-serif");
    expect(document.documentElement.style.getPropertyValue('--reading-font-family')).toBe("'DM Sans', sans-serif");
  });

  it('presents only accessibility preferences after the initial assessment', async () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        snapshot: { queryParamMap: convertToParamMap({ afterAssessment: 'true' }) },
      },
    });

    const fixture = TestBed.createComponent(ProfilePage);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Choose what feels right for you.');
    expect(fixture.nativeElement.textContent).toContain('Reading preferences');
    expect(fixture.nativeElement.textContent).toContain('Save preferences and continue');
    expect(fixture.nativeElement.textContent).toContain('Skip for now');
    expect(fixture.nativeElement.textContent).not.toContain('Your interests & goals');
    expect(fixture.nativeElement.querySelector('input[formControlName="name"]')).toBeNull();
  });

  it('saves curated interest selections from the profile picker', async () => {
    const fixture = TestBed.createComponent(ProfilePage);
    fixture.detectChanges();
    await fixture.whenStable();

    const options = Array.from(
      fixture.nativeElement.querySelectorAll('.interest-option'),
    ) as HTMLElement[];
    const animals = options.find((option) => option.textContent?.includes('Animals'));
    expect(animals).toBeDefined();
    (animals!.querySelector('input') as HTMLInputElement).click();
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(TestBed.inject(AuthService).currentUser.profile.interests).toContain('Animals');
    expect(fixture.nativeElement.querySelector('input[formControlName="interests"]')).toBeNull();
  });
});
