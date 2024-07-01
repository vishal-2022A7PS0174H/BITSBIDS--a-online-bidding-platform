import {Component, OnInit} from '@angular/core';
import {ApiManagerService} from '../../_services/api-manager.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from '../../_alert';
import { LoggerService } from 'src/app/shared/logger.service';

@Component({
  selector: 'app-product-info',
  styleUrls: ['./product-info.component.css'],
  templateUrl: './product-info.component.html'
})
export class ProductInfoComponent implements OnInit {
  constructor(private apiManagerService: ApiManagerService,
              private spinner: NgxSpinnerService,
              private alertService: AlertService,
              private loggerService: LoggerService) {
  }

  available_signatures: any;
  sent_signatures: any;
  pending_signatures: any;
  last_purchase: any;
  recent_signatures: any;

  ngOnInit(): void {
    this.spinner.show();
    this.getAvailableSignatures();
    this.getSentSignatures();
    this.getPendingSignatures();
    this.getLastPurchase();
    this.spinner.hide();
  }


  public getAvailableSignatures(): void {
    this.apiManagerService.getAvailableSignatures().subscribe((response: any) => {
        this.available_signatures = response;
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
        this.alertService.error(error.error.message, {autoClose: true});
      });
  }

  public getSentSignatures(): void {
    this.apiManagerService.getSentSignatures().subscribe((response: any) => {
        this.sent_signatures = response;
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
        this.alertService.error(error.error.message, {autoClose: true});
      });
  }

  public getPendingSignatures(): void {
    this.apiManagerService.getPendingSignatures().subscribe((response: any) => {
        this.pending_signatures = response;
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
        this.alertService.error(error.error.message, {autoClose: true});
      });
  }

  public getLastPurchase(): void {
    this.apiManagerService.getLastPurchase().subscribe((response: any) => {
        this.last_purchase = response;
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
        this.alertService.error(error.error.message, {autoClose: true});
      });
  }
}
