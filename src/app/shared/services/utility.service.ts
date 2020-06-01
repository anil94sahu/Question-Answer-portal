import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class UtilityService {
    constructor() { }


    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
      }


    getToken() {
      return localStorage.getItem('token');
    }


    getLocalStorage() {
      const token = localStorage.getItem('token');
      return {token};
    }


    setState(body) {
      localStorage.setItem('state', JSON.stringify(body));
    }

    setValue(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }

    getValue(key) {
      return JSON.parse(localStorage.getItem(key));
    }

    response(res) {
      return res.map(e => e.payload.doc.data());
    }

    // response with ID
    responsive(res) {
      return res.map(e => {
        const payload =   e.payload.doc.data();
        payload.id = e.payload.doc.id;
        return payload;
      });
    }

    responsiveDoc(res) {
      const id = res.id;
      return {...res.data(), id: id};
    }
}
