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
      v-model="textarea"
      class="textarea"
    >
    </el-input>
    <div class="bottom flex-align">
      <div class="operation-box flex-align">
        <img src="@/assets/images/publisher/compose_toolbar_picture@3x.png" />
        <img src="@/assets/images/publisher/compose_toolbar_video@3x.png" />
        <img src="@/assets/images/publisher/compose_toolbar_mention@3x.png" />
        <img src="@/assets/images/publisher/compose_toolbar_topics@3x.png" />
      </div>
      <div class="inform-box">
        <span class="text-length" v-show="textareaLen >= 9">{{ 10 - textareaLen }}</span>
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
        <el-button type="primary" round size="small" class="inform-box_btn">Release</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
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
    };
  },
  watch: {
    textarea(val) {
      console.log(val.length);
    },
  },
  computed: {
    textareaLen() {
      return this.textarea.length;
    },
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
      img {
        width: 24px;
        height: 24px;
        margin-right: 35px;
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
