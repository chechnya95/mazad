import { TestBed } from '@angular/core/testing';
import { UserNamePipe } from './user-name.pipe';
import { TranslateService } from '@ngx-translate/core';
import { LOCALE_ID } from '@angular/core';

describe('UserNamePipe', () => {
  let pipe: UserNamePipe;

  beforeEach(() => {
    // Configure the Angular TestBed
    TestBed.configureTestingModule({
      // Provide the required services
      providers: [
        { provide: TranslateService, useValue: {} }, // Mock TranslateService or provide a real instance
        { provide: LOCALE_ID, useValue: 'en' }       // Set LOCALE_ID to a default value
      ]
    });

    // Create an instance of the pipe using TestBed
    pipe = TestBed.inject(UserNamePipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  // Additional tests for the pipe's transform method can be added here
});
