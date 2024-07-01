import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {DialogService} from "../shared/_modal/dialog.service";
import {NgxSpinnerService} from "ngx-spinner";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  productId: number;
  productDetails: any;
  yourBidAmount: any;
  highestBidder: any;
  highestBidderName: any = 'N/A';
  highestBidAmount: any = 0;
  base_url = environment.base_url;
  username = localStorage.getItem('user_username');
  userId: any = localStorage.getItem('user_id');

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private dialogService: DialogService,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    // Get the product ID from the route parameters
    this.getProductDetails();
  }

  isUsernameBlur(product: any, bidder: any): boolean {
    console.log(bidder.bidder.id);
    // Check the conditions related to product bids and bidder's status
    if (product && product.bids && product.bids.bidStatus == 'CLOSED') {
      // Check if the bidder's ID or the seller's ID matches the logged-in user ID
      const isBidder = product.bids.bidders.find(b =>  b.bidder.id == bidder.bidder.id && b.status == true);
      const isSeller = product.bids.seller.id == this.userId && product.bids.bidders.find(b => b.bidder.id == bidder.bidder.id && b.status == true);

      console.log(isBidder);
      console.log(isSeller);
      return isBidder !== undefined || isSeller;
    }
    return false;
  }

  isSellerNameBlur(product: any): boolean {
    // Check the conditions related to product bids and bidder's status
    if (product && product.bids) {
      // Check if the bidder's ID or the seller's ID matches the logged-in user ID
      const isBidder = product.bids.bidStatus == 'CLOSED' && product.bids.bidders.find(b => b.bidder.id == this.userId && b.status == true);
      const isSeller = product.bids.seller.id == this.userId;

      return isBidder !== undefined || isSeller;
    }
    return false;
  }

  getProductDetails() {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      // Fetch product details using the product ID
      this.http.get<any>(environment.base_url + '/api/products/' + this.productId).subscribe(data => {
        this.productDetails = data;
        console.log(this.username !== this.productDetails.bids.seller.username)
        console.log(this.productDetails.bids.bidStatus !== 'CLOSED')
        // Find the highest bidder and their bid amount
        const highestBidder = this.findHighestBidder(data.bids.bidders);
        if (highestBidder) {
          this.highestBidder = highestBidder.bidder;
          this.highestBidderName = highestBidder.bidder.username;
          this.highestBidAmount = highestBidder.amount;
        }
      });
    });
  }

  placeBid(bid_id: any) {
    const data = {
      'bidderId': localStorage.getItem('user_id'),
      'bidId': bid_id,
      'amount': this.yourBidAmount,
    };
    this.http.post<any>(environment.base_url + '/api/bidders', data).pipe(
      catchError(error => {
        console.log(error);
        this.dialogService.open(error.error.message, environment.error_message, 'danger', environment.error);
        return throwError(error);
      })
    ).subscribe(data => {
      // Find the highest bidder and their bid amount
      this.getProductDetails();
      this.dialogService.open("Bid Placed Successfully", environment.info_message, 'success', environment.info);
    });
  }

  private findHighestBidder(bidders: any[]): any {
    let highestBidder = null;
    let highestBidAmount = 0;

    bidders.forEach(bidder => {
      if (bidder.amount > highestBidAmount) {
        highestBidder = bidder;
        highestBidAmount = bidder.amount;
      }
    });
    return highestBidder;
  }

  gotoSeller(productDetails: any) {
    localStorage.removeItem('seller_id');
    localStorage.setItem('seller_id', productDetails.bids.seller.id);
    localStorage.setItem('product_name', productDetails.name);

    this.router.navigate(['messages'], {
      queryParams: {
        productId: productDetails.id,
        sellerId: productDetails.bids.seller.id,
        productName: productDetails.name
      }
    });
  }

  finalizeBid(productDetails: any, highestBidder: any, highestBidAmount: any) {
    if (highestBidder == null) {
      this.dialogService.open("No bidder yet", environment.error_message, 'danger', environment.error);
      return;
    }
    this.http.put<any>(environment.base_url + '/api/products/finalize/' + productDetails.id + '/' + highestBidder.id + '/' + highestBidAmount, "").pipe(
      catchError(error => {
        console.log(error);
        this.dialogService.open(error.error.message, environment.error_message, 'danger', environment.error);
        return throwError(error);
      })
    ).subscribe(data => {
      // Find the highest bidder and their bid amount
      this.getProductDetails();
      this.dialogService.open("Bid Finalized Successfully", environment.info_message, 'success', environment.info);
    });
  }
}
