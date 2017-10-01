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
import { Page } from '../pages/page/page';
import { GroupsPage } from '../pages/groups/groups';
import { GroupPage } from '../pages/group/group';
import { EventsPage } from '../pages/events/events';
import { VideosPage } from '../pages/videos/videos';
import { SettingsGeneralPage } from '../pages/settings-general/settings-general';
import { SettingsNotificationsPage } from '../pages/settings-notifications/settings-notifications';
import { SettingsPasswordPage } from '../pages/settings-password/settings-password';
import { SettingsPrivacyPage } from '../pages/settings-privacy/settings-privacy';
import { PhotosPage } from '../pages/photos/photos';
import { ForumsPage } from '../pages/forums/forums';
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
import {OnlinePage} from '../pages/online/online'
import {ContactUsPage} from '../pages/contact-us/contact-us'
import {FindFriendsPage}  from '../pages/find-friends/find-friends'
import {FriendListPage}  from '../pages/friend-list/friend-list'
import {FriendRequestsPage}  from '../pages/friend-requests/friend-requests'
import {GiftsPage}  from '../pages/gifts/gifts'
import {FriendProfilePage}  from '../pages/friend-profile/friend-profile'
import {PostPage}  from '../pages/post/post'
import {TrendingPage}  from '../pages/trending/trending'
import {CreatePagePage}  from '../pages/create-page/create-page'
import {CreateGroupPage}  from '../pages/create-group/create-group'
import {EditGroupPage}  from '../pages/edit-group/edit-group'
import {EditPagePage}  from '../pages/edit-page/edit-page'
import {CreateEventPage}  from '../pages/create-event/create-event'
import {EditEventPage}  from '../pages/edit-event/edit-event'
import {EventPage}  from '../pages/event/event'
import {PhotoselectionPage}  from '../pages/photoselection/photoselection'
import { SavedPage } from '../pages/saved/saved';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

// import { File } from '@ionic-native/file';
// import { Transfer } from '@ionic-native/transfer';
// import { FilePath } from '@ionic-native/file-path';
// import { Camera } from '@ionic-native/camera';

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
    GroupsPage,
    EventsPage,
    PhotosPage,
    OnlinePage,
    VideosPage,
    ForumsPage,
    GroupPage,
    Page,
    SettingsGeneralPage,
    SettingsNotificationsPage,
    SettingsPasswordPage,
    SettingsPrivacyPage,
    ContactUsPage,
    FriendRequestsPage,
    FriendListPage,
    FindFriendsPage,
    GiftsPage,
    FriendProfilePage,
    PostPage,
    TrendingPage,
    CreatePagePage,
    CreateGroupPage,
    EditGroupPage,
    EditPagePage,
    SavedPage,
    PhotoselectionPage, CreateEventPage, EditEventPage, EventPage
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
    GroupsPage,
    EventsPage,
    PhotosPage,
    OnlinePage,
    VideosPage,
    ForumsPage,
    GroupPage,
    Page,
    SettingsGeneralPage,
    SettingsNotificationsPage,
    SettingsPasswordPage,
    SettingsPrivacyPage,
    ContactUsPage,
    FriendRequestsPage,
    FriendListPage,
    FindFriendsPage,
    GiftsPage,
    FriendProfilePage,
    PostPage,

    TrendingPage,
    CreatePagePage,
    CreateGroupPage,
    EditGroupPage,
    EditPagePage,
    SavedPage,
    PhotoselectionPage, CreateEventPage, EditEventPage, EventPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileTransfer,Camera,
    FileTransferObject,
    // File,
    // Transfer,
    // Camera,
    // FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RemoteServiceProvider
  ]
})
export class AppModule {}
