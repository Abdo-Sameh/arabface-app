import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
/**
 * Generated class for the VideosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-videos',
  templateUrl: 'videos.html',
})
export class VideosPage {
  videos
  categories
  userId :any;
  search
  category
  type
  filter

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.type = "browse";
    this.filter = "all";
    this.category = "all";
    this.search = "";
    this.getVideos(this.category, this.search,this.type, this.filter, this.userId);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideosPage');
  }

  getVideos(categoryId, term, type, filter, userId){
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
    // var element = document.getElementById("active");
    // if(element != null){
    //   if($( "#active1" ).hasClass( "active" )){
    //     type = "all";
    //   }else
    //   type = "mine";
    // }
    // console.log(type);
    // console.log(term);

    this.remoteService.getVideos(categoryId, term, type, filter, userId).subscribe(res =>{
        loading.dismiss();
        console.log(this.type);
        console.log(this.category);
        console.log(this.filter);
        console.log("----------------");
        console.log(type);
        console.log(categoryId);
        console.log(filter);
        this.videos = res.videos ;
        this.categories = res.categories;
        console.log(res);
      });
  }

  back()
  {
    this.navCtrl.push(TabsPage);
  }

}
