import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { Storage } from '@ionic/storage';
import { environment } from '../../../../environments/environment';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  user : {}
  userId : string;
  orders: any[] = [];

  orderMeta : {
    id: any,
    bkashNumber: any,
    bkashTrx: any
  }
  AllorderMeta : any[] = [];
  constructor(
    private accountService : AccountService,
    private storage : Storage,
    private loadingCtrl: LoadingController
  ) { 
    this.storage.get("auth").then(authData=>{
      console.log("auth : ", authData);
      this.user = authData;
      console.log("auth UserId : ", authData.userId);
      this.showOrders(authData.userId);
    })
  }

  ngOnInit() {
  }

  showOrders(id){
    const WooCommerce = new WooCommerceRestApi({
      url: environment.siteUrl,
      consumerKey: environment.consumerKey,
      consumerSecret: environment.consumerSecret,
      version: 'wc/v3',
      queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
    });
    this.loadingCtrl.create({
      message: "Loading your Orders ...",
      spinner: "lines"
    }).then(loadingEl=>{
      loadingEl.present();

      WooCommerce.get("orders?per_page=10&customer=29")  //replace with 
      .then((response) => {
        this.loadingCtrl.dismiss();
      this.orders = response.data;
      console.log("order : ",this.orders, "length : ",this.orders.length);
      console.log(this.orders[0].meta_data.length);
  
      for(let j =0; j<this.orders.length; j++){
        for(let i=0; i<this.orders[j].meta_data.length; i++){    
          if(this.orders[j].meta_data[i].key && this.orders[j].meta_data[i].key == "woo_bkash_number"){
  
            this.orderMeta = {
                id: this.orders[j].id,
                bkashNumber: this.orders[j].meta_data[i].value,
                bkashTrx: this.orders[j].meta_data[i+1].value
            }
            this.AllorderMeta.push(this.orderMeta);
            console.log("orderMeta: ",this.orderMeta);
          }
          else{
            
          }       
        }
      }
        console.log("allOrderMetaData : ", this.AllorderMeta);
  
      })
      .catch((error) => {
        this.loadingCtrl.dismiss();
      console.log(error);
      });
    })

  }

}
