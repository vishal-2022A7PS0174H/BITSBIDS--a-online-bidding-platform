import {Injectable} from '@angular/core';
import {ModalDismissReasons, NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DialogModalComponent} from './dialog-modal/dialog-modal.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private modalService: NgbModal) {
  }

  open(message, messageType, classes, iconClass): any {
    const dialogModal = this.modalService.open(DialogModalComponent, {centered: true});
    dialogModal.result.then((result) => {
    }, (reason) => {
      if (reason === ModalDismissReasons.ESC) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    });
    dialogModal.componentInstance.message = message;
    dialogModal.componentInstance.class = classes;
    dialogModal.componentInstance.messageType = messageType;
    dialogModal.componentInstance.iconClass = iconClass;
  }
}
