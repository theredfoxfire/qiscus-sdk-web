# Qiscus SDK Web

<p align="center"><br/><img src="https://res.cloudinary.com/qiscus/image/upload/K8xvGP4tXd/ss1.png" width="70%" /><br/></p>

Qiscus SDK helps you build Web Chat Application easy and fast. It uses Qiscus server backend for the API.

You can download files you need by navigating to the [release](https://github.com/qiscus/qiscus-sdk-web/releases) section.

# Quick Start
## Create a new app 
Register on [www.qiscus.com/dashboard](https://www.qiscus.com/dashboard) using your email and password and then create new application

You should create one application per service, regardless of the platform. For example, an app released in Android, iOS or Web would require only one application to be created in the Dashboard.

All users within the same Qiscus application are able to communicate with each other, across all platforms. This means users using iOS, Android, web clients, etc. can all chat with one another. However, users in different Qiscus `APP_ID` cannot talk to each other.

Now you can use the `APP_ID` into your apps and get chat functionality by implementing qiscus into your app.

## Integrating SDK
Qiscus SDK let you add a chat widget directly into your existing HTML web pages. You just need to include the javascript and css files from the build directory. And you also need to append `<div id="qiscus-widget"></div>` tag before closing body tag. Here's sample HTML:

You can just copy and paste this into your html file and it'll work directly.

``` html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <link rel=stylesheet href=https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css>
  <link rel="stylesheet" type="text/css" href="https://res.cloudinary.com/qiscus/raw/upload/DbSLsqjXn5/qiscus-sdk.2.5.8.css">
  <!-- add this CDN for emojione if you intend to support emoji -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/lib/js/emojione.min.js"></script>
</head>
<body>
  <div id="qiscus-widget"></div>
  <script src="https://res.cloudinary.com/qiscus/raw/upload/LwJUbnqW0r/qiscus-sdk.2.5.8.js"></script>
  <script>
     // let's setup options for our widget
     QiscusSDK.core.init({
        AppId: 'DRAGONGO',
        options: {
          // When we're success login into qiscus SDK we'll have a 1-on-1 chat to guest2@qiscus.com
          // You can change this to any user you have on your AppId, e.g: contact@your_company.com, etc
          loginSuccessCallback(data) { QiscusSDK.core.UI.chatTarget('guest2@qiscus.com') },
          // function below will be called when there's new message
          newMessagesCallback(data) { console.log("new message : ", data) }
        }
     });
     // login to qiscus
     QiscusSDK.core.setUser('guest3@qiscus.com', 'password', 'Qiscus Demo');
     // render the widget
     QiscusSDK.render();
  </script>
</body>
</html>
```

<p align="center"><br/><img src="https://res.cloudinary.com/qiscus/image/upload/JnLaMVdypw/ss3.png" width="70%" /><br/></p>



We're using two CDN here, one for emoji support and one for the icon, in this case we're using FontAwesome. 
The *emojione* is optional though.

If you already registered for your own AppId, just replace `dragongo` with your own `AppId`. In the example above we automatically open a chat roow with `guest2@qiscus.com` assuming that user already registered on `dragongo` AppId, if the user is not registered then it will be failed. 

On the code snippet above, we can pass several callbacks to init options, in the example we're using `loginSuccessCallback` which will be called when login is success. It'll automatically open 1-1 chat room with `guest2@qiscus.com`. There's also `newMessagesCallback` where in the example it just log what the messages are. After that we render the widget into our page by calling `QiscusSDK.render()`

# Authentication
## Init with APP ID

We can initialize Qiscus SDK by using this line of code:
```
QiscusSDK.core.init({
  AppId: 'DRAGONGO',
  options: {
  }
});
```

After we initialize the SDK, we need to set `login` data for current user by using this code:
`QiscusSDK.core.setUser('[email / unique identifer]', '[password]', '[Display Name]');`

## Set User or Updating a User Profile

You can use the previous login code to update your data:

`QiscusSDK.core.setUser('email', 'key', 'username', 'avatar_url');`

- `email` email used by currently logged in user
- `key` secret key for current user
- `username` username to be displayed to other participant
- `avatar_url` user avatar, fallback to default avatar if not provided

```
     // login to qiscus
     QiscusSDK.core.setUser('guest@qiscus.com', 'password', 'Qiscus Demo');
     // render the widget
     QiscusSDK.render();
```

# Chat Rooms
## Get Rooms List
`QiscusSDK.core.loadRoomsList(params)`
Parameters:
- `page` [int] page to load
- `limit` [int] limit room results, default to `100`
- `show_participants` [bool] whether to attach participant lists or not, default to `true`

## Create 1-to-1 chat
To create a 1-to-1 chat use this code:

`QiscusSDK.core.UI.chatTarget('[email / unique identifier]')`

## Creating a Group Room

`QiscusSDK.core.createGroupRoom (name, ...emails)`

where `email(s)` is in the type of `array`

## Get Room by id

`QiscusSDK.core.UI.chatGroup('group_room_id')`

# Event Handler

During `Qiscus.init` you can put callbacks that will being called when the event triggered.

```
QiscusSDK.core.init({
  AppId: 'DRAGONGO',
  options: {
    // called when user is successfully logged in. example: put alert boxes or notifs to notify user, or even do something with localstorage.
    loginSuccessCallback(data) { QiscusSDK.UI.chatTarget('guest2@qiscus.com') },
        
    // called when there's new incoming message. example: Put unread indicator somewhere in our apps to notify users there's incoming message or even call Desktop Notification code here.
    newMessagesCallback(data) { console.log("new message : ", data) },
    
    // called when user successfully open 1-1 chat. example: log the time, put analytic code, etc.
    chatRoomCreatedCallback(data) { console.log("chat room created : ", data) },
     
    // called when user successfully open group chat. example: log the time, put analytic code, etc.
    groupRoomCreatedCallback(data) { console.log("group room created : ", data) },
     
    // called when user click the header of chat room. example: put code to open user or group detail.
    headerClickedCallback() { console.log("header clicked") },

    // called when comment we sent is already delivered to target user. example: put analytic code.
    commentDeliveredCallback(data) { console.log("message delivered : ", data) },
    
    // called when comment we sent is delivered and read by target user. example: put analytic code.
    commentReadCallback(data) { console.log("message read : ", data) },
    
  }
});
```


# UI Customization
In case you don't want to have the sdk displaying on a widget view, we can put the Chat inside a container by setting `mode` to `wide` on `init` as a parameter like this example.

```
  QiscusSDK.core.init({
      AppId: 'DRAGONGO',
      mode: 'wide',
      options: {
      }
   });
 ```

You can also enable / disable avatar by passing `avatar` options.
 
The widget is built using vuejs and divided into several components. We also use fontawesome for the icon, so you can target fontawesome css class directly. You can change the appearance of the widget by using these css selectors below.

Widget components have namespaces of `qcw-...`

| css properties | description |
|----- | ---- |
| .qcw-trigger-button | Button for toggling the chat window | 
| .qcw-container | Widget Window Wrapper div |
| .qcw-header | Widget Header containing active chat title |
| ul#messages__comments | Messages list container |
| .qcw-comment-form | Comment Form container |
| .qcw-comment-form textarea | Comment Text Input Field |
| .qcw-comment-form i | Comment Form icons (paperclip and paper-plane icon) | 
| .comment-form i | Comment Form icons (paperclip and paper-plane icon) | 

# Search Messages
**qisc**us SDK provide API to search for Messages.

```
QiscusSDK.core.searchMessages(params)
```

**params**
- **query** {string} keyword to search
- **room_id** {int} search in specific room
- **last_comment_id** {int} search query only on comments higher than this id

Search message API above return Javascript Promise. So you can work on the result after the promise is resolved. Example:

```
QiscusSDK.core.searchMessages({query: 'hello'})
  .then(messages => {
    // messages return Array of Qiscus SDK Comments
    // You can use `gotoComment` API to navigate to specific comment in a room if only the comment is already loaded
    // If not, it will only navigate to the Room where the comment is resided
    QiscusSDK.Core.UI.gotoComment(messages[0]) // => navigate to the 1st room of search messages
  })
```

# Load Room List
```
QiscusSDK.core.loadRoomList(params)
```

**params**
- page {int} page number, default 1
- show_participants {bool}, default to true
- limit {int}, default to 100

# Sample Code

## Codepen
The code above will put qiscus chat inside a container. Here's a working example on [Codepen](https://codepen.io/desertlion/pen/MmdRBd)

## Full flow implementation
We have full flow of Chat SDK implementation with standard features like Chat List, Group creation, Add participant, etc
here on our Repository [https://bitbucket.org/qiscus/qiscus-sdk-sandbox](https://bitbucket.org/qiscus/qiscus-sdk-sandbox)

You can see [Live Demo](https://qiscus-sdk-sandbox.herokuapp.com/app) here

The implementation is using Vue js

## Simple HTML and jQuery
We are also provide sample using very simple HTML and jQuery that can be used for reference here
[Repository](https://github.com/apiep/qiscus-sdk-simple-sample)

you can see the [Live Demo](https://apiep.github.io/qiscus-sdk-simple-sample/) here






