import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { FileViewerPage } from '../file-viewer/file-viewer';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  currentFolder : {
    id: number,
    name: string
  };
  uploadFile: File;
  currentFilesList: any[];

  constructor(
    private navCtrl: NavController,
    private http: HttpProvider,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.currentFolder = {
      id: null,
      name: 'PolyDrive'
    };
    if (this.navParams.get('folderId') && this.navParams.get('folderName')) {
      this.currentFolder.id = this.navParams.get('folderId');
      this.currentFolder.name = this.navParams.get('folderName');
    }
  }

  ionViewDidLoad() {
    this.fetchData();
  }

  fetchData() {
    const loading = this.loadingCtrl.create();
    loading.present();
    if (this.currentFolder.id) {
      this.http.get('/res/' + this.currentFolder.id).then(
        res => {
          loading.dismiss();
          this.initFileList(res.content);
        },
        err => {
          loading.dismiss();
          let alertTitle = 'Une erreur est survenue. Veuillez vérifier votre connexion.';
          if (err.error.code == 401) {
            alertTitle = 'Vous n\'avez pas les droits d\'accès à ce dossier.';
          }
          this.alertCtrl.create({
            title: alertTitle,
            buttons: [{
              text: 'Ok',
              handler: () => {
                this.navCtrl.pop();
              }
            }]
          }).present();
        }
      );
    }
    else {
      this.http.get('/res').then(
        res => {
          loading.dismiss();
          this.initFileList(res.content);
        },
        err => {
          loading.dismiss();
          if (err.error.code == 401) {
            this.alertCtrl.create({
              title: 'Vous n\'avez pas les droits d\'accès à ce dossier',
              buttons: [{
                text: 'Ok',
                handler: () => {
                  this.navCtrl.pop();
                }
              }]
            }).present();
          }
        }
      );
    }
  }

  initFileList(content: any) {
    if (content.children) {
      this.currentFilesList = content.children;
    }
    else {
      this.currentFilesList = content;
    }
  }

  openFile(file: any) {
    this.modalCtrl.create(FileViewerPage, file).present();
  }

  openFolder(folder: any) {
    this.navCtrl.push(HomePage, {
      folderId: folder.id,
      folderName: folder.name
    });
  }

  upload() {
    var fd = new FormData();
    fd.append('file', this.uploadFile);
    const loading = this.loadingCtrl.create();
    loading.present();
    let route = "";
    if (this.currentFolder.id) {
      route = "/" + this.currentFolder.id;
    }
    this.http.post("/res/upload" + route, fd).then(
      res => {
        loading.dismiss();
        this.fetchData();
        this.alertCtrl.create({
          title: 'Upload réussi',
          message: 'Votre fichier a bien été déposé sur le serveur',
          buttons: ['Ok']
        }).present();
      },
      err => {
        console.log(err);
        loading.dismiss();
        this.alertCtrl.create({
          title: 'Erreur lors de l\'upload',
          message: 'Une erreur est survenue. Veuillez réessayer',
          buttons: ['Ok']
        }).present();
      }
    );
  }

  changeFile(e) {
    this.uploadFile = e.target.files[0];
    this.upload();
  }

  createFolder() {
    const alert = this.alertCtrl.create({
      title: 'Créer un nouveau dossier',
      inputs: [
        {
          label: 'Nom du dossier',
          placeholder: 'Nom du dossier',
          type: 'text',
          name: 'folderName'
        }
      ],
      buttons: [
        {
          text: 'Annuler'
        },
        {
          text: 'Ok',
          handler: data => {
            console.log(data);
            this.http.post('/res', {
              name: data.folderName,
              parent_id: this.currentFolder.id,
              type: 'folder'
            }).then(
              res => {
                this.fetchData();
                this.alertCtrl.create({
                  title: 'Upload réussi',
                  message: 'Votre fichier a bien été déposé sur le serveur',
                  buttons: ['Ok']
                }).present();
              },
              err => {
                this.alertCtrl.create({
                  title: 'Erreur lors de l\'upload',
                  message: 'Une erreur est survenue. Veuillez réessayer',
                  buttons: ['Ok']
                }).present();  
              }
            )
          }
        }
      ]
    });
    alert.present();
  }

  selectFile(file: any) {
    this.alertCtrl.create({
      title: 'Supprimer le fichier ?',
      buttons: [
        {
          text: 'Supprimer',
          handler: () => {
            this.delete(file);
          }
        },
        {
          text: 'Annuler'
        }
      ]
    }).present();
  }

  delete(file) {
    console.log(file);
    const loading = this.loadingCtrl.create();
    loading.present();
    this.http.delete('/files/' + file.id).then(
      res => {
        loading.dismiss();
        console.log(res);
        this.fetchData();
        this.alertCtrl.create({
          title:'Le fichier a bien été supprimé',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                this.fetchData
              }
            }
          ]
        }).present();
      },
      err => {
        loading.dismiss();
        console.log(err);
      }
    )
  }
  
}
