import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController ,AlertController} from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';

/**
 * Generated class for the PostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  likeNumbers;
  userData;
  show=true
  feedComments
  havePosted =false
  post ={ 'text' : ""}
  comment={
  'comment' : '',
  'reply' :''
  }
  feed 
  public userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
  userAvatar = localStorage.getItem('userAvatar').slice(8,-1);
    constructor(public navCtrl: NavController, public navParams: NavParams ,public alert:AlertController,public loadingCtrl: LoadingController, public remoteService : RemoteServiceProvider) {
      this.feed=this.navParams.get('feed')
      
    this.remoteService.loadComments(this.feed.id).subscribe(res2 =>{
      this.feed.answers.unshift(res2) 
 
      for(let g=0 ;g <this.feed.answers[0].length;g++)
        {
          this.remoteService.loadReplies(this.feed.answers[0][g].id).subscribe(res3 => { 
            this.feed.answers[0][g]['repliesContent']=res3
            
          });
          
        }
        
      });
  }
   
likeFeed(userid =this.userId,feedid,postIndex)
{

  this.remoteService.likeFeedApiCall(this.userId,feedid).subscribe(res =>{
  
            this.feed.like_count=res.likes;
            this.feed.has_like=res.has_like;
  })

  
}

likeComment(userid =this.userId,commentID,postIndex,commentIndex)
{


  this.remoteService.likeCommentApiCall(this.userId,commentID).subscribe(res =>{
    for(let i =0 ; i<this.feed.answers[0].length ;i++)
      {
        if(this.feed.answers[0][commentIndex].id == commentID)
        {
          this.feed.answers[0][commentIndex].like_count=res.likes;
          this.feed.answers[0][commentIndex].has_like=res.has_like;
          
          break
        }      
      }
    
  
  })

  
}
likeReply(userid =this.userId,replyID,postIndex,commentIndex,replyIndex)
{

  this.remoteService.likeCommentApiCall(this.userId,replyID).subscribe(res =>{
    for(let i =0 ; i<this.feed.answers[0][commentIndex].repliesContent.length ;i++)
      {
          if(this.feed.answers[0][commentIndex].repliesContent[i].id == replyID)
          {
            this.feed.answers[0][commentIndex].repliesContent[i].like_count=res.likes;
            this.feed.answers[0][commentIndex].repliesContent[i].has_like=res.has_like;
            
            break
          }
      }
    
  
  })

  
}

commentOnFeed(postOwner,postID,whoCommented=this.userId,comment=this.comment.comment)
{
  let loading = this.loadingCtrl.create({
    content: "commenting",
  });        
  
  loading.present()
  this.remoteService.commentOnFeeds(postOwner,postID,whoCommented,comment).subscribe(res => {
    
 
    res.postid = postID
 
     
                this.feed.answers[0].push(res)
      
      this.remoteService.loadComments(postID).subscribe(res2 =>{ });
      
      this.comment.comment = ''
      loading.dismiss()
  })

}
replyOnComment(postindex,commentindex,postOwner,commentID,whoCommented=this.userId,comment=this.comment.reply)
{
  let loading = this.loadingCtrl.create({
    content: "replying",
  });        
  
  loading.present()
  this.remoteService.ReplyOnComment(postOwner,commentID,whoCommented,comment).subscribe(res => {    
    
    
   this.feed.answers[0][commentindex].repliesContent.push(res)
     
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
reply()
{
  this.show = !this.show;
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad PostPage');
    console.log(this.feed)
  }

}
