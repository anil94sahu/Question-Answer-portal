import { CONFIGAPI } from 'src/app/shared/constants/constants';
import { CrudService } from './../crud.service';
import { UtilityService } from './../shared/services/utility.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-submit-question',
  templateUrl: './submit-question.component.html',
  styleUrls: ['./submit-question.component.css']
})
export class SubmitQuestionComponent implements OnInit {

  queryForm: FormGroup;
  constructor(private crudService: CrudService, private utilityService: UtilityService) { }

  ngOnInit() {
    this.queryForm = this.initForm();
  }

  initForm() {
    const initForm =   {
      id: new FormControl('', /*  Validators.compose([Validators.required]) */),
      name: new FormControl(''),
      email: new FormControl('', Validators.required),
      location: new FormControl(''),
      question: new FormControl(''),
    };
    return new FormGroup(initForm);
  }

  onSubmit(data) {
    if (this.queryForm.valid) {
      this.crudService.create('questions', data).then(
        e => {console.log(e),
              // this.router.navigateByUrl('');
              alert('Question is submmited successfully');
              const item = { email: data.email, question: data.question, name: data.name};
              this.sendMail(item);
        }
      ).catch(
        () => {
        }
      );
    } else {
      alert('please fill the mandatory fields')
    }
  }

  sendMail(item) {
    // this.loading = true;
    // this.buttonText = 'Submiting...';
    const user = {
      name: item.name,
      email: item.email,
      question: item.question,
      body: `
      <p><strong>Hare Krishna ${item.name} pr</strong></p>
        <br>
        <p>
            Thank you for asking question.
        </p>
        <p>
            <b>Question : </b> ${item.question}
        </p>
        <br/>
        <p>
            We will notify you once question is answered.
        </p>
        <br>
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
    this.utilityService.sendMail(`${CONFIGAPI}sendmail`, user).subscribe(
      data => {
        const res: any = data;
        console.log(
          `👏 > 👏 > 👏 > 👏 Mail is sent to ${user.name} successfully ${res.messageId}`
        );
      },
      err => {
        console.log(err); 
        // this.loading = false;
        // this.buttonText = 'Submit';
      }, () => {
        // this.loading = false;
        // this.buttonText = 'Submit';
      }
    );
  }

}
