import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioSubmitComponent } from './audio-submit.component';

describe('AudioSubmitComponent', () => {
  let component: AudioSubmitComponent;
  let fixture: ComponentFixture<AudioSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
