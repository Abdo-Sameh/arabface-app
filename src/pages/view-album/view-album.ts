import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import { EditAlbumPage} from '../edit-album/edit-album';

/**
 * Generated class for the ViewAlbumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-view-album',
  templateUrl: 'view-album.html',
})
export class ViewAlbumPage {
  userId
  album
  photos
  constructor(public navCtrl: NavController, public navParams: NavParams, public remoteService: RemoteServiceProvider, public toastCtrl: ToastController) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "")
    this.album = navParams.get("album");
    // this.albumDetails(this.album.id)
    console.log(this.album)
    this.albumPhotos(this.album.id, 10, 0)

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewAlbumPage');
  }
  albumPhotos(id, limit, offset){
    this.remoteService.albumPhotos(id, limit, offset, this.userId).subscribe(res => {
      console.log(res);
      this.photos = res;
    })
  }
  albumDetails(album_id){
    this.remoteService.albumDetails(album_id, this.userId).subscribe(res => {
      this.album = res;
    });
  }

  editPage(){
    this.albumDetails(this.album.id)
    this.navCtrl.push(EditAlbumPage, {
      album: this.album
    })
  }

  deleteAlbum(){
    this.remoteService.deleteAlbum(this.album.id, this.userId).subscribe(res => {
      if(res.status == 1){
        let toast = this.toastCtrl.create({
          message: 'Album deleted successfully',
          duration: 2000,
          position: 'top'
        });
        toast.present();
      this.navCtrl.pop();
      }
    })
  }
  back(){
    this.navCtrl.pop();
  }

}
