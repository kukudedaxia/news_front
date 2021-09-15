<!--
 * @Author: jianbang
 * @Description: 发布器组件
-->
<template>
  <div class="com-publisher">
    <el-input
      type="textarea"
      :autosize="{ minRows: 5, maxRows: 10 }"
      placeholder="Express freely…"
      ref="textareaId"
      id="textareaId"
      v-model="textarea"
      class="textarea"
      @blur="onInputBlur"
      @focus="onInputFocus"
    >
    </el-input>
    <div class="bottom flex-align">
      <ul class="operation-box flex-align">
        <li @click="uploadImgShow = true">
          <img src="@/assets/images/publisher/compose_toolbar_picture@3x.png" />
        </li>
        <li @click="uploadVideoShow = true">
          <img src="@/assets/images/publisher/compose_toolbar_video@3x.png" />
        </li>
        <li @click="addMention">
          <img src="@/assets/images/publisher/compose_toolbar_mention@3x.png" />
        </li>
        <li @click="addTopics">
          <img src="@/assets/images/publisher/compose_toolbar_topics@3x.png" />
        </li>
      </ul>
      <div class="inform-box">
        <span class="text-length" v-show="textareaLen >= 9990">{{ 10000 - textareaLen }}</span>
        <el-dropdown
          trigger="click"
          @command="handleCommand"
          @visible-change="visibleChangeHandler"
          class="select"
        >
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right" ref="dropdownId"></i>{{ selectVal }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="item.name" v-for="item in selectList" :key="item.id">{{
              item.name
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" round size="small" :disabled="btnDisabled" class="inform-box_btn"
          >Release</el-button
        >
      </div>
    </div>
    <el-divider v-if="uploadImgShow"></el-divider>
    <transition name="fade_top">
      <upload-image @onCloseImgUpload="onCloseImgUpload" v-if="uploadImgShow"></upload-image>
    </transition>
      <el-divider v-if="uploadVideoShow"></el-divider>
    <transition name="fade_top">
      <UploadV v-if="uploadVideoShow" @onClose="onCloseVideoUpload"></UploadV>
    </transition>
    <transition name="fade">
      <Popover
        v-show="popoverShow"
        :type="popoverType"
        class="popover"
        id="popoverId"
        @onItemClick="onItemClick"
      ></Popover>
    </transition>
  </div>
</template>

<script>
import Popover from '@/components/publish/Popover';
import UploadImage from '@/components/publish/UploadImage';
import UploadV from '@/components/publish/UploadV';

import '../../assets/sdk/jquery.caret';
import $ from 'jquery';
export default {
  components: {
    Popover,
    'upload-image': UploadImage,
    UploadV,
  },
  data() {
    return {
      textarea: '',
      selectVal: 'Public',
      selectList: [
        {
          id: 1,
          name: 'Public',
        },
        {
          id: 2,
          name: 'Followers',
        },
        {
          id: 3,
          name: 'Friends',
        },
        {
          id: 4,
          name: 'Only me',
        },
      ],
      // 发布器光标离 @ # 最近的坐标
      cursorCoordinate: {
        left: 0,
        top: 0,
      },
      popoverShow: false,
      popoverType: '', // # topic 、 @ user
      uploadImgShow: false,
      // 输入框的偏移量
      textareaOffset: {
        top: 0,
        left: 0,
      },
      // 输入框的光标所在下标
      focusIndex: 0,
      uploadVideoShow: true,
    };
  },
  watch: {
    // 监听发布器文本变化
    textarea(val) {
      /**
       * 1. 获取光标所在下标
       * 2. 检测光标的前一位字符是否为 @、# ; 如果是，则弹出对应的popover
       * 3. 选择完成后，需要在后面增加一个空格，以表示完成输入
       * // ---- 待完善 ---- //
       * 1. 需要监听光标的移动
       * 2. 当光标在@、#后一位，则弹出popover
       * 3. 如果光标在@、#后不存在空格的字符串中的任意位置。则提示敲击空格完成输入
       * 4. popover选项支持键盘选择
       */
      this.$nextTick(() => {
        this.getFocusIndex();
        const letter = val.charAt(this.focusIndex - 1);
        if (letter === '@' || letter === '#') {
          this.popoverType = letter === '@' ? 'user' : 'topic';
          Object.assign(this.cursorCoordinate, $('.el-textarea__inner').caret('offset'));
          this.$nextTick(() => {
            this.popoverPosition();
            setTimeout(() => {
              this.popoverShow = true;
            }, 100);
          });
        } else {
          this.popoverShow = false;
        }
      });
    },
  },
  computed: {
    textareaLen() {
      return this.textarea.length;
    },
    btnDisabled() {
      return this.textareaLen > 0 ? false : true;
    },
  },
  mounted() {
    // 设置textarea不检查单词拼写
    this.$refs.textareaId.$el.spellcheck = false;
    // 获取textarea的左、上偏移量
    this.textareaOffset = {
      top: $('#textareaId').offset().top,
      left: $('#textareaId').offset().left,
    };
  },
  methods: {
    handleCommand(val) {
      this.selectVal = val;
    },
    visibleChangeHandler(val) {
      const dropdownId = this.$refs.dropdownId;
      if (val) {
        dropdownId.classList.add('select-icon_up');
        dropdownId.classList.remove('select-icon_down');
      } else {
        dropdownId.classList.remove('select-icon_up');
        dropdownId.classList.add('select-icon_down');
      }
    },
    // 点击@图标
    addMention() {
      this.textarea =
        this.textarea.slice(0, this.focusIndex) + '@' + this.textarea.slice(this.focusIndex);
      this.setFocusIndex(this.focusIndex + 1);
      this.$refs.textareaId.focus();
    },
    // 点击#图标
    addTopics() {
      this.textarea =
        this.textarea.slice(0, this.focusIndex) + '#' + this.textarea.slice(this.focusIndex);
      this.setFocusIndex(this.focusIndex + 1);
      this.$refs.textareaId.focus();
    },
    // 输入框失去焦点
    onInputBlur() {
      // 失去焦点，更新光标下标
      this.getFocusIndex();
      if (this.popoverShow) {
        setTimeout(() => {
          this.popoverShow = false;
        }, 200);
      }
    },
    // 输入框获得焦点
    onInputFocus() {
      // 获得焦点，更新光标下标
      setTimeout(() => {
        this.getFocusIndex();
        // 光标的上一个字符
        const letter = this.textarea.charAt(this.focusIndex - 1);
        if (letter === '@' || letter === '#') {
          this.popoverType = letter === '@' ? 'user' : 'topic';
          Object.assign(this.cursorCoordinate, $('.el-textarea__inner').caret('offset'));
          this.popoverShow = true;
          this.$nextTick(() => {
            this.popoverPosition();
          });
        }
      }, 0);
    },
    // 获取发布器输入框中光标的下标位置
    getFocusIndex() {
      const dom = $('#textareaId')[0];
      // IE
      if (document.selection) {
        var range = document.selection.createRange();
        range.moveStart('character', -dom.value.length);
        this.focusIndex = range.text.length;
      } else if (dom.selectionStart || dom.selectionStart == 0) {
        // another support
        this.focusIndex = dom.selectionStart;
      }
    },
    // 设置发布器输入框中光标的下标位置
    setFocusIndex(index) {
      const dom = $('#textareaId')[0];
      if (this.focusIndex < 0) this.focusIndex = this.textarea.length;
      if (dom.setSelectionRange) {
        setTimeout(() => {
          dom.setSelectionRange(index, index);
        }, 0);
      } else if (dom.createTextRange) {
        dom.createTextRange().move('character', this.focusIndex);
      }
    },
    // 获取popover DOM
    getPopoverDom() {
      return document.querySelector('#popoverId');
    },
    // 定位popover的位置
    popoverPosition() {
      const dom = this.getPopoverDom();
      dom.style.top = `${this.cursorCoordinate.top +
        2 * this.cursorCoordinate.height -
        this.textareaOffset.top}px `;
      dom.style.left = `${this.cursorCoordinate.left + 20 - this.textareaOffset.left}px`;
    },
    // popover选中事件
    onItemClick(data) {
      this.getFocusIndex();
      this.textarea =
        this.textarea.slice(0, this.focusIndex) + data + ' ' + this.textarea.slice(this.focusIndex);
      this.popoverShow = false;
      // 设置光标的位置为选中数据空格的后一位
      this.focusIndex = this.focusIndex + data.length + 1;
    },
    // 关闭图片上传功能
    onCloseImgUpload() {
      this.uploadImgShow = false;
    },
    // 关闭视频上传功能
    onCloseVideoUpload() {
      this.uploadVideoShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.com-publisher {
  background: #ffffff;
  border-radius: 6px;
  width: 782px;
<<<<<<< HEAD
  margin: auto;
  position: relative;
=======
  margin: 20px auto;
>>>>>>> 95ad1c2 (feature: 视频上传 + 登录修改)
  .textarea {
    padding: 20px 20px 12px 20px;
    /deep/.el-textarea__inner {
      background: #f6f6f9 !important;
      border-radius: 6px;
      border-color: transparent;
      resize: none;
      padding: 12px 16px;
      font-family: SFUIText-Regular;
      font-size: 16px;
      color: #333333;
      // text-align: justify;
      line-height: 20px;

      &::placeholder {
        font-family: SFUIText-Regular;
        font-size: 16px;
        color: #636363;
      }
      &:focus {
        border-color: #ff536c;
      }
    }
  }
  .bottom {
    justify-content: space-between;
    padding: 0 20px 12px 13px;
    .operation-box {
      li {
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 19px;
        cursor: pointer;
        transition: 0.3s;
        img {
          width: 24px;
          height: 24px;
          position: relative;
        }
        &:hover {
          background: #f6f6f9;
          border-radius: 50%;
        }
      }
    }
    .inform-box {
      .text-length {
        font-family: SFUIText-Regular;
        font-size: 14px;
        color: #ee3b23;
        text-align: center;
      }
      .select {
        margin: 0 20px;
        padding: 9px 12px 9px 8px;
        height: 34px;
        font-family: SFUIText-Medium;
        font-size: 14px;
        color: #777f8e;
        letter-spacing: 0;
        text-align: center;
        cursor: pointer;
        transition: 0.3s;
        &:hover {
          border-radius: 17px;
          background: #f6f6f9;
        }
        i {
          margin-right: 4px;
          &::before {
            content: '';
            display: inline-block;
            background: url('../../assets/images/publisher/public_icon_details_down@3x.png')
              no-repeat;
            background-size: 100% 100%;
            width: 14px;
            height: 14px;
            vertical-align: -2px;
          }
        }
        .select-icon_down {
          transform: rotateX(0deg);
        }
        .select-icon_up {
          transform: rotateX(180deg);
        }
      }
      .inform-box_btn {
        font-family: SFUIText-Medium;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
        text-align: center;
        background-color: #ff536c;
        border-color: #ff536c;
        &:active {
          background-color: #ef4c63;
          border-color: #ef4c63;
        }
        &:disabled {
          opacity: 0.4;
        }
      }
    }
  }
  .textarea-hide {
    border-radius: 6px;
    border-color: transparent;
    resize: none;
    padding: 12px 16px;
    font-family: SFUIText-Regular;
    font-size: 16px;
    color: #333333;
    text-align: justify;
    line-height: 20px;
    white-space: pre-wrap;
    visibility: hidden;
  }
  .popover {
    position: absolute;
    top: 120px;
    left: 550px;
  }
  .el-divider {
    margin: 0;
    background-color: #f1f1f3;
  }
}
.el-dropdown-menu {
  width: 160px;
  background: #ffffff;
  border: 1px solid #eff1f5;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  .el-dropdown-menu__item {
    height: 40px;
    font-family: SFUIText-Regular;
    font-size: 16px;
    letter-spacing: 0;
  }
  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: transparent;
  }
  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: transparent;
  }
  /deep/.popper__arrow {
    display: none;
  }
}
</style>
