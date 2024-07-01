// product-marketplace.component.ts

import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-marketplace',
  templateUrl: './product-marketplace-component.component.html',
  styleUrls: ['./product-marketplace-component.component.css']
})
export class ProductMarketplaceComponent implements OnInit {
  searchQuery: string;
  productsNotInSeller: any[] = [];
  base_url = environment.base_url;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  ngOnInit(): void {
    // Replace the URL with your actual API endpoint to get products not in a specific seller
    this.http.get<any[]>(environment.base_url + '/api/products/notInSeller/' + localStorage.getItem('user_id')).subscribe(data => {
      this.productsNotInSeller = data;

      this.productsNotInSeller = this.productsNotInSeller.filter(product => {
        // Check if at least one bid has bidStatus 'ACTIVE'
        return product.bids.bidStatus === 'ACTIVE';
      });
    });
  }

  navigateToDetails(productId: number): void {
    // Use the Angular Router to navigate to the product details page
    this.router.navigate(['/product', productId]);
  }

  searchProducts() {
    // Implement logic to fetch products based on the search query from the backend
    // Use this.searchQuery to get the search query
    // Update the 'products' array with the search results
    // This could be an API call to search for products based on the query
    this.http.get<any[]>(environment.base_url + '/api/products/search/' + localStorage.getItem('user_id') + '?query=' + this.searchQuery).subscribe(
      (data) => {
        this.productsNotInSeller = data;
      },
      (error) => {
        console.error('Error fetching search results:', error);
      }
    );
  }
}
