import {environment} from '../../../environments/environment';

export class EndPoints {
  private baseUrl = environment.base_url;

  public readonly admin_login = this.baseUrl + '/api/auth/signin';
  public readonly registration = this.baseUrl + '/api/auth/signup';
}
