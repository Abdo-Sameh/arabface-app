import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';

/**
 * Generated class for the SavedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-saved',
  templateUrl: 'saved.html',
})
export class SavedPage {
  userId
  pages
  groups
  events
  posts
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.getSavedPosts();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SavedPage');
  }
  getSavedPosts(){
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
    this.remoteService.savedFeeds(this.userId).subscribe(res =>{
        loading.dismiss();
        this.posts = res ;
        console.log(res);
      });
  }
  getSavedPages(){
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
    this.remoteService.getPages("saved", "", "all", this.userId).subscribe(res =>{
        loading.dismiss();
        this.pages = res.pages ;
        console.log(res);
      });
  }
  getSavedGroups(){
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
    this.remoteService.getGroups("saved", "", "all", this.userId).subscribe(res =>{
        loading.dismiss();
        this.groups = res;
        console.log(res);
      });
  }
  getSavedEvents(){
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
    this.remoteService.getEvents("saved", "all", "" , this.userId).subscribe(res =>{
        loading.dismiss();
        this.events = res.events ;
        console.log(res);
      });
  }

}
