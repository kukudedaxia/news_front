<template>
  <div class="home">
    <div class="content">
      <div class="left">
        <TimeLine :channels="channels" />
      </div>
      <!-- <div class="right">
        <Top />
      </div> -->
    </div>
  </div>
</template>

<script>
// import Top from '../components/home/top';
import TimeLine from '../components/timeline.vue';
export default {
  name: 'Home',
  components: {
    // Top,
    TimeLine,
  },
  data() {
    return {
      scrollTop: 0,
      sticky: false,
      top: 0, //让右边固定
      channels: [],
    };
  },
  computed: {
    lang() {
      return this.$store.state.language;
    },
  },
  created() {
    this.getChannel();
  },
  methods: {
    getChannel() {
      this.$store.dispatch('ajax', {
        req: {
          url: 'channels',
          params: {
            page: 1,
            pageSize: 100,
          },
        },
        onSuccess: res => {
          this.channels = this.channels.concat(res.data);
          if (res.data.length > 0) {
            this.$store.commit('setChannel', this.channels[0].id);
          }
        },
      });
    },
  },
  activated() {
    console.log('进入前', this.scrollTop);
    this.$nextTick(() => {
      document.documentElement.scrollTop = this.scrollTop;
    });
  },
  beforeRouteLeave(to, from, next) {
    console.log(document.documentElement.scrollTop, '离开前');
    this.scrollTop = document.documentElement.scrollTop;
    next();
    // ...
  },
};
</script>
<style lang="less" scoped>
.home {
  max-width: 1020px;
  margin: 0 auto;
  margin-bottom: 60px;
  border-radius: 6px;
}
.content {
  display: flex;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  .left {
    // width: 800px;
    width: 100%;
    background: #fff;
    padding: 20px;
    border: 1px solid #e7eaf2;
    border-radius: 6px;
  }
  .right {
    width: 300px;
    min-height: 1000px;
    background: transparent;
    margin-left: 20px;
  }
}
.sticky {
  position: sticky;
  z-index: 99;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
@media screen and (max-width: 1080px) {
  .home {
    margin-bottom: 0;
  }
  .content {
    flex-direction: column-reverse;
    .left {
      width: 100%;
      padding: 12px;
      min-height: calc(100vh - 160px);
      border: none;
      border-radius: 0;
    }
    .right {
      width: 100%;
      margin-right: 0;
      display: none;
    }
  }
}
</style>
