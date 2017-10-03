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

  deviceLanguage
  public xmlLang :any;
  rootPage: any = LoginPage;
  //  userName = localStorage.getItem('userName').replace(/['"]+/g, '');
  //  userAvatar = localStorage.getItem('userAvatar').slice(8,-1);
  //  userCover = localStorage.getItem('userCover');


    pages: Array<{title: string, component: any}>;


    constructor(public database:RemoteServiceProvider,public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen , public http :Http) {
      this.deviceLanguage = this.platform.lang();
      firebase = this.database ;
      //this.loadXML('ar')
      this.initializeApp();

     // this.userAvatar ="http://"+this.userAvatar;
      // used for an example of ngFor and navigation
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

      firebase.user.subscribe (snapshot => {
        console.log(snapshot)

        if(snapshot == "logged") {
          if(localStorage.getItem('userid') == undefined) {
            this.nav.setRoot(LoginPage)

          }else {
            this.database.set_userid(localStorage.getItem('userid'));
            firebase.set_active("true");
          }



    this.nav.setRoot(TabsPage);
        }else if(snapshot == "not here") {

          this.nav.push(TabsPage);

      //     when deploying uncomment the next and comment above
    //when in development comment next line and uncommnt above tel snapshot == logged

          // this.nav.setRoot(LoginPage);
        }
      })

    //   this.database.remotelisten('video').subscribe (data => {
    // candidate = data ;
    // console.log(candidate)
    // if(candidate != "undefined" && candidate != undefined) {
    // //   var candidate = $.map(candidate, function(value, index) {
    // //     return [value];
    // // });
    // console.log(candidate.ice)
    //   if(candidate.ice == undefined){
    // this.nav.setRoot(VideohandlerPage , {candidate : candidate.message , type : 'remote' , id: candidate.sender });
    //     }
    // }

    //   })


    }

 signout () {

  firebaseauth.auth().signOut().then(function() {
   console.log("success")
  }).catch(function(error) {

  });
   }
  // logout()
  // {
  //   localStorage.setItem('loggedIn', null );
  //   localStorage.setItem('userName', "" );
  //   localStorage.setItem('userAvatar', "" );
  //   localStorage.setItem('userData', "" );
  //   localStorage.setItem('userDataID', "" );
  //   localStorage.setItem('lang', "" );


  //   this.nav.push(LoginPage);

  // }



}
