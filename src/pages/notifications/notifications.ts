import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { PostPage} from '../post/post'
import { ProfilePage} from '../profile/profile'

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
  userData

  constructor(public navCtrl: NavController, public navParams: NavParams ,public loadingCtrl :LoadingController, public remoteService : RemoteServiceProvider , public loading: LoadingController) {
    this.getNotifications(this.userId)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }


  getNotifications(userid)
  {
    let loading = this.loading.create({
      content: "Loading",
    });        
    loading.present()  
    this.remoteService.getNotifications(userid).subscribe(res => { loading.dismiss();console.log(res);this.notifications=res
    
      console.log(this.notifications)
    });
  }
  GoToProfile(id)
  {
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });        
    loading.present()
  
      this.remoteService.profileDetailsApiCall(this.userId,id).subscribe(res =>{loading.dismiss();this.userData = res ; res.id=id;    
       this.navCtrl.push(ProfilePage,{"userData" : res})
    });
    
  }
  
  displayPost(feed,type,userid)
  { 
    if(type == 'profile.view')
    {
      console.log(userid)
      this.GoToProfile(userid)
    }else if(type == 'relationship.confirm')
    {
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
