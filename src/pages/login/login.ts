import { Component } from '@angular/core';
import { HttpProvider } from '../../providers/http/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from 'ionic-angular';
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
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    this.http.post("/login", this.loginForm.value).then(
      res => {
        this.navCtrl.setRoot(HomePage);
      },
      err => {
        console.log(err);
        
        let alertText;
        if (err.status == 401) {
          alertText = 'Login ou mot de passe incorrect';
        }
        else {
          alertText = "Une erreur s'est produite";
        }
        
        this.alertCtrl.create({
          title: alertText,
          message: 'Veuillez réessayer',
          buttons: [{
            text: 'Ok'
          }]
        }).present();
      }
    );
  }

  goToRegisterPage(): void {
    this.navCtrl.push("RegisterPage");
  }

}
