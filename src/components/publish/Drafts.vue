<!--
 * @Author: jianbang
 * @Description: 草稿箱组件
-->
<template>
  <div class="com-drafts flex-align">
    <div class="text-box flex-align">
      <p class="blog-text text-overflow-3">
        {{ data.text }}
      </p>
      <div class="text-bottom flex-align">
        <p class="time">{{ `${data.time} · ${data.power}` }}</p>
        <span class="btn-del">
          Delete
        </span>
      </div>
    </div>
    <div class="img" v-if="data.imgUrls && data.imgUrls.length > 0">
      <img :src="data.imgUrls[0].url" />
      <div class="cover" v-if="data.imgUrls.length >= 9">
        +9
      </div>
    </div>
    <div class="video" v-if="data.video">
      <img :src="data.video.url" />
      <span class="time">
        {{ data.video.time }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComDrafts',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.com-drafts {
  padding: 18px 20px;
  background: #ffffff;
  border-bottom: 1px solid #f6f6f6;
  transition: 0.3s;
  &:hover {
    cursor: pointer;
    background: #f9f9fb;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.04);
  }
  .text-box {
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    height: 89px;
    .blog-text {
      font-family: SFUIText-Regular;
      font-size: 16px;
      color: #333333;
      letter-spacing: 0;
      text-align: justify;
      line-height: 20px;
    }
    .text-bottom {
      width: 100%;
      justify-content: space-between;
      .time {
        font-family: SFUIText-Regular;
        font-size: 12px;
        color: #777f8e;
      }
      .btn-del {
        font-family: SFUIText-Regular;
        font-size: 12px;
        color: #b9bdc7;
        letter-spacing: 0;
        line-height: 16px;
        cursor: pointer;
        transition: 0.3s;
        &:hover {
          color: #ff536c;
        }
      }
    }
  }
  .img {
    width: 120px;
    height: 89px;
    background: #d8d8d8;
    border: 0 solid rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    margin-left: 20px;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .cover {
      background: #d8d8d8;
      background: rgba(0, 0, 0, 0.3);
      border: 0 solid rgba(0, 0, 0, 0.03);
      border-radius: 6px;
      font-family: SFUIText-Regular;
      font-size: 28px;
      color: #ffffff;
      letter-spacing: 0;
      text-align: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .video {
    width: 120px;
    height: 89px;
    background: #d8d8d8;
    border: 0 solid rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    margin-left: 20px;
    overflow: hidden;
    position: relative;
    .time {
      display: inline-block;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ffffff;
      text-align: right;
      text-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 8px;
      right: 12px;
    }
  }
}
</style>
