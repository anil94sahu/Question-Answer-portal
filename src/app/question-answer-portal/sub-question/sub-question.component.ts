import { ToastrService } from 'ngx-toastr';
import { LoaderService } from './../../shared/services/loader.service';
import { SaveFileComponent } from 'src/app/shared/components/save-file/save-file.component';
import { UtilityService } from './../../shared/services/utility.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from './../../crud.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AudioRecordingService } from 'src/app/audio-recording.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CONFIGAPI } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-sub-question',
  templateUrl: './sub-question.component.html',
  styleUrls: ['./sub-question.component.css']
})
export class SubQuestionComponent implements OnInit {

  questions: {question: string, isRecording: boolean, blobUrl: any, recordedTime: string } =
    {question: '', isRecording: false, blobUrl: '', recordedTime: ''}
  ;
  isRecording = false;
  recordedTime;
  blobUrl;
  itemNumber = 0;
  tempQuestions = [];
  responseForm: FormGroup;
  item: any;

  selectedFiles: FileList;
  currentFileUpload = false;
  progress: { percentage: number } = { percentage: 0 };
  downloadURL: Observable<string>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number> = of(0);
  uploadState: Observable<string>;
  url: string;
  private basePath = '/recording';
  file: any;
  id: string;
  @ViewChild('saveFile', {static: false}) SaveFileComponentChild: SaveFileComponent;
  modalPopup: any;
  loading = true;
  buttonText = 'Send Mail...';

  constructor(public modalService: NgbModal, private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer,
    private crudService: CrudService, private utilityService: UtilityService, private afStorage: AngularFireStorage,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private router: Router, private route: ActivatedRoute) {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.item.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.item.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.item['blobUrl'] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.file = data.blob;
      this.file.name = data.title;
      this.upload(this.item);
    });
  }

  get questionsForm() {
    return this.responseForm.get('questions');
  }



  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.id = id;
    // this.getQuestion();
    this.getQuestionById(id);
    this.responseForm = this.initForm();
  }


  getQuestionById(id) {
    this.loaderService.show();
    this.crudService.getByParam('questions', id)
    .subscribe((data) => {
      this.loaderService.hide();
      this.item = this.utilityService.responsiveDoc(data);
      if (this.item) {
        this.setValue(this.item);
      }
    },
    err => {this.loaderService.hide();});
  }


  setValue(value) {
      this.responseForm.patchValue({
        answer: value.answer ? value.answer : '',
        id: value.id,
        email: value.email,
        question: value.question
      });
      if (value.answer) {
        this.responseForm.controls.answer.disable();
      }
  }

  initForm() {
    const initForm =   {
      id: new FormControl('', /*  Validators.compose([Validators.required]) */),
      name: new FormControl(''),
      email: new FormControl('', Validators.required),
      question: new FormControl(''),
      answer: new FormControl(''),
      recordAnswer: new FormControl(''),
      attachment: new FormControl('')
    };
    return new FormGroup(initForm);
  }

/* Modal popup */
openSm(content, item) {
  this.modalPopup =  this.modalService.open(content, { size: 'sm' });
  this.isRecording = false;
  this.recordedTime = undefined;
  this.blobUrl = undefined;
  this.itemNumber = 0;
  this.item = item;
}


submitAnswerByText(data) {
  console.log(data);
  this.loaderService.show();
  this.crudService.update('questions', {answer: data.answer}, data.id);
  this.loaderService.hide();
  this.toastr.success('answer is saved successfully', 'success');
  this.sendMail(data);
  this.getQuestionById(data.id);
  // this.getQuestion();
}

editAnswer() {
  this.responseForm.controls.answer.enable();
}

/* Recroding session */
startRecording(item) {
  if (!item.isRecording) {
    item.isRecording = true;
    this.audioRecordingService.startRecording();
  }
}

abortRecording(item) {
  if (item.isRecording) {
    item.isRecording = false;
    this.audioRecordingService.abortRecording();
  }
}

stopRecording(item) {
  if (item.isRecording) {
    this.audioRecordingService.stopRecording();
    item.isRecording = false;
  }
}

clearRecordedData() {
  this.blobUrl = null;
}

/* upload file in database */
selectFile(event) {
  const file = event.target.files.item(0);
  this.file = file;
  // if (file.type.match('*.*')) {
    this.selectedFiles = event.target.files;
  // } else {
  // }
}

upload(item) {
  this.currentFileUpload = true;
  const id = `${this.basePath}/${item.id}`;
  const task = this.afStorage.upload(id + '/' +  this.file.name, this.file);
  const ref = this.afStorage.ref(id + '/' + this.file.name);
  this.uploadProgress = task.percentageChanges();
  task.percentageChanges().subscribe(
    (progress: number) => {
      this.progress.percentage = progress;
    }
  );
  task.snapshotChanges().pipe(
    finalize(() => {
      const downloadURL = ref.getDownloadURL();
      downloadURL.subscribe(url => {this.url = url; console.log(url);
        this.loaderService.show();
        this.crudService.update('questions', {recordAnswer: url}, item.id);
        this.loaderService.hide();
        this.toastr.success('audio recording is saved successfully', 'success');
        this.modalPopup.close();
      });
    })
  )
    .subscribe();
}

/* upload attachment file */
saveAttachment(fileUrl) {
  if (fileUrl) {
    this.responseForm.controls.attachment.setValue(fileUrl);
  } else {
    this.toastr.info('This is not a valid file', 'info');
  }
}

openAttachment() {
  this.SaveFileComponentChild.openModal(this.item);
}

/* Send mail  */
  sendMail(data) {
    this.loading = true;
    this.buttonText = 'Submiting...';
    const user = {
      name: data.name,
      email: data.email,
      question: data.question,
      answer: data.answer,
      audioLink: data.recordAnswer,
      attachment: data.attachment,
      body: `
      <p><strong>Hare Krishna ${data.name} pr</strong></p>
        <br>
        <p>
            Thank you for asking question.
        </p>
        <p>
            Below is the answer of your question
        </p>
        <br>
        <p>
            <b>Question :</b> ${data.question}
        </p>
        <p>
            <b>Answer : </b> ${data.answer}
        </p>
        <p>
            <b>Link for audio : </b> ${data.recordAnswer}
        </p>
        <p>
            <b>Link for Attachment : </b> ${data.recordAnswer}
        </p>

        <br>
        <p>
            <b>
                Your Servant
            </b>
        </p>
        <p>
            <strong>
                Pune voice team
            </strong>
      </p>
      `
    };
    this.loaderService.show();
    this.utilityService.sendMail(`${CONFIGAPI}sendmail`, user).subscribe(
      data => {
        this.loaderService.hide();
        const res: any = data;
        this.toastr.success(`Email is sent to ${user.name} successfully`, 'success');
      },
      err => {
        console.log(err);
        this.loaderService.hide();
        this.loading = false;
        this.buttonText = 'Submit';
        this.toastr.error(`Facing error in sending mail to ${user.name}`, 'success');

      }, () => {
        this.loading = false;
        this.loaderService.hide();
        this.buttonText = 'Submit';
      }
    );
  }

// tslint:disable-next-line: use-life-cycle-interface
ngOnDestroy(): void {
  this.audioRecordingService.abortRecording();
}

}
