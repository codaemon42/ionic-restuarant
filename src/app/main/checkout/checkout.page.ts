import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { environment } from '../../../environments/environment';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM
import { LoadingController, NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

subtotal : any[] = [];
cart : any[];
shippingCost : any;
isPaymentMethodSelected: boolean ;
selectedPaymentMethod : any;
bkash = {
  type: environment.bkashAccountType,
  number: environment.bkashPhoneNumber
}
lineItem:{
  product_id: any,
  quantity: any
}
lineItems: any[];
metaData: any[];
orderStatus: string;
valuenew : any;
valid : boolean ;


form: FormGroup;
paymentMethods: any;

  constructor(
    private storage: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
  ) { 

  }

  ngOnInit() {
    this.form = new FormGroup({
      fname: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      lname: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      shaddress: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      email: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      pnum: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      bpn: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.nullValidator]
      }),
      bti: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.nullValidator]
      })
    });
    
            const WooCommerce = new WooCommerceRestApi({
              url: environment.siteUrl,
              consumerKey: environment.consumerKey,
              consumerSecret: environment.consumerSecret,
              version: 'wc/v3',
              queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
            });  
            WooCommerce.get("payment_gateways")
            .then((response) => {
              console.log("payment gateways : ", response.data);
              this.paymentMethods = response.data;
              // if()
              console.log("this.paymentMethods:",this.paymentMethods);
            })
            .catch((error) => {
              console.log(error.response.data);
            });

  }  

  ionViewWillEnter(){
    console.log("CheckOut Page ");
    console.log("CheckOut Page ");
    this.storage.get("shippingCost").then(data=>{
      console.log("shipping cost : ",data);
    });
    this.storage.get("cart").then(data=>{
      console.log("cart : ",data);
    });
    this.storage.get("subtotalcost").then(data=>{
      console.log("subtotalcost : ",data);
    });
    this.storage.get("couponApplied").then(data=>{
      console.log("couponApplied : ",data);
    });
  }

  onPlacingOrder(){

    // console.log("C
    this.lineItems = [];
    this.metaData = [];
    if(this.form.value.bpn != null && this.form.value.bti != null){
      this.metaData = [
        {
          key: "woo_bkash_number",
          value: this.form.value.bpn
        },
        {
          key: "woo_bkash_trans_id",
          value: this.form.value.bti
        }
      ]
    }
    // this.storage.get("shippingCost").then(data=>{
    //   console.log("shipping cost : ",data);
    // });
    // this.storage.get("cart").then(data=>{
    //   console.log("cart : ",data);
    // });
    // this.storage.get("subtotalcost").then(data=>{
    //   console.log("subtotalcost : ",data);
    
    // });
    console.log("form : ", this.form);
    if(!this.form.valid && !this.isPaymentMethodSelected){
      this.valid = false;
      // toast controller
      this.toastCtrl.create({
        message: "Fill up all the fields properly...",
        keyboardClose: true,
        color: "danger",
        duration: 2000
      }).then(toastEl=>{
        toastEl.present();
      })
    }
    this.valid = true;

    this.storage.get("shippingState").then(shippingState=>{
      console.log("shippingState : ",shippingState);

      this.storage.get("cart").then(cart=>{
        console.log("cart : ",cart);
        cart.forEach(cartItem => {
          this.lineItem = {
            product_id: cartItem.product.id,
            quantity: cartItem.qty
          }
          this.lineItems.push(this.lineItem);
        });

        this.storage.get("subtotalcost").then(subtotalcost=>{
          console.log("subtotalcost : ",subtotalcost);

          this.storage.get("shippingCost").then(shippingCost=>{
            console.log("shippingCost : ",shippingCost);

            const data = {
              payment_method: this.selectedPaymentMethod.id,
              payment_method_title: this.selectedPaymentMethod.method_title,
              set_paid: false,
              status: "processing",
              billing: {
                first_name: this.form.value.fname,
                last_name: this.form.value.lname,
                address_1: this.form.value.shaddress,
                address_2: "",
                city: "",
                state: shippingState,
                postcode: "",
                country: "BD",
                email: this.form.value.email,
                phone: this.form.value.pnum
              },
              shipping: {
                first_name: this.form.value.fname,
                last_name: this.form.value.lname,
                address_1: this.form.value.shaddress,
                address_2: "",
                city: "",
                state: shippingState,
                postcode: "",
                country: "BD"
              },
              line_items: this.lineItems,
              shipping_lines: [
                {
                  method_id: "flat_rate",
                  method_title: "Flat Rate",
                  total: shippingCost
                }
              ],
              meta_data: this.metaData,
            };

            this.loadingCtrl.create({
              keyboardClose: true,
              message: "Placing your order..."
            }).then(loadingEl=>{
              loadingEl.present();            
              const WooCommerce = new WooCommerceRestApi({
                url: environment.siteUrl,
                consumerKey: environment.consumerKey,
                consumerSecret: environment.consumerSecret,
                version: 'wc/v3',
                queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
              });  
              WooCommerce.post("orders", data).then((response) => {
                console.log(response.data);
                this.loadingCtrl.dismiss();
                this.navCtrl.navigateForward('/main/tabs/account/orders');
              }).catch((error) => {
                console.log(error.response.data);
                this.loadingCtrl.dismiss();
              });
            })
          });
        
        });
      });
    });

    
  }

  checkValue(event){
    console.log(event);
  }

  onSelectPayment(paymentMethod){
    this.isPaymentMethodSelected = true;
    this.selectedPaymentMethod = paymentMethod;
    console.log("paymentMethod: ",this.selectedPaymentMethod);
  }

}
