<!--
 * @Author: lenghui
 * @Description: scroll包裹层 通过一个空元素底部的距离判断是否要继续请求
-->
<template>
  <div class="scroll-wrap" :id="id">
    <div v-if="direction == 'down'">
      <slot name="content"></slot>
    </div>
    <!-- loading状态 -->
    <div v-if="innerLoading && !finished && loadingCon" key="loading" class="loading">
      <loading>
        <span class="loading-text no-flip-over">{{ loadingText || '加载中...' }}</span>
      </loading>
    </div>
    <template v-if="maxLength">
      <!-- 完成状态 -->
      <div
        v-if="finished && length > 0 && length < maxLength && showFinished"
        class="no-more no-flip-over"
      >
        {{ finishedText || `已经到结尾了...` }}
      </div>
      <!-- 查看更多状态 -->
      <!-- <div v-if="finished && length >= maxLength" class="view-more no-flip-over" v-click1="() => {}">
        查看更多
      </div> -->
    </template>
    <template v-else>
      <div v-if="finished && length > 0" class="no-more no-flip-over">
        {{ finishedText || `已经到结尾了...` }}
      </div>
    </template>
    <!-- error状态 -->
    <div v-if="error" @click="clickErrorText" class="error-text no-flip-over">
      {{ errorText || 'error tyr again' }}
    </div>
    <div v-if="direction == 'up'">
      <slot name="content"></slot>
    </div>
    <div ref="placeholder" key="placeholder" class="placeholder" />
  </div>
</template>
<script>
import Loading from './common/Loading';
import tools from '@/utils/tools';
export default {
  name: 'CusScroll',
  props: {
    error: Boolean,
    loading: Boolean,
    loadingCon: {
      type: Boolean,
      default: true,
    },
    length: Number,
    finished: Boolean,
    errorText: String,
    loadingText: String,
    finishedText: String,
    immediateCheck: {
      type: Boolean,
      default: true,
    },
    offset: {
      type: [Number, String],
      default: 200,
    },
    direction: {
      type: String,
      default: 'down',
    },
    // 传false无限制最大长度
    maxLength: {
      type: [Number, Boolean],
      default: 3,
    },
    id: [String, Number],
    showFinished: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    loading: Loading,
  },
  data() {
    return {
      innerLoading: this.loading,
    };
  },
  updated() {
    this.innerLoading = this.loading;
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.scroller) {
        this.scroller = tools.getScroller(this.$el);
      }
      const throttle = this.tools.throttle(this.check);
      this.listenFun = () => {
        throttle();
      };
      const eventNode = this.id ? document.getElementById(this.id) : window;
      eventNode.addEventListener('scroll', this.listenFun, false);
      if (this.immediateCheck) {
        this.check();
      }
    });
  },

  watch: {
    // loading: 'check',
    finished: 'check',
  },

  methods: {
    // 最重要的一点 检查到底部了没
    check() {
      this.$nextTick(() => {
        if (this.innerLoading || this.finished || this.error) {
          return;
        }
        const { $el, scroller, offset, direction } = this;

        // console.log(offset, 'offset');
        let scrollerRect;

        if (scroller.getBoundingClientRect) {
          scrollerRect = scroller.getBoundingClientRect();
        } else {
          scrollerRect = {
            top: 0,
            bottom: scroller.innerHeight,
          };
        }
        // console.log(this.$el, this.scroller);
        const scrollerHeight = scrollerRect.bottom - scrollerRect.top;
        // console.log(scrollerHeight, 'scrollerHeight');
        // console.log(JSON.stringify(scrollerRect), scrollerHeight, 'scroll组件内部');
        /* istanbul ignore next */
        if (!scrollerHeight || this.isHidden($el)) {
          return false;
        }

        let isReachEdge = false;
        const placeholderRect = this.$refs.placeholder.getBoundingClientRect();

        if (direction === 'up') {
          isReachEdge = scrollerRect.top - placeholderRect.top <= offset;
        } else {
          // isReachEdge = placeholderRect.bottom - scrollerRect.bottom <= offset;
          // console.log(placeholderRect.bottom, window.screen.height);
          isReachEdge = placeholderRect.bottom - window.screen.height <= offset;
          // console.log(isReachEdge, 'isReachEdge');
        }
        console.log(isReachEdge, 'isReachEdge');
        if (isReachEdge) {
          this.innerLoading = true;
          // this.$emit('input', true); //修改v-model
          this.$emit('load');
        }
      });
    },
    clickErrorText() {
      this.$emit('update:error', false);
      this.check();
    },
    isHidden(el) {
      const style = window.getComputedStyle(el);
      const hidden = style.display === 'none';
      const parentHidden = el.offsetParent === null && style.position !== 'fixed';
      return hidden || parentHidden;
    },
  },
};
</script>
<style scoped>
.loading-text {
  color: var(--text-7);
  margin-left: 10px;
}
.view-more {
  background: rgba(255, 255, 255, 0);
  box-shadow: 0 0 0 0 #f4f4f4;
  font-size: 15px;
  color: var(--text-2);
  height: 40px;
  text-align: center;
  line-height: 40px;
  background: var(--bg-3);
  /* border-width: 1px;
  border-color: #f9f9f9;
  border-style: solid;
  border-left: none;
  border-right: none; */
}
.no-more {
  text-align: center;
  color: #999999;
}
.loading {
  padding: 20px 0;
}
</style>
