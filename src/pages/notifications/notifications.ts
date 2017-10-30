import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, App } from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { PostPage} from '../post/post'
import { ProfilePage} from '../profile/profile'
import { Page } from '../page/page';
import { LatestVisitorsPage } from '../latest-visitors/latest-visitors';

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  public userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
  notifications;
  unread;
  userData
  page
  pageNum
  constructor(private app: App, public navCtrl: NavController, public navParams: NavParams ,public loadingCtrl :LoadingController, public remoteService : RemoteServiceProvider , public loading: LoadingController) {
    this.pageNum = 1;
    this.getNotifications(1);
    this.getUnreadNotifications();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

  getNotifications(page) {
    let loading = this.loading.create({
      content: "Loading",
    });
    loading.present()

    $('#more').show();

      if(page > 1){
        this.remoteService.getNotifications(this.userId, 10, page).subscribe(res => {
          loading.dismiss();
          if(res.length >= 10){
              $('#more').show();
          }else{
            $('#more').hide();
          }
          for(let x of res){
            this.notifications.push(x);
          }
        });
          this.pageNum = page;
      }else{
        this.pageNum = page;
        this.remoteService.getNotifications(this.userId, 10, page).subscribe(res => {
          loading.dismiss();
          if(res.length >= 10){
              $('#more').show();
          }else{
            $('#more').hide();
          }
            this.notifications = res;
            console.log(res);
          });
      }

  }
  getUnreadNotifications(){
    this.remoteService.getUnreadNotifications(this.userId, 10, 1).subscribe(res => {
      this.unread = res;
      console.log(res);
    });
  }
  deleteNotification(id, index){
    this.remoteService.deleteNotification(this.userId, id).subscribe(res => {
      console.log(res);
         this.notifications.splice(index, 1);
    });
  }

  markReadNotification(id, type, index){
    this.remoteService.markReadNotification(this.userId, id, type).subscribe(res => {
      if(type == '1'){
        console.log("green");
        console.log('#check' + id);
        $('#check' + id).css("color", 'green');
        $('#' + id).css("background-color", 'transparent');
        this.notifications[index].mark_read = "1";
      }else{
        $('#check' + id).css("color", 'black');
        $('#' + id).css("background-color", '#e2e2e2');
        this.notifications[index].mark_read = "0";

      }
    })
  }
  GoToProfile(id) {
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()

      this.remoteService.profileDetailsApiCall(this.userId,id).subscribe(res =>{loading.dismiss();this.userData = res ; res.id=id;
       this.navCtrl.push(ProfilePage,{"userData" : res})
    });
  }
  getPageDetails(id){
    let loading = this.loading.create({
      content: "Loading",
    });
    loading.present()
    this.remoteService.getPageDetails(this.userId, id).subscribe(res => {
      console.log(res);
      this.page = res;
       this.app.getRootNav().push(Page, {
         page : this.page
       })
      loading.dismiss()
    })
  }


  gotoNotification(type, notification, index){

    this.markReadNotification(notification.id, '1', index)
    switch(type) {
       case "profile.view": {
         this.app.getRootNav().push(LatestVisitorsPage);
          break;
       }
       case "relationship.confirm": {
          break;
       }
       case "page.like":{
         this.getPageDetails(notification.type_id)
         break;
       }
       case "relationship.follow" :{

         break;
       }
       default: {
          break;
       }
    }
  }

  displayPost(feed,type,userid) {
    if(type == 'profile.view') {
      console.log(userid)
      this.GoToProfile(userid)
    }else if(type == 'relationship.confirm') {
      console.log(userid)

      this.GoToProfile(userid)

    }else if(type == 'relationship.add')
    {

    }else if(type == 'relationship.follow')
    {

    }else if(type == 'event.invite')
    {

    }else if(type == 'page.invite')
    {

    }else if(type == 'group.add.member')
    {

    }else{
    this.navCtrl.push(PostPage , { 'feed' : feed[0]})
    }
  }
}
