import {environment} from '../../../environments/environment';

export class EndPoints {
  private baseUrl = environment.base_url;
  private baseUrl2 = environment;

  public readonly fetch_profile = this.baseUrl + 'api/profile/get';
  public readonly update_profile = this.baseUrl + 'api/profile/update';
  public readonly update_password = this.baseUrl + 'api/profile/update-password';
  public readonly available_signatures = this.baseUrl + 'api/report/dashboard/available-signature';
  public readonly sent_signatures = this.baseUrl + 'api/report/dashboard/sent-signature';
  public readonly pending_signatures = this.baseUrl + 'api/report/dashboard/pending-signature';
  public readonly last_purchase = this.baseUrl + 'api/report/dashboard/last-purchase';
  public readonly recent_signature = this.baseUrl + 'api/report/dashboard/recent-signature';
  public readonly downloadDocumentStatusUpdate = this.baseUrl + 'api/report/dashboard/update/status/';

  public readonly downloadDocument = this.baseUrl2 + 'api/auth/signRequests/download/docs/';
  public readonly downloadEvidence = this.baseUrl2 + 'api/auth/signRequests/download/evr/';
  public readonly downloadAttachment = this.baseUrl2 + 'api/auth/signRequests/download/user-attachment/';
}
