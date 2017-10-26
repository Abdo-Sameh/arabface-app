import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { TabsPage } from '../tabs/tabs';
import { PagesPage } from '../pages/pages';
import { InviteFriendPage } from '../invite-friend/invite-friend';
import { EditPagePage } from '../edit-page/edit-page';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FriendProfilePage } from '../friend-profile/friend-profile'
import { ProfilePage } from '../profile/profile';
import { DisplayPostPage } from '../display-post/display-post';
import { PostFeatursPage } from '../post-featurs/post-featurs';
/**
 * Generated class for the Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-page',
  templateUrl: 'page.html',
})
export class Page {

  id
  page
  userId
  saved
  message
  likes = 0
  show=true
  postToDisplay
  feedComments
  havePosted =false
  post ={ 'text' : ""}
  comment={
  'comment' : '',
  'reply' :'',
  'edited':'',
  }
  hiddenPost
  userAvatar
  feed = { 'feedid' :""}
  feeds
  feedLikes
  userData
  constructor(public alert:AlertController, private socialSharing: SocialSharing, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.page = navParams.get("page");
    this.isSaved(this.page.id);
    this.pageLikes(this.page.id, '1')
    this.userAvatar = this.page.logo;
    console.log(this.page);
    this.getFeedsList(this.userId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Page');
  }

  editPage(){
    this.navCtrl.push(EditPagePage,{
      page: this.page
    });
  }
  savePage(pageId){
    this.remoteService.saveItem('page', pageId, this.userId).subscribe(res=>{
      this.saved = true;
    });
  }
  unsavePage(pageId){
    this.remoteService.unsaveItem('page', pageId, this.userId).subscribe(res=>{
      this.saved  = false;
    });
  }
  likePage(userId, pageId, type){
    this.remoteService.likePage(userId, pageId, type).subscribe(res =>{
      if(type == "like"){
        this.page.has_like = true;
        this.likes = this.likes + 1;

      }else{
        this.page.has_like = false;
        this.likes = this.likes - 1;
      }

    });
  }
  pageLikes(typeId, likeType){
    this.remoteService.pageLikes(typeId, this.userId, likeType).subscribe(res => {
      console.log(res);
      this.likes = res;
    });
  }
  isSaved(pageId){
    this.remoteService.isSaved('page', pageId, this.userId).subscribe(res=>{
      if(res.status == 1){
        this.saved = true;
      }else{
        this.saved = false;
      }
    });
  }
  inviteFriend(){
    this.navCtrl.push(InviteFriendPage, {
      page: this.page
    });
  }
  regularShare(){
    this.socialSharing.share(this.page.title, "Arabface", "assets/images/logo.png", this.page.page_url);
  }

  reportPage(){
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
            this.remoteService.reportItem("page", this.page.page_url, data.reason, this.userId).subscribe(res => {
              if(res.status == "1"){
                let toast = this.toastCtrl.create({
                  message: 'Report sent successfully',
                  duration: 2000,
                  position: 'top'
                });
                toast.present();
              }else{
                let toast = this.toastCtrl.create({
                  message: 'You have reported this page before',
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
  getFeedsList(id,more=false,GotPosts= 30)
  {
    let loading = this.loadingCtrl.create({
      content: "",
      spinner: "bubbles",
      showBackdrop: true,
    });
    loading.present()
        this.remoteService.feedsListApiCall(id,this.page.id,'page',10).subscribe(res =>{
          for(let i = 0; i < res.length; i++) {
            let newFeedID = res[i].id
            let newFeed = res[i].answers
            this.remoteService.loadComments(newFeedID).subscribe(res2 =>{newFeed.unshift(res2)
              for(let g = 0; g < newFeed[0].length; g++) {
                  this.remoteService.loadReplies(newFeed[0][g].id).subscribe(res3 => {
                    newFeed[0][g]['repliesContent'] = res3
                  });
                }
              });
          }
          this.feeds=res

          loading.dismiss();
          console.log(this.feeds)

        });
  }

  loadMoreFeeds(feedlength) {
    console.log(feedlength)
    this.getFeedsList(this.userId,true,feedlength)
  }

  ///////////////////// post feed //////////////

  likeFeed(userid =this.userId,feedid,postIndex) {
    this.remoteService.likeFeedApiCall(this.userId,feedid).subscribe(res =>{
        this.feeds[postIndex].like_count = res.likes;
        this.feeds[postIndex].has_like = res.has_like;
    })
  }

  likeComment(userid =this.userId,commentID,postIndex,commentIndex) {
    this.remoteService.likeCommentApiCall(this.userId,commentID).subscribe(res =>{
      this.likes = res;
      for(let i = 0; i < this.feeds[postIndex].answers[0].length; i++) {
          if(this.feeds[postIndex].answers[0][commentIndex].id == commentID) {
            this.feeds[postIndex].answers[0][commentIndex].like_count = this.feedLikes.likes;
            this.feeds[postIndex].answers[0][commentIndex].has_like = this.feedLikes.has_like;
            break
          }
        }
    })
  }

  likeReply(userid =this.userId,replyID,postIndex,commentIndex,replyIndex) {
    this.remoteService.likeCommentApiCall(this.userId,replyID).subscribe(res =>{
      for(let i =0 ; i<this.feeds[postIndex].answers[0][commentIndex].repliesContent.length ;i++) {
            if(this.feeds[postIndex].answers[0][commentIndex].repliesContent[i].id == replyID) {
              this.feeds[postIndex].answers[0][commentIndex].repliesContent[i].like_count = res.likes;
              this.feeds[postIndex].answers[0][commentIndex].repliesContent[i].has_like = res.has_like;
              break
            }
        }
    })
  }

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

  sharePost(feedid,userID=this.userId)
  {
    let alert = this.alert.create({
      title: 'share',
      message: 'Do you want to share this post on your timeline ?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.remoteService.sharePost(feedid,userID).subscribe(res => {

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




  /////////////////////////////////////////
  GoToProfile(id,userId)
  {
    let loading = this.loadingCtrl.create({
      content: "",
      spinner: "bubbles",  });
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
      let toast = this.toastCtrl.create({
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

            let toast = this.toastCtrl.create({
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
                    let toast = this.toastCtrl.create({
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

                    let toast = this.toastCtrl.create({
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

  goToPost()
   {
  //   let popover = this.popOver.create(PostFeatursPage, {}, {cssClass: 'contpopover'});
  //   popover.present({

  //   });
    this.navCtrl.push(PostFeatursPage,{
      type: 'page',
      type_id: this.page.id
    })
  }
  back() {
    this.navCtrl.pop();
  }

}
