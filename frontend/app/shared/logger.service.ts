import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class LoggerService {

  constructor() {}

  log(text: string, object?: any) {
    if (!environment.production) {
      if (object) {
        console.log(text, object);
      } else {
        console.log(text);
      }
    }
  }
}
