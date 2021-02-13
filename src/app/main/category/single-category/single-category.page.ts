import { Component, OnInit } from '@angular/core';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-category',
  templateUrl: './single-category.page.html',
  styleUrls: ['./single-category.page.scss'],
})
export class SingleCategoryPage implements OnInit {

  currency = environment.currency;
  private cat_id:string;
  products: any[];
  images: any[];
  featuredImage: string;
  i:number;
  //productsList: any[];
  moreProducts: any[];
  productCategory: any[];
  isLoading: boolean = false;
  page:number;
  isSale:boolean = false;
  constructor(
    private activaedRoute: ActivatedRoute
  ) {
    this.isLoading=true;
    this.page = 2;
    //this.loadProducts();


    this.loadMoreProducts(null);
    this.loadCategory();
   }

  ngOnInit() {
  }

  loadProducts() {
    const WooCommerce = new WooCommerceRestApi({
      url: environment.siteUrl,
      consumerKey: environment.consumerKey,
      consumerSecret: environment.consumerSecret,
      version: 'wc/v3',
      queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
    });

    WooCommerce.get("products?per_page=20&orderby=date&order=asc")
    .then((response) => {
      console.log(response);
      this.products = response.data; 
      
      
    })
    .catch((error) => {
      console.log(error);
    });

}

loadMoreProducts(event) {
console.log(event);

  this.activaedRoute.paramMap.subscribe(paramMap=>{
    this.cat_id = paramMap.get("categoryId");
    console.log("cat_id",this.cat_id);
    console.log(typeof(this.cat_id));
    

  console.log("cat_id_out",this.cat_id);
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

    WooCommerce.get("products?per_page=6&page="+this.page+"&category="+this.cat_id)
    .then((response) => {
      console.log(response);
      this.moreProducts = this.moreProducts.concat(response.data); 

      this.isLoading=false;
      
      if(event != null){
        event.target.complete();
        if(response.data.length<1){
          event.target.disabled = true;
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
  });//activated route ends
}

loadCategory(){
  const WooCommerce = new WooCommerceRestApi({
    url: environment.siteUrl,
    consumerKey: environment.consumerKey,
    consumerSecret: environment.consumerSecret,
    version: 'wc/v3',
    queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
  });
    WooCommerce.get("products/categories?per_page=9")
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });

}
}
