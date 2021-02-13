import { Component, OnInit } from '@angular/core';
import { AccountService } from './account.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  user:{};
  userLoggedIn: any;

  constructor(
    private accountService: AccountService,
    private storage: Storage
  ) {
    this.initiateAuth();
   }

   ionViewWillEnter(){
    this.initiateAuth();     
   }

  ngOnInit() {
  }

  initiateAuth(){
    this.storage.get("auth").then(authData=>{
      this.user = authData;
      this.userLoggedIn = authData.loggedIn;
      console.log("logged in : ",  this.userLoggedIn);
    });
    console.log("logged in : ",  this.userLoggedIn);
  }

  onLogOut(){
    this.userLoggedIn = false;
    this.accountService.logOut();
  }

}
