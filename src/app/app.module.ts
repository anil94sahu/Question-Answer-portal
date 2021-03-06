import { LoaderComponent } from './shared/components/loader/loader.component';
import { AngularFireStorage } from '@angular/fire/storage';
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
import { ReactiveFormsModule } from '@angular/forms';
import { AudioSubmitComponent } from './audio-submit/audio-submit.component';
import { SubQuestionComponent } from './question-answer-portal/sub-question/sub-question.component';
import { SaveFileComponent } from './shared/components/save-file/save-file.component';
import { HeaderComponent } from './shared/components/header/header.component';
import {HttpClientModule} from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionAnswerPortalComponent,
    SubmitQuestionComponent,
    AudioSubmitComponent,
    SubQuestionComponent,
    SaveFileComponent,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      extendedTimeOut: 1000
    })
  ],
  providers: [AudioRecordingService, AngularFirestore, AngularFireStorage],
  bootstrap: [AppComponent]
})
export class AppModule { }
