import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharePage } from './share';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    SharePage,
  ],
  imports: [
    IonicPageModule.forChild(SharePage),
    IonicSelectableModule
  ],
})
export class SharePageModule {}
