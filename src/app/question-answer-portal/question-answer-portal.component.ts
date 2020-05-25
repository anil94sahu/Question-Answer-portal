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

  constructor(private modalService: NgbModal, private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer) { 
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
  }


/* Modal popup */
openSm(content) {
  this.modalService.open(content, { size: 'sm' });
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
