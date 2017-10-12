import { Component ,ViewChild} from '@angular/core';
import { HomePage} from '../home/home';

import { NewsPage} from '../news/news';
import { MessagesPage} from '../messages/messages';
import { NotificationsPage} from '../notifications/notifications';
import { FriendsPage} from '../friends/friends';
import { Nav,NavController,MenuController } from 'ionic-angular';
import {LoginPage}  from '../login/login';
import {MenuPage}  from '../menu/menu';
import { OnlinePage } from '../online/online';
import { SettingsPage } from '../settings/settings';
import { PhotosPage } from '../photos/photos';
import { PagesPage } from '../pages/pages';
import { SavedPage } from '../saved/saved';
import { ProfilePage } from '../profile/profile';
import { GroupsPage } from '../groups/groups';
import { EventsPage } from '../events/events';
import { VideosPage } from '../videos/videos';
import { ForumsPage } from '../forums/forums';
import { TrendingPage } from '../trending/trending';
import { ContactUsPage } from "../contact-us/contact-us";
import { GiftsPage } from "../gifts/gifts";
@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {
  @ViewChild(Nav) nav: Nav;
  
  tab2Root = NewsPage;
  tab3Root = NotificationsPage;
  tab4Root  = MessagesPage;
  tab5Root = FriendsPage;
  tab6Root = MenuPage;
  

  pages: Array<{title: string, component: any}>;
  
  constructor(public navCtrl: NavController,public menu: MenuController) {
    console.log(localStorage.getItem('loggedIn'))
    this.menu = menu;
    this.menu.enable(true)    
    this.pages = [
      { title: 'Profile', component: ProfilePage },
      { title: 'Online friends', component:  OnlinePage},
      { title: 'Videos', component: VideosPage },
      { title: 'Photos', component: PhotosPage },
      { title: 'Pages', component: PagesPage },
      { title: 'Forums', component: ForumsPage },
      { title: 'Groups', component: GroupsPage },
      { title: 'Events', component: EventsPage },
      { title: 'Contact Us', component: ContactUsPage },
      { title: 'Gift Shop', component: GiftsPage },
      { title: 'Saved', component: SavedPage },
      { title: 'Discover', component: TrendingPage },
      { title: 'Settings', component: SettingsPage },
    ];
  }
  openMenu()
  {
    this.menu.open();    
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  
}
