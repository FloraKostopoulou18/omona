import { Component } from '@angular/core';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { AuthPage } from './auth.page';

@Component({ standalone: true, template: '' })
class LoginDestination {}

describe('AuthPage', () => {
  it('allows a valid mock login without requiring the hidden registration name', async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPage],
      providers: [
        provideRouter([{ path: 'dashboard', component: LoginDestination }]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { mode: 'login' } } },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AuthPage);
    const page = fixture.componentInstance;
    page.form.controls.email.setValue('alex@example.com');
    page.form.controls.password.setValue('abcdef');

    expect(page.form.valid).toBe(true);

    page.submit();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/dashboard');
  });
});
