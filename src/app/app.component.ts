import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { RemoteServiceProvider} from '../providers/remote-service/remote-service';

import 'rxjs/add/operator/map';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { OnlinePage } from '../pages/online/online';
import { SettingsPage } from '../pages/settings/settings';
import { PhotosPage } from '../pages/photos/photos';
import { PagesPage } from '../pages/pages/pages';
import { TabsPage } from '../pages/tabs/tabs';
import { SavedPage } from '../pages/saved/saved';

import { ProfilePage } from '../pages/profile/profile';
import { GroupsPage } from '../pages/groups/groups';
import { EventsPage } from '../pages/events/events';
import { VideosPage } from '../pages/videos/videos';
import { ForumsPage } from '../pages/forums/forums';
import { TrendingPage } from '../pages/trending/trending';
import { ContactUsPage } from "../pages/contact-us/contact-us";
import { GiftsPage } from "../pages/gifts/gifts";
//import { TabsPage } from '../pages/tabs/tabs';

import xml2js from 'xml2js';
let firebaseauth
let firebase,candidate ;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
checkLogin = localStorage.getItem('loggedIn')
userName = localStorage.getItem('userName').replace(/[^aA-zZ]/g, "")
userCover = localStorage.getItem('userCover')
  deviceLanguage
  public xmlLang :any;
  //  userName = localStorage.getItem('userName').replace(/['"]+/g, '');
  //  userAvatar = localStorage.getItem('userAvatar').slice(8,-1);
  //  userCover = localStorage.getItem('userCover');


    pages: Array<{title: string, component: any , icon: string}>;


    constructor(public database:RemoteServiceProvider,public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen , public http :Http) {
      this.deviceLanguage = this.platform.lang();
      firebase = this.database ;
      //this.loadXML('ar')
      this.initializeApp();
   console.log(this.userCover)
     // this.userAvatar ="http://"+this.userAvatar;
      // used for an example of ngFor and navigation
      this.pages = [
        { title: 'Profile', component: ProfilePage ,icon : 'ion-ios-person'  },
        { title: 'Online friends', component:  OnlinePage ,icon : 'ion-person-stalker'},
        { title: 'Videos', component: VideosPage ,icon : 'ion-ios-videocam' },
        { title: 'Photos', component: PhotosPage ,icon : 'ion-images'},
        { title: 'Pages', component: PagesPage ,icon : 'ion-ios-browsers'},
        { title: 'Forums', component: ForumsPage ,icon : 'ion-chatboxes'},
        { title: 'Groups', component: GroupsPage ,icon : 'ion-ios-people'},
        { title: 'Events', component: EventsPage ,icon : 'ion-calendar'},
        { title: 'Contact Us', component: ContactUsPage ,icon : 'ion-ios-telephone'},
        { title: 'Gift Shop', component: GiftsPage ,icon : 'ion-bag'},
        { title: 'Saved', component: SavedPage ,icon : 'ion-compass'},
        { title: 'Discover', component: TrendingPage,icon : 'ion-compass'},
        { title: 'Settings', component: SettingsPage ,icon : 'ion-ios-gear'},
      ];
     // console.log(this.userName);
      //console.log(this.userCover)
  }

  ionViewDidLoad() {


  }
  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  public loadXML(lang):any
  {
     this.http.get('/assets/lang/'+lang+'.xml')
     .map(res => res.text())
     .subscribe((data)=>
     {
        this.parseXML(data)
        .then((data)=>
        {
            this.xmlLang= localStorage.setItem('lang', JSON.stringify(data) )
        });

     });

  }
  public  parseXML(data)
  {
     return new Promise(resolve =>
     {
      let
      arr    = [],
      obj,
      parser = new xml2js.Parser(
      {

         trim: true,
         explicitArray: true
      });

  parser.parseString(data, function (err, result)
  {
      obj = result.resources.string;
     for(let i=0; i < obj.length ; i++)
     {
         var key = obj[i].$.name;
         var value =obj[i]._;
         key = key.replace(/_{1,}/g,' ').replace(/(\s{1,}|\b)(\w)/g, function(m, space, letter)
         {
           return  letter.toUpperCase();
         })

         let ob = {}

         ob[key]=value
        arr.push(ob);
     }
     resolve(arr);
    });
     });
  }

  ngOnInit () {

    if(this.checkLogin == "1")
    {
      this.nav.setRoot(TabsPage)
      
    }else{
      this.nav.setRoot(LoginPage)
      
    }
    //   firebase.user.subscribe (snapshot => {
    //     console.log(snapshot)

    //     if(snapshot == "logged") {
    //       if(localStorage.getItem('userid') == undefined) {
    //         this.nav.setRoot(LoginPage)

    //       }else {
    //         this.database.set_userid(localStorage.getItem('userid'));
    //         firebase.set_active("true");
    //       }
          
          
         
    //       this.nav.setRoot (TabsPage);

    //     }else if(snapshot == null) {
    
    //       this.nav.setRoot(TabsPage);
    
    //   //     when deploying uncomment the next and comment above
    // //when in development comment next line and uncommnt above tel snapshot == logged

    //       // this.nav.setRoot(LoginPage);
    //     }
    //   })
    

    }

  logout()
  {
    localStorage.setItem('loggedIn', "0" );
    localStorage.setItem('userName', "" );
    localStorage.setItem('userAvatar', "" );
    localStorage.setItem('userData', "" );
    localStorage.setItem('userDataID', "" );
    localStorage.setItem('userCover', "" );
    console.log(    localStorage.getItem('userCover' ))

    this.nav.setRoot(LoginPage);

  }
  //  signout () {
  // this.na
  //  console.log("success")
 
  //  }




}
