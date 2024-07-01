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

  public getProfile(): any {
    return this.http.get(this.endpoints.fetch_profile).pipe(
      catchError(this.handleError),
    );
  }

  public update(registrationData): any {
    return this.http.post(this.endpoints.update_profile, registrationData).pipe(
      catchError(this.handleError),
    );
  }

  public getAvailableSignatures(): any {
    return this.http.get(this.endpoints.available_signatures).pipe(
      catchError(this.handleError),
    );
  }

  public getSentSignatures(): any {
    return this.http.get(this.endpoints.sent_signatures).pipe(
      catchError(this.handleError),
    );
  }

  public getPendingSignatures(): any {
    return this.http.get(this.endpoints.pending_signatures).pipe(
      catchError(this.handleError),
    );
  }

  public getLastPurchase(): any {
    return this.http.get(this.endpoints.last_purchase).pipe(
      catchError(this.handleError),
    );
  }

  public getRecentSignatures(): any {
    return this.http.get(this.endpoints.recent_signature).pipe(
      catchError(this.handleError),
    );
  }

  public updatePassword(passwords): any {
    return this.http.post(this.endpoints.update_password, passwords).pipe(
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse): any {
    return throwError(error);
  }
}
