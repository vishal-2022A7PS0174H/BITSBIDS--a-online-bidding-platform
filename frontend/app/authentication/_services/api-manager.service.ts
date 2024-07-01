import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {EndPoints} from '../_models/EndPoints';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiManagerService {

  constructor(private http: HttpClient, private endpoints: EndPoints) {
  }

  public checkCredentials(loginParam): any {
    return this.http.post(this.endpoints.admin_login, loginParam).pipe(
      catchError(this.handleError),
    );
  }

  public registration(registrationData): any {
    return this.http.post(this.endpoints.registration, registrationData).pipe(
      catchError(this.handleError),
    );
  }

  public getAllCustomers(): any {
  /*  return this.http.get(this.endpoints.get_all_customers).pipe(
      catchError(this.handleError),
    );*/
  }

  private handleError(error: HttpErrorResponse): any {
    return throwError(error);
  }

}
