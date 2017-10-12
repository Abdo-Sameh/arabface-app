import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
import {ProfilePage} from '../profile/profile';

/**
 * Generated class for the FriendsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {
  friendslist  ;
  FriendsRequest;
  FriendsSuggestion;
  Id :any;
  userData;
  friendID
  show = false
  constructor(public navCtrl: NavController, public navParams: NavParams ,public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.Id=localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.getFriendsRequestList(this.Id)
    this.getFriendsList(this.Id);
    this.getFriendsSuggestionList(this.Id);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsPage');
  }

  getFriendsList(Id, term="")
  {

 
    this.remoteService.friendsListApiCall(Id, Id, term).subscribe(res =>{this.friendslist=res ;console.log(res)});
  }

  getFriendsRequestList(Id)
  {
    this.remoteService.friendsRequestListApiCall(Id).subscribe(res =>{this.FriendsRequest=res ;console.log(res)});
  }

  getFriendsSuggestionList(Id)
  { let loading = this.loadingCtrl.create({
    content: "",
    spinner: "bubbles",
  });
  loading.present()
    this.remoteService.friendsSuggestionListApiCall(Id).subscribe(res =>{ loading.dismiss();this.FriendsSuggestion=res ;console.log(res)});
  }

  GoToProfile(id,Id)
  {
      this.remoteService.profileDetailsApiCall(id, Id).subscribe(res =>{this.userData = res ; res.id=id;      this.navCtrl.push(ProfilePage,{"userData" : res})
    });

  }
  addfriend(friendId,index,userid=this.Id)
  {

    this.remoteService.addFriend(userid,friendId).subscribe(res => {
      console.log(res)
      if(res.status == 1)
      {
        this.FriendsSuggestion.splice(index,1)
      }
       let toast = this.toastCtrl.create({
        message: "friend request sent",
        duration: 2000
      });
      toast.present();
    })
  }

  confirmFriendrequest(friendId,index,userid=this.Id)
  {

    this.remoteService.ConfirmFriendRequest(friendId,userid).subscribe(res => {
      if(res.status == 1)
      {
        this.FriendsRequest.splice(index,1)
      }
      let toast = this.toastCtrl.create({
        message: "added",
        duration: 2000
      });
      toast.present();
    })
  }
  DeleteFriendrequest(friendId,index,userid=this.Id)
  {

    this.remoteService.deleteFriendRequest(friendId,userid).subscribe(res => {
      if(res.status == 1)
      {
        this.FriendsRequest.splice(index,1)
      }
      let toast = this.toastCtrl.create({
        message: "removed",
        duration: 2000
      });
      toast.present();
    })
  }
  back()
  {
    this.navCtrl.push(TabsPage);
  }
}
