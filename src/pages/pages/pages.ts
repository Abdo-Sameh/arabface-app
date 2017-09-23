import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';

/**
 * Generated class for the PagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-pages',
  templateUrl: 'pages.html',
})
export class PagesPage {
  pages
  categories
  userId :any;
  search
  category
  page = {
    'title' : "",
    'desc' : "",
    'category' : "",
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId=localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.category = 'all';
    this.getPages("all", "", "", this.userId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesPage');
  }

  getPages(type="all", term=this.search, categoryId=this.category, Id){
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
    var element = document.getElementById("active2");
    if(element != null){
      if(document.getElementById("active2").innerHTML == "My Pages"){
        type = "mine";
      }
    }

    this.remoteService.getPages(type, term, categoryId, Id).subscribe(res =>{
        loading.dismiss();
        this.pages = res.pages ;
        this.categories = res.categories;
        console.log(res);
      });
  }

  likePage(userId, pageId, type){
    this.remoteService.likePage(userId, pageId, type).subscribe(res =>{});
  }
  createPage(title, description, category, userId){
    this.remoteService.createPage(title, description, category, userId).subscribe(res =>{
        // loading.dismiss();
        this.pages = res.pages ;
        this.categories = res.categories;
        console.log(res);
      });
  }


  back()
  {
    this.navCtrl.push(TabsPage);
  }

}
