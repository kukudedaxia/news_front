<template>
  <div ref="text" :class="['desc', data.raw_message_zh ? 'text-overflow-6' : 'text-overflow-4']">
    <template v-if="data.raw_message_zh">
      <div class="flex">
        <p><span class="bold">[译文]&nbsp;</span>{{ data.raw_message_zh }}</p>
      </div>
    </template>
    <template v-if="data.raw_message_zh">
      <br />
    </template>
    <div :class="[{ small: data.raw_message_zh }, 'flex']">
      <!-- <span class="hot" v-if="index % 3 == 0">精</span> -->

      <p :class="[{ 'text-overflow-1': over2 }]">
        <span class="bold">[原文]&nbsp;</span>{{ data.raw_message }}
      </p>
    </div>
  </div>
</template>
<style lang="less">
.text-line {
  font-size: 16px;
  line-height: 24px;
  word-break: break-word;
  font-family: 'Tahoma';
}
.text-lines {
  font-size: 16px;
  line-height: 24px;
  font-size: 16px;
  word-break: break-word;
  font-family: 'Tahoma';
}
</style>
<script>
export default {
  name: 'Texts',
  props: {
    data: Object,
  },
  data() {
    return {
      lineNum: 4,
      over2: false, //第二部分超过
    };
  },
  created() {
    this.calculateLine();
  },
  methods: {
    calculateLine() {
      this.$nextTick(() => {
        const lineHeight = 24;
        if (this.data.raw_message) {
          this.check(this.data.raw_message_zh, this.data.raw_message, lineHeight);
        }
      });
    },
    checkLongs(str) {
      const dom = document.createElement('p');
      dom.setAttribute('class', 'text-line');
      dom.innerHTML = str;
      dom.style.width = this.$refs.text.offsetWidth + 'px';
      document.body.appendChild(dom);
      this.width += dom.offsetWidth;
      const height = dom.offsetHeight;
      document.body.removeChild(dom);
      return height;
    },
    // 超过四行
    check(val1, val2, lineHeight) {
      const height1 = this.checkLongs(val1);
      const height2 = this.checkLongs(val2);
      // console.log(height1, height2, lineHeight);
      if (height1 > this.lineNum * lineHeight) {
        // console.log('第一部分超过');
        this.modifyText(val1, lineHeight, 1);
        this.over2 = true;
      } else if (height1 + height2 > this.lineNum * lineHeight) {
        // console.log('第二部分超过');
        if (this.data.raw_message_zh) {
          this.over2 = true;
        } else {
          this.modifyText(val2, lineHeight, 2);
        }
      }
    },
    // 修改文字内容
    modifyText(str, lineHeight, num) {
      const dom = document.createElement('p');
      dom.setAttribute('class', 'text-lines');
      document.body.appendChild(dom);
      dom.style.width = this.$refs.text.offsetWidth + 'px';
      let arr = str.split('');
      let flag = false;
      let index = 0;
      const lineNum = this.data.raw_message_zh ? this.lineNum - 1 : this.lineNum;
      // console.log(lineNum, 'lineNum');
      for (let i = 0; i < arr.length; i++) {
        dom.innerHTML += arr[i] + '';
        if (dom.offsetHeight > lineNum * lineHeight) {
          index = i - 1;
          flag = true;
          break;
        }
      }
      let newStr = '';
      let newStr1 = '';
      for (let i = 0; i <= index; i++) {
        newStr += arr[i] + '';
        if (i <= index - 10) {
          newStr1 += arr[i] + '';
        }
      }
      if (flag) {
        // let newText = newStr;
        dom.innerHTML = newStr + '...';
        // 限制加上省略号超过两行
        if (dom.offsetHeight > lineNum * lineHeight) {
          const dom1 = document.createElement('p');
          dom1.setAttribute('class', 'text-lines');
          document.body.appendChild(dom1);
          dom1.innerHTML = newStr1;
          if (dom1.offsetHeight < (lineNum - 1) * lineHeight) {
            dom.innerHTML = newStr1 + '\n...';
          } else {
            dom.innerHTML = newStr1 + '...';
          }
          document.body.removeChild(dom1);

          // dom.innerHTML = newStr1 + '...';
          // newText = newStr1;
        }
        // 除了更改文字长度，还需要把实体不满足的去掉
        if (num == 1) {
          this.data.raw_message_zh = dom.innerHTML;
        } else {
          this.data.raw_message = dom.innerHTML;
        }
      }
      document.body.removeChild(dom);
    },
  },
};
</script>
<style lang="less" scoped>
.desc {
  font-size: 16px;
}
.bold {
  font-weight: bold;
  color: #3667a6;
}
.flex {
  p {
    // display: inline-flex;
    word-break: break-word;
    line-height: 24px;
  }
  > span {
    word-break: keep-all;
    margin-right: 4px;
  }
}
.small {
  p {
    font-size: 14px;
    color: #666;
  }
}
</style>
