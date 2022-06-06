<template>
  <div class="wrap">
    <div class="con">
      <h2>{{ item.title }}</h2>
      <div class="time">{{ item.time }}</div>
      <template v-for="(itemc, key, index) in item.content">
        <div class="video" v-if="key.split('_')[0] === 'video'" :key="index">
          <video :src="itemc.src" controls="controls" :poster="itemc.cover"></video>
        </div>
        <div class="img" v-else-if="key.split('_')[0] === 'img'" :key="index">
          <img :src="itemc" />
        </div>
        <div class="desc pub-rtl" v-else-if="key.split('_')[0] === 'p'" :key="index">
          {{ itemc }}
        </div>
      </template>
      <div class="btns">
        <button class="prev btn" @click="prev" :disabled="newsId == list[0].id">
          <i class="icon prev-icon" />{{ $t('previous') }}
        </button>
        <button class="next btn" @click="next" :disabled="newsId == list[list.length - 1].id">
          {{ $t('next') }}<i class="icon next-icon" />
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import news_ar from '@/config/news_ar';
export default {
  name: 'NewsItem',
  computed: {
    newsId() {
      return this.$route.params.id;
    },
    lang() {
      return this.$store.state.language;
    },
    list() {
      return this.lang == 'en' ? news_ar : news_ar;
    },
    item() {
      return this.list.find(item => item.id == this.newsId);
    },
    itemIndex() {
      return this.list.findIndex(item => item.id == this.newsId);
    },
  },
  mounted() {
    document.title = this.item.title;
  },
  methods: {
    prev() {
      this.$router.push({
        name: 'newsroomItem',
        params: {
          id: this.list[this.itemIndex - 1].id,
        },
      });
    },
    next() {
      this.$router.push({
        name: 'newsroomItem',
        params: {
          id: this.list[this.itemIndex + 1].id,
        },
      });
    },
  },
};
</script>
<style lang="less">
.con {
  max-width: 1100px;
  margin: 0 auto;
  h2 {
    font-family: Tahoma-Bold;
    font-size: 30px;
    color: #333333;
    letter-spacing: -0.62px;
    text-align: justify;
    margin: 40px 0 30px;
  }
  .time {
    font-family: Tahoma;
    font-size: 14px;
    color: #939393;
    text-align: left;
    margin-bottom: 30px;
  }
  .img {
    width: 100%;
    margin-bottom: 30px;
    margin-top: 30px;
    img {
      width: 100%;
      border-radius: 10px;
      max-height: 616px;
      object-fit: cover;
    }
  }
  .video {
    margin-bottom: 30px;
    margin-top: 30px;
    video {
      width: 100%;
      height: 618px;
      object-fit: cover;
    }
  }
  .desc {
    font-family: Tahoma;
    font-size: 18px;
    color: #666666;
    letter-spacing: -0.38px;
    text-align: justify;
    line-height: 30px;
    white-space: pre-line;
    word-break: break-word;
    // margin-bottom: 60px;
  }
}
.btns {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  margin-top: 30px;
}
.btn {
  background: #ffffff;
  border: 1px solid hsl(0, 0%, 63%);
  border-radius: 6px;
  padding: 8px 14px;
  font-family: Tahoma;
  font-size: 14px;
  color: #939393;
  min-width: 100px;
  cursor: pointer;
  margin: 0 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn:disabled {
  border: 1px solid #d3d3d3;
  color: #d3d3d3;
}

.prev {
  &:hover {
    color: #ffdc10;
    border: 1px solid #ffdc10;
    .prev-icon {
      background: url('../assets/images/web_newsroom_page_icon_Previous_highlight.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
.prev:disabled {
  cursor: not-allowed;
  .prev-icon {
    background: url('../assets/images/web_newsroom_page_icon_Previous_disabled.png') no-repeat;
    background-size: 100% 100%;
  }
  &:hover {
    border: 1px solid #d3d3d3;
    color: #d3d3d3;
  }
}

.next {
  &:hover {
    color: #ffdc10;
    border: 1px solid #ffdc10;
    .next-icon {
      background: url('../assets/images/web_newsroom_page_icon_next_highlight.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
.next:disabled {
  .next-icon {
    background: url('../assets/images/web_newsroom_page_icon_next_disabled.png') no-repeat;
    background-size: 100% 100%;
  }
  &:hover {
    border: 1px solid #d3d3d3;
    color: #d3d3d3;
  }
}

.icon {
  width: 20px;
  height: 20px;
  display: inline-block;
}
.prev-icon {
  background: url('../assets/images/web_newsroom_page_icon_Previous_normal.png') no-repeat;
  background-size: 100% 100%;
  margin-right: 3px;
}
.next-icon {
  background: url('../assets/images/web_newsroom_page_icon_next_normal.png') no-repeat;
  background-size: 100% 100%;
  margin-left: 3px;
}
html[lang='ar'] {
  .icon {
    transform: scaleX(-1);
  }
  .next-icon {
    margin-left: 0;
    margin-right: 3px;
  }
  .prev-icon {
    margin-left: 3px;
    margin-right: 0;
  }
  .con .time {
    text-align: right;
  }
}
</style>
