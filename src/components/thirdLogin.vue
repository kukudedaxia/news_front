<template>
  <div class="wrap">
    <el-row class="icons">
      <div class="item" @click="FBlogin">
        <img :src="require('../assets/images/facebook.png')" />
      </div>
      <div class="item">
        <div id="customBtn" />
        <img :src="require('../assets/images/google.png')" />
      </div>
      <div class="item" @click="loginInApple">
        <img :src="require('../assets/images/apple.png')" />
      </div>
    </el-row>
    <!-- <div class="g_id_signout">Sign Out</div>
    <div>
      <span @click="signOutGoogle">Exit Google</span>
    </div> -->
    <!-- <div
      id="appleid-signin"
      class="signin-button"
      data-mode="logo-only"
      data-color="black"
      data-border="true"
      data-type="sign-in"
    ></div> -->
  </div>
</template>
<script>
import Cookies from 'js-cookie';
export default {
  name: 'ThirdLogin',
  data() {
    return {
      auth2: '',
    };
  },
  created() {
    this.LoadJS('https://accounts.google.com/gsi/client', this.initNewgoogle);
  },
  mounted() {
    // this.initNewgoogle();
    // console.log(window.google);
    // this.LoadJS('https://accounts.google.com/gsi/client', this.initNewgoogle);
    setTimeout(() => {
      this.initApple();
      this.initFB();
    }, 10);
  },
  methods: {
    LoadJS(url, callback) {
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.src = url;
      var done = false;
      script.onload = script.onreadystatechange = function() {
        if (
          !done &&
          (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')
        ) {
          done = true;
          callback();
          script.onload = script.onreadystatechange = null;
          head.removeChild(script);
        }
      };
      head.appendChild(script);
    },
    initNewgoogle() {
      window.google.accounts.id.initialize({
        client_id: '323627425448-i3697bcdimd39k3qrdqcp85iju447s1v.apps.googleusercontent.com',
        // client_id: '295411335410-rfpoqls277s5t104b6i1088o9d6rdadu.apps.googleusercontent.com',
        context: 'signin',
        ux_mode: 'popup',
        skip_prompt_cookie: 'sid',
        callback: response => {
          console.log(response);
          this.thirdLogin('2', response);
        },
      });
      var em = document.getElementById('customBtn');
      window.google.accounts.id.renderButton(em, {
        theme: 'outline',
        size: 'large',
        type: 'icon',
        shape: 'circle',
      });
      // window.google.accounts.id.prompt(notification => {
      //   console.log(notification.isNotDisplayed(), notification.isSkippedMoment(), 222);
      //   if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      //     // try next provider if OneTap is not displayed or skipped
      //     console.log('skip');
      //   }
      // });
    },
    thirdLogin(type, data) {
      // const that = this;
      let accesstoken = '';
      let thirduid = '123';
      if (type == '2') {
        accesstoken = data.credential;
        this.$store.commit('setLoginType', 'google');
      } else if (type == '3') {
        accesstoken = data.authorization.id_token;
        this.$store.commit('setLoginType', 'apple');
      } else {
        accesstoken = data.authResponse.accessToken;
        thirduid = data.authResponse.userID;
        this.$store.commit('setLoginType', 'facebook');
      }

      console.log(accesstoken, 'accesstoken');
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: '/sign/api/thirdlogin',
          data: {
            entry: 'sinbad',
            site: type,
            accesstoken,
            thirduid: thirduid,
            vid: window.$CONFIG ? window.$CONFIG.user : '',
          },
        },
        onSuccess: async res => {
          console.log(res, 'thirdLogin');
          const uid = res.data.user.id;
          // const replaceUrl = that.$route.query.redirect || '/';
          Cookies.set('uid', uid);
          if (process.env.NODE_ENV === 'production') {
            Cookies.set('SUB', res.data.gsid, {
              domain: process.env.VUE_APP_DOMAIN,
            });
          } else {
            Cookies.set('SUB', res.data.gsid);
          }

          await this.$store.dispatch('getUser', uid);
          this.$router.push({ path: 'live' });
        },
        onFail: res => {
          if (res.error_code == 30070) {
            this.$message.error('You have no permission');
          } else {
            this.$message.error(res.error);
          }
        },
      });
    },
    // google
    // loadGoogle() {
    //   const that = this;
    //   console.log(window.gapi);
    //   window.gapi.load('auth2', function() {
    //     // Retrieve the singleton for the GoogleAuth library and set up the client.
    //     window.auth2 = window.gapi.auth2.init({
    //       client_id: '323627425448-222g5935fc50q54ubabqkjjdfj4g121v.apps.googleusercontent.com',
    //       scope: 'profile email',
    //       // Request scopes in addition to 'profile' and 'email'
    //       // scope: 'additional_scope'
    //     });
    //     that.attachSignin(document.getElementById('customBtn'));
    //   });
    // },
    // attachSignin(element) {
    //   console.log(element.id);
    //   window.auth2.attachClickHandler(element, {}, this.onSuccess, this.onFailure);
    // },
    // onSuccess(googleUser) {
    //   var profile = googleUser.getBasicProfile();
    //   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //   console.log('Name: ' + profile.getName());
    //   console.log('Image URL: ' + profile.getImageUrl());
    //   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    //   var id_token = googleUser.getAuthResponse().id_token;
    //   console.log(id_token); //将ID令牌发送到您的服务器
    // },
    // onFailure(error) {
    //   console.log(error);
    // },
    signOutGoogle() {
      // 返回GoogleAuth对象。在调用此方法之前，您必须使用gapi.auth2.init()初始化GoogleAuth对象。
      // var GoogleAuth = window.gapi.auth2.getAuthInstance();
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
      // GoogleAuth.signOut().then(function() {
      //   console.log('User signed out.');
      // });
      window.google.accounts.id.cancel();
      window.google.accounts.id.disableAutoSelect();
      console.log(window.google, 'logoutgoogle');
      // Cookies.remove('g_state');
      // window.google.accounts.id.cancel();
      // window.gapi.auth2.getAuthInstance().disconnect();
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
      const that = this;
      window.FB.login(function(response) {
        console.log(response, 'respingse');
        if (response.authResponse) {
          that.thirdLogin('1', response);
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
      window.AppleID.auth.init({
        clientId: 'to.bee.m',
        scope: 'name email',
        // response_type: 'code id_token',
        redirectURI: 'https://bee.to/sign/api/callback',
        state: 'initial',
        // nonce: '[NONCE]',
        usePopup: true, //or false defaults to false
      });
      this.listenApple();
    },
    async loginInApple() {
      try {
        const data = await window.AppleID.auth.signIn();
        this.thirdLogin('3', data);
        console.log(data, 'loginapple');
      } catch (error) {
        //handle error.
        console.log(error);
      }
    },
    listenApple() {
      //Listen for authorization success
      // const that = this;
      document.addEventListener('AppleIDSignInOnSuccess', data => {
        console.log(data, 'apple');
        // that.thirdLogin('3',data);
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
<style lang="less">
#customBtn {
  position: absolute;
  width: 48px;
  height: 48px;
  opacity: 0;
  > div {
    width: 100%;
    height: 100%;
  }
}
</style>
<style lang="less" scoped>
.icons {
  max-width: 330px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  img {
    width: 48px;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    width: 48px;
    height: 48px;
  }
}
</style>
