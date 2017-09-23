import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { OnlinePage } from '../pages/online/online';
import { SettingsPage } from '../pages/settings/settings';
import { PhotosPage } from '../pages/photos/photos';
import { PagesPage } from '../pages/pages/pages';
import { ProfilePage } from '../pages/profile/profile';
//import { TabsPage } from '../pages/tabs/tabs';

import xml2js from 'xml2js';


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
  
    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen , public http :Http) {
      this.deviceLanguage = this.platform.lang();
      //this.loadXML('ar')
      this.initializeApp();
    
     // this.userAvatar ="http://"+this.userAvatar;   
      // used for an example of ngFor and navigation
      this.pages = [
        { title: 'profile', component: ProfilePage },
        { title: 'online friends', component:  OnlinePage},
        { title: 'photos', component: PhotosPage },
        { title: 'pages', component: PagesPage },
        { title: 'settings', component: SettingsPage },
        
        
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


  logout()
  {
    localStorage.setItem('loggedIn', null );
    localStorage.setItem('userName', "" );
    localStorage.setItem('userAvatar', "" );
    localStorage.setItem('userData', "" );
    localStorage.setItem('userDataID', "" );
    localStorage.setItem('lang', "" );
    
    
    this.nav.push(LoginPage);  
    
  }



}
