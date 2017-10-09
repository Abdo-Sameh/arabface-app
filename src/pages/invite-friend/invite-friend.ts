import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';


/**
 * Generated class for the InviteFriendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-invite-friend',
  templateUrl: 'invite-friend.html',
})
export class InviteFriendPage {
  userId
  friends
  page
  constructor(public navCtrl: NavController, public navParams: NavParams, public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.page = this.navParams.get('page');
    this.friendsListApiCall(this.userId, this.userId, '');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InviteFriendPage');
  }
  friendsListApiCall(the_userid, id, term){
    this.remoteService.friendsListApiCall(the_userid, id, term).subscribe(res => {
      this.friends = res;
      console.log(res);
    });
  }
  isInvitedPage(user){
    this.remoteService.isInvitedPage(this.page.id, user, this.userId).subscribe(res => {
      if(res.status == true)
        return true;
      else
        return false;
    });
  }
  back(){
    this.navCtrl.pop();
  }

}
