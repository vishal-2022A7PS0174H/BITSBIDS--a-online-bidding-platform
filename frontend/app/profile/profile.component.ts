import {Component, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder} from "@angular/forms";
import {DialogService} from "../shared/_modal/dialog.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;
  modalRef: NgbModalRef;
  newProfile: any = {};  // Used to store the updated profile temporarily

  constructor(private http: HttpClient,
              private modalService: NgbModal,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.http.get<any[]>(environment.base_url + '/api/auth/' + localStorage.getItem('user_id')).subscribe(data => {
      this.user = data;
    });
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true});
  }

  openEditProfileModal(editProfileModal: any) {
    // Open the edit profile modal
    this.newProfile = { ...this.user };  // Copy the user details to a new object for editing
    this.openModal(editProfileModal);
  }
  onSubmit() {
    this.http.put<any[]>(environment.base_url + '/api/auth/' + localStorage.getItem('user_id'), this.user).subscribe(data => {
      this.dialogService.open("Updated Successfully", environment.info_message, 'success', environment.info);
      this.getUser();
    });
  }

  buyCredit(value: string) {
    const data = {
      amount: value
    }
    this.http.post<any[]>(environment.base_url + '/api/auth/buy/' + localStorage.getItem('user_id')+'/?amount='+value, "").subscribe(data => {
      this.dialogService.open("Purchased Successfully", environment.info_message, 'success', environment.info);
      this.getUser();
    });
  }
}
