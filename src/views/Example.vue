<template>
  <div>
    <div class="item">
      <div class="title">BCACA智能机器人</div>
      <div class="sub_title">快速查价、一键跟踪、群友共享、提升市场敏锐力、超越99%的韭菜</div>
      <div class="content">
        <div class="fixed">范例</div>
        <div class="imgs">
          <div>
            <div class="img-title">发出监控<span class="arrow" /></div>
            <img :src="require('../assets/images/example/1.png')" />
          </div>
          <div>
            <div class="img-title">被动喂投<span class="arrow" /></div>
            <img :src="require('../assets/images/example/2.png')" />
          </div>
          <div>
            <div class="img-title">迅速查价<span class="arrow" /></div>
            <img :src="require('../assets/images/example/3.png')" />
          </div>
        </div>
        <div class="button">进入使用详细教程</div>
      </div>
    </div>
    <div class="item">
      <div class="title">BCACA自定义监控系统</div>
      <div class="sub_title">
        迅速跟踪监控discord、twitter、medium……以及各种圈内媒体的作者与特定内容
      </div>
      <div class="content">
        <div class="fixed">范例</div>
        <div class="imgs">
          <div>
            <div class="img-title">灵活配置监控<span class="arrow" /></div>
            <img :src="require('../assets/images/example/4.jpeg')" />
          </div>
          <div>
            <div class="img-title">极速信息喂投<span class="arrow" /></div>
            <img :src="require('../assets/images/example/5.jpeg')" />
          </div>
        </div>
        <div class="button">进入使用详细教程</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Example',
  data() {},
};
</script>
<style lang="less" scoped>
.item {
  .title {
    font-size: 20px;
    margin: 20px auto 16px;
    text-align: center;
    letter-spacing: 1px;
    font-weight: bold;
    color: #4467a4;
  }
  .sub_title {
    font-size: 14px;
    padding: 0 20px;
    color: #666;
    text-align: center;
    margin-bottom: 10px;
  }
  .content {
    margin: 0 20px;
    background: #fff;
    box-shadow: 0 4px 12px #0000000f, 0 0 2px #0000001a;
    border-radius: 10px;
    padding: 16px 16px 30px 16px;
    position: relative;
  }
  .fixed {
    position: absolute;
    left: 0;
    background: #4467a4;
    color: #fff;
    padding: 2px 16px;
    font-weight: bold;
    font-size: 15px;
    border-radius: 0px 0px 10px;
  }
  .imgs {
    padding-top: 30px;
    text-align: center;
  }
  .img-title {
    font-weight: bold;
    color: #4467a4;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    width: 300px;
    margin: 10px 0;
    border-radius: 6px;
    border: 1px solid #ddd;
  }
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60%;
    margin: 0 auto;
    padding: 6px;
    background: #4465a2;
    border-radius: 20px;
    color: #fff;
  }
  .arrow {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('../assets/images/example/arrow.png') no-repeat;
    background-size: 100% 100%;
    margin-left: 6px;
  }
}
</style>
