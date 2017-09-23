import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { FriendsPage } from '../pages/friends/friends';
import { NewsPage } from '../pages/news/news';
import { PagesPage } from '../pages/pages/pages';
import { PhotosPage } from '../pages/photos/photos';
import { SettingsPage } from '../pages/settings/settings';
import { MenuPage } from '../pages/menu/menu';
import { TabsPage } from '../pages/tabs/tabs';
import { NotificationsPage } from '../pages/notifications/notifications';
import { ProfilePage } from '../pages/profile/profile';
import { ChatPage } from '../pages/chat/chat';
import { MessagesPage } from '../pages/messages/messages';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RemoteServiceProvider } from '../providers/remote-service/remote-service';
import  {OnlinePage} from '../pages/online/online'
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    SignupPage,
    LoginPage,
    FriendsPage,
    MessagesPage,
    NewsPage,
    NotificationsPage,
    ProfilePage,
    ChatPage,
    MenuPage,
    SettingsPage,
    PagesPage,
    PhotosPage,
    OnlinePage
    


  ],
  imports: [
BrowserModule , IonicModule.forRoot(MyApp), HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    NotificationsPage,
    LoginPage,
    SignupPage,
    FriendsPage,
    MessagesPage,
    NewsPage,
    ProfilePage,
    ChatPage,
    MenuPage,
    SettingsPage,
    PagesPage,
    PhotosPage,
    OnlinePage


  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RemoteServiceProvider
  ]
})
export class AppModule {}