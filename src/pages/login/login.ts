import { Component } from '@angular/core';
import { HttpProvider } from '../../providers/http/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;

  constructor(
    private http: HttpProvider,
    private formBuilder: FormBuilder,
    private navCtrl: NavController
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    console.log(this.loginForm.value);
    
    this.http.post("/login", this.loginForm.value).then(
      res => {
        console.log(res);
        this.navCtrl.setRoot(HomePage);
      }
    );
  }

  goToRegisterPage(): void {
    this.navCtrl.push("RegisterPage");
  }

}
