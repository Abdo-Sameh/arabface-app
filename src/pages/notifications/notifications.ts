import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, App } from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { PostPage} from '../post/post'
import { ProfilePage} from '../profile/profile'
import { Page } from '../page/page';
import { LatestVisitorsPage } from '../latest-visitors/latest-visitors';
import { VideoPage } from '../video/video';
import { DisplayPostPage } from '../display-post/display-post';
import { TranslateService } from '@ngx-translate/core';
import { EventPage } from '../event/event';
import { GroupPage } from '../group/group';
import { FriendProfilePage } from '../friend-profile/friend-profile';

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
  userId
  notifications;
  unread;
  userData
  page
  pageNum
  constructor(public translate: TranslateService, private app: App, public navCtrl: NavController, public navParams: NavParams ,public loadingCtrl :LoadingController, public remoteService : RemoteServiceProvider , public loading: LoadingController) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
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
            if(res.length == 0)
              $('#noNoti').show();
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
            if(res.length == 0)
              $('#noNoti').show();
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
         if(this.notifications.length == 0){
           $('#noNoti').show();
         }
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

      this.remoteService.profileDetailsApiCall(id, this.userId).subscribe(res =>{loading.dismiss();this.userData = res ; res.id=id;
       this.app.getRootNav().push(FriendProfilePage,{"userData" : res})
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

  getTime(time_ago){
    setTimeout("", 10000);
    var timeNow = new Date().getTime()/1000;
    // console.log(timeNow);
    // console.log(time_ago);
    // setInterval(1000);
    // console.log(timeNow-time_ago);
    var time_elapsed 	= timeNow - time_ago;
    var seconds 	= Math.round(time_elapsed) ;
    var minutes 	= Math.round(time_elapsed / 60 );
    var hours 		= Math.round(time_elapsed / 3600);
    var days 		= Math.round(time_elapsed / 86400 );
    var weeks 		= Math.round(time_elapsed / 604800);
    var months 	= Math.round(time_elapsed / 2600640 );
    var years 		= Math.round(time_elapsed / 31207680 );
    // console.log(days);
    var result = {
        number : 0,
        'format' : ''
    };
    if(seconds <= 60){
        result.number = seconds;
        result['format'] = "seconds";
    }
//Minutes
    else if(minutes <=60){
        if(minutes==1){
            result['number'] = 1;
            result['format'] = "minutes";

        }
        else{
            result['number'] = minutes;
            result['format'] = "minutes";
        }
    }
//Hours
    else if(hours <=24){
        if(hours==1){
            result['number'] = 1;
            result['format'] = "hours";
        }else{
            result['number'] = hours;
            result['format'] = "hours";
        }
    }
//Days
    else if(days <= 7){
        if(days==1){
            result['number'] = 1;
            result['format'] = "days";
        }else{
            result['number'] = days;
            result['format'] = "days";
        }
    }
//Weeks
    else if(weeks <= 4.3){
        if(weeks==1){
            result['number'] = 1;
            result['format'] = "weeks";
        }else{
            result['number'] = weeks;
            result['format'] = "weeks";
        }
    }
//Months
    else if(months <=12){
        if(months==1){
            result['number'] = 1;
            result['format'] = "months";
        }else{
            result['number'] = months;
            result['format'] = "months";
        }
    }
//Years
    else{
        if(years==1){
            result['number'] = 1;
            result['format'] = "years";
        }else{
            result['number'] = years;
            result['format'] = "years";
        }
    }
    let format, ago
    this.translate.get(result['format']).subscribe(value => { format = value; })
    this.translate.get('ago').subscribe(value => { ago = value; })

    var arabic = /[\u0600-\u06FF]/;
    if(arabic.test(format)){
      return ago + " " + result['number'] + " " + format;
    }else{
      return result['number'] + " " + format + " " + ago;
    }
  }


  gotoNotification(type, notification, index){

    this.markReadNotification(notification.id, '1', index)
    switch(type) {
       case "profile.view": {
         this.app.getRootNav().push(LatestVisitorsPage);
          break;
       }
       case "page.like":{
         this.getPageDetails(notification.type_id)
         break;
       }
       case "page.new.role":{
         this.app.getRootNav().push(Page,{
           page: notification.page[0]
         });
         break;
       }
       case "feed.like" :{
         this.app.getRootNav().push(DisplayPostPage,{
           post: notification.feed[0]
         });
         break;
       }
       case "post-on-timeline" :{
         this.app.getRootNav().push(DisplayPostPage,{
           post: notification.feed[0]
         });
         break;
       }
       case "feed.comment" :{
         this.app.getRootNav().push(DisplayPostPage,{
           post: notification.feed[0]
         });
         break;
       }
       case "video.comment" :{
         this.app.getRootNav().push(VideoPage,{
           video: notification.video[0]
         });
         break;
       }
       case "video.like" :{
         this.app.getRootNav().push(VideoPage,{
           video: notification.video[0]
         });
         break;
       }
       case "event.rsvp" :{
         this.app.getRootNav().push(EventPage,{
           event: notification.event[0]
         });
         break;
       }
       case "group.post" :{
         this.app.getRootNav().push(GroupPage,{
           group: notification.group[0]
         });
         break;
       }
       case "relationship.follow" :{
         console.log(notification.userid);
         this.GoToProfile(notification.userid);
         break;
       }
       default: {
          break;
       }
    }
  }

}
