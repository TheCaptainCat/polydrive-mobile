import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpProvider } from '../../providers/http/http';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  registerForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpProvider,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  register(): void {
    this.http.post('/register', this.registerForm.value).then(
      data => {
        console.log(data);
        this.alertCtrl.create({
          title: 'Vous êtes inscrit.',
          message: 'Bienvenue sur Polydrive',
          buttons: [{
            text: 'Ok',
            handler: () => {
              this.navCtrl.setRoot(HomePage)
            }
          }]
        }).present();
      },
      err => {
        console.error(err);
      }
    );
  }

}
