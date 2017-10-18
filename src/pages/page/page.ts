import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { TabsPage } from '../tabs/tabs';
import { PagesPage } from '../pages/pages';
import { InviteFriendPage } from '../invite-friend/invite-friend';
import { EditPagePage } from '../edit-page/edit-page';


/**
 * Generated class for the Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-page',
  templateUrl: 'page.html',
})
export class Page {

  id
  page
  userId
  saved
  message
  likes = 0
  constructor(public alert:AlertController, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.page = navParams.get("page");
    this.isSaved(this.page.id);
    this.pageLikes(this.page.id, '1')
    console.log(this.page);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Page');
  }

  editPage(){
    this.navCtrl.push(EditPagePage,{
      page: this.page
    });
  }
  savePage(pageId){
    this.remoteService.saveItem('page', pageId, this.userId).subscribe(res=>{
      this.saved = true;
        // console.log(res);
    });
  }
  unsavePage(pageId){
    this.remoteService.unsaveItem('page', pageId, this.userId).subscribe(res=>{
      this.saved  = false;
      // console.log(res);
    });
  }
  likePage(userId, pageId, type){
    this.remoteService.likePage(userId, pageId, type).subscribe(res =>{
      if(type == "like"){
        this.page.has_like = true;
        this.likes = this.likes + 1;

      }else{
        this.page.has_like = false;
        this.likes = this.likes - 1;
      }

    });
  }
  pageLikes(typeId, likeType){
    this.remoteService.pageLikes(typeId, this.userId, likeType).subscribe(res => {
      console.log(res);
      this.likes = res;
    });
  }
  isSaved(pageId){
    this.remoteService.isSaved('page', pageId, this.userId).subscribe(res=>{
      // console.log(res);
      if(res.status == 1){
        this.saved = true;
      }else{
        this.saved = false;
      }
    });
  }
  inviteFriend(){
    this.navCtrl.push(InviteFriendPage, {
      page: this.page
    });
  }
  reportPage(message){
    let alert = this.alert.create({
      title: 'Report',
      inputs: [
      {
        name: 'reason',
        placeholder: 'Reason ...'
      }
    ],
      buttons: [
        {
          text: 'Send',
          handler: () => {
            this.remoteService.reportItem("page", this.page.page_url, message, this.userId).subscribe(res => {
              if(res.status == "1"){
                let toast = this.toastCtrl.create({
                  message: 'Report sent successfully',
                  duration: 2000,
                  position: 'top'
                });
                toast.present();
              }else{
                let toast = this.toastCtrl.create({
                  message: 'You have reported this page before',
                  duration: 2000,
                  position: 'top'
                });
                toast.present();
              }
            });

          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    alert.present();

  }
  back()
  {
    this.navCtrl.pop();
  }

}
