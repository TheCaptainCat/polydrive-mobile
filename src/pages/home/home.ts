import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private currentFolder : {
    id: number,
    name: string
  };
  private currentFilesList: any[];
  private fileTransfer: FileTransferObject;

  constructor(
    private navCtrl: NavController,
    private http: HttpProvider,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private transfer: FileTransfer,
    private fileOpener: FileOpener,
    private file: File,
    private androidPermissions: AndroidPermissions
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
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => {
        if (!result.hasPermission) {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
        }
      },
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    );
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
    console.log(file);
    this.fileTransfer = this.transfer.create();
    console.log(this.http.url + "/res/" + file.id + "/download", this.file.externalRootDirectory + 'Download/' + file.name + "." + file.extension);
    this.fileTransfer.download(this.http.url + "/res/" + file.id + "/download", this.file.externalRootDirectory + 'Download/' + file.name + "." + file.extension).then(
      res => {
        console.log(res);
        this.fileOpener.open(res.nativeURL, file.mime);
      },
      err => {
        console.error(err);
      }
    )
  }

  openFolder(folder: any) {
    this.navCtrl.push(HomePage, {
      folderId: folder.id,
      folderName: folder.name
    });
  }

  upload(uploadFile: any) {
    var fd = new FormData();
    fd.append('file', uploadFile);
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
    const uploadFile = e.target.files[0];
    this.upload(uploadFile);
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
