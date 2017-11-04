import { Component, ViewChild,Inject } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import { RemoteServiceProvider} from '../providers/remote-service/remote-service';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
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
import { TranslateService } from '@ngx-translate/core';
import { ProfilePage } from '../pages/profile/profile';
import { GroupsPage } from '../pages/groups/groups';
import { EventsPage } from '../pages/events/events';
import { VideosPage } from '../pages/videos/videos';
import { ForumsPage } from '../pages/forums/forums';
import { TrendingPage } from '../pages/trending/trending';
import { ContactUsPage } from "../pages/contact-us/contact-us";
import { GiftsPage } from "../pages/gifts/gifts";
import { Globalization } from '@ionic-native/globalization';
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

  deviceLanguage
  public xmlLang :any;
  //  userName = localStorage.getItem('userName').replace(/['"]+/g, '');
  //  userAvatar = localStorage.getItem('userAvatar').slice(8,-1);
  //  userCover = localStorage.getItem('userCover');


    pages: Array<{title: string, component: any , icon: string}>;


    constructor(@Inject(DOCUMENT) private document, public globalization: Globalization, public launchNavigator: LaunchNavigator, public translate: TranslateService, public database:RemoteServiceProvider,public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen , public http :Http) {
      // translate.setDefaultLang('ar');


      firebase = this.database ;
      //this.loadXML('ar')
      this.initializeApp();
     // this.userAvatar ="http://"+this.userAvatar;
      // used for an example of ngFor and navigation

      this.pages = [
        { title: 'profile', component: ProfilePage ,icon : 'fa fa-user'  },
        { title: 'online-friends', component:  OnlinePage ,icon : 'fa fa-circle'},
        { title: 'videos', component: VideosPage ,icon : 'fa fa-video-camera' },
        { title: 'photos', component: PhotosPage ,icon : 'fa fa-camera'},
        { title: 'pages', component: PagesPage ,icon : 'fa fa-file'},
        { title: 'forums', component: ForumsPage ,icon : 'fa fa-commenting'},
        { title: 'groups', component: GroupsPage ,icon : 'fa fa-users'},
        { title: 'events', component: EventsPage ,icon : 'fa fa-calendar'},
        { title: 'contact-us', component: ContactUsPage ,icon : 'fa fa-envelope'},
        { title: 'gift-shop', component: GiftsPage ,icon : 'fa fa-shopping-bag'},
        { title: 'saved', component: SavedPage ,icon : 'fa fa-bookmark'},
        { title: 'discover', component: TrendingPage,icon : 'fa fa-hashtag'},
        { title: 'settings', component: SettingsPage ,icon : 'fa fa-cog'},
      ];
     // console.log(this.userName);
      //console.log(this.userCover)
  }

  ionViewDidLoad() {


  }
  initializeApp() {
    this.platform.ready().then(() => {
      //running from browser
      // this.translate.setDefaultLang("ar");
      // this.platform.setDir('rtl', true);
      // this.document.getElementById('appstyle').setAttribute('href', 'assets/css/main-ar.css');
      // this.deviceLanguage = "ar";
      // this.translate.getDefaultLang()
      //running from app

      this.globalization.getPreferredLanguage()
      .then( res => {
        this.translate.use((res.value).split("-")[0]);
        this.translate.setDefaultLang((res.value).split("-")[0]);
        if(this.translate.getDefaultLang() == "ar"){
          this.platform.setDir('rtl', true);
          this.document.getElementById('appstyle').setAttribute('href', 'assets/css/main-ar.css');
        }else{
          this.platform.setDir('ltr', true);
          this.document.getElementById('appstyle').setAttribute('href', 'assets/css/main.css');
        }
      });
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
    console.log('app'+this.checkLogin)
    if((this.checkLogin == "0") || (!this.checkLogin))
    {
      this.nav.setRoot(LoginPage)
    }else{
      this.nav.setRoot(TabsPage)

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

    this.nav.setRoot(LoginPage);

  }
  //  signout () {
  // this.na
  //  console.log("success")

  //  }




}
