import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, AlertController } from 'ionic-angular';
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
    private alertCtrl: AlertController
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
    if (this.currentFolder.id) {
      this.http.get('/folders/' + this.currentFolder.id).then(
        res => {
          this.initFileList(res.content);
        },
        err => {
          console.log(err);
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
    else {
      this.http.get('/folders').then(
        res => {
          this.initFileList(res.content);
        },
        err => {
          console.log(err);
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
    this.currentFilesList = content;
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
    fd.append('parent_id', this.currentFolder.id.toString());
    this.http.post("/files", fd).then(
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
            this.http.post('/folders', {
              name: data.folderName,
              parent_id: this.currentFolder.id
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
  
}
