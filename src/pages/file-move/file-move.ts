import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, NavController, ModalController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';

@IonicPage()
@Component({
  selector: 'page-file-move',
  templateUrl: 'file-move.html',
})
export class FileMovePage {

  currentFoldersList: any;
  selectedFolderId: number;

  constructor(
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private http: HttpProvider,
    private modalCtrl: ModalController
    ) {
  }

  ionViewDidLoad() {
    if (!this.navParams.get('children')) {
      this.http.get('/res').then(
        res => {
          this.currentFoldersList = res.content.filter(elem => elem.type == 'folder');
        }
      );
    }
    else {
      this.currentFoldersList = this.navParams.get('children').filter(elem => elem.type == 'folder');
      this.selectedFolderId = this.navParams.get('id');
    }
  }

  openFolder(folder) {
    if (folder.children.length) {
      const modal = this.modalCtrl.create(FileMovePage, {
        children: folder.children,
        id: folder.id
      });
      modal.present();
      modal.onDidDismiss(
        data => {
          if (data) {
            this.viewCtrl.dismiss({
              id: data.id
            });
          }
        }
      )
    }
    else {
      this.selectedFolderId = folder.id;
    }
  }

  validate() {
    if (this.selectedFolderId == undefined)
      this.selectedFolderId = null;
    this.viewCtrl.dismiss({
      id: this.selectedFolderId
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

}
