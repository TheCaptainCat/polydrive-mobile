import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { HttpProvider } from '../providers/http/http';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private http: HttpProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.splashScreen.hide();
      
      this.storage.get('address').then(
        res => {
          if (!res) {
            this.connectionAlert();
          }
          else {
            this.http.url = res;
            this.tryLogin();
          }
        }
      );
    });
  }

  tryLogin() {
    this.http.get("/user").then(
      res => {
        this.rootPage = HomePage;
      },
      err => {
        this.rootPage = LoginPage;
      }
    )
  }

  connectionAlert() {
    const alert = this.alertCtrl.create({
      title: "Vous n'êtes connecté à aucun serveur",
      message: "Veuillez indiquer l'adresse du serveur",
      inputs: [
        {
          type: 'text',
          name: 'address'
        }
      ],
      buttons: [
        {
          text: 'Valider',
          handler: data => {
            this.http.url = data.address;
            this.testConnection();
          }
        }
      ],
      enableBackdropDismiss: false
    });
    alert.present();
  }

  testConnection() {
    const loading = this.loadingCtrl.create({
      content: 'Test de la connection'
    });
    loading.present();
    this.http.get('/', 'text').then(
      res => {
        console.log(res);
        loading.dismiss();
        this.alertCtrl.create({
          title: 'Vous êtes connecté au serveur'
        }).present();
        this.storage.set('address', this.http.url);
        this.tryLogin();
      },
      err => {
        console.error(err);
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Erreur de connection',
          buttons: [
            'Réessayer'
          ]
        });
        alert.present();
        alert.onDidDismiss(() => {
          this.connectionAlert();
        })
      }
    )
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  openShared() {
    this.nav.setRoot(HomePage, {
      sharedPage: true
    });
  }

  logout() {
    const loading = this.loadingCtrl.create({
      content: 'Déconnexion'
    });

    loading.present();

    this.http.get('/logout').then(
      res => {
        this.nav.setRoot(LoginPage);
        loading.dismiss();
      }
    );
  }
}
