import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, ToastController, Loading  ,AlertController,LoadingController} from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { NotFound_404Page } from '../not-found-404/not-found-404';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TabsPage } from '../tabs/tabs';
import { PhotosPage } from '../photos/photos'
import { FriendProfilePage } from '../friend-profile/friend-profile'
import { DisplayPostPage } from '../display-post/display-post'
import { PostFeatursPage } from '../post-featurs/post-featurs'
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { UploadImagePage } from '../upload-image/upload-image';

// import { Camera, CameraOptions } from '@ionic-native/camera';
// import { FileTransfer, FileUploadOptions, FileTransferObject  } from '@ionic-native/file-transfer';

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var cordova: any;

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
    userData = [];
    userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    profileInfo = {
      'online_time' : '',
      "gender" : '',
      "birth" : '',
      "bio" :'',
      "city" : '',
      "state" : '',
      "country" : ''
    }
    feeds ;
    likes;
    cover
    userID
    photos
    show=true
    postToDisplay
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
    offset
    limit

    post ={ 'text' : ""}
    comment={
    'comment' : '',
    'reply' :'',
    'edited':'',
    }
    hiddenPost
    feed = { 'feedid' :""}
    lastImage: string = null;
    loading: Loading;
    videoURL
  constructor(private filePath: FilePath, private transfer: FileTransfer, private file: File, public camera: Camera, public navCtrl: NavController, public navParams: NavParams,public alert :AlertController,public loadingCtrl :LoadingController ,public remoteService : RemoteServiceProvider,  public toast: ToastController, public actionSheetCtrl: ActionSheetController, public platform: Platform) {
    let data = navParams.get('userData');
    console.log()
    this.limit = 4;
    this.offset = 1;
    this.photos = [];
    this.cover =  localStorage.getItem('userCover');
    console.log(this.cover)
        this.getProfileData(this.userId, this.userId);
        this.getFeedsList(this.userId)
        this.getPhotsFromProvider(this.userID);
  }
  public presentActionSheet(type) {
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Select Image Source',
      buttons: [
        {
          text: 'Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, type);

          }
        },
        {
          text: 'Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, type);

          }
        }
      ]
    });
    actionSheet.present();

  }

  public takePicture(sourceType, type) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), type);

          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), type);

      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName, type) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.navCtrl.push(UploadImagePage,{
        type: type,
        image: this.lastImage
      })
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  getFeedsList(id,more=false,GotPosts= 30)
  {
    let loading = this.loadingCtrl.create({
      content: "",
      spinner: "bubbles",
      showBackdrop: true,
    });
    loading.present()
        this.remoteService.feedsListApiCall(id,id,'timeline',10).subscribe(res =>{

          for(let i =0 ; i < res.length;i++)
          {

            if(res[i].video_embed != '')
            {
                res[i].video_embed = res[i].video_embed.substring(res[i].video_embed.indexOf("src=") + 5);
                res[i].video_embed = res[i].video_embed.substring(0, res[i].video_embed.indexOf("\""));
                this.videoURL = res[i].video_embed;
            }
            let newFeedID = res[i].id
            let newFeed = res[i].answers
            this.remoteService.loadComments(newFeedID).subscribe(res2 =>{newFeed.unshift(res2)
              for(let g = 0 ;g < newFeed[0].length; g++)
                {
                  this.remoteService.loadReplies(newFeed[0][g].id).subscribe(res3 => {

                    newFeed[0][g]['repliesContent']=res3

                  });

                }
              });

          }
          this.feeds=res
          if(GotPosts > 30)
          {
            console.log()
            this.feeds.push(res)
          }
          loading.dismiss();
          console.log(this.feeds)
        });
  }

  loadMoreFeeds(feedlength) {
    console.log(feedlength)
    this.getFeedsList(this.userId,true,feedlength)
  }

likeFeed(userid =this.userId,feedid,postIndex) {
  this.remoteService.likeFeedApiCall(this.userId,feedid).subscribe(res =>{
        this.feeds[postIndex].like_count=res.likes;
        this.feeds[postIndex].has_like=res.has_like;
  })
}

likeComment(userid =this.userId,commentID,postIndex,commentIndex) {
  this.remoteService.likeCommentApiCall(this.userId,commentID).subscribe(res =>{
    this.likes = res;
    for(let i =0 ; i<this.feeds[postIndex].answers[0].length ;i++)
      {
        if(this.feeds[postIndex].answers[0][commentIndex].id == commentID)
        {
          this.feeds[postIndex].answers[0][commentIndex].like_count=this.likes.likes;
          this.feeds[postIndex].answers[0][commentIndex].has_like=this.likes.has_like;
          break
        }
      }
  })
}
likeReply(userid =this.userId,replyID,postIndex,commentIndex,replyIndex)
{

  this.remoteService.likeCommentApiCall(this.userId,replyID).subscribe(res =>{
    for(let i =0 ; i<this.feeds[postIndex].answers[0][commentIndex].repliesContent.length ;i++)
      {
          if(this.feeds[postIndex].answers[0][commentIndex].repliesContent[i].id == replyID)
          {
            this.feeds[postIndex].answers[0][commentIndex].repliesContent[i].like_count=res.likes;
            this.feeds[postIndex].answers[0][commentIndex].repliesContent[i].has_like=res.has_like;

            break
          }
      }


  })


}
// postFeed(userID=this.userId,postText=this.post.text)
// {
//   console.log(this.feeds)

//   let loading = this.loadingCtrl.create({
//     content: "",
//     spinner: "bubbles",

//   });
//   loading.present()
//   this.remoteService.feedPosting(userID,postText).subscribe( res => {
//     this.feeds.unshift(res.feed)
//     this.post.text= ""
//     //this.getFeedsList(this.userId);
//     loading.dismiss();
//   });

// }
commentOnFeed(postOwner,postID,whoCommented=this.userId,comment=this.comment.comment)
{
  let loading = this.loadingCtrl.create({
    content: "",
    spinner: "bubbles",  });

  loading.present()
  this.remoteService.commentOnFeeds(postOwner,postID,whoCommented,comment).subscribe(res => {


    res.postid = postID
    for( let x in this.feeds)
      {
        if(this.feeds[x].id == res.postid)
          {
                this.feeds[x].answers[0].push(res)
              }
      }
      this.remoteService.loadComments(postID).subscribe(res2 =>{ });

      this.comment.comment = ''
      loading.dismiss()
  })

}
replyOnComment(postindex,commentindex,postOwner,commentID,whoCommented=this.userId,comment=this.comment.reply)
{
  let loading = this.loadingCtrl.create({
    content: "",
    spinner: "bubbles",  });

  loading.present()
  this.remoteService.ReplyOnComment(postOwner,commentID,whoCommented,comment).subscribe(res => {


    res.postid = commentID

                this.feeds[postindex].answers[0][commentindex].repliesContent.push(res)

      this.remoteService.loadReplies(commentID).subscribe(res2 =>{ });

      this.comment.reply = ''
      loading.dismiss()
  })

}

  getFollowingAndLikes(userId){
    this.offset = 1;
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
    this.remoteService.getPages("likes", "", "all", userId, 1, 4).subscribe(res =>{this.likedPages = res.pages ;console.log(res)});
    loading.dismiss();
  }
  getMorePages(userId){
    this.offset += 1;
    this.remoteService.getPages("likes", "", "all", userId, this.offset, this.limit).subscribe(res => {
      for(let x of res.pages){
        this.likedPages.push(x);
      }
       console.log(res)
    });
  }
  isFriend(id) {
  //  return true;
    this.remoteService.profileDetailsApiCall(70, this.userId).subscribe(res =>{

      console.log(res);
      return false;
    });
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
    this.remoteService.profileDetailsApiCall(id, theUserId).subscribe(res =>{
      this.userData = res;
      console.log(res)
      this.profileInfo.online_time = res.profile_info[0].value;
      this.profileInfo.gender = res.profile_info[1].value;
      this.profileInfo.birth = res.profile_info[2].value;
      this.profileInfo.bio = res.profile_info[3].value;
      // this.profileInfo.city = res.profile_info[4].value;
      // this.profileInfo.state = res.profile_info[5].value;
      this.profileInfo.country = res.profile_info[4].value;

      // console.log(res)
    });

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
            this.remoteService.isBlocked(res.id, this.userId).subscribe(res2 => {
              if(res2.status == 1){
                this.navCtrl.push(NotFound_404Page, {
                  "userData" : res,
                  "blocked" : true
                });
              }else{
                this.navCtrl.push(FriendProfilePage, {
                  "userData" : res,
                  "blocked" : false
                });
              }
            });
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

  // getProfilePosts(userid)
  //   {
  //     let loading = this.loadingCtrl.create({
  //       content: "Loading",
  //     });
  //     loading.present()
  //     this.remoteService.profilePosts(userid).subscribe((res) => {           loading.dismiss();

  //       for(let i =0 ; i < res.length;i++)
  //         {
  //           let newFeedID=res[i].id
  //           let newFeed =res[i].answers

  //           this.remoteService.loadProfileComments(newFeedID).subscribe(res2 =>{newFeed.push(res2); })
  //         }
  //         this.posts=res
  //         console.log(this.posts)


  //     })

  //   }
    // likeFeed(userid =this.userId,feedid)
    // {
    // //   "use strict";
    // //   $(".feed-box").on("click", function() {
    // //     console.info($(this).index())
    // // });
    //   this.remoteService.likeFeedApiCall(this.userId,feedid).subscribe(res =>{
    //     this.likes = res;
    //     for(let i =0 ; i<this.posts.length ;i++)
    //       {
    //           if(this.posts[i].id == feedid)
    //           {
    //             this.posts[i].like_count=this.likes.likes;
    //             break
    //           }
    //       }


    //   })


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

presentToast(msg) {
  let toast = this.toast.create({
    message: msg,
    duration: 3000,
    position: 'bottom'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}

  edit() {
    $(document).on('click','.comment-edit',function(){
      $(this).parent().prev().find('.input-group').show();

    })
    $(document).on('click','.cancel-edit',function(){
      $(this).parent().hide();

    })

  }
  reply()
    {
      $(document).on('click','.comment-reply',function(){
        $(this).closest('.comment').find('.reply-input').show();

      })
      $(document).on('click','.reply-close',function(){
        $(this).closest('.reply-input').hide();

      })



      }
   //////////////////////////////////////////////
   back()
   {
     //this.navCtrl.pop();
          this.navCtrl.push(TabsPage);
   }


     /* feed options
      which contain
      -i don't like post
      -edit post
      -delete post
      -view post
     */

      editPost()
      {
        $(document).on('click','.comment-edit',function(){
          $(this).parent().prev().find('.input-group').show();

        })
        $(document).on('click','.cancel-edit',function(){
          $(this).parent().hide();

        })
      }
      ConfirmEditPost(text,feedid)
      {
          this.remoteService.editPost(text,feedid,this.userId).subscribe((data) => {console.log(data)})
      }

      savePost(feedid)
    {
      let toast = this.toast.create({
        message: 'this post has saved !',
        duration : 2000,
        cssClass: 'alert'
      });
      toast.present();
      this.remoteService.saveItem('feed',feedid,this.userId).subscribe(res => {
        console.log(res)
      })
    }
      donotLikePost(feedid,index,userID=this.userId)
      {
        this.remoteService.hidePost(feedid,userID).subscribe(res => {
          this.hiddenPost = res.status
          if(res.status == 1 )
          {
            this.feeds.splice(index,1)

            let toast = this.toast.create({
              message: 'This post will no longer show to you',
              duration : 2000
            });
            toast.present();
          }
        })
      }
      deletePost(feedid,index,userID=this.userId)
      {
        let alert = this.alert.create({
          title: 'Delete',
          message: 'Do you want to delete this post?',

          buttons: [
            {
              text: 'Ok',
              handler: () => {

                this.remoteService.removePost(feedid,userID).subscribe(res => {
                  if(res.status == 1 )
                  {
                    this.feeds.splice(index,1)
                    let toast = this.toast.create({
                      message: 'You deleted this post ',
                      duration : 2000


                    });
                    toast.present();
                  }
                })
              }
            },
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
        });
        alert.present();
      }
      deleteComment(commentId)
      {
        let alert = this.alert.create({
          title: 'Delete',
          message: 'Do you want to delete comment?',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                this.remoteService.removeComment(commentId,this.userId).subscribe(res => {
                  if(res.status == 1 )
                  {

                    let toast = this.toast.create({
                      message: 'You deleted this comment ',
                      duration : 2000

                    });
                    toast.present();
                  }
                })
              }
            },
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
        });
        alert.present();


      }
      turnOffNotifications(feedid,userID=this.userId)
      {
          this.remoteService.unsubscribePost(feedid,userID).subscribe((data) => { console.log(data)})
      }
      showPost(feed)
      {
        this.postToDisplay=feed
        console.log(this.postToDisplay)
        this.navCtrl.push(DisplayPostPage,{'post':this.postToDisplay})
      }
     //////////////////////////////////////////
   effects()
   {
     $(this).css('background-color','grey')
   }

  goToPost() {
    this.navCtrl.push(PostFeatursPage)
  }
}
