import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubQuestionComponent } from './sub-question.component';

describe('SubQuestionComponent', () => {
  let component: SubQuestionComponent;
  let fixture: ComponentFixture<SubQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
