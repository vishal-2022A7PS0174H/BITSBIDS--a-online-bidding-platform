import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {CommonEndPoints} from './CommonEndPoints';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  constructor(private http: HttpClient) {
  }

  public post(url, body) {
    return this.http.post(url, body).pipe(
      catchError(this.handleError),
    );
  }

  public put(url, param, body) {
    return this.http.put(url + '/' + param, body).pipe(
      catchError(this.handleError),
    );
  }

  public get(url, param) {
    return this.http.get(url + '/' + param).pipe(
      catchError(this.handleError),
    );
  }


  public getQuery(url) {
    return this.http.get(url).pipe(
      catchError(this.handleError),
    );
  }

  public delete(url, param) {
    return this.http.delete(url + '/' + param).pipe(
      catchError(this.handleError),
    );
  }


  private handleError(error: HttpErrorResponse): any {
    return throwError(error);
  }
}
