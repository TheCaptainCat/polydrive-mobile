import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpProvider } from '../../providers/http/http';
import { IonicSelectableComponent } from 'ionic-selectable';

@IonicPage()
@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class SharePage {

  private shareForm: FormGroup;
  private users: any;
  private selectedUser: any;

  constructor(
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private http: HttpProvider
  ) {
    this.shareForm = this.formBuilder.group({
      user: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    this.getUsers();
  }

  getUsers() {
    this.http.get('/users').then(
      res => {
        this.users = res.content;
      },
      err => {
        console.error(err);
      }
    );
  }

  validate() {
    this.viewCtrl.dismiss({
      userId: this.shareForm.value.user.id,
      type: this.shareForm.value.type
    });
  }

  quit() {
    this.viewCtrl.dismiss();
  }

}
