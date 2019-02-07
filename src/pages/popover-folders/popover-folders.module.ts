import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverFoldersPage } from './popover-folders';

@NgModule({
  declarations: [
    PopoverFoldersPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverFoldersPage),
  ],
})
export class PopoverFoldersPageModule {}
