// product-list.component.ts

import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {environment} from "../../environments/environment";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DialogService} from "../shared/_modal/dialog.service";
import {NgxSpinnerService} from "ngx-spinner";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  @ViewChild('editModal') editModal: ElementRef;
  editedProduct: any = null;
  modalRef: NgbModalRef;
  productForm: FormGroup;
  selectedFile: File | null = null;
  base_url = environment.base_url;
  myBids: any[] = [];

  constructor(private http: HttpClient,
              private modalService: NgbModal,
              private fb: FormBuilder,
              private dialogService: DialogService,
              private spinner: NgxSpinnerService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getProductsByUser();
    this.getBidByUser();
  }

  getProductsByUser() {
    this.http.get<any[]>(environment.base_url + '/api/products/user/' + localStorage.getItem('user_id')).subscribe(data => {
      this.products = data;
      this.initDataTables()
    });
  }

  getBidByUser() {
    this.http.get<any[]>(environment.base_url + '/api/products').subscribe(data => {
      this.myBids = data.filter(product =>
        product.bids.bidders.some(bidder => bidder.bidder.id == localStorage.getItem('user_id'))
      );
      this.initDataTables2();
    });
  }

  initDataTables() {
    $(document).ready(() => {
      $('#productTable').DataTable();
    });
  }

  initDataTables2() {
    $(document).ready(() => {
      $('#productTable2').DataTable();
    });
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true});
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  openEditModal(product: any, content: any) {
    this.selectedFile = null;
    // Populate editedProduct with the selected survey data
    this.editedProduct = {...product};
    console.log(this.editedProduct);

    this.http.get<any[]>(environment.base_url + '/api/products/' + this.editedProduct.id + '/images').subscribe(data => {
      this.editedProduct.images = data;
    });
    console.log(this.editedProduct.images);
    this.productForm = this.fb.group({
      name: [this.editedProduct.name, Validators.required],
      description: [this.editedProduct.description],
      category: [this.editedProduct.category],
      askingPrice: [this.editedProduct.askingPrice, [Validators.required, Validators.min(0)]],
      minBidIncrement: [this.editedProduct.minBidIncrement],
      bidClosingDate: [this.editedProduct.bids.bidClosingDate],
      file: ['']
    });
    this.openModal(content);
  }

  onSubmit() {
    const formData = new FormData();
    if (this.selectedFile != null)
      formData.append('file', this.selectedFile as Blob);
    formData.append('name', this.productForm.get('name').value);
    formData.append('description', this.productForm.get('description').value);
    formData.append('category', this.productForm.get('category').value);
    formData.append('askingPrice', this.productForm.get('askingPrice').value);
    formData.append('minBidIncrement', this.productForm.get('minBidIncrement').value);
    formData.append('bidClosingDate', this.productForm.get('bidClosingDate').value);
    formData.append('sellerId', localStorage.getItem('user_id'));

    this.http.put<any>(environment.base_url + '/api/products/' + this.editedProduct.id, formData)
      .pipe(
        catchError(error => {
          console.error('Error creating product and bid', error);
          this.dialogService.open("Product and Bid Failed to Create", environment.error_message, 'danger', environment.error);
          return throwError(error);
        })
      )
      .subscribe(
        response => {
          console.log('Product and Bid created successfully', response);
          this.dialogService.open("Product and Bid created successfully", environment.info_message, 'success', environment.info);
        }
      );
  }

  navigateToDetails(productId: number): void {
    // Use the Angular Router to navigate to the product details page
    this.router.navigate(['/product', productId]);
  }
}
