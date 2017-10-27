import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController ,LoadingController ,AlertController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import { Page } from '../page/page';
import { EventPage } from '../event/event';
import { GroupPage } from '../group/group';
import { TabsPage } from '../tabs/tabs';
import { DisplayPostPage } from '../display-post/display-post';

/**
 * Generated class for the SavedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-saved',
  templateUrl: 'saved.html',
})
export class SavedPage {
  userId
  type = "posts"
  pages :any
  groups :any
  events :any
  posts
  page
  likes;
  likeNumbers;
  userData;
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
  constructor(public toast:ToastController ,public alert:AlertController, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.userAvatar = "http://" + localStorage.getItem('userAvatar').slice(8,-1);
    this.type = "posts"
    this.page = 1;
    this.pages = [];
    this.groups = [];
    this.events = [];
    this.getSavedPosts();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SavedPage');
  }
  getSavedPosts(more=false,GotPosts= 30){
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
    this.remoteService.savedFeeds(this.userId).subscribe(res =>{
        for(let i = 0 ; i < res.length;i++)
        {
          let newFeedID = res[i].id
          let newFeed = res[i].answers
          this.remoteService.loadComments(newFeedID).subscribe(res2 => {newFeed.unshift(res2)
            for(let g = 0 ;g < newFeed[0].length; g++)
              {
                this.remoteService.loadReplies(newFeed[0][g].id).subscribe(res3 => {

                  newFeed[0][g]['repliesContent'] = res3

                });

              }
            });

        }
        this.posts = res
        loading.dismiss();
        console.log(this.posts)
      });
  }
  likeFeed(userid =this.userId,feedid,postIndex) {
    this.remoteService.likeFeedApiCall(this.userId,feedid).subscribe(res =>{
        this.posts[postIndex].like_count=res.likes;
        this.posts[postIndex].has_like=res.has_like;
    })
  }

  likeComment(userid =this.userId,commentID,postIndex,commentIndex) {
    this.remoteService.likeCommentApiCall(this.userId,commentID).subscribe(res =>{
      this.likes = res;
      for(let i =0 ; i<this.posts[postIndex].answers[0].length ;i++)
        {
          if(this.posts[postIndex].answers[0][commentIndex].id == commentID)
          {
            this.posts[postIndex].answers[0][commentIndex].like_count=this.likes.likes;
            this.posts[postIndex].answers[0][commentIndex].has_like=this.likes.has_like;
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
      for( let x in this.posts)
        {
          if(this.posts[x].id == res.postid) {
            this.posts[x].answers[0].push(res)
          }
        }
        this.remoteService.loadComments(postID).subscribe(res2 =>{ });
        this.comment.comment = ''
        loading.dismiss()
    })

  }

  replyOnComment(postindex,commentindex,postOwner,commentID,whoCommented=this.userId,comment=this.comment.reply) {
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

  edit() {
    $(document).on('click','.comment-edit',function(){
      $(this).parent().prev().find('.input-group').show();
    })
    $(document).on('click','.cancel-edit',function(){
      $(this).parent().hide();
    })
  }

  reply() {
      $(document).on('click','.comment-reply',function(){
        $(this).closest('.comment').find('.reply-input').show();
      })
      $(document).on('click','.reply-close',function(){
        $(this).closest('.reply-input').hide();
      })
  }

  editPost() {
    $(document).on('click','.comment-edit',function(){
      $(this).parent().prev().find('.input-group').show();

    })
    $(document).on('click','.cancel-edit',function(){
      $(this).parent().hide();

    })
  }

  ConfirmEditPost(text,feedid) {
      this.remoteService.editPost(text,feedid,this.userId).subscribe((data) => {console.log(data)})
  }

  donotLikePost(feedid,index,userID=this.userId) {
    this.remoteService.hidePost(feedid,userID).subscribe(res => {
      this.hiddenPost = res.status
      if(res.status == 1 )
      {
        this.posts.splice(index,1)

        let toast = this.toast.create({
          message: 'This post will no longer show to you',
          duration : 2000
        });
        toast.present();
      }
    })
  }

  deletePost(feedid,index,userID=this.userId) {
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
                this.posts.splice(index,1)
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

  deleteComment(commentId) {
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

  turnOffNotifications(feedid,userID=this.userId) {
      this.remoteService.unsubscribePost(feedid,userID).subscribe((data) => { console.log(data)})
  }

  showPost(feed) {
    this.postToDisplay = feed
    console.log(this.postToDisplay)
    this.navCtrl.push(DisplayPostPage, {'post' : this.postToDisplay})
  }

 //////////////////////////////////////////
effects() {
 $(this).css('background-color','grey')
}

  getSavedPages(page){
    if(page == 1)
      this.pages = [];
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
    this.remoteService.getPages("saved", "", "all", this.userId, page, 4).subscribe(res =>{
        loading.dismiss();
        for(let x of res.pages){
          this.pages.push(x);
        }
        console.log(res);
      });
      this.page = page;
  }
  pagePage(page){
    this.navCtrl.push(Page, {
      page : page
    });
  }
  likePage(userId, pageId, type, index){
    this.remoteService.likePage(userId, pageId, type).subscribe(res =>{
      if(type == "like"){
        this.pages[index].has_like = true;
      }else{
        this.pages[index].has_like = false;
      }

    });
  }

  getSavedGroups(page){
    if(page == 1)
      this.groups = [];
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
    this.remoteService.getGroups("saved", "", "all", this.userId, page, 4).subscribe(res =>{
        loading.dismiss();
        for(let x of res){
          this.groups.push(x);
        }
        console.log(res);
      });
      this.page = page;
  }
  groupPage(group){
    this.navCtrl.push(GroupPage, {
      group: group
    })
  }
  joinGroup(group_id, status, userId, index){
    this.remoteService.joinGroup(group_id, status, userId).subscribe(res =>{
      if(status == '0'){
        this.groups[index].is_member = true;
      }else{
        this.groups[index].is_member = false;
      }
    });

  }
  getSavedEvents(page){
    if(page == 1)
      this.events = [];
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
    this.remoteService.getEvents("saved", "all", "" , this.userId, page, 2).subscribe(res =>{
        loading.dismiss();
        for(let x of res.events){
          this.events.push(x);
        }
        console.log(res);
      });
      this.page = page;
  }
  goToEventPage(event){
    this.navCtrl.push(EventPage, {
      event : event
    });
  }
  display(type){
    if(type == 'posts')
      this.getSavedPosts();
    else if(type == 'groups')
      this.getSavedGroups(1);
    else if(type == 'events')
      this.getSavedEvents(1);
    else if(type == 'pages')
      this.getSavedPages(1);
  }
  back(){
    this.navCtrl.push(TabsPage);
  }

}
