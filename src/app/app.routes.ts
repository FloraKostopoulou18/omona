import { Routes } from '@angular/router';
import { assessmentPendingGuard, authGuard } from './core/guards/auth.guard';
import { AssessmentPage } from './features/assessment/assessment.page';
import { AuthPage } from './features/auth/auth.page';
import { DashboardPage } from './features/dashboard/dashboard.page';
import { OnboardingPage } from './features/onboarding/onboarding.page';
import { PracticePage } from './features/practice/practice.page';
import { ProfilePage } from './features/profile/profile.page';
import { ProgressPage } from './features/progress/progress.page';
import { RealWorldPage } from './features/real-world/real-world.page';
import { AppLayout } from './layout/app-layout/app-layout';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', component: AuthPage, data: { mode: 'login' } },
  { path: 'register', component: AuthPage, data: { mode: 'register' } },
  { path: 'onboarding', component: OnboardingPage },
  { path: 'assessment', component: AssessmentPage, canActivate: [authGuard, assessmentPendingGuard] },
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardPage },
      { path: 'practice', component: PracticePage },
      { path: 'real-world', component: RealWorldPage },
      { path: 'progress', component: ProgressPage },
      { path: 'profile', component: ProfilePage },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
