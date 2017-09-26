import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { NewsPage} from '../news/news';
import { MessagesPage} from '../messages/messages';
import { NotificationsPage} from '../notifications/notifications';
import { LoginPage} from '../login/login';
import { FriendsPage} from '../friends/friends';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
postList =[];

  constructor(public navCtrl: NavController , public remoteService : RemoteServiceProvider) {
 // this.getPosts();

  }

//   getPosts(){
//        this.remoteService.getPosts().subscribe((data)=>{
//            this.postList = data;
//        });

// }

logout()
{
  localStorage.setItem('loggedIn', null );
  this.navCtrl.push(LoginPage);  
  
}




}
