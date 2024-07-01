import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiManagerService} from '../../_services/api-manager.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from '../../_alert';
import {HttpClient} from '@angular/common/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {EndPoints} from '../../_models/EndPoints';
import { LoggerService } from 'src/app/shared/logger.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  constructor(private http: HttpClient,
              private apiManagerService: ApiManagerService,
              private spinner: NgxSpinnerService,
              private alertService: AlertService,
              private endpoints: EndPoints,
              private modalService: NgbModal,
              private loggerService: LoggerService) {
  }

  @ViewChild('content') myModal: any;
  recent_signatures: any;
  closeResult = '';

  ngOnInit(): void {
    this.spinner.show();
    this.getRecentSignatures();
    this.spinner.hide();
  }

  public getRecentSignatures(): void {
    this.apiManagerService.getRecentSignatures().subscribe((response: any) => {
        this.recent_signatures = response;
        this.loggerService.log('recent_signatures', this.recent_signatures);
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
        this.alertService.error(error.error.message, {autoClose: true});
      });
  }

  open(content) {
    this.modalService.open(content, {centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  downloadDocument(idDocument: any): void {
    this.spinner.show();
    this.loggerService.log('idDocument', idDocument);
    this.http.get(this.endpoints.downloadDocument + idDocument, {responseType: 'blob'})
      .subscribe((rs: any) => {
        this.spinner.hide();
        this.downloadFile(rs, idDocument, 'doc_');
        this.http.get(this.endpoints.downloadDocumentStatusUpdate + idDocument)
          .subscribe((res: any) => {
            this.spinner.hide();
            this.loggerService.log('res', res);
          }, err => {
            this.spinner.hide();
            console.error(err);
          });
      }, err => {
        this.spinner.hide();
        console.error(err);
      });
  }

  downloadFile(response, idDocument, type): any {
    const newBlob = new Blob([response], {type: 'application/pdf'});
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    }

    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement('a');
    link.href = data;
    link.download = type + idDocument;
    link.click();
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
    }, 400);
  }

  downloadZip(response, idDocument, type): any {
    const newBlob = new Blob([response], {type: 'application/zip'});
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    }

    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement('a');
    link.href = data;
    link.download = type + idDocument;
    link.click();
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
    }, 400);
  }

  downloadEvidence(idDocument: any): void {
    this.spinner.show();
    this.http.get(this.endpoints.downloadEvidence + idDocument + '/', {responseType: 'blob'})
      .subscribe(rs => {
        this.spinner.hide();
        this.downloadFile(rs, idDocument, 'evidence_');
      }, err => {
        this.spinner.hide();
        console.error(err);
      });
  }

  downloadAttached(idDocument: any, reqId: any) {
    this.spinner.show();
    this.http.get(this.endpoints.downloadAttachment + idDocument + '/' + reqId, {responseType: 'blob'})
      .subscribe(rs => {
        this.spinner.hide();
        this.downloadZip(rs, idDocument, 'attachment_');
      }, err => {
        this.spinner.hide();
        this.open(this.myModal);
        console.error(err);
      });
  }

  getStatusColor(status) {
    if (status === 'signed') {
      return 'primary';
    }
    if (status === 'rejected') {
      return 'danger';
    }
    if (status === 'sent') {
      return 'warning';
    }
  }

  getStatusText(status) {
    if (status === 'signed') {
      return 'signés';
    }
    if (status === 'rejected') {
      return 'rejettés';
    }
    if (status === 'sent') {
      return 'envoyés';
    }
  }
}
