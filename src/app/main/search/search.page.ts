import { Component, OnInit } from '@angular/core';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; 
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  currency = environment.currency;
  search:string;
  products: any[];
  images: any[];
  featuredImage: string;
  //productsList: any[];
  moreProducts: any[];
  isLoading: boolean = false;
  page:number =1;
  isSale:boolean = false;
  constructor() {
   }

  ngOnInit() {
  }

  onSearch(event){
    console.log(event.target.value);
    this.moreProducts= [];
    console.log("before",this.moreProducts);
    if(event.target.value == ''){
      return;
    }
    else{
      this.search=event.target.value;
      this.isLoading = true;
      this.loadMoreProducts(null);
    }
    console.log("after",this.moreProducts);
  }

  loadMoreProducts(event) {
    console.log(event);

        const WooCommerce = new WooCommerceRestApi({
          url: environment.siteUrl,
          consumerKey: environment.consumerKey,
          consumerSecret: environment.consumerSecret,
          version: 'wc/v3',
          queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
        });

        if(event == null){
          this.page = 2;
          this.moreProducts=[];
        }
        else {
          this.page = this.page+1;
        }
        console.log("searched: ", this.search);
       WooCommerce.get("products?per_page=10&page="+this.page+"&search="+this.search)
        .then((response) => {
          console.log(response);
          this.moreProducts = this.moreProducts.concat(response.data); 
          this.page = this.page+1;
          this.isLoading=false;
          
          if(event != null){
            event.target.complete();
            if(response.data.length < 1){
              console.log("not found");
              event.target.disabled = true;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    
}
