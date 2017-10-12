import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController ,AlertController} from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import * as $ from "jquery"

declare var users
@Component({
  selector: 'page-post-featurs',
  templateUrl: 'post-featurs.html',
})
export class PostFeatursPage {
  post ={ 'text' : "" ,
            'feeling' : ''}
  bgshow = true
  tagedUsers
  searchedUsers
  chosenUsers
  listeningShow=true
   userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
  userAvatar = localStorage.getItem('userAvatar').slice(8,-1);
  
  constructor(public navCtrl: NavController,public navParams: NavParams ,public alert:AlertController,public loadingCtrl: LoadingController, public remoteService : RemoteServiceProvider) {
  
  }
  selectPrivacy()
  {
    $(document).on('click','li',function(){
      if($(this).text() == 'Public')
      {
        $('.privacy').attr('id','1')
      }else if ($(this).text() == 'Friends only')
      {
        $('.privacy').attr('id','2')
        
      }
      else{
        $('.privacy').attr('id','3')
        
      }

     })
  }
  postFeed(userID=this.userId,postText=this.post)
  {
    let privacy= $('.privacy').attr('id')
    
    let loading = this.loadingCtrl.create({
      content: "Posting",
    });        
    loading.present()
    if($('.postBody').attr('id'))
    {
      let id=$('.postBody').attr('id')
      
      this.remoteService.feedPosting(userID,postText.text,'none','text',privacy,id).subscribe( res => { 
        // this.feeds.unshift(res.feed)
         this.post.text= ""
         //this.getFeedsList(this.userId);
         loading.dismiss();
       });
       this.navCtrl.pop()
     }
     else if($('.feeling-div').attr('id')) {
      let selectedFeeling=$('.feeling-div').attr('id')
        this.remoteService.feedPosting(userID,postText.feeling,selectedFeeling,privacy,'feeling').subscribe( res => { 
          // this.feeds.unshift(res.feed)
           this.post.text= ""
           //this.getFeedsList(this.userId);
           loading.dismiss();
         });
         this.navCtrl.pop()
       }
  
       else{
      this.remoteService.feedPosting(userID,postText.text,'none','text',privacy).subscribe( res => { 
        // this.feeds.unshift(res.feed)
         this.post.text= ""
         //this.getFeedsList(this.userId);
         loading.dismiss();
       });
       this.navCtrl.pop()
    }
   
  }
  locationPopUp()
  {
      let locationAlert = this.alert.create(
        {
          title : 'location',
          message: "where are you now ?",
          inputs : [{
            name:'location',
            placeholder : 'your location !'
          }],
          buttons : [
            {
              text: 'post',
              handler: data => {
                // if (User.isValid(data.username, data.password)) {
                //   // logged in!
                // } else {
                //   // invalid login
                //   return false;
                // }
                this.remoteService.locationPosting(this.userId,data.location).subscribe(res => 
                {
                    console.log(res)

                })
              }

            }
          ]
        }
      )
     locationAlert.present()
  }
  backgroundShow()
  {
    this.bgshow =!this.bgshow
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PostFeatursPage');
  }
  getColor()
  {
    $(document).on('click','li',function(){
      $('.postBody').attr('id',this.id)
      $('.p-0').attr('id',this.id)
      
    });  
    
  }
  feelingsShow()
  {
				$('.dropdown-feeling').toggleClass('open');
  }
  selectFeeling()
  {   
    $(document).on('click','.dropdown-menu li a',function(){
    $('.feeling-div').attr('id',$(this).text())
    $(".feeling-div").show()
    $('.feelingText').text($(this).text())
  })
  
  }

  tagUsersDivShow()
  {
    $('.tag-div').toggle();
    
  }

  getFriendsListToTag(term)
  {
    if(term != ""){
      this.remoteService.friendsListApiCall(this.userId,this.userId,term).subscribe(res =>{
         this.searchedUsers = res    
          });
    }
  }
  selectUserToTag()
  {
    var users
    $(document).on('click','.tagslist li a',function(e){
      
      e.preventDefault();
     $('.selectedUsersInTag').find("ul[class='chosenElments']").append('<li class="well" style="margin:3px;display:inline">'+$(this).text()+'</li>') 
    })
  }
}
