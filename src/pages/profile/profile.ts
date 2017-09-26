import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController} from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
import { PhotosPage} from '../photos/photos'
/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
    userData =[];
    userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    userID
    photos
    likes;
    likeNumbers;
    posts
    picture = {'path': ''}
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl :LoadingController ,public remoteService : RemoteServiceProvider) {
    let data = navParams.get('userData');
   
    if(data)
      {
          this.userID= data.id;
          console.log(data)
      }

    if(this.userID == null)
      {
        this.getProfileData(this.userId);
        this.getPhotsFromProvider(this.userId)
        this.getProfilePosts(this.userId)
        
        
      }
      else
      {
        this.getProfileData(this.userID);
        this.getPhotsFromProvider(this.userID)
        this.getProfilePosts(this.userID)
        
        
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  
  getProfileData(id)
  {
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });        
    loading.present()
    this.remoteService.profileDetailsApiCall(id).subscribe(res =>{loading.dismiss();this.userData = res ;console.log(res)});
    
  }
  goToPhotos()
  {
    this.navCtrl.push(PhotosPage)
  }

  getPhotsFromProvider (userid)
  {
      this.remoteService.userPhotosAlbumOnProfile(userid).subscribe((res) => { this.photos = res})
  }

  getProfilePosts(userid)
    {
      let loading = this.loadingCtrl.create({
        content: "Loading",
      });        
      loading.present()
      this.remoteService.profilePosts(userid).subscribe((res) => {           loading.dismiss();
        
        for(let i =0 ; i < res.length;i++)
          {
            let newFeedID=res[i].id
            let newFeed =res[i].answers
      
            this.remoteService.loadProfileComments(newFeedID).subscribe(res2 =>{newFeed.push(res2); })
          }
          this.posts=res
          console.log(this.posts)
      
      
      })
      
    }
    likeFeed(userid =this.userId,feedid)
    {
    //   "use strict";
    //   $(".feed-box").on("click", function() {
    //     console.info($(this).index())
    // });
      this.remoteService.likeFeedApiCall(this.userId,feedid).subscribe(res =>{
        this.likes = res; 
        for(let i =0 ; i<this.posts.length ;i++)
          {
              if(this.posts[i].id == feedid)
              {
                this.posts[i].like_count=this.likes.likes;
                break
              }
          }
        
      
      })
    
      
    }
    

  // changeProfilePicture()
  // {
  //   var files = event.srcElement.files;
    
  //     console.log(this.picture.path)
  // }



count=1;

setColor(btn)
{
    var property = document.getElementById(btn);
    if (this.count == 0){
        property.style.color = "gray"
        this.count=1;        
    }
    else{
        property.style.color = "blue"
        this.count=0;
    }

}

  back()
  {
    this.navCtrl.push(TabsPage);
  }

}
