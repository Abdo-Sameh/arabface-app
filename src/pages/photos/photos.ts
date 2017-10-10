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
  photos
  userId

  constructor(public navCtrl: NavController,public remoteService : RemoteServiceProvider, public navParams: NavParams) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "")
    // this.getPhotsFromProvider(this.userid)
    this.getPhotos("all", 10, 0);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotosPage');
  }
  getPhotos(album_id, limit, offset){
    this.remoteService.getPhotos(this.userId, album_id, limit, offset).subscribe(res => {
      this.photos = res;
    });
  }

  getPhotsFromProvider (userid)
  {
      this.remoteService.userPhotosAlbumOnProfile(userid).subscribe((res) => { this.photos = res})
  }

  back()
  {
    this.navCtrl.push(TabsPage);
  }
}
