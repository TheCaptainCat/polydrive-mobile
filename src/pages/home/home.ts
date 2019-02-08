import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, PopoverController, Platform, ModalController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { PopoverFilePage } from '../popover-file/popover-file';

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
  private isSharedPage: boolean;

  constructor(
    private navCtrl: NavController,
    private http: HttpProvider,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private fileOpener: FileOpener,
    private file: File,
    private androidPermissions: AndroidPermissions,
    private popoverCtrl: PopoverController,
    private platform: Platform,
    private modalCtrl: ModalController
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
    if (this.platform.is('core')) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        result => {
          if (!result.hasPermission) {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
          }
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      );
    }
  }

  fetchData() {
    const loading = this.loadingCtrl.create();
    loading.present();
    let route = '/res';
    if (this.currentFolder.id) {
      this.http.get(route + '/' + this.currentFolder.id).then(
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
      this.isSharedPage = this.navParams.get('sharedPage');
      if (this.isSharedPage)
        route = '/res/shared';
      this.http.get(route).then(
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
    this.http.get("/res/" + file.id + "/download", "blob").then(
      res => {
        this.file.writeFile(this.file.externalRootDirectory + 'Download/', file.name + "." + file.extension, res).then(
          res => {
            this.fileOpener.open(res.nativeURL, file.mime);
          },
          err => {
            this.alertCtrl.create({
              title: 'Le fichier a déjà été téléchargé',
              message: 'Vous pouvez y accéder en allant dans Téléchargements',
              buttons: ['Ok']
            }).present();
          }
        )
      },
      err => {
        this.alertCtrl.create({
          title: 'Erreur lors du téléchargement',
          message: 'Une erreur est survenue. Veuillez réessayer',
          buttons: ['Ok']
        }).present();
      }
    );
  }

  openFolder(folder: any) {
    let sharedPage = false;
    this.isSharedPage ? sharedPage = true : sharedPage = false;
    this.navCtrl.push(HomePage, {
      folderId: folder.id,
      folderName: folder.name,
      sharedPage: sharedPage
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

  deleteFile(file) {
    const loading = this.loadingCtrl.create();
    loading.present();
    this.http.delete('/res/' + file.id).then(
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

  presentPopover(event, file) {
    event.stopPropagation();
    const pop = this.popoverCtrl.create(PopoverFilePage, {
      isSharedPage: this.isSharedPage
    });
    pop.present({
      ev: event
    });
    pop.onWillDismiss(data => {
      if (data) {
        switch (data.value) {
          case 1:
            //Rename
            this.renameFile(file);
            break;
          case 2:
            //Déplacer
            this.moveFile(file);
            break;
          case 3:
            //Déplacer
            this.shareFile(file);
            break;
          default:
            break;
        }
      }
    });
  }

  renameFile(file: any) {
    console.log(file);
    const alert = this.alertCtrl.create({
      title: 'Modifier le nom du fichier',
      inputs: [
        {
          name: 'newName',
          type: 'text'
        }
      ],
      buttons: [
        'Annuler',
        {
          text: 'Valider',
          handler: data => {
            this.http.put('/res/' + file.id, {
              name: data.newName
            }).then(
              res => {
                this.fetchData();
              },
              err => {
                console.error(err);
              }
            )
          }
        }
      ]
    });
    alert.present();
  }

  moveFile(file: any) {
    const modal = this.modalCtrl.create('FileMovePage');
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data) {
          data.id;
          this.http.put('/res/' + file.id, {
            parent_id: data.id
          }).then(
            res => {
              this.fetchData();
            },
            err => {
              console.error(err);
            }
          );
        }
      }
    )
  }

  shareFile(file: any) {
    const modal = this.modalCtrl.create('SharePage');
    modal.present();
    modal.onDidDismiss(
      data => {
        console.log(data);
        if (data) {
          this.http.post('/res/share/' + file.id + '/' + data.userId + '/' + data.type, {}).then(
            res => {
              console.log(res);
            },
            err => {
              console.log(err);
            }
          );
        }
      }
    );
  }
  
}
