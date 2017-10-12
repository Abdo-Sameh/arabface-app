import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController} from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import {ProfilePage} from '../profile/profile'
import {TabsPage} from '../tabs/tabs';
import { PhotosPage} from '../photos/photos'

/**
 * Generated class for the FriendProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-friend-profile',
  templateUrl: 'friend-profile.html',
})
export class FriendProfilePage {
  userData =[];
  userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
  userID
  photos
  likes;
  temp ;
  likeNumbers;
  posts
  picture = {'path': ''}
  friendslist
  followers
  following


  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl :LoadingController ,public remoteService : RemoteServiceProvider) {
    let data = navParams.get('userData');

      this.userID= data.id;
      console.log(data)
      console.log(this.userID , this.userId);
      this.getProfileData(this.userID, this.userId);
      this.getProfilePosts(this.userID)
  }
  getFollowing(userId){
    if(this.userID == null){
      userId = this.userId;
    }else{
      userId = this.userID;
    }
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
    this.remoteService.following(userId).subscribe(res =>{this.following = res ;console.log(res)});
    this.remoteService.followers(userId).subscribe(res =>{this.followers = res ;console.log(res)});
    loading.dismiss();
  }
  isFriend(id) {
  //  return true;
    this.remoteService.profileDetailsApiCall(70, this.userId).subscribe(res =>{

      console.log(res);
      return false;
  }

  );
  }
  myProfile(){
    if(this.userID == null || this.userId == this.userID){
      return true;
    }else{
      return false;
    }
  }

  getProfileData(id, theUserId)
  {
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
    this.remoteService.profileDetailsApiCall(id, theUserId).subscribe(res =>{loading.dismiss();this.userData = res ;console.log(res)});

  }
  GoToProfile(id,userId)
  {
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()

      this.remoteService.profileDetailsApiCall(id,userId).subscribe(res => {
          loading.dismiss();this.userData = res ;
          res.id=id;
          if(id == userId){
            this.navCtrl.push(ProfilePage,{
              "userData" : res
            })
          }else{
            this.navCtrl.push(FriendProfilePage,{
              "userData" : res
            })
          }

    });

  }
  getFriendsList(Id, id, term="")
  {
    if(this.userID == null){
      Id = id;
    }
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
      this.remoteService.friendsListApiCall(Id, id, term).subscribe(res =>{loading.dismiss();this.friendslist=res ;console.log(res)});
  }
  goToPhotos()
  {
    this.navCtrl.push(PhotosPage)
  }

  getPhotsFromProvider (userid)
  {
    if(this.userID == null){
      userid = this.userId;
    }else{
      userid = this.userID;
    }
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
      this.remoteService.userPhotosAlbumOnProfile(userid).subscribe((res) => { loading.dismiss();this.photos = res})
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
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendProfilePage');
  }

}
