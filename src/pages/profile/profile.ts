import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, ToastController ,LoadingController} from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
//import { File } from '@ionic-native/file';
//import { Transfer, TransferObject } from '@ionic-native/transfer';
//import { FilePath } from '@ionic-native/file-path';
//import { Camera } from '@ionic-native/camera';
import {TabsPage} from '../tabs/tabs';
import { PhotosPage} from '../photos/photos'
import {FriendProfilePage} from '../friend-profile/friend-profile'

// import { Camera, CameraOptions } from '@ionic-native/camera';
// import { FileTransfer, FileUploadOptions, FileTransferObject  } from '@ionic-native/file-transfer';

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
    temp ;
    likeNumbers;
    posts
    picture = {'path': ''}
    friendslist
    followers
    following
    likedPages
    imageURI:any;
    imageFileName:any;

  constructor( public navCtrl: NavController, public navParams: NavParams,public loadingCtrl :LoadingController ,public remoteService : RemoteServiceProvider,  public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public platform: Platform) {
    let data = navParams.get('userData');
    console.log()
    //
    // if(data)
    //   {
    //       this.userID= data.id;
    //       console.log(data)
    //   }
    //   console.log(this.userID , this.userId);
    // if(this.userID == null  || this.userID == this.userId)
    //   {
    //     console.log("----------------------------");
    //     // console.log(this.userId);
        this.getProfileData(this.userId, this.userId);
    //     //this.getPhotsFromProvider(this.userId)
        this.getProfilePosts(this.userId)
    //
    //   }
    //   else
    //   {
    //     this.getProfileData(this.userID, this.userId);
    //   //  this.getPhotsFromProvider(this.userID)
    //     this.getProfilePosts(this.userID)
    //
    //   }

      // console.log(this.photos);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  getFollowingAndLikes(userId){
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
    this.remoteService.getPages("likes", "", "all", userId).subscribe(res =>{this.likedPages = res.pages ;console.log(res)});
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
    this.remoteService.profileDetailsApiCall(id, theUserId).subscribe(res =>{this.userData = res ;console.log(res)});

  }
  GoToProfile(id,userId)
  {
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()

      this.remoteService.profileDetailsApiCall(id,userId).subscribe(res => {
          loading.dismiss();this.userData = res ;
          console.log("---------------------------");
          res.id=id;
          console.log(res);
          console.log("----------------------------");
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
    changeProfilePicture(userid , avatar){
      console.log(avatar);
      this.remoteService.changeProfilePicture(this.userId, avatar).subscribe(res =>{console.log("success")});
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

// getImage() {
//     const options: CameraOptions = {
//       quality: 100,
//       destinationType: this.camera.DestinationType.FILE_URI,
//       sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
//     }

//     this.camera.getPicture(options).then((imageData) => {
//       this.imageURI = imageData;
//     }, (err) => {
//       console.log(err);
//       this.presentToast(err);
//     });
// }

// uploadFile() {
// let loader = this.loadingCtrl.create({
//   content: "Uploading..."
// });
// loader.present();
// const fileTransfer: FileTransferObject = this.transfer.create();

// let headers = new Headers();
// headers.append('Content-Type', 'multipart/form-data');

// let options: FileUploadOptions = {
//   fileKey: 'avatar',
//   fileName: this.imageURI,
//   chunkedMode: false,
//   mimeType: "multipart/form-data",
//   headers: headers,
//   params: {
//     'userid': this.userId,
//     'avatar': this.imageURI
//   }
// }

// fileTransfer.upload(this.imageURI, 'http://nilemm.com/arabface/api/89129812/profile/change/avatar', options)
//   .then((data) => {
//   console.log(data+" Uploaded Successfully");
//   this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
//   loader.dismiss();
//   this.presentToast("Image uploaded successfully");
// }, (err) => {
//   console.log(err);
//   loader.dismiss();
//   this.presentToast(err);
// });
// }

presentToast(msg) {
  let toast = this.toastCtrl.create({
    message: msg,
    duration: 3000,
    position: 'bottom'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}
// upload()
//     {
//
//        let options = {
//
//            quality: 100
//             };
//
//
//       this.camera.getPicture(options).then((imageData) => {
//        // imageData is either a base64 encoded string or a file URI
//        // If it's base64:
//
//      const fileTransfer: TransferObject = this.transfer.create();
//      let headers = new Headers();
//      headers.append('Content-Type', 'multipart/form-data');
//      let urlSearchParams = new URLSearchParams();
//     //  urlSearchParams.append('avatar', avatar);
//     //  urlSearchParams.append('userid', userid);
//       let options1: FileUploadOptions = {
//          fileKey: 'avatar',
//          fileName: 'name.jpg',
//          headers: headers
//       }
//
//   fileTransfer.upload(imageData, 'http://nilemm.com/arabface/api/89129812/profile/change/avatar?userid=66', options1)
//    .then((data) => {
//      // success
//      alert("success");
//    }, (err) => {
//      // error
//      alert("error"+JSON.stringify(err));
//    });
//
//
//     });
//
//
// }

  back()
  {
    this.navCtrl.push(TabsPage);
    // this.navCtrl.pop()
  }

}
