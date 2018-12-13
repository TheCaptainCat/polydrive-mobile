import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'page-file-viewer',
  templateUrl: 'file-viewer.html',
})
export class FileViewerPage {

  file: any;
  imageURL: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private http: HttpProvider,
    private sanitizer: DomSanitizer
  ) {
    this.file = this.navParams.data;
  }

  ionViewDidLoad() {
    this.http.get('/files/' + this.file.id + '/file', 'blob').then(
      res => {
        const unsafeImageURL = URL.createObjectURL(res);
        this.imageURL = this.sanitizer.bypassSecurityTrustUrl(unsafeImageURL);
      }
    )
  }

  closeModal() {
    this.navCtrl.pop();
  }


}
