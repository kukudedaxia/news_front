<template>
  <div class="wrap">
    <div class="item" v-for="(item, index) in list" :key="index" @click="go(item)">
      <h2 class="text-overflow-2">{{ item.title }}</h2>
      <div class="content">
        <div>
          <div class="desc text-overflow-3 pub-rtl">
            <div v-for="(oItem, key, index) in item.content" :key="index">
              {{ key.split('_')[0] === 'p' ? oItem : '' }}
            </div>
          </div>
          <div class="time">{{ item.time }}</div>
        </div>
        <div class="img" v-if="item.cover">
          <img :src="item.cover" />
        </div>
      </div>
    </div>
    <el-pagination
      class="pagination"
      background
      :page-size="10"
      layout="prev, pager, next, slot"
      :total="list.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
    >
      <template v-if="list.length > 10">
        <el-input type="number" v-model="jumpNum" class="custom-input"></el-input>
        <div class="jump" @click="jump">{{ $t('jump') }}</div>
      </template>
      <!-- <input type="number" class="custom-input" /> -->
    </el-pagination>
  </div>
</template>
<script>
import news_ar from '@/config/news_ar';
export default {
  name: 'News',
  data() {
    return {
      currentPage: 1,
      jumpNum: '',
    };
  },
  computed: {
    lang() {
      return this.$store.state.language;
    },
    list() {
      return this.lang == 'en' ? news_ar : news_ar;
    },
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    jump() {
      if (this.jumpNum > Math.ceil(this.list.length / 10)) {
        this.currentPage = Math.ceil(this.list.length / 10);
      } else {
        this.currentPage = Number(this.jumpNum);
      }
    },
    go(item) {
      this.$router.push({
        name: 'newsroomItem',
        params: {
          id: item.id,
        },
      });
    },
  },
};
</script>
<style lang="less">
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #ffdc10;
  color: #ffdc10;
  border-radius: 50%;
  color: #333;
  width: 30px;
  height: 30px;
  line-height: 31px;
  margin: 0 10px;
}
.el-pager {
  display: flex;
  align-items: center;
}
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #333333;
}
.el-pagination.is-background .el-pager li {
  background-color: transparent;
  color: #666666;
  height: 34px;
  line-height: 34px;
  font-size: 16px;
}
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev {
  background: #ffffff;
  border: 1px solid #a0a0a0;
  border-radius: 6px;
  width: 34px;
  height: 34px;
  &:hover {
    border: 1px solid #ffdc10;
    color: #ffdc10;
  }
}
.el-pagination.is-background .btn-prev:disabled,
.el-pagination.is-background .btn-next:disabled {
  color: #d3d3d3;
  border: 1px solid #d3d3d3;
}
html[lang='ar'] {
  .el-pagination .btn-prev .el-icon,
  .el-pagination .btn-next .el-icon {
    transform: scaleX(-1);
  }
}
</style>
<style lang="less" scoped>
.wrap {
  text-align: left;
  max-width: 1100px;
  margin: auto;
}
.item {
  margin-top: 40px;
  cursor: pointer;
  h2 {
    font-family: Tahoma-Bold;
    font-size: 24px;
    color: #333333;
    letter-spacing: -0.5px;
    margin-bottom: 14px;
  }
  .content {
    display: flex;
  }
  .desc {
    font-family: Tahoma;
    font-size: 18px;
    color: #666666;
    letter-spacing: -0.38px;
    text-align: justify;
    line-height: 30px;
    margin-bottom: 14px;
    white-space: pre-line;
    word-break: break-word;
    height: 90px;
  }
  .time {
    font-family: Tahoma;
    font-size: 14px;
    color: #939393;
  }
  .img {
    margin-left: 30px;
    img {
      border-radius: 10px;
      width: 214px;
      height: 120px;
      object-fit: cover;
    }
  }
}
.pagination {
  margin: 60px 0 40px;
  display: flex;
  align-items: center;
}
.custom-input {
  border: 1px solid #d3d3d3;
  border-radius: 6px;
  border-radius: 6px;
  width: 58px;
  height: 34px;
  margin: 0 20px;
  overflow: hidden;

  &:focus {
    border: 1px solid #ffdc10;
  }
  &:hover {
    border: 1px solid #ffdc10;
  }
  /deep/.el-input__inner {
    padding: 0 7px;
    height: 100%;
    border: none;
    text-align: left;
  }
}
.jump {
  font-size: 14px;
  color: #939393;
  background: #ffffff;
  border: 1px solid #a0a0a0;
  border-radius: 6px;
  padding: 6px 11px;
  cursor: pointer;
  height: 34px;
  &:hover {
    color: #ffdc10;
    border: 1px solid #ffdc10;
  }
}
html[lang='ar'] {
  .item {
    .img {
      margin-left: 0;
      margin-right: 30px;
    }
    .time {
      text-align: right;
    }
    h2 {
      text-align: right;
    }
  }
}
</style>
