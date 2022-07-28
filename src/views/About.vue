<i18n>
{
"en": {
    "en": "Engilish",
    "zh": "Chinese",
    "title": "Help you to uncover the most valuable messages",
    "li-1": "Aggregated",
    "li-2": "Efficient",
    "li-3": "Accurate",
    "li-4": "Autonomous",
    "li-5": "Perpetual",
    "li-6": "Never ending",
    "ph-1": "Bcaca tends to provide indexing and parsing of content, rather than just the content. As you know, most of those news release from media have been touched up, it would be easily misleading by incorrect market signals from that news. We believe that it is very vital for investors to obtain the most instructive information as an index to associate with other relevant message. By gathering all the information in a systematic way, they can finally output the most accurate market signal.",
    "ph-2": "Bcaca use the independent developed 'intelligent content filtering driver' to automatically collect the most promising information through all online channels , and will also publish the web links and sources of those information. We do not make any information as our own product via any particular channel because we believe that only the purest content can help you find more opportunities."
  },
  "zh": {
    "en": "英文",
    "zh": "中文",
    "title": "帮助你挖掘最具价值的内容",
    "li-1": "聚合",
    "li-2": "高效",
    "li-3": "精准",
    "li-4": "自动",
    "li-5": "永久存储",
    "li-6": "永不停止",
    "ph-1": "Bcaca 更倾向于提供消息的索引和解析，而不是消息本身。就像你们知道的，大多数媒体发出来的消息都是经过特殊编撰的，如果你只是看这些消息，这其中就会很容易存在市场信号的误导。我们相信投资者更需要的是将最具市场潜力的消息作为一种索引，从而发现与其相关联的其他讯息，然后将它们形成一个体系，最终成为最准确的市场信号。",
    "ph-2": "Bcaca 采用自主研发的“智能化内容过滤驱动器”，从全网所有渠道自动化采集最有潜力的讯息，并将该条讯息的所有网络链接和来源公开。而不仅仅是去特定的渠道抓取内容，并包装成自己的产物。因为我们认为只有最存粹的内容本身才能帮助你寻找更多的机会。"
  }
}
</i18n>
<template>
  <div class="about">
    <!-- <div class="switch">
      <el-switch
        @change="changeLanuage"
        :value="lang == 'zh'"
        :active-text="$t('zh')"
        :inactive-text="$t('en')"
      >
      </el-switch>
    </div> -->
    <!-- <Section :list="list" /> -->
    <div class="content">
      <div id="about_1" class="pragraph">
        <div class="left">
          <h3 class="title">
            帮助你挖掘最具价值的内容 <br />Help you to uncover the most valuable messages
          </h3>
          <ul class="list">
            <li>聚合 Aggregated</li>
            <li>高效 Efficient</li>
            <li>精准 Accurate</li>
            <li>自动 Autonomous</li>
            <li>永久存储 Perpetual</li>
            <li>永不停止 Never ending</li>
          </ul>
        </div>
        <div class="right center">
          <img
            class="image"
            src="https://cdn-news.jin10.com/e0a25eb9-80f7-4440-a6f2-56259bbc0b43.png/lite"
          />
        </div>
      </div>
      <div id="about_2" class="pragraph">
        <div class="left center">
          <img class="image" src="https://s2.loli.net/2022/07/28/BdIm9Rfv7srzyVT.jpg" />
        </div>
        <div class="right">
          <p class="desc">
            Bcaca
            更倾向于提供消息的索引和解析，而不是消息本身。就像你们知道的，大多数媒体发出来的消息都是经过特殊编撰的，如果你只是看这些消息，这其中就会很容易存在市场信号的误导。我们相信投资者更需要的是将最具市场潜力的消息作为一种索引，从而发现与其相关联的其他讯息，然后将它们形成一个体系，最终成为最准确的市场信号。<br /><br />
            <span
              >Bcaca tends to provide indexing and parsing of content, rather than just the content.
              As you know, most of those news release from media have been touched up, it would be
              easily misleading by incorrect market signals from that news. We believe that it is
              very vital for investors to obtain the most instructive information as an index to
              associate with other relevant message. By gathering all the information in a
              systematic way, they can finally output the most accurate market signal.</span
            >
          </p>
        </div>
      </div>
      <div id="about_3" class="pragraph">
        <div class="left">
          <p class="desc">
            Bcaca
            采用自主研发的“智能化内容过滤驱动器”，从全网所有渠道自动化采集最有潜力的讯息，并将该条讯息的所有网络链接和来源公开。而不仅仅是去特定的渠道抓取内容，并包装成自己的产物。因为我们认为只有最存粹的内容本身才能帮助你寻找更多的机会。<br /><br />Bcaca
            <span
              >use the independent developed 'intelligent content filtering driver' to automatically
              collect the most promising information through all online channels , and will also
              publish the web links and sources of those information. We do not make any information
              as our own product via any particular channel because we believe that only the purest
              content can help you find more opportunities.</span
            >
          </p>
        </div>
        <div class="right center">
          <img class="image" src="https://s2.loli.net/2022/07/28/3PVZvXkYQg85fBq.jpg" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { loadLanguageAsync } from '@/utils/i18n.js';
// import Section from '@/components/section';
import i18n from '@/utils/i18n';
export default {
  name: 'About',
  components: {
    // Section,
  },
  data() {
    return {
      value: true,
      refresh: false,
      list: [],
    };
  },
  computed: {
    lang() {
      return this.$store.state.language;
    },
  },
  created() {
    this.initList();
  },
  methods: {
    initList() {
      this.list = [];
      this.list = [
        {
          name: i18n.t('about.1'),
          link: '#about_1',
        },
        {
          name: i18n.t('about.2'),
          link: '#about_2',
        },
        {
          name: i18n.t('about.3'),
          link: '#about_3',
        },
      ];
    },
    changeLanuage() {
      this.lang == 'en'
        ? loadLanguageAsync('zh').then(() => {
            localStorage.setItem('lanuage', 'zh');
            this.initList();
          })
        : loadLanguageAsync('en').then(() => {
            localStorage.setItem('lanuage', 'en');
            this.initList();
          });
    },
  },
};
</script>
<style lang="less" scoped>
.about {
  margin-bottom: 60px;
}
.switch {
  margin-bottom: 20px;
}
.content {
  padding: 20px;
  background: #fff;
  box-shadow: 0 0 3px 0 #f3f3f3;
  border-radius: 6px;
}
.pragraph {
  display: flex;
  margin-bottom: 80px;
  justify-content: center;
  .left {
    margin-right: 80px;
  }
  .title {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 20px;
  }
  .image {
    width: 300px;
    border-radius: 6px;
    box-shadow: 0 4px 15px 0 rgb(0 0 0 / 30%);
  }
  .desc {
    max-width: 400px;
    line-height: 20px;
    word-break: break-word;
  }
}
.list {
  margin-left: 20px;
  li {
    margin-top: 10px;
    padding-left: 20px;
    position: relative;
    line-height: 20px;
    color: #666666;
    &::before {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      background: #3667a6;
      border-radius: 50%;
      top: 5px;
      left: 0;
    }
  }
}
@media screen and (max-width: 920px) {
  .content {
    margin-top: 20px;
  }
}
@media screen and (max-width: 760px) {
  .about {
    padding: 0 16px;
  }
  .content {
    padding: 10px;
  }
  .switch {
    margin: 20px 0;
  }
  .center {
    text-align: center;
  }
  .pragraph {
    flex-direction: column;
    margin-bottom: 60px;
    .left {
      margin-right: 0;
    }
    .right {
      margin-top: 20px;
    }
  }
}
</style>
