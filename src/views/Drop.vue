<template>
  <div class="wrap IDO">
    <div class="menu-title hidden-sm-and-down">空投</div>
    <div class="tip">
      提示：空投挖掘板块包括固定回报任务以及拥有潜在空投机会的任务； Bcaca
      仅负责搬运有潜力的任务内容，无法确保任务100%获得回报； 请务必自行对任务内容做详尽调研；
    </div>
    <div class="content">
      <div class="top card">
        <div class="title"></div>
        <div class="type">活动填表</div>
        <div class="pha">
          <div class="line">
            <span class="bold">任务概要</span>
            <p>成为 50 位幸运中奖者之一，赢取 $50 USDT 奖励，总计 $2500 USDT</p>
          </div>
          <div class="line">
            <span class="bold">任务入口</span>
            <p><a class="link">https://galaxy.eco/LuckyBuy/campaign/GCd1ZUtShN</a></p>
          </div>
          <div class="line">
            <span class="bold">教程</span>
            <p>入口链接内自带教程</p>
          </div>
          <div class="line">
            <span class="bold">推荐程度</span>
            <span class="hot">
              <img :src="require('../assets/images/hot.png')" />
              <img :src="require('../assets/images/hot.png')" />
              <img :src="require('../assets/images/hot.png')" />
              <img :src="require('../assets/images/hot.png')" />
            </span>
          </div>
        </div>
        <span class="time">截止日期：2022-09-10</span>
      </div>
      <div class="filter">
        <el-radio-group v-model="type" class="group" size="small">
          <el-radio-button label="1">全部</el-radio-button>
          <el-radio-button label="2">潜力交互</el-radio-button>
          <el-radio-button label="3">抽奖系列</el-radio-button>
          <el-radio-button label="4">白名单</el-radio-button>
          <el-radio-button label="5">活动填表</el-radio-button>
        </el-radio-group>
        <el-input
          v-model="keywords"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          class="serach"
          size="medium"
          type="search"
          @change="Search"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="list">
        <div class="card" v-for="item in 10" :key="item">
          <div class="title"></div>
          <div class="type">活动填表</div>
          <div class="pha">
            <div class="line">
              <span class="bold">任务概要</span>
              <p>成为 50 位幸运中奖者之一，赢取 $50 USDT 奖励，总计 $2500 USDT</p>
            </div>
            <div class="line">
              <span class="bold">任务入口</span>
              <p><a class="link">https://galaxy.eco/LuckyBuy/campaign/GCd1ZUtShN</a></p>
            </div>
            <div class="line">
              <span class="bold">教程</span>
              <p>入口链接内自带教程</p>
            </div>
            <div class="line">
              <span class="bold">推荐程度</span>
              <span class="hot">
                <img :src="require('../assets/images/hot.png')" />
                <img :src="require('../assets/images/hot.png')" />
                <img :src="require('../assets/images/hot.png')" />
                <img :src="require('../assets/images/hot.png')" />
              </span>
            </div>
          </div>
          <span class="time">截止日期：2022-09-10</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Drop',
  data() {
    return {
      type: 1,
      keywords: '',
    };
  },
  created() {},
  methods: {},
};
</script>
<style lang="less">
.IDO {
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #4465a2;
    border-color: #4465a2;
  }
}
</style>
<style lang="less" scoped>
.wrap {
  max-width: 1120px;
  margin: 0 auto;
  border-right: 1px solid hsla(0, 0%, 53%, 0.2);
}
.menu-title {
  padding: 20px 20px;
  font-size: 20px;
  font-weight: 600;
  line-height: 20px;
  border-bottom: 1px solid hsla(0, 0%, 53%, 0.2);
  color: #010102;
}
.tip {
  max-width: 680px;
  margin: 30px auto;
  font-size: 14px;
  color: #666;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  align-items: flex-start;
}
.top {
  padding-right: 80px;
}
.card {
  width: 100%;
  padding: 20px;
  position: relative;
  border-color: #e5e7eb;
  box-shadow: 0 4px 12px #0000000f, 0 0 2px #0000001a;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  .line {
    display: flex;
    margin-bottom: 10px;
    font-size: 14px;
    word-break: break-word;
    .bold {
      font-weight: bold;
      white-space: nowrap;
      margin-right: 16px;
      min-width: 64px;
      text-align: right;
      font-size: 14px;
    }
  }
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // padding-left: 20px;
  }
  .time {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
    color: #666;
  }
  .hot {
    display: flex;
    img {
      width: 16px;
      margin: 0 2px;
    }
  }
}
.filter {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
}
.group {
  padding: 20px 0;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 2;
  width: 100%;
  margin: 10px 0;
}
.link {
  color: #4465a2;
}
.type {
  position: absolute;
  background: linear-gradient(45deg, #5f73e6, #4465a2);
  right: -40px;
  padding: 4px 50px;
  transform: rotate(40deg);
  font-size: 14px;
  color: #fff;
}
.type-1 {
  background: linear-gradient(45deg, #8bc34a, #cddc39);
}

.list {
  .card {
    // padding-right: 80px;
    max-width: 660px;
    margin-bottom: 20px;
    .pha {
      padding-right: 80px;
    }
  }
}

@media (max-width: 767px) {
}
@media (max-width: 992px) {
  .group {
    top: 46px;
    display: flex;
    justify-content: center;
  }
  .content {
    padding: 0 10px;
  }
  .tip {
    padding: 0 16px;
  }
  .type {
    transform: rotate(40deg) scale(0.8);
    font-size: 14px;
    color: #fff;
    top: 12px;
    width: 56px;
    box-sizing: content-box;
    text-align: center;
    right: -50px;
  }
  .list .card {
    .pha {
      padding-right: 34px;
    }
  }
}
@media (max-width: 1200px) {
}
@media (min-width: 768px) {
}
</style>
