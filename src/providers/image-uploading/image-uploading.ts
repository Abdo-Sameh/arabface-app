import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ImageUploadingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageUploadingProvider {

  constructor(public http: Http) {
    console.log('Hello ImageUploadingProvider Provider');
  }

}
