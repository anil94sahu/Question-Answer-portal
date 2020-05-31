import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable, of } from 'rxjs';
import {  finalize } from 'rxjs/operators';



@Component({
  selector: 'app-audio-submit',
  templateUrl: './audio-submit.component.html',
  styleUrls: ['./audio-submit.component.css']
})
export class AudioSubmitComponent implements OnInit {

  currentFileUpload = false;
  progress: { percentage: number } = { percentage: 0 };
  downloadURL: Observable<string>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number> = of(0);
  uploadState: Observable<string>;
  url: string;
  constructor(private afStorage: AngularFireStorage) { }

  ngOnInit() {
  }

  upload(basePath, fileName, file ) {
    this.currentFileUpload = true;
    this.task = this.afStorage.upload(basePath + '/' +  fileName, file);
    const ref = this.afStorage.ref(basePath + '/' + fileName);
    this.uploadProgress = this.task.percentageChanges();
    this.task.percentageChanges().subscribe(
      (progress: number) => {
        this.progress.percentage = progress;
      }
    );
    console.log('Image uploaded!');
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = ref.getDownloadURL();
        this.downloadURL.subscribe(url => {this.url = url; /* this.valueChange.emit(url); */ });
      })
    )
      .subscribe();
  }

}
