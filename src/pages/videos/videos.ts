import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import { TabsPage } from '../tabs/tabs';
import { VideoPage } from '../video/video';
import { AddVideoPage } from '../add-video/add-video';


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
  page
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.type = "browse";
    this.filter = "all";
    this.category = "all";
    this.search = "";
    this.page = 1;
    this.getVideos(this.category, this.search,this.type, this.filter, this.userId, 1);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideosPage');
  }


  getVideos(categoryId, term, type, filter, userId, page){
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });

    if(page > 1){
      this.remoteService.getVideos(categoryId, term, type, filter, userId, page, 4).subscribe(res =>{
        for(let x of res.videos){
          this.videos.push(x);
        }
      });
      this.page = page;
    }else {
      this.page = page;
      loading.present()
      this.remoteService.getVideos(categoryId, term, type, filter, userId, page, 4).subscribe(res =>{
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
  }
  videoPage(video){
    this.navCtrl.push(VideoPage, {
      'video' : video
    })
  }
  addNewVideo(){
    this.navCtrl.push(AddVideoPage);
  }
  back() {
    this.navCtrl.push(TabsPage);
  }

}
