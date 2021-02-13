import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM
import { LoadingController, IonInfiniteScroll, IonSlides, ToastController, ModalController, AnimationController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { CartModalServiceService } from './product-detail/cart-modal/cart-modal-service.service';
import { Storage } from '@ionic/storage';
import { CartModalPage } from './product-detail/cart-modal/cart-modal.page';
import { DatePipe } from '@angular/common';
// import * as WC from 'woocommerce-api'
import { SpecialModalPage } from './special-modal/special-modal.page';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
//@ViewChild('fabevent') fabevent : ElementRef;
@ViewChild("button", { read: ElementRef, static: true }) button: ElementRef;
@ViewChild("fabanime", { read: ElementRef, static: true }) fabanime: ElementRef;
slideOpts = {
  initialSlide: 1,
  speed: 500
};

  cartUpdateTime: number = 500;
  cartItems:any[]=[];
  totalCartItems: any;
  currency = environment.currency;
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

  freshCartArray:any = []
  freshCartQty: number = 0;

  freshCart: {
    id: any,
    qty: number,
    price: number
  };
  currentTime : Date;
  somoi: {
    hours:any,
    minutes: any,
    seconds: any
  }

  anime :{
    clickFromX: any,
    clickFromY: any,
    clickToX: any,
    clickToY: any
  }

  displayCounts: boolean = false;


  
  constructor(
    private loadingCtrl: LoadingController,  
    private storage: Storage, 
    private toastCtrl: ToastController, 
    private modalCtrl: ModalController,
    private animationCtrl: AnimationController,
    private CartService: CartModalServiceService
    ) {
    
      this.countItems();

      this.isLoading=true;
      this.page = 2;
      //this.loadProducts();
      this.loadMoreProducts(null);
      this.loadCategory();
      console.log("started");

      //time
      setInterval(()=>{
        this.currentTime = new Date();
        this.somoi = {
          hours: this.currentTime.getHours(),
          minutes: this.currentTime.getMinutes(),
          seconds: this.currentTime.getSeconds()
        }
      },1000);

      this.CartService.allcategory();

   }

  //  ngAfterViewInit() {
  //   this.animateButton();
  // }

  public animateButton(x1,y1,x2,y2) {
    const animation = this.animationCtrl
      .create()
      .addElement(this.button.nativeElement)
      .duration(this.cartUpdateTime)
      //.iterations(Infinity)
      .keyframes([
        { offset: 0, background: "rgba(250, 14, 14, 0)" },
        { offset: 0.1, background: "rgba(250, 14, 14, 0.4)" },
        { offset: 0.4, background: "rgba(250, 14, 14, 0.6)" },
        { offset: 0.4, right: "39px" },
        { offset: 0.6, background: "rgba(250, 14, 14, 0.8)" },
        { offset: 0.6, right: "32px" },
        { offset: 0.7, background: "rgba(250, 14, 14, 0.9)" },
        { offset: 0.7, right: "25px" },
        { offset: 0.95, background: "rgba(250, 14, 14, 1)" },
        { offset: 0.95, right: "15px" },
        { offset: 0.95, top: "10%" },
        { offset: 0.95, background: "rgba(250, 14, 14, 0)" },
        { offset: 1, background: "rgba(250, 14, 14, 0)" },
        { offset: 1, top: "70%" },
        { offset: 1, right: "37px" }
      ]);

    animation.play();
  }

  fabanimation(){
    const fabAnimation = this.animationCtrl.create()
    .addElement(this.fabanime.nativeElement)
    .duration(this.cartUpdateTime)
    .keyframes([
      { offset: 0, scale: 1},
      { offset: 0, zIndex: 99999999999},
      { offset: 0.3, background: "rgba(250, 14, 14, 0.1)"},
      { offset: 0.3, scale: 2.3},
      { offset: 0.9, background: "rgba(250, 14, 14, 0.8)"},
      { offset: 1, scale: 1}
    ])
    fabAnimation.play();
  }


   slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
   }
  ngOnInit() {
    this.countItems();
    console.log("startedinit");
    
  }


  ionViewWillEnter(){
    this.countItems();
    //this.freshCartQty = 0;
    //this.isLoading=true;
    //this.loadMoreProducts(null);
    for(let i = 0; i<this.moreProducts.length; i++){
      if(this.moreProducts[i].downloads.length == 1){
        this.moreProducts[i].downloads.splice(0,1);
      }
    }

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

            WooCommerce.get("products?per_page=10&page="+this.page)
            .then((response) => {
              console.log(response);
              this.moreProducts = this.moreProducts.concat(response.data); 
  
              this.isLoading=false;
              
              if(event != null){
                event.target.complete();
                if(response.data.length<5){
                  event.target.disabled = true;
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
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
              console.log(error);
            });

    }

    countItems(){
      this.storage.ready().then(() => {
        this.storage.get("cart").then(data=>{
          console.log(data);
          this.cartItems = data;
  
          this.totalCartItems = 0;
          // vanishing micus and counts
          this.displayCounts = false;

          if(this.cartItems.length>0){
            this.cartItems.forEach((item, index)=>{   
              this.totalCartItems += item.qty;
            });
          }
  
  
        });
  
      });
     }

    //  callAnime(){
    //   anime({
    //     targets: '.anime-me',
    //     translateX: [
    //       {value: 100, duration: 1200},
    //       {value: 0, duration: 800}
    //     ],
    //     rotate: '1turn',
    //     backgrounColor: '#ff0000ad',
    //     duration: 2000
    //     //direction: 'alternate',
    //     //loop: true,
    //     //easing: 'spring(1, 80, 10, 0)'
    //   });
    //  }
     onCartFoodItem(product, cartf, index, localRef){
       console.log("console: ", localRef);
       this.anime = {
        clickFromX: localRef.clientX+'px',
        clickFromY: '0px',
        clickToX: localRef.clientX+'px',
        clickToY: '-200px'
      }
      console.log("this.anime : ", this.anime);

       this.animateButton(this.anime.clickFromX, this.anime.clickFromY, this.anime.clickToX, this.anime.clickToY);

        console.log("ion-fab-clicked", product, cartf, index);

        setTimeout(()=>{
          this.fabanimation();

          if(product.downloads.length == 0){
            this.freshCart = {
              id: product.id,
              qty: 1,
              price: parseFloat(product.price)
            };
            this.moreProducts[index].downloads.push(this.freshCart);
            // displaying minus and counts
            this.displayCounts = true;
            // cart added
          this.storage.get("cart").then(data => {
            if(data == null || data.length == 0){
              data = [];
      
              data.push({
                product: product,
                qty: 1,
                price: parseFloat(product.price)
              });
              console.log("add to cart first time: ",data);
              this.totalCartItems = this.totalCartItems+data[0].qty;

            }
            else{
              let added = 0 ;
      
              for(let i=0; i<data.length; i++){
                if(data[i].product.id == product.id){
                  let qty = data[i].qty;
                  data[i].qty = qty+cartf;
                  this.totalCartItems = this.totalCartItems+cartf;
      
                  data[i].price = parseFloat(data[i].price) + parseFloat(data[i].price)
                  added = 1;
                  console.log("add to cart next time: ",data);
                }
              }
              if(added == 0){
                data.push({
                  product: product,
                  qty: 1,
                  price: product.price
                });
                this.totalCartItems = this.totalCartItems+cartf;
              }
            }
            this.storage.set("cart", data);
            console.log("all added",data);
          })
          //cart ended
          }
          else if(product.downloads.length == 1){
            this.freshCart = {
              id: product.id,
              qty: product.downloads[0].qty + cartf,
              price: parseFloat(product.price)
            };
            this.moreProducts[index].downloads[0].qty = this.freshCart.qty;
            // displaying minus and counts
            this.displayCounts = true;
            // cart added
          this.storage.get("cart").then(data => {
            // if(data == null || data.length == 0){
            //   data = [];
      
            //   data.push({
            //     product: product,
            //     qty: 1,
            //     price: parseFloat(product.price)
            //   });
            //   console.log("add to cart first time: ",data);
            //   this.totalCartItems = this.totalCartItems+data[0].qty;
            // }
             //else{
              let added2 = 0 ;
      
              for(let i=0; i<data.length; i++){
                if(data[i].product.id == product.id){
                  let qty = data[i].qty;
                  data[i].qty = qty+cartf;
                  this.totalCartItems = this.totalCartItems+cartf;
      
                  data[i].price = parseFloat(data[i].price) + parseFloat(data[i].price)
                  added2 = 1;
                  console.log("add to cart next time: ",data);
                }
              }
              if(added2 == 0){
                data.push({
                  product: product,
                  qty: 1,
                  price: product.price
                });
                this.totalCartItems = this.totalCartItems+cartf;
              }
            //}
            this.storage.set("cart", data);
            console.log("all added",data);
          })
          }
          else{
  
          }
        }, this.cartUpdateTime);

        //console.log('freshcart: ' ,this.freshCartQty);
        //console.log("fresh cart: ", this.freshCart);
        //this.moreProducts[index].push(this.freshCart);
        console.log("clicked product: ",this.moreProducts[index]);


        // cart added
        // this.storage.get("cart").then(data => {
        //   if(data == null || data.length == 0){
        //     data = [];
    
        //     data.push({
        //       product: product,
        //       qty: 1,
        //       price: parseFloat(product.price)
        //     });
        //     console.log("add to cart first time: ",data);
        //     this.totalCartItems = this.totalCartItems+data[0].qty;
        //   }
        //   else{
        //     let added = 0 ;
    
        //     for(let i=0; i<data.length; i++){
        //       if(data[i].product.id == product.id){
        //         let qty = data[i].qty;
        //         data[i].qty = qty+cartf;
        //         this.totalCartItems = this.totalCartItems+cartf;
    
        //         data[i].price = parseFloat(data[i].price) + parseFloat(data[i].price)
        //         added = 1;
        //         console.log("add to cart next time: ",data);
        //       }
        //     }
        //     if(added == 0){
        //       data.push({
        //         product: product,
        //         qty: 1,
        //         price: product.price
        //       });
        //       this.totalCartItems = this.totalCartItems+cartf;
        //     }
        //   }
        //   this.storage.set("cart", data);
        //   console.log("all added",data);
        // })
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

    onSpecial(special){
      this.modalCtrl.create({
        component: SpecialModalPage,
        swipeToClose: true,
        keyboardClose: true,
        componentProps:{
          'category': special
        }
      }).then(modalEl => {
        modalEl.present();
      })
    }


}
