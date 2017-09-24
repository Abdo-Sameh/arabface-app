import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
import {Page} from '../page/page';

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
  type
  page = {
    'title' : "",
    'desc' : "",
    'category' : "",
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId=localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.category = 'all';
    this.type = "all";
    this.getPages(this.type, "", this.category, this.userId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesPage');

  }

  getPages(type, term, categoryId, Id){
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
      $('#active1, #active2').click(function(){
        if(this.id == 'active1'){
          type = "all";
        }else{
          type = "mine";
        }
      });
      this.type = type;
      this.category = categoryId;

    this.remoteService.getPages(type, term, categoryId, Id).subscribe(res =>{
        loading.dismiss();
        console.log(type);
        console.log(term);
        console.log(categoryId);
        this.pages = res.pages ;
        this.categories = res.categories;
        console.log(res);
      });
      this.search="";
  }

  likePage(userId, pageId, type){
    this.remoteService.likePage(userId, pageId, type).subscribe(res =>{});
    var like = "#like"+pageId;
    var dislike = "#dislike"+pageId;

    if(type == "like"){
      $(like).html("<i class=\"fa fa-thumbs-o-up\"></i> Liked");

    }else{
      $(dislike).html("<i class=\"fa fa-thumbs-o-up\"></i> Like");

    }
  }

  createPage(title, description, category, userId){
    this.remoteService.createPage(title, description, category, userId).subscribe(res =>{

        this.pages = res.pages ;
        this.categories = res.categories;
        console.log(res);
      });
  }

  pagePage(page){
    //console.log(page);
    this.navCtrl.push(Page, {
      page: page,
    });
  }


  back()
  {
    this.navCtrl.push(TabsPage);
  }

}
