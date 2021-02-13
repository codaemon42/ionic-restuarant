import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
//import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { LoadingController, ToastController } from '@ionic/angular';

import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM
import { environment } from '../../../../environments/environment';
//import axios from 'axios';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  form: FormGroup;

  
  otp: any;

  films: Observable<any>;

  otpSent: boolean = false;

  otpVerified: boolean = false;

  constructor(
    private accountService: AccountService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      // fname: new FormControl(null,{
      //   updateOn: 'blur',
      //   validators: [Validators.required]
      // }),
      // lname: new FormControl(null,{
      //   updateOn: 'blur',
      //   validators: [Validators.required]
      // }),
      // uname: new FormControl(null,{
      //   updateOn: 'blur',
      //   validators: [Validators.required]
      // }),
      // email: new FormControl(null,{
      //   updateOn: 'blur',
      //   validators: [Validators.required]
      // }),
      pnum: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      otp: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }


  onOtpSend(){
      // otp
      this.otp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
      console.log("otp : ",this.otp);
      // let data = {
      //   sender_id : '01947686268',
      //   apiKey : 'HR62CTV4',
      //   mobileNo : '8801754719659',
      //   message : 'your foodel otp and password is :'+ this.otp 
      // };

      // const headers = new HttpHeaders({
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // });
      // const options = {
      //   headers: headers
      // };
      // console.log("data : ",data);
      // this.films = this.http.post<any>('http://66.45.237.70/api.php?username='+data.sender_id+'&password='+data.apiKey+'&number='+data.mobileNo+'&message='+data.message,'',options);
      // this.films
      // .subscribe(datas => {
      //   console.log('my data: ', datas);
      // });
      this.otpSent = true;

  }


  onRegister(){
    console.log(this.form.value);
    if(this.form.value.otp == this.otp){
      console.log("Otp matched");
      this.otpVerified = true;
      //this.accountService.createUser(this.form);
    }
    else{
      console.log("Otp not matched");
      this.otpVerified = false;
      this.toastCtrl.create({
        message: "Incorrect OTP password..",
        color: "danger",
        position: 'top',
        duration: 2000
      }).then(toastEl=>{
        toastEl.present();
      })
    }

    //this.accountService.login(this.form);

    
  }

  // createUser(form){
  //   // register
  //   if(!form.valid){
  //     console.log()
  //     return;
  //   }
  //   this.loadingCtrl.create({
  //     keyboardClose: true,
  //     spinner: "lines",
  //     message: "Creating Account..."
  //   }).then(loadingEl=>{
  //     loadingEl.present();

  //       const data = {
  //         email: form.value.pnum+'@gmail.com',
  //         first_name: form.value.pnum,
  //         last_name: form.value.pnum,
  //         username: form.value.pnum,
  //         password: form.value.otp,
  //         billing: {
  //           first_name: form.value.pnum,
  //           last_name: form.value.pnum,
  //           company: "",
  //           address_1: "",
  //           address_2: "",
  //           city: "",
  //           state: "",
  //           postcode: "",
  //           country: "BD",
  //           email: form.value.pnum+'@gmail.com',
  //           phone: form.value.pnum
  //         },
  //         shipping: {
  //           first_name: form.value.pnum,
  //           last_name: form.value.pnum,
  //           company: "",
  //           address_1: "",
  //           address_2: "",
  //           city: "",
  //           state: "",
  //           postcode: "",
  //           country: "BD"
  //         }
  //       };

  //       const WooCommerce = new WooCommerceRestApi({
  //         url: environment.siteUrl,
  //         consumerKey: environment.consumerKey,
  //         consumerSecret: environment.consumerSecret,
  //         version: 'wc/v3',
  //         queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
  //       });

  //       WooCommerce.post("customers", data)
  //       .then((response) => {
  //         console.log(response.data);
  //         this.loadingCtrl.dismiss();
  //         this.toastCtrl.create({
  //           message: "Registered Successfully...",
  //           color: "success",
  //           position: 'top',
  //           duration: 2000
  //         }).then(toastEl=>{
  //           toastEl.present();
  //         })
  //       })
  //       .catch((error) => {
  //         console.log(error.response.data);
  //         this.loadingCtrl.dismiss();
  //         this.toastCtrl.create({
  //           message: "User already exists..",
  //           color: "danger",
  //           position: 'top',
  //           duration: 2000
  //         }).then(toastEl=>{
  //           toastEl.present();
  //         })
  //       });
  //   });
  // }

}
