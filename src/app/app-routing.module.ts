import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubmitQuestionComponent } from './submit-question/submit-question.component';
import { QuestionAnswerPortalComponent } from './question-answer-portal/question-answer-portal.component';
import { SubQuestionComponent } from './question-answer-portal/sub-question/sub-question.component';

const routes: Routes = [
  {path : 'submit-question', component: SubmitQuestionComponent},
  {path : 'question-answer', component: QuestionAnswerPortalComponent},
  {path : 'question-answer/:id', component: SubQuestionComponent},
  {path : '**', component: SubmitQuestionComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
