import { TestBed } from '@angular/core/testing';
import { Exercise, ExerciseAttempt } from '../core/models/onoma.models';
import { ExerciseContainerComponent } from './exercise-container.component';

const sampleExercise: Exercise = {
  id: 9,
  type: 'decoding',
  skill: 'Decoding',
  difficulty: 1,
  content: {
    prompt: 'Which word rhymes with “day”?',
    options: ['play', 'book'],
    correctAnswer: 'play',
    explanation: 'The words share an ending sound.',
  },
};

describe('ExerciseContainerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseContainerComponent],
    }).compileComponents();
  });

  it('emits a standardized attempt when an answer is checked', async () => {
    const fixture = TestBed.createComponent(ExerciseContainerComponent);
    fixture.componentRef.setInput('exercise', sampleExercise);
    fixture.componentRef.setInput('mode', 'practice');
    const attempts: ExerciseAttempt[] = [];
    fixture.componentInstance.completed.subscribe((attempt) => attempts.push(attempt));
    await fixture.whenStable();

    const answer = fixture.nativeElement.querySelector('.answer-option') as HTMLButtonElement;
    answer.click();
    fixture.detectChanges();
    const submit = fixture.nativeElement.querySelector('.primary-button') as HTMLButtonElement;
    submit.click();

    expect(attempts).toHaveLength(1);
    expect(attempts[0]).toMatchObject({
      exerciseId: 9,
      answer: 'play',
      correct: true,
      hintsUsed: 0,
    });
    expect(attempts[0].responseTime).toBeGreaterThanOrEqual(0);
  });
});
