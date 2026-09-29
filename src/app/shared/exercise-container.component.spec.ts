import { TestBed } from '@angular/core/testing';
import { afterEach, vi } from 'vitest';
import { Exercise, ExerciseAttempt } from '../core/models/onoma.models';
import { UserService } from '../core/services/onoma.services';
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
  let originalSpeechSynthesis: PropertyDescriptor | undefined;

  afterEach(() => {
    if (originalSpeechSynthesis) {
      Object.defineProperty(window, 'speechSynthesis', originalSpeechSynthesis);
    } else {
      Reflect.deleteProperty(window, 'speechSynthesis');
    }
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

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

  it('lets learners select the line to highlight', async () => {
    const fixture = TestBed.createComponent(ExerciseContainerComponent);
    fixture.componentRef.setInput('exercise', {
      ...sampleExercise,
      content: { ...sampleExercise.content, prompt: 'First line\nSecond line' },
    });
    fixture.componentRef.setInput('mode', 'practice');
    await fixture.whenStable();
    fixture.detectChanges();

    const lines = fixture.nativeElement.querySelectorAll('.prompt-line') as NodeListOf<HTMLButtonElement>;
    expect(lines).toHaveLength(2);
    expect(lines[0].getAttribute('aria-pressed')).toBe('true');
    lines[1].click();
    fixture.detectChanges();
    expect(lines[0].getAttribute('aria-pressed')).toBe('false');
    expect(lines[1].getAttribute('aria-pressed')).toBe('true');
  });

  it('updates prompt, answer, and support text sizes when the preference changes', async () => {
    const fixture = TestBed.createComponent(ExerciseContainerComponent);
    fixture.componentRef.setInput('exercise', sampleExercise);
    fixture.componentRef.setInput('mode', 'practice');
    await fixture.whenStable();
    fixture.detectChanges();

    TestBed.inject(UserService).applyFontSize('extra-large');
    fixture.detectChanges();

    const prompt = fixture.nativeElement.querySelector('.prompt, .prompt-line') as HTMLElement;
    const answer = fixture.nativeElement.querySelector('.answer-option') as HTMLElement;
    const reassurance = fixture.nativeElement.querySelector('.reassurance') as HTMLElement;
    expect(prompt.style.fontSize).toBe('36px');
    expect(answer.style.fontSize).toBe('22px');
    expect(reassurance.style.fontSize).toBe('15px');
  });

  it('reads the exercise prompt aloud when text-to-speech is enabled', async () => {
    originalSpeechSynthesis = Object.getOwnPropertyDescriptor(window, 'speechSynthesis');
    const speech = {
      cancel: vi.fn(),
      speak: vi.fn(),
    };
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: speech,
    });
    vi.stubGlobal(
      'SpeechSynthesisUtterance',
      class {
        lang = '';
        rate = 1;
        onstart: (() => void) | null = null;
        onend: (() => void) | null = null;
        onerror: (() => void) | null = null;

        constructor(readonly text: string) {}
      },
    );

    const users = TestBed.inject(UserService);
    users.save({
      ...users.profile(),
      preferences: { ...users.profile().preferences, textToSpeech: true },
    });
    const fixture = TestBed.createComponent(ExerciseContainerComponent);
    fixture.componentRef.setInput('exercise', {
      ...sampleExercise,
      content: { ...sampleExercise.content, instruction: 'Read this carefully.' },
    });
    fixture.componentRef.setInput('mode', 'practice');
    await fixture.whenStable();
    fixture.detectChanges();

    const listen = fixture.nativeElement.querySelector('.audio-button') as HTMLButtonElement;
    expect(listen).not.toBeNull();
    listen.click();

    expect(speech.cancel).toHaveBeenCalledOnce();
    expect(speech.speak).toHaveBeenCalledOnce();
    expect(speech.speak.mock.calls[0][0]).toMatchObject({
      text: 'Read this carefully. Which word rhymes with “day”?',
      lang: 'en-US',
      rate: 0.9,
    });

    const listenToChoice = fixture.nativeElement.querySelector('.choice-audio-button') as HTMLButtonElement;
    expect(listenToChoice).not.toBeNull();
    listenToChoice.click();
    expect(speech.speak).toHaveBeenCalledTimes(2);
    expect(speech.speak.mock.calls[1][0]).toMatchObject({
      text: 'play',
      lang: 'en-US',
      rate: 0.9,
    });
  });
});
