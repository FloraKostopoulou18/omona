import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { assessmentPendingGuard } from './auth.guard';
import { AuthService } from '../services/onoma.services';
import { AssessmentPage } from '../../features/assessment/assessment.page';

@Component({ standalone: true, template: '' })
class TestPage {}

describe('assessmentPendingGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'dashboard', component: TestPage },
          { path: 'assessment', component: TestPage, canActivate: [assessmentPendingGuard] },
        ]),
      ],
      imports: [AssessmentPage],
    });
  });

  it('keeps the initial demo learner eligible to take the assessment', async () => {
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/assessment');

    expect(router.url).toBe('/assessment');
  });

  it('allows a newly registered learner to take the assessment once', async () => {
    const auth = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);
    auth.register('New Learner', 'new@example.com');

    await router.navigateByUrl('/assessment');
    expect(router.url).toBe('/assessment');

    auth.completeAssessment();
    await router.navigateByUrl('/dashboard');
    await router.navigateByUrl('/assessment');
    expect(router.url).toBe('/dashboard');
  });

  it('redirects learners who already completed the assessment', async () => {
    TestBed.inject(AuthService).completeAssessment();
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/assessment');

    expect(router.url).toBe('/dashboard');
  });

  it('marks the assessment complete when the learner answers the final item', () => {
    const auth = TestBed.inject(AuthService);
    auth.register('New Learner', 'new@example.com');
    const fixture = TestBed.createComponent(AssessmentPage);
    fixture.detectChanges();
    const page = fixture.componentInstance;
    page.index.set(page.exercises.length - 1);

    page.onCompleted({
      exerciseId: page.exercise().id,
      answer: page.exercise().content.correctAnswer,
      correct: true,
      responseTime: 100,
    });

    expect(auth.currentUser.assessmentCompleted).toBe(true);
  });
});
