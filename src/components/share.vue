<template>
  <div v-if="loaded">
    <el-popover
      width="140"
      :trigger="pc ? 'hover' : 'click'"
      placement="bottom"
      :close-delay="100"
      ref="popoverRef"
    >
      <a class="link" target="_blank" slot="reference"><i class="el-icon-share"></i>分享</a>
      <div class="shares">
        <div class="share-item">
          <span class="line" @click="copy"><i class="icon copylink"></i>复制链接</span>
          <input
            id="copy"
            readonly
            type="text"
            value=""
            style="position: fixed; top: -20px; left: 0; opacity: 0; z-index: -10"
          />
        </div>
        <div class="share-item hidden-md-and-up">
          <span class="line" @click="showBg"><i class="icon wechat"></i>分享到微信</span>
        </div>
        <div class="share-item hidden-md-and-down">
          <span class="line"><i class="icon qq"></i>分享到QQ</span>
        </div>
        <div class="share-item hidden-md-and-up">
          <span class="line" @click="showBg"><i class="icon qq"></i>分享到QQ</span>
        </div>
        <div class="share-item">
          <span class="line" @click="shareToSinaWeiBo"><i class="icon sina"></i>分享到微博</span>
        </div>
        <div class="share-item hidden-md-and-up">
          <span class="line mt-0"><i class="icon image"></i>生成长图</span>
        </div>

        <div class="share-item hidden-md-and-down">
          <img
            src="https://img.bee-cdn.com/large/3b9ae203lz1gmm6bogjkxj203v03v741.jpg"
            alt="code"
            class="code"
            loading="lazy"
          />
          <span class="line"><i class="icon wechat"></i>微信扫一扫</span>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: 'Share',
  props: {
    link: String,
  },
  data() {
    return {
      loaded: false,
      pc: false,
    };
  },
  created() {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.pc = false;
      // 移动端操作
    } else {
      this.pc = true;
      // PC端操作
    }
    this.loaded = true;
  },
  methods: {
    copy() {
      const inputElement = document.getElementById('copy');
      inputElement.value = this.link;
      inputElement.select();
      document.execCommand('Copy');
      this.$message('复制成功');
      this.$refs.popoverRef.doClose();
    },
    shareToSinaWeiBo(title, url, pic) {
      this.$refs.popoverRef.doClose();
      var param = {
        url: url || 'www.baidu.com',
        /*分享地址(可选)*/
        type: '3',
        count: '1',
        /** 是否显示分享数，1显示(可选)*/
        appkey: '',
        /** 您申请的应用appkey,显示分享来源(可选)*/
        title: title,
        /** 分享的文字内容(可选，默认为所在页面的title)*/
        pic: pic || '',
        /**分享图片的路径(可选)*/
        ralateUid: '',
        /**关联用户的UID，分享微博会@该用户(可选)*/
        rnd: new Date().valueOf(),
      };
      var temp = [];
      for (var p in param) {
        temp.push(p + '=' + encodeURIComponent(param[p] || ''));
      }
      var targetUrl = 'http://service.weibo.com/share/share.php?' + temp.join('&');
      window.open(targetUrl, 'sinaweibo', 'height=800, width=800');
    },
    showBg() {
      this.$refs.popoverRef.doClose();
      this.$store.dispatch('changeOverlay', true);
    },
  },
};
</script>
<style lang="less">
.overlay {
  z-index: 999 !important;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  .info {
    color: #409eff;
    font-size: 16px;
    p {
      margin-bottom: 10px;
    }
  }
}
</style>
<style lang="less" scoped>
// 分享
.code {
  width: 100%;
}
.link {
  color: #409eff;
  cursor: pointer;
  margin-right: 20px;
  &:hover {
    text-decoration: underline;
  }
  i {
    margin-right: 6px;
  }
}

.line {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  color: #999;
  &:hover {
    color: #333;
  }
}
.icon {
  width: 20px;
  height: 20px;
  margin-right: 4px;
}
.wechat {
  background: url('~@/assets/images/wechat.png') no-repeat;
  background-size: 100% 100%;
  display: inline-block;
}
.qq {
  background: url('~@/assets/images/qq.png') no-repeat;
  background-size: 100% 100%;
  display: inline-block;
}
.copylink {
  background: url('~@/assets/images/copylink.png') no-repeat;
  background-size: 100% 100%;
  display: inline-block;
}
.sina {
  background: url('~@/assets/images/sina.png') no-repeat;
  background-size: 100% 100%;
  display: inline-block;
}
.image {
  background: url('~@/assets/images/image.png') no-repeat;
  background-size: 100% 100%;
  display: inline-block;
}
.mt-0 {
  margin-bottom: 0;
}
.overlay {
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  .info {
    color: #409eff;
    font-size: 16px;
    p {
      margin-bottom: 10px;
    }
  }
}
</style>
