import { Component, OnDestroy } from '@angular/core';
import { AudioRecordingService } from './audio-recording.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
    .start-button {
      background-color: #7ffe9f; /* Green */
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin-bottom: 10px;
    }

    .stop-button {
      background-color: rgba(118, 146, 254, 0.69); /* Green */
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin-bottom: 10px;

    }

    .cancel-button {
      background-color: #af7541; /* Green */
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin-bottom: 10px;

    }
  `]
})
export class AppComponent implements OnDestroy {

  isRecording = false;
  recordedTime;
  blobUrl;
  itemNumber = 0;
  questions: {question: string, isRecording: boolean, blobUrl: any, recordedTime: string }[] = [
    {question: 'Who is god ?', isRecording: false, blobUrl: '', recordedTime: ''},
    {question: 'Why to follow god?', isRecording: false, blobUrl: '', recordedTime: ''},
    {question: 'How to learn vaisnava etiquette?', isRecording: false, blobUrl: '', recordedTime: ''}
  ];

  constructor(private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer) {

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
