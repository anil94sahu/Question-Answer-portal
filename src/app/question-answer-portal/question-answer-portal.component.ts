import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { UtilityService } from './../shared/services/utility.service';
import { CrudService } from './../crud.service';
import { AudioRecordingService } from './../audio-recording.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-question-answer-portal',
  templateUrl: './question-answer-portal.component.html',
  styleUrls: ['./question-answer-portal.component.css']
})
export class QuestionAnswerPortalComponent implements OnInit {

  questions: {question: string, isRecording: boolean, blobUrl: any, recordedTime: string }[] = [
    {question: 'Who is god ?', isRecording: false, blobUrl: '', recordedTime: ''},
    // {question: 'Why to follow god?', isRecording: false, blobUrl: '', recordedTime: ''},
    // {question: 'How to learn vaisnava etiquette?', isRecording: false, blobUrl: '', recordedTime: ''}
  ];
  isRecording = false;
  recordedTime;
  blobUrl;
  itemNumber = 0;
  tempQuestions = [];
  responseForm: FormGroup;

  constructor(private modalService: NgbModal, private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer,
    private crudService: CrudService, private utilityService: UtilityService) {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.questions[this.itemNumber].isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.questions[this.itemNumber].recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.questions[this.itemNumber]['blobUrl'] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
    });
  }

  ngOnInit() {
    this.getQuestion();
    this.responseForm = new FormGroup({questions: new FormArray([])});
  }

  getQuestion() {
    this.crudService.getAll('questions')
    .subscribe((data) => {
      this.tempQuestions = this.utilityService.responsive(data);
      console.log(this.tempQuestions);
      this.tempQuestions.forEach((e, i) => {this.addItem(); this.setValue(e, i); });
    });
  }

  get questionsForm() {
    return this.responseForm.get('questions');
  }

  addItem() {
    const items = this.responseForm.get('questions') as FormArray;
    items.push(this.initForm());
  }

  setValue(value, i) {
      this.questionsForm['controls'][i].patchValue({
        answer: value.answer ? value.answer : '',
        id: value.id,
        email: value.email,
        question: value.question
      });
      if (value.answer) {
        this.questionsForm['controls'][i].get('answer').disable();
      }
  }

  initForm() {
    const initForm =   {
      id: new FormControl('', /*  Validators.compose([Validators.required]) */),
      name: new FormControl(''),
      email: new FormControl('', Validators.required),
      question: new FormControl(''),
      answer: new FormControl('')
    };
    return new FormGroup(initForm);
  }

/* Modal popup */
openSm(content) {
  this.modalService.open(content, { size: 'sm' });
  this.isRecording = false;
  this.recordedTime = undefined;
  this.blobUrl = undefined;
  this.itemNumber = 0;

}


submitAnswerByText(data) {
  console.log(data);
  this.crudService.update('questions', {answer: data.answer}, data.id);
  this.getQuestion();
}

editAnswer(i) {
  this.questionsForm['controls'][i].get('answer').enable();
}

/* Recroding sessio */
startRecording(item, i) {
  if (!item.isRecording) {
    item.isRecording = true;
    this.itemNumber = i;
    this.audioRecordingService.startRecording();
  }
}

abortRecording(item, i) {
  if (item.isRecording) {
    item.isRecording = false;
    this.audioRecordingService.abortRecording();
  }
}

stopRecording(item, i) {
  if (item.isRecording) {
    this.audioRecordingService.stopRecording();
    item.isRecording = false;
  }
}

clearRecordedData() {
  this.blobUrl = null;
}

ngOnDestroy(): void {
  this.audioRecordingService.abortRecording();
}
}
