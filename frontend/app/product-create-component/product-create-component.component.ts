import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {DialogService} from "../shared/_modal/dialog.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create-component.component.html',
  styleUrls: ['./product-create-component.component.css']
})
export class ProductCreateComponent implements OnInit {

  productForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private dialogService: DialogService,
              private spinner: NgxSpinnerService,
              private datePipe: DatePipe) {
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      category: [''],
      askingPrice: ['', [Validators.required, Validators.min(0)]],
      minBidIncrement: [''],
      bidClosingDate: [''],
      creationDate: [''],
      sellerId: ['', Validators.required],
      file: ['']
    });
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.selectedFile as Blob);
    formData.append('name', this.productForm.get('name').value);
    formData.append('description', this.productForm.get('description').value);
    formData.append('category', this.productForm.get('category').value);
    formData.append('askingPrice', this.productForm.get('askingPrice').value);
    formData.append('minBidIncrement', this.productForm.get('minBidIncrement').value);
    formData.append('bidClosingDate', this.datePipe.transform(this.productForm.get('bidClosingDate').value, 'yyyy-MM-ddTHH:mm:ss'));
    formData.append('sellerId', localStorage.getItem('user_id'));

    this.http.post<any>(environment.base_url + '/api/products', formData)
      .pipe(
        catchError(error => {
          console.error('Error creating product and bid', error);
          this.dialogService.open("Product and Bid Failed to Create", environment.error_message, 'danger', environment.error);
          return throwError(error);
        })
      )
      .subscribe(
        response => {
          this.productForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: [''],
            category: [''],
            askingPrice: ['', [Validators.required, Validators.min(0)]],
            minBidIncrement: [''],
            bidClosingDate: [''],
            creationDate: [''],
            sellerId: ['', Validators.required],
            file: ['']
          });
          console.log('Product and Bid created successfully', response);
          this.dialogService.open("Product and Bid created successfully", environment.info_message, 'success', environment.info);
        }
      );
  }

  protected readonly event = event;
}
