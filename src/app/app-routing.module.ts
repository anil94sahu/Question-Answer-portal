import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubmitQuestionComponent } from './submit-question/submit-question.component';
import { QuestionAnswerPortalComponent } from './question-answer-portal/question-answer-portal.component';

const routes: Routes = [
  {path : 'submit-question', component: SubmitQuestionComponent},
  {path : 'question-answer', component: QuestionAnswerPortalComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled', // Add options right here
  }) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
