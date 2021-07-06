<template>
  <div class="wrap">
    <el-row class="icons">
      <el-col :span="8" class="item" id="customBtn">
        <img :src="require('../assets/images/google2.png')" />
        <span>Google</span>
      </el-col>
      <el-col :span="8">
        <div class="item" @click="FBlogin">
          <img :src="require('../assets/images/facebook.png')" />
          <span>FaceBook</span>
        </div>
      </el-col>
      <el-col :span="8" class="item">
        <div class="item" @click="initApple">
          <img :src="require('../assets/images/apple2.png')" />
          <span>Apple</span>
        </div>
      </el-col>
      <!-- <el-col :span="8" class="item">
        <div
          id="g_id_onload"
          data-client_id="323627425448-i3697bcdimd39k3qrdqcp85iju447s1v.apps.googleusercontent.com"
          data-context="signin"
          data-ux_mode="popup"
          data-callback="loginGoogle"
          data-auto_prompt="false"
        ></div>
        <div
          class="g_id_signin"
          data-type="standard"
          data-shape="rectangular"
          data-theme="outline"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left"
        ></div>
      </el-col> -->
    </el-row>
    <div>
      <span @click="signOutGoogle">Exit Google</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ThirdLogin',
  data() {
    return {
      auth2: '',
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.loadGoogle();
      this.initFB();
    }, 200);
  },
  methods: {
    // google
    loadGoogle() {
      const that = this;
      console.log(window.gapi);
      window.gapi.load('auth2', function() {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        window.auth2 = window.gapi.auth2.init({
          client_id: '295411335410-rfpoqls277s5t104b6i1088o9d6rdadu.apps.googleusercontent.com',
          scope: 'profile email',
          // Request scopes in addition to 'profile' and 'email'
          // scope: 'additional_scope'
        });
        that.attachSignin(document.getElementById('customBtn'));
      });
    },
    attachSignin(element) {
      console.log(element.id);
      window.auth2.attachClickHandler(element, {}, this.onSuccess, this.onFailure);
    },
    onSuccess(googleUser) {
      var profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
      var id_token = googleUser.getAuthResponse().id_token;
      console.log(id_token); //将ID令牌发送到您的服务器
    },
    onFailure(error) {
      console.log(error);
    },
    signOutGoogle() {
      // 返回GoogleAuth对象。在调用此方法之前，您必须使用gapi.auth2.init()初始化GoogleAuth对象。
      var GoogleAuth = window.gapi.auth2.getAuthInstance();
      //   console.log(GoogleAuth)
      //   if (GoogleAuth.isSignedIn.get()) {
      //     var profile = GoogleAuth.currentUser.get().getBasicProfile();
      //     console.log('ID: ' + profile.getId());
      //     console.log('Full Name: ' + profile.getName());
      //     console.log('Given Name: ' + profile.getGivenName());
      //     console.log('Family Name: ' + profile.getFamilyName());
      //     console.log('Image URL: ' + profile.getImageUrl());
      //     console.log('Email: ' + profile.getEmail());
      //   }
      GoogleAuth.signOut().then(function() {
        console.log('User signed out.');
      });
      window.gapi.auth2.getAuthInstance().disconnect();
    },
    // facebook
    initFB() {
      window.FB.init({
        appId: '192200776032093', // 这里填入第2步的appid
        cookie: true, // Enable cookies to allow the server to access the session.
        xfbml: true, // Parse social plugins on this webpage.
        version: 'v11.0', // Use this Graph API version for this call.
      });
    },
    FBlogin() {
      console.log(222);
      window.FB.login(function(response) {
        console.log(response, 'respingse');
        if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ');
          window.FB.api('/me', function(response) {
            console.log('Good to see you, ' + response.name + '.');
          });
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      });
    },
    FBCheckLoginState() {
      // Called when a person is finished with the Login Button.
      window.FB.getLoginStatus(function(response) {
        // See the onlogin handler
        if (response.status === 'connected') {
          // The user is logged in and has authenticated your
          // app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed
          // request, and the time the access token
          // and signed request each expire.
          var uid = response.authResponse.userID;
          var accessToken = response.authResponse.accessToken;
          console.log(uid, accessToken);
        } else if (response.status === 'not_authorized') {
          // The user hasn't authorized your application.  They
          // must click the Login button, or you must call FB.login
          // in response to a user gesture, to launch a login dialog.
        } else {
          // The user isn't logged in to Facebook. You can launch a
          // login dialog with a user gesture, but the user may have
          // to log in to Facebook before authorizing your application.
        }
      });
    },
    // apple
    async initApple() {
      console.log(window.AppleID);
      this.loginInApple();
      window.AppleID.auth.init({
        clientId: 'to.bee.m',
        scope: 'name email',
        // response_type: 'code id_token',
        redirectURI: 'https://m.bee.to',
        state: 'initial',
        // nonce: '[NONCE]',
        usePopup: true, //or false defaults to false
      });
      try {
        const data = await window.AppleID.auth.signIn();
        console.log(data)
      } catch (error) {
        //handle error.
        console.log(error)
      }
    },
    loginInApple() {
      //Listen for authorization success
      document.addEventListener('AppleIDSignInOnSuccess', data => {
        console.log(data);
        //handle successful response
      });
      //Listen for authorization failures
      document.addEventListener('AppleIDSignInOnFailure', error => {
        console.log(error, 222);
        //handle error.
      });
    },
  },
};
</script>
<style lang="less" scoped>
.icons {
  max-width: 300px;
  margin: 0 auto;
  img {
    width: 40px;
    margin-bottom: 10px;
  }
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
  }
}
</style>
