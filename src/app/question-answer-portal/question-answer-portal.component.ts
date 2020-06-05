import { LoaderService } from './../shared/services/loader.service';
import { Observable, of } from 'rxjs';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { UtilityService } from './../shared/services/utility.service';
import { CrudService } from './../crud.service';
import { AudioRecordingService } from './../audio-recording.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-question-answer-portal',
  templateUrl: './question-answer-portal.component.html',
  styleUrls: ['./question-answer-portal.component.css']
})
export class QuestionAnswerPortalComponent implements OnInit {

  questionAnswerGrid = [];

  constructor(private modalService: NgbModal, private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer,
    private crudService: CrudService, private utilityService: UtilityService, private afStorage: AngularFireStorage,
    private router: Router, private route: ActivatedRoute, private loaderService: LoaderService) {

  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.getQuestion();
    // this.getQuestionById(id);
  }

  getQuestion() {
    this.loaderService.show();
    this.crudService.getAll('questions')
      .subscribe((data) => {
        this.loaderService.hide();
        this.questionAnswerGrid = this.utilityService.responsive(data);
        const questionList = this.questionAnswerGrid.map(e => e.id);
        localStorage.setItem('questionList', JSON.stringify(questionList));
      },
      (err) => {this.loaderService.hide(); });
  }

  openQuestion(id) {
    this.router.navigateByUrl(`question-answer/${id}`);
  }

}
