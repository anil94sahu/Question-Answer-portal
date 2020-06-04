import { LoaderService } from './../../services/loader.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from './../../../crud.service';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-save-file',
  templateUrl: './save-file.component.html',
  styleUrls: ['./save-file.component.css']
})
export class SaveFileComponent implements OnInit {

  selectedFiles: FileList;
  currentFileUpload = false;
  progress: { percentage: number } = { percentage: 0 };
  downloadURL: Observable<string>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number> = of(0);
  uploadState: Observable<string>;
  url: string;
  file: any;
  id: string;
  @Output() response = new EventEmitter();
  @Input()basePath: string;
  @Input()item: any;
  @ViewChild('content', {static: false}) content: ElementRef;
  loginModalPopup: NgbModalRef;



  constructor(private modalService: NgbModal, private crudService: CrudService, private afStorage: AngularFireStorage,
    private loaderService: LoaderService ) { }

  ngOnInit() {
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
  console.log('Image uploaded!');
  task.snapshotChanges().pipe(
    finalize(() => {
      const downloadURL = ref.getDownloadURL();
      downloadURL.subscribe(url => {this.url = url; console.log(url);
        this.loaderService.show();
        this.crudService.update('questions', {attachment: url}, item.id);
        this.loaderService.hide();
      });
    })
  )
    .subscribe();
}

  /* Modal popup */
  openModal(item) {
    this.item = item;
    this.loginModalPopup = this.modalService.open(this.content);
  }


}
