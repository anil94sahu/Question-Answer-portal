import { AppRoutingModule } from './app-routing.module';
import { environment } from './../environments/environment.prod';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AudioRecordingService } from './audio-recording.service';
import { QuestionAnswerPortalComponent } from './question-answer-portal/question-answer-portal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { SubmitQuestionComponent } from './submit-question/submit-question.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [
    AppComponent,
    QuestionAnswerPortalComponent,
    SubmitQuestionComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    MDBBootstrapModule.forRoot(),
    AppRoutingModule
  ],
  providers: [AudioRecordingService, AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
