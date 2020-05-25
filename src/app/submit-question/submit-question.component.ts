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
        }
      ).catch(
        () => {
        }
      );
    } else {
      alert('please fill the mandatory fields')
    }
  }

}
