import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';

/**
 * Generated class for the PhotosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-photos',
  templateUrl: 'photos.html',
})
export class PhotosPage {
  photos ;
  userid ;

  constructor(public navCtrl: NavController,public remoteService : RemoteServiceProvider, public navParams: NavParams) {
    this.userid = localStorage.getItem('userDataID').replace(/[^0-9]/g, "")
    this.getPhotsFromProvider(this.userid)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotosPage');
  }

  getPhotsFromProvider (userid : number)
  {
      this.remoteService.userPhotosAlbumOnProfile(userid).subscribe((res) => { this.photos = res})
  }

  back()
  {
    this.navCtrl.push(TabsPage);
  }
}
