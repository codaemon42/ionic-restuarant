import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import {  IonSlides, Animation, AnimationController, NavController, ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { CartModalPage } from './cart-modal/cart-modal.page';
//import { NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  //providers: [NavParams]
})
export class ProductDetailPage implements OnInit {
  @ViewChild('slideToggler', {static:false}) slideToggler:ElementRef;
  @ViewChild('slideToggler', {static:false}) slideToggler2:ElementRef;
  @ViewChild('#cat') cat:any;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  togglerClicked:boolean = false;
  togglerClicked2:boolean = false;
  animation: Animation;
  animation2: Animation;
  currency = environment.currency;

  isShortDescription: boolean = false;
  isDescription: boolean = false;
  isRelatedProduct: boolean = false;


  productId: string;
  public product: any;
  productVariations: any;
  isLoading: boolean = false;


  constructor(
    // private navCtrl: NavController,
     //public navParams: NavParams
     private activatedRoute: ActivatedRoute,
     private animationCtrl: AnimationController,
     private storage: Storage,
     private toastCtrl: ToastController,
     private navCtrl: NavController,
     private modalCtrl: ModalController
  ) { 
    //  this.product = this.navParams.get("productId");
    //  console.log(this.product);
this.isLoading = true;


  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      //console.log('Params: ', params.productId);
      console.log(params.get('productId'));
      this.productId = params.get('productId');

      const WooCommerce = new WooCommerceRestApi({
        url: environment.siteUrl,
        consumerKey: environment.consumerKey,
        consumerSecret: environment.consumerSecret,
        version: 'wc/v3',
        queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
      });
  
      WooCommerce.get("products/"+ params.get('productId'))
      .then((response) => {
        this.isLoading = true;
        console.log(response.data);
        this.product = response.data; 
        this.isLoading = false;
        
      });
      WooCommerce.get("products/"+ params.get('productId')+"/variations")
      .then((response) => {
        this.isLoading = true;
        console.log(response.data);
        this.productVariations = response.data; 
        console.log("first Variation : ",this.productVariations[0]);
        this.isLoading = false;
        
      })
      .catch((error) => {
        console.log(error);
      });
      return this.product;
    });
  }


  slidesDidLoad(slides: IonSlides){
    slides.startAutoplay();
  }


  onShortDescription(){
     this.togglerClicked = !this.togglerClicked;
     if(!this.togglerClicked){
      this.animation = this.animationCtrl.create()
      .addElement(this.slideToggler.nativeElement)
      .duration(1000)
      .fromTo('transform', 'translateX(0)', 'translateX(400px)')
      .fromTo('opacity', '1', '0')
      .afterStyles({display:'none'});
     }
     else{
      this.animation = this.animationCtrl.create()
      .addElement(this.slideToggler.nativeElement)
      .duration(1000)
      .fromTo('transform', 'translateX(400px)', 'translateX(0)')
      .fromTo('opacity', '0', '1')
      .beforeStyles({display:'block', color:'#666'});
     }
    this.animation.play();
  }


  addToCart(){
    this.storage.get("cart").then(data => {
      if(data == null || data.length == 0){
        data = [];

        data.push({
          product: this.product,
          qty: 1,
          price: parseFloat(this.product.price)
        });
        console.log("add to cart first time: ",data);
      }
      else{
        let added = 0 ;

        for(let i=0; i<data.length; i++){
          if(data[i].product.id == this.product.id){
            let qty = data[i].qty;
            data[i].qty = qty+1;

            data[i].price = parseFloat(data[i].price) + parseFloat(data[i].price)
            added = 1;
            console.log("add to cart next time: ",data);
          }
        }
        if(added == 0){
          data.push({
            product: this.product,
            qty: 1,
            price: this.product.price
          });
        }
      }
      this.storage.set("cart", data);
      console.log("all added",data);
      this.toastCtrl.create({
        duration: 5000,
        position: "middle",
        color: "tertiary",
        buttons: [
          {
            side: 'start',
            icon: 'star',
            text: 'View Cart',
            handler: () => {
              console.log('Favorite clicked');
              this.onCartModal();
            }
          }, {
            text: 'not now',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      }).then((toast)=>{
        toast.present();
      })
    })
  }

  onCartModal(){
    this.modalCtrl.create({
      component: CartModalPage,
      swipeToClose: true,
      keyboardClose: true
    }).then(modalEl =>{
      modalEl.present();
    })
  }

  onSelectVariation(variation){
    console.log(variation);
  }


}
