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
      v-model="textarea"
      class="textarea"
    >
    </el-input>
    <div class="bottom flex-align">
      <ul class="operation-box flex-align">
        <li>
          <img src="@/assets/images/publisher/compose_toolbar_picture@3x.png" />
        </li>
        <li>
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
    <Popover
      v-if="popoverShow"
      :type="popoverType"
      class="popover"
      id="popoverId"
      @onItemClick="onItemClick"
    ></Popover>
  </div>
</template>

<script>
import Popover from '@/components/publish/Popover';
import '../../assets/sdk/jquery.caret';
import $ from 'jquery';
export default {
  components: {
    Popover,
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
    };
  },
  watch: {
    // 监听发布器文本变化
    textarea(val) {
      const endLetter = val.charAt(val.length - 1);
      if (endLetter === '@' || endLetter === '#') {
        this.popoverType = endLetter === '@' ? 'user' : 'topic';
        Object.assign(this.cursorCoordinate, $('.el-textarea__inner').caret('offset'));
        this.popoverShow = true;
        this.$nextTick(() => {
          this.popoverPosition();
        });
      } else {
        this.popoverShow = false;
      }
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
    // 设置textarea不检查
    this.$refs.textareaId.$el.spellcheck = false;
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
    // @
    addMention() {
      this.textarea += '@';
      this.$refs.textareaId.focus();
    },
    // #
    addTopics() {
      this.textarea += '#';
      this.$refs.textareaId.focus();
    },
    getPopoverDom() {
      return document.querySelector('#popoverId');
    },
    // 定位popover的位置
    popoverPosition() {
      const dom = this.getPopoverDom();
      dom.style.top = `${this.cursorCoordinate.top + this.cursorCoordinate.height + 4}px `;
      dom.style.left = `${this.cursorCoordinate.left}px`;
    },
    // popover选中事件
    onItemClick(data) {
      this.textarea += `${data} `;
      this.popoverShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.com-publisher {
  background: #ffffff;
  border-radius: 6px;
  width: 782px;
  margin: auto;
  padding: 20px;
  .textarea {
    /deep/.el-textarea__inner {
      background: #f6f6f9 !important;
      border-radius: 6px;
      border-color: transparent;
      resize: none;
      padding: 12px 16px;
      font-family: SFUIText-Regular;
      font-size: 16px;
      color: #333333;
      text-align: justify;
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
    margin-top: 12px;
    justify-content: space-between;
    height: 34px;
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
        font-family: SFUIText-Medium;
        font-size: 14px;
        color: #777f8e;
        letter-spacing: 0;
        text-align: center;
        cursor: pointer;
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
    position: fixed;
    top: 120px;
    left: 550px;
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
