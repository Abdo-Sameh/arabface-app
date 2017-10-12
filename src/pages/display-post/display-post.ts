import { Component } from '@angular/core';
import { IonicPage, NavController,PopoverController , NavParams ,LoadingController ,AlertController} from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';

/**
 * Generated class for the DisplayPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-display-post',
  templateUrl: 'display-post.html',
})
export class DisplayPostPage {
    post
    comment={
      'comment' : '',
      'reply' :''
      }
      likes;
      likeNumbers;
      userData;
      show=true
      postToDisplay
      feedComments
      havePosted =false
      public userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
      userAvatar = localStorage.getItem('userAvatar').slice(8,-1);
      
      feed = { 'feedid' :""}
  constructor(public navCtrl: NavController,public popOver : PopoverController  , public navParams: NavParams ,public alert:AlertController,public loadingCtrl: LoadingController, public remoteService : RemoteServiceProvider) {
      this.post=this.navParams.get('post')
    console.log(this.post)


      
  }
  
likeFeed(userid =this.userId,feedid,postIndex)
{

  this.remoteService.likeFeedApiCall(this.userId,this.post.id).subscribe(res =>{

            this.post.like_count=res.likes;
            this.post.has_like=res.has_like;
  })


}
likeComment(userid =this.userId,commentID,postIndex,commentIndex)
{


  this.remoteService.likeCommentApiCall(this.userId,commentID).subscribe(res =>{
    this.likes = res;
    for(let i =0 ; i<this.post.answers[0].length ;i++)
      {
        if(this.post.answers[0][commentIndex].id == commentID)
        {
          this.post.answers[0][commentIndex].like_count=this.likes.likes;
          this.post.answers[0][commentIndex].has_like=this.likes.has_like;

          break
        }
      }


  })


}
likeReply(userid =this.userId,replyID,postIndex,commentIndex,replyIndex)
{

  this.remoteService.likeCommentApiCall(this.userId,replyID).subscribe(res =>{
    for(let i =0 ; i<this.post.answers[0][commentIndex].repliesContent.length ;i++)
      {
          if(this.post.answers[0][commentIndex].repliesContent[i].id == replyID)
          {
            this.post.answers[0][commentIndex].repliesContent[i].like_count=res.likes;
            this.post.answers[0][commentIndex].repliesContent[i].has_like=res.has_like;

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


                this.post.answers[0].push(res)
              
      
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

                this.post.answers[0][commentindex].repliesContent.push(res)

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


  ionViewDidLoad() {
    console.log('ionViewDidLoad DisplayPostPage');
  }

}
