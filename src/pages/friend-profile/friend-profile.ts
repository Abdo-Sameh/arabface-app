import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController, ToastController, AlertController} from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { ProfilePage } from '../profile/profile'
import { TabsPage } from '../tabs/tabs';
import { PhotosPage } from '../photos/photos'
import { NotFound_404Page } from '../not-found-404/not-found-404';

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
  myFriendsList
  cover
  profileInfo
  blocked = false
  post ={ 'text' : ""}
  comment={
  'comment' : '',
  'reply' :'',
  'edited':'',
  }
  hiddenPost
  feed = { 'feedid' :""}
  constructor(public alert:AlertController, public navCtrl: NavController, public toastCtrl: ToastController,public navParams: NavParams,public loadingCtrl :LoadingController ,public remoteService : RemoteServiceProvider) {
    let data = navParams.get('userData');
    this.blocked = navParams.get('blocked');
    if(this.blocked){
      navCtrl.push(NotFound_404Page);
    }
      this.friendslist = [];
      this.myFriendsList = [];
      this.profileInfo = {
        'online_time' : '',
        "gender" : '',
        "birth" : '',
        "bio" :'',
        "city" : '',
        "state" : '',
        "country" : ''
      }
      this.userID = data.id;
      console.log(data)
      console.log(this.userID , this.userId);
      this.getProfileData(this.userID, this.userId);
      this.getFeedsList(this.userID)
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
    this.remoteService.profileDetailsApiCall(id, theUserId).subscribe(res =>{
      loading.dismiss();
      this.userData = res;
      console.log(res)
      for(var i = 0; i < res.profile_info.length; i++){
        console.log(res.profile_info[i]);
        if(res.profile_info[i]){
          if(res.profile_info[i].name == "online_time")
            this.profileInfo.online_time = res.profile_info[i].value;
          else if(res.profile_info[i].name == "gender")
            this.profileInfo.gender = res.profile_info[i].value;
          else if(res.profile_info[i].name == "birth")
            this.profileInfo.birth = res.profile_info[i].value;
          else if(res.profile_info[i].name == "bio")
            this.profileInfo.bio = res.profile_info[i].value;
          else if(res.profile_info[i].name == "country")
            this.profileInfo.country = res.profile_info[i].value;
          else if(res.profile_info[i].name == "city")
            this.profileInfo.city = res.profile_info[i].value;
          else if(res.profile_info[i].name == "state")
            this.profileInfo.state = res.profile_info[i].value;
          }
      }
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
          res.id=id;
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
    this.friendslist = [];
    if(this.userID == null){
      Id = id;
    }
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
      this.remoteService.friendsListApiCall(Id, id, term).subscribe(res => {
        for(let friend of res){
          this.remoteService.profileDetailsApiCall(friend.id, this.userId).subscribe(res2 => {
            console.log(res2);
            friend.friend_status = res2.friend_status;
            this.friendslist.push(friend);
          });


        }
        // this.friendslist = res;
        console.log(this.friendslist);
      });

      this.remoteService.friendsListApiCall(this.userId, this.userId, term).subscribe(res1 => {
        loading.dismiss();
        console.log(res1);
        for (var i = 0;i < res1.length; i++){
            this.myFriendsList.push(res1[i].id);
        }
        console.log(this.myFriendsList);
      });

  }
  goToPhotos() {
    this.navCtrl.push(PhotosPage)
  }

  getPhotsFromProvider (userid) {
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
          this.posts=res

          loading.dismiss();
          console.log(this.posts)
        });
  }

  loadMoreFeeds(feedlength) {
    console.log(feedlength)
    this.getFeedsList(this.userId, true, feedlength)
  }

likeFeed(userid = this.userId, feedid, postIndex) {
  this.remoteService.likeFeedApiCall(this.userId, feedid).subscribe(res =>{
        this.posts[postIndex].like_count = res.likes;
        this.posts[postIndex].has_like = res.has_like;
  })
}

likeComment(userid =this.userId,commentID,postIndex,commentIndex) {
  this.remoteService.likeCommentApiCall(this.userId, commentID).subscribe(res =>{
    this.likes = res;
    for(let i = 0 ; i < this.posts[postIndex].answers[0].length; i++)
      {
        if(this.posts[postIndex].answers[0][commentIndex].id == commentID)
        {
          this.posts[postIndex].answers[0][commentIndex].like_count = this.likes.likes;
          this.posts[postIndex].answers[0][commentIndex].has_like = this.likes.has_like;
          break
        }
      }
  })
}
likeReply(userid =this.userId,replyID,postIndex,commentIndex,replyIndex) {
  this.remoteService.likeCommentApiCall(this.userId,replyID).subscribe(res =>{
    for(let i =0 ; i<this.posts[postIndex].answers[0][commentIndex].repliesContent.length ;i++)
      {
          if(this.posts[postIndex].answers[0][commentIndex].repliesContent[i].id == replyID)
          {
            this.posts[postIndex].answers[0][commentIndex].repliesContent[i].like_count=res.likes;
            this.posts[postIndex].answers[0][commentIndex].repliesContent[i].has_like=res.has_like;
            break
          }
      }
  })
}

commentOnFeed(postOwner,postID,whoCommented=this.userId,comment=this.comment.comment) {
  let loading = this.loadingCtrl.create({
    content: "",
    spinner: "bubbles"
  });
  loading.present()
  this.remoteService.commentOnFeeds(postOwner,postID,whoCommented,comment).subscribe(res => {
    res.postid = postID
    for( let x in this.posts) {
        if(this.posts[x].id == res.postid) {
                this.posts[x].answers[0].push(res)
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
    this.posts[postindex].answers[0][commentindex].repliesContent.push(res)
      this.remoteService.loadReplies(commentID).subscribe(res2 =>{ });

      this.comment.reply = ''
      loading.dismiss()
  })

}

    addfriend(friendId, index, userid = this.userId) {
      this.remoteService.addFriend(userid,friendId).subscribe(res => {
        console.log(res)
        if(res.status == 1) {
          if(index == -1)
            this.userData['friend_status'] = 1;
          else
            this.friendslist[index].friend_status = 1;
        }

      })
    }

    follow(type){
      this.remoteService.follow(this.userId, this.userData['id'], type).subscribe(res => {
        if(res.status == 1){
          if(type == "follow")
            this.userData['follow_status'] = true;
          else
            this.userData['follow_status'] = false;
        }
      });
    }

  back() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendProfilePage');
  }

  blockUser(){
    this.remoteService.blockUser(this.userID, this.userId).subscribe(res => {
      if(res.status == 1){
        let toast = this.toastCtrl.create({
          message: 'User blocked successfully',
          duration: 2000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.pop();
      }
    });
  }

  reportUser(){
    let alert = this.alert.create({
      title: 'Report',
      inputs: [
      {
        name: 'reason',
        placeholder: 'Reason ...'
      }
    ],
      buttons: [
        {
          text: 'Send',
          handler: data => {
            this.remoteService.reportItem("profile", this.userData['url'], data.reason, this.userId).subscribe(res => {
              console.log(this.userData['url']);
              if(res.status == "1"){
                let toast = this.toastCtrl.create({
                  message: 'Report sent successfully',
                  duration: 2000,
                  position: 'top'
                });
                toast.present();
              }else{
                let toast = this.toastCtrl.create({
                  message: 'You have reported this profile before',
                  duration: 2000,
                  position: 'top'
                });
                toast.present();
              }
            });
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
  DeleteFriendrequest() {
    let alert = this.alert.create({
      title: 'Friend Request',
      message: 'Do you want to cancel this friend request?',
      buttons: [
        {
          text: 'Yes',
          handler: data => {
            this.remoteService.deleteFriendRequest(this.userID, this.userId).subscribe(res => {
              if(res.status == 1) {
                  this.userData['friend_status'] = '0';
              }
            })
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    alert.present();

  }
  deleteFriend(){
    let alert = this.alert.create({
      title: 'Remove Friend',
      message: 'Do you want to remove this friend?',
      buttons: [
        {
          text: 'Yes',
          handler: data => {
            this.remoteService.deleteFriendRequest(this.userID, this.userId).subscribe(res => {
              if(res.status == 1) {
                  this.userData['friend_status'] = '0';
              }
            })
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

}
