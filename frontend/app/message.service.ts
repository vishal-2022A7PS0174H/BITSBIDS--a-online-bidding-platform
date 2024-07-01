// message.service.ts

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = environment.base_url + '/api/messages';

  constructor(private http: HttpClient) {
  }

  sendMessage(messageRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send`, messageRequest);
  }

  getInbox(userId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inbox/${userId}`);
  }

  getChatHistory(user1Id: number, user2Id: number, productId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history/${user1Id}/${user2Id}/${productId}`);
  }

  getChatHistoryWithProductName(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inbox-with-product/${userId}`);
  }
}
