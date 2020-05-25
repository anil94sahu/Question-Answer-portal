import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAnswerPortalComponent } from './question-answer-portal.component';

describe('QuestionAnswerPortalComponent', () => {
  let component: QuestionAnswerPortalComponent;
  let fixture: ComponentFixture<QuestionAnswerPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAnswerPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnswerPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
