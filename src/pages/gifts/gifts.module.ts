import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GiftsPage } from './gifts';

@NgModule({
  declarations: [
    GiftsPage,
  ],
  imports: [
    IonicPageModule.forChild(GiftsPage),
  ],
})
export class GiftsPageModule {}
