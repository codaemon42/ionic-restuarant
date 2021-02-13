import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from '../../../../../environments/environment';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CartModalServiceService {

shipZone : any[];
shipCode : any[];
shippingCost : any;
outsideShip : any;
shippingCostAvailable : boolean =false;

  shipping : {
    zoneType : string,
    zoneCode: string
  }

  shippingTypeCodeCost : {
    type : string,
    code : string,
    cost : any
  }
  shippingTypeCodeCostArray : any[] = [];   // contains all code cost type
  ShippingArray : any[] = [];

  total:number;
  totalCartItems: number;
  cartItems: any[] = [];

  restZone : any = [];
  restZoneIdArray : any = [];
  reqId : any;
  restLocation : any;
  restMethod : any;

  allcategoriesArray: any[] = [];
  constructor(
    private storage: Storage,
    private loadingCtrl: LoadingController
  ) {
    this.countItems();
      
   }

   ionViewWillEnter(){
    this.countItems();
   }

   getShippingArray(){
    this.shipZone = ['Bagerhat', 		
    'Bandarban', 		
    'Barguna', 			
    'Barisal', 		
    'Bhola', 		
    'Bogra', 		
    'Brahmanbaria', 		
    'Chandpur', 		
    'Chapai Nawabganj',
    'Chittagong', 		
    'Chuadanga', 		
    'Comilla', 		
    "Cox's Bazar",
    'Dhaka', 		
    'Dinajpur', 		
    'Faridpur', 		
    'Feni', 		
    'Gaibandha', 		
    'Gazipur', 		
    'Gopalganj', 		
    'Habiganj', 	
    'Jamalpur', 		
    'Jessore', 		
    'Jhalakathi', 		
    'Jhenaidah', 		
    'Joypurhat', 		
    'Khagrachhari', 		
    'Khulna', 		
    'Kishoreganj', 	
    'Kurigram', 		
    'Kushtia', 		
    'Lakshmipur', 		
    'Lalmonirhat', 		
    'Madaripur', 		
    'Magura', 		
    'Manikganj', 		
    'Meherpur', 		
    'Moulvibazar', 		
    'Munshiganj', 			
    'Mymensingh', 		
    'Naogaon', 		
    'Narail', 		
    'Narayanganj', 		
    'Narsingdi', 		
    'Natore', 		
    'Netrakona', 		
    'Nilphamari', 		
    'Noakhali', 		
    'Pabna', 		
    'Panchagarh', 	
    'Patuakhali', 	
    'Pirojpur', 	
    'Rajbari', 			
    'Rajshahi', 	
    'Rangamati', 			
    'Rangpur', 	
    'Satkhira', 	
    'Shariatpur', 	
    'Sherpur', 	
    'Sirajganj', 	
    'Sunamganj', 		
    'Sylhet', 	
    'Tangail', 		
    'Thakurgaon'	];
    this.shipCode = [
      'BD-05',
      'BD-01',
      'BD-02',
      'BD-06',
      'BD-07',
      'BD-03',
      'BD-04',
      'BD-09',
      'BD-45',
      'BD-10',
      'BD-12',
      'BD-08',
      'BD-11',
      'BD-13',
      'BD-14',
      'BD-15',
      'BD-16',
      'BD-19',
      'BD-18',
      'BD-17',
      'BD-20',
      'BD-21',
      'BD-22',
      'BD-25',
      'BD-23',
      'BD-24',
      'BD-29',
      'BD-27',
      'BD-26',
      'BD-28',
      'BD-30',
      'BD-31',
      'BD-32',
      'BD-36',
      'BD-37',
      'BD-33',
      'BD-39',
      'BD-38',
      'BD-35',
      'BD-34',
      'BD-48',
      'BD-43',
      'BD-40',
      'BD-42',
      'BD-44',
      'BD-41',
      'BD-46',
      'BD-47',
      'BD-49',
      'BD-52',
      'BD-51',
      'BD-50',
      'BD-53',
      'BD-54',
      'BD-56',
      'BD-55',
      'BD-58',
      'BD-62',
      'BD-57',
      'BD-59',
      'BD-61',
      'BD-60',
      'BD-63',
      'BD-64'];  

      for(let i = 0; i < this.shipZone.length; i++){
        this.shipping = {
          zoneType : this.shipZone[i],
          zoneCode : this.shipCode[i]
        }
        this.ShippingArray.push(this.shipping);
      }
    }

   countItems(){
    this.storage.ready().then(() => {
      this.storage.get("cart").then(data=>{
        console.log(data);
        this.cartItems = data;

        this.totalCartItems = 0;

        if(this.cartItems.length>0){
          this.cartItems.forEach((item, index)=>{   
            this.totalCartItems += item.qty;
            console.log("cart Item servcie: ",this.totalCartItems)
          });
        }
      });

    });
   }
  
   allcategory(){
    const WooCommerce = new WooCommerceRestApi({
      url: environment.siteUrl,
      consumerKey: environment.consumerKey,
      consumerSecret: environment.consumerSecret,
      version: 'wc/v3',
      queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
    });
      WooCommerce.get("products/categories?per_page=20")
      .then((response) => {
        this.allcategoriesArray = response.data;
        console.log("categories: ",this.allcategoriesArray);
      })
      .catch((error) => {
        console.log(error);
      });
    
   }


}

