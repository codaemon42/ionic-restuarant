import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { environment } from '../../../../../environments/environment';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM
import { CartModalServiceService } from './cart-modal-service.service';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {

  isVisibleDistrict: boolean = true;

  grandTotal : any;
  subtotal : number;
  shippingStateCode : any;

  restZone : any[];
  shippingCost : string;
  shippingState: string;
  subtotalcost : any;
  shippingCostAvailable : boolean = false;

  shippingArray : any[] = [];
  coupon="";
  couponData: any;
  couponStorage: {
    id: any,
    code: any,
    amount: any
  }

  currency = environment.currency;

  cartItems: any[] = [];
  showEmpltyMeaage:boolean = false;
  total: number;
  constructor(
    private storage: Storage,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private cartModalService: CartModalServiceService
    ) { 

  
      this.cartModalService.getShippingArray();
      this.shippingArray = this.cartModalService.ShippingArray;
      console.log("new ShipArray: ",this.shippingArray);
    }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.storeCart();
    this.shippingCostAvailable = false;
    this.isVisibleDistrict = !this.isVisibleDistrict;
  }

  getCoupon(){
    
    this.storeCart();
    this.loadingCtrl.create({
      keyboardClose: true,
      message: "Applying Coupon...",
      spinner: 'lines'
    }).then(loadingEl=>{
      loadingEl.present();
    });
      console.log(this.coupon);
      const WooCommerce = new WooCommerceRestApi({
        url: environment.siteUrl,
        consumerKey: environment.consumerKey,
        consumerSecret: environment.consumerSecret,
        version: 'wc/v3',
        queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
      });
      this.storage.ready().then(()=>{
        this.storage.get("couponApplied").then(data=>{
          this.couponStorage = data;
        })
      });
        WooCommerce.get("coupons?code="+this.coupon)
          .then((response) => {
            console.log("coupon details : ",response.data);

            this.couponStorage = {
              id: response.data[0].id,
              code: response.data[0].code,
              amount: response.data[0].amount
            }
            console.log("couponStorage : ", this.couponStorage);

            this.storage.set("couponApplied", this.couponStorage).then((data)=>{
              console.log(data);
            })

      
            this.couponData = response.data;   // basic response

            if(response.data.length > 0 ){        // coupon exists             
              let couponedPrice = 0 ; //apply coupon successfully

              if(response.data[0].discount_type == "fixed_cart"){
                couponedPrice = parseInt(response.data[0].amount);
              }
              if(response.data[0].discount_type == "percent"){      //bug
                let percent = parseInt(response.data[0].amount)/100;
                couponedPrice = this.total * percent;
              }

              this.total = this.total - couponedPrice;
              this.cartModalService.total = this.total;
              console.log("service total : ",this.cartModalService.total);
              // total storage
              this.storage.set("subtotalcost", this.total).then(()=>{
                this.subtotalcost = this.total;
              })

              this.loadingCtrl.dismiss();
              this.toastCtrl.create({
                message: "Coupon added successfully...",
                keyboardClose: true,
                position: "top",
                duration:2000,
                color:"success"
              }).then(toastEl=>{
                toastEl.present();
              })
            }
            else{  // coupon does not exist
              this.storeCart();
              this.loadingCtrl.dismiss();
              this.toastCtrl.create({
                message: "Invalid Coupon",
                keyboardClose: true,
                position: "top",
                duration:2000,
                color:"danger"
              }).then(toastEl=>{
                toastEl.present();
              })
            }
            this.totalCost();

          })
          .catch((error) => {
            console.log(error.response.data);

          });
  }
  storeCart(){
    this.total = 0;
    this.storage.ready().then(() => {
      this.storage.get("cart").then(data=>{
        console.log(data);
        this.cartItems = data;

        if(this.cartItems.length>0){
          this.cartItems.forEach((item, index)=>{
            this.total = this.total + (parseInt(item.product.price)*item.qty);
            this.cartModalService.total = this.total;
          });
          console.log("Total1 :",this.total);
        }
        else{
          this.showEmpltyMeaage = true;
        }

      });

    });
  }

  onClosingCartModal(){
    this.modalCtrl.dismiss();
  }

  onRemoveItem(item, i){
    let qty = item.qty;
    let price = item.product.price;

    this.cartItems.splice(i,1);
    this.storage.set("cart", this.cartItems).then(()=>{
      this.total = this.total - (parseInt(price)*qty);
      this.cartModalService.totalCartItems -= qty;
          // total storage
    this.storage.set("subtotalcost", this.total).then(()=>{
      this.subtotalcost = this.total;
    }) 
      this.totalCost();
    }); 

  }

  onChangeQuantity(item, index, change){
    let qty = 0;
    let price = 0;

    qty = item.qty;
    price = parseInt(item.product.price);

    if(change < 0 && item.qty == 1){
      return;
    }
    else{
      qty = qty + change;
      item.qty = qty;
      item.price = parseInt(item.product.price)*item.qty;

      this.cartItems[index] = item;

      this.storage.set("cart", this.cartItems).then(()=>{
        if(change < 0){
          this.total = this.total - parseInt(item.product.price);
          this.cartModalService.totalCartItems -= 1;
                        // total storage
                        this.storage.set("subtotalcost", this.total).then(()=>{
                          this.subtotalcost = this.total;
                        })
          this.totalCost();
        }
        if(change > 0){
          this.total = this.total + parseInt(item.product.price);     
          this.cartModalService.totalCartItems += 1; 
                        // total storage
                        this.storage.set("subtotalcost", this.total).then(()=>{
                          this.subtotalcost = this.total;
                        })
          this.totalCost();    
        }
      });
    } 
  }

  

  onSelectDistrict(districtCode){
    this.loadingCtrl.create({
      keyboardClose: true,
      message: "Calculating Delivery Cost..."
    }).then(loadingEl=>{
      loadingEl.present();
      console.log("District Name Selected : ",districtCode);
      this.getAllShippingZone(districtCode);
      console.log("cart page shipping cost : ",this.shippingCost);
    });
  }

  getAllShippingZone(code){
    this.storage.ready().then(()=>{
      this.storage.get("shippingState").then(data=>{
        this.shippingStateCode = data;
      });
      this.storage.get("shippingCost").then(data=>{
        this.shippingCost = data;
      });
      this.storage.get("subtotalcost").then(data=>{
        this.subtotalcost = data;
      });
    })

    const WooCommerce = new WooCommerceRestApi({
      url: environment.siteUrl,
      consumerKey: environment.consumerKey,
      consumerSecret: environment.consumerSecret,
      version: 'wc/v3',
      queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
    });     

    WooCommerce.get("shipping/zones")
    .then((response) => {
      this.restZone = response.data;
      console.log("all shipping zone Array : ",this.restZone);
      this.restZone.forEach( zone => {
        console.log(zone.id, typeof(zone.id)); 

        if(zone.id >= 0){
          WooCommerce.get("shipping/zones/"+zone.id+"/locations")
          .then((response) => {
            if(response.data[0].type === "state" && response.data[0].code){
              console.log("zoneId : ", zone.id);
              console.log("Locations : ",response.data[0].code.slice(3,response.data[0].code.length));
              if(code == response.data[0].code.slice(3,response.data[0].code.length)){
                WooCommerce.get("shipping/zones/"+zone.id+"/methods")
                .then((response) => {
                  console.log("shipping cost : ",  response.data[0].settings.cost.value);
                  this.shippingCost = response.data[0].settings.cost.value;
                  this.storage.set("shippingCost", this.shippingCost).then(data=>{
                    this.shippingCost = response.data[0].settings.cost.value;
                  });
                  this.shippingStateCode = code.slice(3,code.length);
                  this.storage.set("shippingState", this.shippingStateCode).then(()=>{
                  })
                  this.subtotalcost = this.total;
                  this.storage.set("subtotalcost", this.subtotalcost).then(()=>{
                  })
                  this.totalCost();
                  console.log("hello total : ", this.total);
                  this.loadingCtrl.dismiss();
                  this.shippingCostAvailable = true;
                })
                .catch((error) => {
                  console.log(error);
                });
              }
              else{
                WooCommerce.get("shipping/zones/0/methods")
                .then((response) => {
                  console.log("outside ship value", response.data[0].settings.cost.value);

                  this.shippingCost = response.data[0].settings.cost.value;
                  
                  this.storage.set("shippingCost", this.shippingCost).then(data=>{
                    this.shippingCost = response.data[0].settings.cost.value;
                  });
                  this.storage.set("shippingState", code).then(()=>{                   
                    this.shippingStateCode = code.slice(3,code.length);
                  })
                  this.storage.set("subtotalcost", this.total).then(()=>{
                    this.subtotalcost = this.total;
                  })
                  this.shippingCostAvailable = true;
                  this.totalCost();
                  console.log("hello total : ", this.total);
                  this.loadingCtrl.dismiss();                 
                })
                .catch((error) => {
                  console.log(error);
                }); 
              }
            }
          })
          .catch((error) => {
            console.log(error);
          }); 
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });

  }

  totalCost(){
      this.subtotal = this.total;
    this.grandTotal = this.subtotal + parseInt(this.shippingCost);
  }


  
}
