import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  
  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      uname: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      pass: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onLogin(){
    console.log(this.form.value.uname, this.form.value.pass);
    this.accountService.login(this.form);
  }

}
