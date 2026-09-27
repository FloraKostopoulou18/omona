import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach } from 'vitest';
import { UserService } from '../../core/services/onoma.services';
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
});
