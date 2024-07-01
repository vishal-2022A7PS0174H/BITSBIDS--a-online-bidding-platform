import {environment} from '../../environments/environment';

export class CommonEndPoints {
  private baseUrl = environment.base_url;

  public readonly createSentence = this.baseUrl + 'api/sentence/create';
  public readonly getSentence = this.baseUrl + 'api/sentence/get';
  public readonly getSentenceById = this.baseUrl + 'api/sentence/get/by';
  public readonly updateSentence = this.baseUrl + 'api/sentence/update';

  public readonly createObject = this.baseUrl + 'api/sink-swim/create';
  public readonly getObject = this.baseUrl + 'api/sink-swim/get';
  public readonly getObjectById = this.baseUrl + 'api/sink-swim/get/by';
  public readonly updateObject = this.baseUrl + 'api/sink-swim/update';

  public readonly mission = this.baseUrl + 'api/home/mission';
  public readonly vision = this.baseUrl + 'api/home/vision';
  public readonly getHomeContent = this.baseUrl + 'api/home/home-content';

  public readonly events = this.baseUrl + 'api/events';
  public readonly galleries = this.baseUrl + 'api/galleries';
}
