import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import { Page } from '../page/page';
import { EventPage } from '../event/event';
import { GroupPage } from '../group/group';
import { TabsPage } from '../tabs/tabs';

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
  type = "posts"
  pages
  groups
  events
  posts
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.type = "posts"
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
  pagePage(page){
    this.navCtrl.push(Page, {
      page : page
    });
  }
  likePage(userId, pageId, type, index){
    this.remoteService.likePage(userId, pageId, type).subscribe(res =>{
      if(type == "like"){
        this.pages[index].has_like = true;
      }else{
        this.pages[index].has_like = false;
      }

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
  groupPage(group){
    this.navCtrl.push(GroupPage, {
      group: group
    })
  }
  joinGroup(group_id, status, userId, index){
    this.remoteService.joinGroup(group_id, status, userId).subscribe(res =>{
      if(status == '0'){
        this.groups[index].is_member = true;
      }else{
        this.groups[index].is_member = false;
      }
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
  goToEventPage(event){
    this.navCtrl.push(EventPage, {
      event : event
    });
  }
  display(type){
    if(type == 'posts')
      this.getSavedPosts();
    else if(type == 'groups')
      this.getSavedGroups();
    else if(type == 'events')
      this.getSavedEvents();
    else if(type == 'pages')
      this.getSavedPages();
  }
  back(){
    this.navCtrl.push(TabsPage);
  }

}
