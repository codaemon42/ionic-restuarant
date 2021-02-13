import { Component, OnInit } from '@angular/core';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  categories: any[];

  constructor() { 
    const WooCommerce = new WooCommerceRestApi({
      url: environment.siteUrl,
      consumerKey: environment.consumerKey,
      consumerSecret: environment.consumerSecret,
      version: 'wc/v3',
      queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
    });
    WooCommerce.get("products/categories?per_page=30&order=desc")
    .then((response) => {
      console.log(response.data);
      this.categories = response.data;
    })
    .catch((error) => {
      console.log(error.response.data);
    });
  }

  ngOnInit() {
  }

}
