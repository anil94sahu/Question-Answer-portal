import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderModel } from '../models/loader.model';
@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderSubject = new Subject<LoaderModel>();
  loaderState = this.loaderSubject.asObservable();
  constructor() { }
  show() {
    this.loaderSubject.next( { show: true } as LoaderModel);
  }
  hide() {
    this.loaderSubject.next( { show: false } as LoaderModel);
  }
}
