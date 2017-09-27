import { Injectable } from '@angular/core';
import {Http ,Response ,Headers,URLSearchParams  } from '@angular/http';
import { IonicPage, NavController, NavParams ,Platform } from 'ionic-angular';
import xml2js from 'xml2js';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {AlertController,LoadingController} from 'ionic-angular'
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as $ from 'jquery'
declare var firebase ; 
let alert1,downloadURL,avatar,name ; let signupres ; let signupresult ; 
let userID = '25'   ; let cids ; let result = [] ; let friends ; let result5 = []; let msgs ; let chatid = [] ; let insideget ; 
let friends2 ;let addchat ;  let getremote  ; let remoteid ; let result34 ; let apichat ; let firebasemsgs ; let apimsgs ; 
let config = {
     apiKey: "AIzaSyBvXvFFmIM--9WbD07aemNah3ONCY22Ml4",
    authDomain: "aracall-3cda0.firebaseapp.com",
    databaseURL: "https://aracall-3cda0.firebaseio.com",
    projectId: "aracall-3cda0",
    storageBucket: "aracall-3cda0.appspot.com",
    messagingSenderId: "712599379890"
  };
  let user ; 
/*
  Generated class for the RemoteServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

let apiURL = 'http://nilemm.com/arabface/api/89129812/';

@Injectable()
export class RemoteServiceProvider {
 public Id :number;
 deviceLanguage
 response ; 
 
 public xmlLang :any;
  constructor(public loadingctr : LoadingController,public alertctrl:AlertController,public http: Http, public platform :Platform) {

    this.init() ;
    //getremote = this.remoteid 
    firebase.initializeApp(config)
    alert1 = this.alertctrl ; 
  }
  login = (data) => {
    let loader = this.loadingctr.create({
     
     showBackdrop : false 
   });
   loader.present();
   const url = 'http://nilemm.com/arabface/api/89129812/login?' + 'username=' + data.username + '&password=' + data.password;
    
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
   this.http.post(url,headers).subscribe(data3 => {
     this.response = data3.text() ; 
    
     this.response = JSON.parse(this.response) ; 

   
     if(this.response.status == 1) {
      localStorage.setItem('userid' , this.response.id) 
      
     avatar = this.response.avatar ; 
     name = this.response.name ; 
     userID = this.response.id ; 
       firebase.auth().signInWithEmailAndPassword(data.username, data.password).then(() => {
         
         loader.dismiss();
 
       }).catch(function(error) {
 // Handle Errors here.
 var errorCode = error.code;



   if(errorCode == "auth/user-not-found"){
    
   
var storageRef = firebase.storage().ref();

// Create a reference to 'mountains.jpg'



var getFileBlob = function(url, cb) {
       var xhr = new XMLHttpRequest();
       xhr.open("GET", url);
       xhr.responseType = "blob";
       xhr.addEventListener('load', function() {
           cb(xhr.response);
       });
       xhr.send();
   };

   var blobToFile = function(blob, name) {
       blob.lastModifiedDate = new Date();
       blob.name = name;
       return blob;
   };

   var getFileObject = function(filePathOrUrl, cb) {
       getFileBlob(filePathOrUrl, function(blob) {
           cb(blobToFile(blob, 'test.jpg'));
       });
   };

   getFileObject(avatar, function(fileObject) {
       var uploadTask = storageRef.child('images/test.jpg').put(fileObject);

       uploadTask.on('state_changed', function(snapshot) {
           
       }, function(error) {
           
       }, function() {
           downloadURL = uploadTask.snapshot.downloadURL;
         
           
   firebase.auth().createUserWithEmailAndPassword(data.username, data.password).then (() => {
loader.dismiss();
      var user = firebase.auth().currentUser;
      user.updateProfile({
        
 displayName: name,
 photoURL:downloadURL , 
}).then(function() {

}).catch(function(error) {
 // An error happened.
});
   }).catch(function(error) {
 // Handle Errors here.
 var errorCode = error.code;
 var errorMessage = error.message;
 let alert = alert1.create({
     title: 'Error',
     subTitle: errorMessage,
     buttons: ['OK']
   });
   alert.present();
});




       });
   });


firebase.database().ref(userID + '/chats').set({ 0: "undefined" }) ; 
firebase.database().ref(userID + '/incoming').set({ 0: "undefined" }) ; 

 }

});
     }else {
       loader.dismiss();
        let alert = alert1.create({
     title: 'Error',
     subTitle: 'User Not Found',
     buttons: ['OK']
   });
   alert.present();
     }
   })
   

 }


 set_userid (id) {
  userID = id.toString() ; 
  console.log('userid is set to' + userID)
}

 creat1 (email,password,name,data) {
let loader = this.loadingctr.create({
     
     showBackdrop : false 
   });
   loader.present();
  let body = new URLSearchParams();
body.append('firstname', data.firstname);
body.append('lastname', data.lastname);
body.append('username', name);
body.append('email_address', data.email_address);
body.append('password', password);
let body1 = body.toString () ; 



 let url = 'http://nilemm.com/arabface/api/89129812/signup?' + 'firstname=' + data.firstname + '&lastname=' + data.lastname + '&username=' + name + '&email_address=' + data.email_address + '&password='+password ;
let url2 = 'http://nilemm.com/arabface/api/89129812/signup' ; 

let headers = new Headers();
     headers.append('Content-Type', 'application/x-www-form-urlencoded');
this.http.post (url2,body1,{headers: headers}).subscribe(data => {

let data1 = data.text() ; 
data = JSON.parse(data1) ; 
signupresult = data ; 
localStorage.setItem('userid' , signupresult.userid)

if (data.status == 1) {

done () ; 

}
});
function done () {

firebase.auth().createUserWithEmailAndPassword(data.email_address, password).then (() => {
loader.dismiss()
      user = firebase.auth().currentUser;
      user.updateProfile({
 displayName: data.username
}).then(function() {
 
 


}).catch(function(error) {
 // An error happened.
});
   }).catch(function(error) {
 // Handle Errors here.
 var errorCode = error.code;
 var errorMessage = error.message;
 let alert = alert1.create({
     title: 'Error',
     subTitle: errorMessage,
     buttons: ['OK']
   });
   alert.present();
});


}
   
 }

 _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
           
           
   }
   public creat2 (email,password,name,photo,firstname,lastname) {
      let url = 'http://nilemm.com/arabface/api/89129812/signup?' + 'firstname=' + firstname + 'lastname=' + lastname + 'username=' + name + 'email_address=' + email + 'password='+password ;
var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
this.http.post (url,headers).subscribe(data => {

 signupres = data ;
 userID = signupres.id;
});
var storageRef = firebase.storage().ref();

// Create a reference to 'mountains.jpg'



var getFileBlob = function(url, cb) {
       var xhr = new XMLHttpRequest();
       xhr.open("GET", url);
       xhr.responseType = "blob";
       xhr.addEventListener('load', function() {
           cb(xhr.response);
       });
       xhr.send();
   };

   var blobToFile = function(blob, name) {
       blob.lastModifiedDate = new Date();
       blob.name = name;
       return blob;
   };

   var getFileObject = function(filePathOrUrl, cb) {
       getFileBlob(filePathOrUrl, function(blob) {
           cb(blobToFile(blob, 'test.jpg'));
       });
   };

   getFileObject(photo, function(fileObject) {
       var uploadTask = storageRef.child('images/test.jpg').put(fileObject);

       uploadTask.on('state_changed', function(snapshot) {
      
       }, function(error) {
           
       }, function() {
           var downloadURL = uploadTask.snapshot.downloadURL;
          
           // handle image here
       });
   });

   
   firebase.auth().createUserWithEmailAndPassword(email, password).then (() => {

      user = firebase.auth().currentUser;
      user.updateProfile({
 displayName: name,
 photoURL:photo , 
}).then(function() {
 
firebase.database().ref(userID + '/chats').set({ 0: "undefined" }) ; 
firebase.database().ref(userID + '/incoming').set({ 0: "undefined" }) ; 


}).catch(function(error) {
 // An error happened.
});
   }).catch(function(error) {
 // Handle Errors here.
 var errorCode = error.code;
 var errorMessage = error.message;
 let alert = alert1.create({
     title: 'Error',
     subTitle: errorMessage,
     buttons: ['OK']
   });
   alert.present();
});

 }
user = new Observable(observer => {
firebase.auth().onAuthStateChanged(function(user) {
  
 if (user) {

   // User is signed in.
   var displayName = user.displayName;
 
   var email = user.email;
   var emailVerified = user.emailVerified;
   var photoURL = user.photoURL;
   var isAnonymous = user.isAnonymous;
   var uid = user.uid;
   var providerData = user.providerData;
 
   observer.next("logged")
   observer.next({name:displayName})
 } else {

  observer.next("not here")
 }
});

}) ;
 
 init() {



 }



  ///////// Login function Start ////////
  /* Function for handling user login in by   */
  loginPostData(sentData,type)
  {

    return new Promise((resolve, reject) =>{
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('username', sentData.username);
      urlSearchParams.append('password', sentData.password);
      let body = urlSearchParams.toString()
      this.http.post(apiURL+type, body, {headers: headers}).
      subscribe(res =>{
        resolve(res.json());
      }, (err) =>{
        reject(err);
      });

    });
  }

    ///////// Login function End ////////

    ///////// Signup function Start ////////

  signupPostData(sentData,type){
    return new Promise((resolve, reject) =>{
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('firstname', sentData.firstname);
      urlSearchParams.append('lastname', sentData.lastname);
      urlSearchParams.append('username', sentData.firstname+sentData.lastname);
      urlSearchParams.append('email_address', sentData.email_address);
      urlSearchParams.append('password', sentData.password);

      let body = urlSearchParams.toString()
      this.http.post(apiURL+type, body, {headers: headers}).
      subscribe(res =>{
        resolve(res.json());
      }, (err) =>{
        reject(err);
      });

    });
  }
    ///////// Signup function End ////////

  getPhotos()
   {

          return  this.http.get("http://nilemm.com/arabface/api/89129812/page/browse")
          .do((res : Response ) => console.log(res.json()))
          .map((res : Response ) => res.json());

   }



    ///////// Friends function Start ////////
   friendsListApiCall(id)
   {

    return  this.http.get('http://nilemm.com/arabface/api/89129812/profile/friends?userid='+id)
    //.do((res : Response ) => console.log(res.json()))
    .map((res : Response ) => res.json());
   }
   ///////// Friends function End ////////


    ///////// Friends Request function Start ////////
    friendsRequestListApiCall(id)
    {

     return  this.http.get('http://nilemm.com/arabface/api/89129812/friend/requests?userid='+id)
     //.do((res : Response ) => console.log(res.json()))
     .map((res : Response ) => res.json());
    }
    ///////// Friends Request function End ////////



    ///////// Friends Request function Start ////////
    friendsSuggestionListApiCall(id)
    {

     return  this.http.get('http://nilemm.com/arabface/api/89129812/friend/suggestions?userid='+id)
     //.do((res : Response ) => console.log(res.json()))
     .map((res : Response ) => res.json());
    }
    ///////// Friends Request function End ////////

   ////////// Feeds function Start ///////////

   feedsListApiCall(id)
   {
    let url = "http://nilemm.com/arabface/api/89129812/feeds?limit=1000&userid="+id;
    console.log(url);
    return  this.http.get(url)
    //do((res : Response ) => console.log(res.json()))
    .map((res : Response ) => res.json());

   }
   ////////// Feeds function End             ///////////

   //////////  profile Api function start   ///////////

   profileDetailsApiCall(id)
   {
     let url = "http://nilemm.com/arabface/api/89129812/profile/details?userid="+id;
     return  this.http.get(url)
     //.do((res : Response ) => console.log(res.json()))
     .map((res : Response ) => res.json());

   }

    //////////  profile api  function End ///////////////
    profilePosts(id)
   {
    return  this.http.get("http://nilemm.com/arabface/api/89129812/feeds?type=timeline&limit=1200&type_id="+id)
    .map((res : Response ) => res.json());
   }

    //////////  messages api  function End ///////////////

    messagesApiCall(id)
    {
      let url = "http://nilemm.com/arabface/api/89129812/chat/conversations?userid="+id;
     return  this.http.get(url)
     //.do((res : Response ) => console.log(res.json()))
     .map((res : Response ) => res.json());

    }

    //////////  messages api  function End ///////////////



   ////////// likes Api call function start  ////////////


   likeFeedApiCall(UserID,FeedID):any
  {

      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('userid', UserID );
      urlSearchParams.append('type', "feed");
      urlSearchParams.append('type_id',FeedID );


      let body = urlSearchParams.toString()
     return this.http.post("http://nilemm.com/arabface/api/89129812/like/item", body, {headers: headers})
      //do((res : Response ) => console.log(res.json()))
     .map((res : Response ) => res.json());



  }

  ///////////// likes Api call function End  ////////////////////
  likeCommentApiCall(UserID,commentId):any
  {

      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('userid', UserID );
      urlSearchParams.append('type', "comment");
      urlSearchParams.append('type_id',commentId );


      let body = urlSearchParams.toString()
     return this.http.post("http://nilemm.com/arabface/api/89129812/like/item", body, {headers: headers})
      //do((res : Response ) => console.log(res.json()))
     .map((res : Response ) => res.json());



  }

  ///////////// chat messages Api call function start  ////////////////////

    usersCoversation(cID,userID):any
    {
      return this.http.get("http://nilemm.com/arabface/api/89129812/chat/get/messages?cid="+cID+"&userid="+userID).
      do((res : Response ) => console.log(res.json()))
     .map((res : Response ) => res.json());
    }


   ///////////// chat messages Api call function end  ////////////////////

  sharePost(feedID,userID):any
  {
    console.log(feedID +userID)
    return this.http.get("http://nilemm.com/arabface/api/89129812/feed/action?action=share&feed_id="+feedID+"&userid="+userID)
   .map((res : Response ) => res.json());
  }


 ///////////// chat messages Api call function end  ////////////////////


  ///////////  Send Messages between users start  ////////////


   ChatMessagesSend(cID,userID,msg):any
   {
    return this.http.get("http://nilemm.com/arabface/api/89129812/chat/send/message?text="+msg+"&cid="+cID+"&userid="+userID).
    do((res : Response ) => console.log(res.json()))
   .map((res : Response ) => res.json());
   }

  ///////////  Send Messages between users End  ////////////

   ///////////// user photos Api call function start  ////////////////////

   userPhotosAlbumOnProfile(userID : number) :any
   {
     return this.http.get("http://nilemm.com/arabface/api/89129812/profile/photos?the_userid="+userID).
     do((res : Response ) => console.log(res.json()))
    .map((res : Response ) => res.json());
   }


  ///////////// user photos Api call function end  ////////////////////



   ///////////// user profile page changing Api call function start  ////////////////////

   changeProfilePicture(userID : number , path) :any
   {
    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('path', path.path);
    let body = urlSearchParams.toString()
     return this.http.get("http://nilemm.com/arabface/api/89129812/profile/change/avatar?userid="+userID).
     do((res : Response ) => console.log(res.json()))
    .map((res : Response ) => res.json());
   }


  /////////////user profile page changing Api call function end  ////////////////////


  //////////// post in feed ///////////////////////

  feedPosting(userID,post)
  {

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userid', userID );
    urlSearchParams.append('entity_id', userID );
    urlSearchParams.append('text', post);
    urlSearchParams.append('type', "feed" );
    urlSearchParams.append('entity_type', "user" );
    let body = urlSearchParams.toString()

   return this.http.post("http://nilemm.com/arabface/api/89129812/feed/add", body, {headers: headers})
    //do((res : Response ) => console.log(res.json()))
   .map((res : Response ) => res.json());
  }

  ////////////////////////////////////////////////
  commentOnFeeds(postOwner,postID,whoCommented,comment)
  {
    return this.http.get("http://nilemm.com/arabface/api/89129812/comment/add?userid="+whoCommented+"&entity_id="+postOwner+"&entity_type=user&text="+comment+"&type=feed&type_id="+postID)
    //do((res : Response ) => console.log(res.json()))
      .map((res : Response ) => res.json());
  }

    //////////// post in feed ///////////////////////
    ReplyOnComment(postOwner,commentID,whoCommented,reply)
    {
      return this.http.get("http://nilemm.com/arabface/api/89129812/comment/add?userid="+whoCommented+"&entity_id="+postOwner+"&entity_type=user&text="+reply+"&type=comment&type_id="+commentID)
      //do((res : Response ) => console.log(res.json()))
        .map((res : Response ) => res.json());
    }
  
    ////////////////////////////////////////////////

  

  ////////////////////////////////////////////////


  //////////// post in feed ///////////////////////
  profilePost(userID,post)
  {

    console.log(userID,post)
    let url = "http://nilemm.com/arabface/api/89129812/feed/add?type=feed&entity_type=user&text="+post+"&entity_id="+userID ;
console.log(url)
   return this.http.get("http://nilemm.com/arabface/api/89129812/feed/add?type=feed&entity_type=user&text=ppppp&entity_id=25")
  .map((res : Response ) => res.json());
  }

  ////////////////////////////////////////////////

  ////////////// get notifications /////////////////
  getNotifications(userid)
  {
    return this.http.get("http://nilemm.com/arabface/api/89129812/notifications?limit=13&userid="+userid)
    //do((res : Response ) => console.log(res.json()))
      .map((res : Response ) => res.json());
  }

  //////////////////////////////////////////////

  //////////////////// load comments ////////////////////

  loadComments(feedid)
  {
    return this.http.get("http://nilemm.com/arabface/api/89129812/comment/load?type=feed&limit=10&type_id="+feedid)
    //do((res : Response ) => console.log(res.json()))
      .map((res : Response ) => res.json());
  }

  loadReplies(commentID)
  {
    return this.http.get("http://nilemm.com/arabface/api/89129812/comment/load?type=comment&limit=10&type_id="+commentID)
    //do((res : Response ) => console.log(res.json()))
      .map((res : Response ) => res.json());
  }



  loadProfileComments(feedid)
  {
    return this.http.get("http://nilemm.com/arabface/api/89129812/comment/load?type=feed&limit=5&type_id="+feedid)
    //do((res : Response ) => console.log(res.json()))
      .map((res : Response ) => res.json());
  }

  // feedposting (userID,post) :any {
  //     return new Promise ((resolve )=> {
  //       var settings = {
  //         "async": true,
  //         "crossDomain": true,
  //         "url": "http://nilemm.com/arabface/api/89129812/feed/add?type=feed&entity_type=user&text="+post+"&entity_id="+userID,
  //         "method": "GET",
  //         "headers": {
  //           "x-devtools-emulate-network-conditions-client-id": "964b73d8-9467-4f26-bff0-ddb7029125a0",
  //           "accept-language": "en-US,en;q=0.8",
  //           "cache-control": "no-cache",
  //         }
  //       }

  //       $.ajax(settings).done(function (response) {
  //         console.log(response);
  //           resolve(response)

  //       });
  //     })
  // }



  /////////////////////////////////////////////////////


  feedsComment(postOwner,postID,whoCommented,comment)
  {
    return this.http.get("http://nilemm.com/arabface/api/89129812/comment/add?userid="+whoCommented+"&entity_id="+postOwner+"&entity_type=user&text="+comment+"&type=feed&type_id="+postID)
    //do((res : Response ) => console.log(res.json()))
      .map((res : Response ) => res.json());
  }



   //////////////////// add friend ////////////////////

   addFriend(userid,friendID)
   {
     return this.http.get("http://nilemm.com/arabface/api/89129812/friend/add?userid="+userid+"&to_userid="+friendID)
     //do((res : Response ) => console.log(res.json()))
       .map((res : Response ) => res.json());
   }



   /////////////////////////////////////////////////////
     //////////////////// load comments ////////////////////

     ConfirmFriendRequest(userid,friendID)
     {
       return this.http.get("http://nilemm.com/arabface/api/89129812/friend/confirm?userid="+userid+"&to_userid="+friendID)
       //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
     }



     /////////////////////////////////////////////////////
       //////////////////// load comments ////////////////////

       deleteFriendRequest(userid,friendID)
       {
         return this.http.get("http://nilemm.com/arabface/api/89129812/friend/remove?userid="+userid+"&to_userid="+friendID)
         //do((res : Response ) => console.log(res.json()))
           .map((res : Response ) => res.json());
       }



       /////////////////////////////////////////////////////
        onlineFriends(userid)
        {
           return this.http.get("http://nilemm.com/arabface/api/89129812/friend/online?userid="+userid)
        //do((res : Response ) => console.log(res.json()))
          .map((res : Response ) => res.json());

        }
        /////////////// get  pages /////////////////////////
        getPages(type, term, categoryId, userId){
          return this.http.get("http://nilemm.com/arabface/api/89129812/page/browse?type=" + type + "&term=" + term + "&category_id=" + categoryId + "&userid=" + userId)
          .map((res : Response ) => res.json());
        }


        getPagesCategories(){
          return this.http.get("http://nilemm.com/arabface/api/89129812/page/get/categories")
          .map((res : Response ) => res.json());
        }

        /////////////// create  page /////////////////////////
        createPage(title, description, category, userId){
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('userid', userId );
          urlSearchParams.append('title', title);
          urlSearchParams.append('description', description );
          urlSearchParams.append('category', category );
          let body = urlSearchParams.toString()

         return this.http.post("http://nilemm.com/arabface/api/89129812/page/create", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }


        editPage(title, description, category, pageId){
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('page_id', pageId );
          urlSearchParams.append('title', title);
          urlSearchParams.append('description', description );
          urlSearchParams.append('category', category );
          let body = urlSearchParams.toString()

         return this.http.post("http://nilemm.com/arabface/api/89129812/page/edit", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }

        likePage(userId, pageId, type):any{
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('userid', userId );
          urlSearchParams.append('type', "page");
          urlSearchParams.append('type_id',pageId );
          let body = urlSearchParams.toString()
          if(type == "like")
         return this.http.post("http://nilemm.com/arabface/api/89129812/like/item", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
         else
         return this.http.post("http://nilemm.com/arabface/api/89129812/dislike/item", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }


        deletePage(pageId, userId){
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('page_id', pageId );
          urlSearchParams.append('userid', userId );
          let body = urlSearchParams.toString()
         return this.http.post("http://nilemm.com/arabface/api/89129812/page/delete", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }



        getGroups(type, term, filter, userId){
            return this.http.get("http://nilemm.com/arabface/api/89129812/group/browse?type=" + type + "&term=" + term + "&filter=" + filter + "&userid=" + userId)
            .map((res : Response ) => res.json());

        }


        createGroup(title, description, name, privacy, userId){
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('userid', userId );
          urlSearchParams.append('title', title);
          urlSearchParams.append('description', description );
          urlSearchParams.append('name', name );
          urlSearchParams.append('privacy', privacy );
          let body = urlSearchParams.toString()

         return this.http.post("http://nilemm.com/arabface/api/89129812/group/create", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }
        editGroup(title, description, privacy, groupId, canPost, canAddMember){
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('group_id', groupId );
          urlSearchParams.append('title', title);
          urlSearchParams.append('description', description );
          urlSearchParams.append('name', title );
          urlSearchParams.append('privacy', privacy );
          urlSearchParams.append('who_can_post', canPost );
          urlSearchParams.append('who_can_add_member', canAddMember );
          let body = urlSearchParams.toString()

         return this.http.post("http://nilemm.com/arabface/api/89129812/group/edit", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }

        deleteGroup(groupId){
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('group_id', groupId );
          let body = urlSearchParams.toString()
         return this.http.post("http://nilemm.com/arabface/api/89129812/group/delete", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }

        joinGroup(group_id, status, userid):any{
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('userid', userid );
          urlSearchParams.append('status', status);
          urlSearchParams.append('group_id', group_id );
          let body = urlSearchParams.toString()

         return this.http.post("http://nilemm.com/arabface/api/89129812/group/join", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }


        groupFeeding(id){
          return this.http.get("http://nilemm.com/arabface/api/89129812/feeds?type=group&type_id="  + id)
          .map((res : Response ) => res.json());
        }


        getEvents(type, categoryId, term, userId){
          if(type == ""){
            return this.http.get("http://nilemm.com/arabface/api/89129812/event/browse?userid=" + userId + "&term=" + term + "&category_id=" + categoryId)
            .map((res : Response ) => res.json());
          }else{

          }
          return this.http.get("http://nilemm.com/arabface/api/89129812/event/browse?userid=" + userId + "&term=" + term + "&category_id=" + categoryId + "&type=" + type)
          .map((res : Response ) => res.json());
        }


        getVideos(categoryId, term, type, filter, userId){
          return this.http.get("http://nilemm.com/arabface/api/89129812/videos/browse?userid=" + userId + "&term=" + term + "&category_id=" + categoryId + "&type=" + type + "&filter=" + filter)
          .map((res : Response ) => res.json());
        }

}
