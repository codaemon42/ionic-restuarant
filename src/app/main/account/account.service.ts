import { Injectable } from '@angular/core';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  user : {
    loggedIn: boolean,
    userId: string
  }


  order : any;

  userExists: boolean = false;
  data: any;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private navCtrl: NavController,
    private storage: Storage
  ) { }

  createUser(form){
    // register
    if(!form.valid){
      console.log()
      return;
    }
    this.loadingCtrl.create({
      keyboardClose: true,
      spinner: "lines",
      message: "Creating Account..."
    }).then(loadingEl=>{
      loadingEl.present();

        const data = {
          email: form.value.pnum+'@gmail.com',
          first_name: form.value.pnum,
          last_name: form.value.pnum,
          username: form.value.pnum,
          password: form.value.otp,
          billing: {
            first_name: form.value.pnum,
            last_name: form.value.pnum,
            company: "",
            address_1: "",
            address_2: "",
            city: "",
            state: "",
            postcode: "",
            country: "BD",
            email: form.value.pnum+'@gmail.com',
            phone: form.value.pnum
          },
          shipping: {
            first_name: form.value.pnum,
            last_name: form.value.pnum,
            company: "",
            address_1: "",
            address_2: "",
            city: "",
            state: "",
            postcode: "",
            country: "BD"
          }
        };

        const WooCommerce = new WooCommerceRestApi({
          url: environment.siteUrl,
          consumerKey: environment.consumerKey,
          consumerSecret: environment.consumerSecret,
          version: 'wc/v3',
          queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
        });

        WooCommerce.post("customers", data)
        .then((response) => {
          console.log(response.data);
          this.loadingCtrl.dismiss();
          this.toastCtrl.create({
            message: "Registered Successfully...",
            color: "success",
            position: 'top',
            duration: 2000
          }).then(toastEl=>{
            toastEl.present();
          })
        })
        .catch((error) => {
          console.log(error.response.data);
          this.loadingCtrl.dismiss();
          this.toastCtrl.create({
            message: "User already exists..",
            color: "danger",
            position: 'top',
            duration: 2000
          }).then(toastEl=>{
            toastEl.present();
          })
        });
    });
  }

  login(form){

    this.storage.ready().then(()=>{     // declaring storage
      this.storage.get("auht").then(authData=>{
        console.log("authData: ", authData);
        this.user = authData;
      });
    })


      this.loadingCtrl.create({
        message: "logging in...",
          spinner: "lines"
      }).then(LoadingEl=>{
          LoadingEl.present();
          this.http.post('https://woopearl.com/wp-json/jwt-auth/v1/token',{
            username: form.value.uname,
            password: form.value.pass
          })
          .subscribe(res=>{
            this.loadingCtrl.dismiss();
            console.log(res);
            this.data = res;
            console.log(this.data.data.id);


            if(this.data.statusCode == 200){      //  user Valid
              this.userExists = true;
              console.log(this.userExists);
              this.user = {
                loggedIn: true,
                userId: this.data.data.id
              };

              this.storage.set("auth", this.user).then(()=>{
                console.log("stored : ",this.user);
              });

              this.navCtrl.navigateForward(environment.loggedUrl);
              this.toastCtrl.create({
                message: "Welcome "+this.data.data.displayName+", login successful...",
                color: "success",
                position: 'top',
                duration: 5000
              }).then(toastEl=>{
                toastEl.present();
              })
            }
            else{
              this.userExists = false;
              console.log(this.userExists);
              this.toastCtrl.create({
                message: "Invalid Username and Password...",
                color: "danger",
                position: 'top',
                duration: 3000
              }).then(toastEl=>{
                toastEl.present();
              })
            }
          });
      });
    
  }
  logOut(){
    this.user = {
      loggedIn: false,
      userId: null
    }
    this.storage.set("auth", this.user).then(()=>{
      console.log("stored : ",this.user);
    });
  }



}
