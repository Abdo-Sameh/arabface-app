import { Component } from '@angular/core';
import { HomePage} from '../home/home';

import { NewsPage} from '../news/news';
import { MessagesPage} from '../messages/messages';
import { NotificationsPage} from '../notifications/notifications';
import { FriendsPage} from '../friends/friends';
import { NavController,MenuController } from 'ionic-angular';
import {LoginPage}  from '../login/login';
import {ProfilePage}  from '../profile/profile';
import {MenuPage}  from '../menu/menu';

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {
 
  tab2Root = NewsPage;
  tab3Root = NotificationsPage;
  tab4Root  = MessagesPage;
  tab5Root = FriendsPage;
  tab6Root = MenuPage;
  


  constructor(public navCtrl: NavController,public menu: MenuController) {
    this.menu = menu;
    this.menu.enable(true)    
  }
  openMenu()
  {
    this.menu.open();    
  }
 
  
}
