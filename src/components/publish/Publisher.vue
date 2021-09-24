<!--
 * @Author: jianbang
 * @Description: 发布器组件
-->
<template>
  <div class="com-publisher">
    <el-input
      type="textarea"
      :autosize="{ minRows: 5, maxRows: 10 }"
      :placeholder="$t('publisher.express')"
      ref="textareaId"
      id="textareaId"
      v-model="textarea"
      class="textarea"
      v-arInput
      @blur="onInputBlur"
      @focus="onInputFocus"
      @keydown.native="onKeyDown"
    >
    </el-input>
    <div class="bottom flex-align">
      <ul class="operation-box flex-align">
        <li @click="onUploadImg">
          <img src="@/assets/images/publisher/compose_toolbar_picture@3x.png" />
        </li>
        <li @click="onUploadVideo">
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
        <span
          :class="['text-length', { red: textareaLen >= 10000 }]"
          v-show="textareaLen >= 9990"
          >{{ 10000 - textareaLen }}</span
        >
        <el-dropdown
          trigger="click"
          @command="handleCommand"
          @visible-change="visibleChangeHandler"
          class="select"
        >
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right" ref="dropdownId"></i
            >{{ $t(selectVal.name) }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="item" v-for="item in selectList" :key="item.id">{{
              $t(item.name)
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          type="primary"
          round
          size="small"
          :disabled="!btnClick"
          :loading="releaseLoading"
          class="inform-box_btn"
          @click="sendBlog"
          >{{ $t('publisher.release') }}</el-button
        >
      </div>
    </div>
    <el-divider v-if="uploadImgShow"></el-divider>
    <transition name="fade_top">
      <upload-image
        @onCloseImgUpload="onCloseImgUpload"
        @onUploadImgSuccess="onUploadImgSuccess"
        v-if="uploadImgShow"
      ></upload-image>
    </transition>
    <el-divider v-if="uploadVideoShow"></el-divider>
    <transition name="fade_top">
      <UploadV
        ref="uploadV"
        v-if="uploadVideoShow"
        @onClose="onCloseVideoUpload"
        @onUploadVideoSuccess="onUploadVideoSuccess"
      ></UploadV>
    </transition>
    <transition name="fade">
      <Popover
        v-show="popoverShow"
        :type="popoverType"
        class="popover"
        id="popoverId"
        :text="searchText"
        @onItemClick="onItemClick"
        @onCreateTopic="onCreateTopic"
      ></Popover>
    </transition>
  </div>
</template>

<script>
import Popover from '@/components/publish/Popover';
import UploadImage from '@/components/publish/UploadImage';
import UploadV from '@/components/publish/UploadV';
import { editClass } from '@/directive/arFocusTools';
import '../../assets/sdk/jquery.caret';
import $ from 'jquery';
import { mapGetters } from 'vuex';
import Bus from '@/utils/bus';

export default {
  components: {
    Popover,
    'upload-image': UploadImage,
    UploadV,
  },
  data() {
    return {
      textarea: '',
      selectVal: {
        id: 0,
        name: 'publisher.public',
      },
      selectList: [
        {
          id: 0,
          name: 'publisher.public',
        },
        {
          id: 3,
          name: 'publisher.friends',
        },
        {
          id: 2,
          name: 'publisher.fans',
        },
        {
          id: 1,
          name: 'publisher.onlyMe',
        },
      ],
      releaseLoading: false,
      // 发布按钮点击
      btnClick: false,
      // 发布器光标离 @ # 最近的坐标
      cursorCoordinate: {
        left: 0,
        top: 0,
      },
      popoverShow: false, // 检索弹窗显示
      popoverType: '', // # topic 、 @ user
      uploadImgShow: false,
      // 输入框的偏移量
      textareaOffset: {
        top: 0,
        left: 0,
      },
      focusIndex: 0, // 输入框的光标所在下标
      startIndex: 0, // @、# 所在的下标
      searchText: null, // @、# 检索文本
      searchStrtIndex: 0, // 检索文本的起始下标
      searchEndIndex: 0, // 检索文本的终止下标
      // ------ 草稿 ------ //
      draftId: null, // 草稿箱id,如果没有传则会新建
      formalV: '', // 草稿箱修改时必须带上，上一版本版本号
      // 草稿保存接口是否请求完成  默认是完成态，当在请求时设为false
      draftSaveFinish: true,
      // 草稿保存定时器实例
      draftSaveTimes: null,
      uploadVideoShow: false,
    };
  },
  watch: {
    // 监听发布器文本变化
    textarea(val) {
      this.textareaChange();
      // 自动保存草稿
      this.draftSaveTime();
      if (val.length > 0 && val.length <= 10000) {
        this.btnClick = true;
      } else {
        this.btnClick = false;
      }
    },
    // 监听上传图片列表变化
    '$store.state.publisher.imgList': {
      handler(list) {
        if (list.length === 0) {
          this.btnClick = false;
          return;
        }
        // 不存在上传中的图片，可点击
        const len = list.length;
        for (let i = 0; i < len; i++) {
          // 如果存在loading，则不可点击
          if (this.getUploadImg[i].loading) {
            this.btnClick = false;
            break;
          }
          this.btnClick = true;
        }
      },
      deep: true,
    },
    // 监听上传视频变化
    '$store.state.video.attr': {
      handler({ status }) {
        if (status === 3) {
          this.btnClick = true;
        } else {
          this.btnClick = false;
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters('publisher', ['getUploadImg', 'getUploadVideo']),
    textareaLen() {
      return this.textarea.length;
    },
    uploadMediaId() {
      return this.$store.state.video.attr.media_id;
    },
    uploadMediaStatus() {
      //0未上传 1上传中 2上传失败 3上传成功
      return this.$store.state.video.attr.status;
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
    // 监听编辑草稿箱事件
    Bus.$on('editDraft', data => {
      const content = JSON.parse(data.content);
      this.draftId = data.id;
      this.formalV = data.v;
      this.textarea = content.text;
      $('#textareaId').val(this.textarea);
      editClass($('#textareaId')[0]);
      this.selectVal = {
        id: this.selectList.find(item => item.name === content.power).id,
        name: content.power,
      };
      if (content.img.length > 0) {
        this.$store.dispatch('publisher/setUploadImg', content.img);
        this.uploadImgShow = true;
      } else if (content.video.fid != '') {
        this.$store.commit('video/setData', {
          status: 3, //上传状态 0， 1，2，3
          media_id: content.video.fid,
          pid: content.video.pid,
          duration: content.video.duration,
          count: 1,
        });
        this.uploadVideoShow = true;
      }
    });
    // 监听浏览器关闭事件
    window.onbeforeunload = () => {
      if (this.textarea.length > 0 || this.getUploadImg.length > 0 || this.uploadMediaId !== '') {
        // 调用保存草稿接口
        this.draftSave();
        return false;
      }
    };
  },
  methods: {
    // 输入框监听事件
    /**
     * 1. 获取光标所在的下标
     * 2. 以光标所在下标为中心向左查找，如果不存在空格且有@、#，则记录@、#的下标，并判定左侧满足检索待定值
     * 3. 以光标所在下标为中心向右查找，如果存在空格则判定右侧不满足检索判定
     * 4. 如果右侧不存在空格，并查找到@、#字符，则判定右侧满足条件，记录@、#符前一字符下标
     * 5. 如果右侧查找到尾部，未发现空格、@、#，则判定满足条件，记录尾部下标
     * 6. 如果左右侧都满足条件，那么将左右侧记录的下标截取的字符串作为检索值
     */
    textareaChange() {
      // 如果文本为空，关闭弹窗
      if (this.textarea === '') {
        this.popoverShow = false;
        return;
      }
      this.getFocusIndex(); // 获取文本变化时的实时光标下标
      // let leftIndex = this.focusIndex; // 左侧指针
      // let rightIndex = this.focusIndex; // 右侧指针
      let searchStrtIndex = this.focusIndex; // 检索值的起始下标
      let searchEndIndex = this.focusIndex; // 检索值的结尾下标
      const leftStr = this.textarea.slice(0, this.focusIndex); // 左侧待检索字符串
      const rightStr = this.textarea.slice(this.focusIndex); // 右侧待检索字符串
      let leftResult = false; //左侧是否满足
      let rightResult = false; // 右侧是否满足
      // 如果左侧文本为空，关闭弹窗
      if (leftStr === '') {
        this.popoverShow = false;
        return;
      }
      // 检索左侧
      for (let i = this.focusIndex; i > 0; i--) {
        const li = i - 1;
        // 如果在左侧检索的过程中先遇到空格，直接判定失败并跳出循环
        if (leftStr[li] === ' ') {
          this.popoverShow = false;
          break;
        }
        // 在未发现空格的情况下查找到@、#，则判定成功，并记录下标值
        else if (leftStr[li] === '@' || leftStr[li] === '#') {
          leftResult = true;
          searchStrtIndex = i;
          break;
        }
      }
      // 检索右侧
      // 如果右侧文本为空，不会进入循环，判定右侧符合条件
      if (rightStr === '') {
        rightResult = true;
        searchEndIndex = leftStr.length;
      }
      const len = rightStr !== '' ? rightStr.length : 0;
      for (let j = 0; j < len; j++) {
        // 如果在右侧检索的过程中先遇到空格，直接判定失败并跳出循环
        if (rightStr[j] === ' ') {
          this.popoverShow = false;
          break;
        }
        // 在未发现空格的情况下查找到@、#，则判定成功，并记录下标值
        else if (rightStr[j] === '@' || rightStr[j] === '#') {
          rightResult = true;
          searchEndIndex = j + leftStr.length;
          break;
        }
        // 未发现空格，@、#，并查找到了尾部，则判定成功，记录下标
        else if (j === len - 1) {
          rightResult = true;
          searchEndIndex = j + leftStr.length;
        }
      }
      // 满足检索条件，弹出popover
      if (leftResult && rightResult) {
        this.popoverType = this.textarea[searchStrtIndex - 1] === '@' ? 'user' : 'topic';
        this.searchText = this.textarea.slice(searchStrtIndex, searchEndIndex);
        this.searchStrtIndex = searchStrtIndex;
        this.searchEndIndex = searchEndIndex;
        Object.assign(this.cursorCoordinate, $('.el-textarea__inner').caret('offset'));
        console.log($('.el-textarea__inner').caret('offset'));
        this.$nextTick(() => {
          this.popoverPosition();
          setTimeout(() => {
            this.popoverShow = true;
          }, 100);
        });
      } else {
        this.searchText = null;
      }
    },
    handleCommand(item) {
      this.selectVal = item;
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
    // 创建新话题
    onCreateTopic() {
      this.onItemClick(this.searchText);
    },
    // 输入框失去焦点
    onInputBlur() {
      this.popoverShow = false;
      // 失去焦点，更新光标下标
      this.getFocusIndex();
      // 为什么失去焦点200ms后再去关闭弹窗？
      // if (this.popoverShow) {
      //   setTimeout(() => {
      //     this.popoverShow = false;
      //   }, 200);
      // }
    },
    // 输入框获得焦点
    onInputFocus() {
      setTimeout(() => {
        this.textareaChange();
      }, 0);
    },
    // 输入框点击回车
    onKeyDown(event) {
      if (event.keyCode === 13) {
        // 如果是在@、#模式下，点击回车会自动在尾部增加空格，然后回车换行
        if (this.searchText !== null) {
          event.preventDefault();
          this.onItemClick(this.searchText);
          return false;
        }
      }
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
      /**
       * problems
       * 1. 在英语模式下，popover的定位没问题
       * 2. 在阿语环境下，英语的定位有问题()
       */
      // 获取环境的语言
      const lang = localStorage.getItem('lanuage');
      const dom = this.getPopoverDom();
      // 设置弹窗的top属性，top值在任何语言环境下都是一致的
      dom.style.top = `${this.cursorCoordinate.top +
        2.5 * this.cursorCoordinate.height -
        this.textareaOffset.top}px `;
      if (lang === 'en') {
        //默认从左定位
        dom.style.right = '';
        dom.style.left = `${this.cursorCoordinate.left + 20 - this.textareaOffset.left}px`;
        // 如果是英语，从左定位
        if (this.tools.checkLan(this.textarea) === 'en') {
          dom.style.right = '';
          dom.style.left = `${this.cursorCoordinate.left + 20 - this.textareaOffset.left}px`;
        } //如果是阿语，从右定位
        else if (this.tools.checkLan(this.textarea) === 'ar') {
          dom.style.left = '';
          dom.style.right = `${this.cursorCoordinate.left + 20 - this.textareaOffset.left}px`;
        }
      } else {
        //默认从左定位
        dom.style.right = '';
        dom.style.left = `${this.cursorCoordinate.left + 20 - this.textareaOffset.left}px`;
        // 如果是英语，从右定位
        if (this.tools.checkLan(this.textarea) === 'en') {
          dom.style.left = '';
          dom.style.right = `${this.cursorCoordinate.left - 220 - this.textareaOffset.left}px`;
        } //如果是阿语，从左定位
        else if (this.tools.checkLan(this.textarea) === 'ar') {
          dom.style.right = '';
          dom.style.left = `${this.cursorCoordinate.left + 20 - this.textareaOffset.left}px`;
        }
      }

      // // 如果是阿语，从右定位
      // if (this.tools.checkAr(this.textarea)) {
      //   dom.style.left = '';
      //   dom.style.right = `${this.cursorCoordinate.left + 20 - this.textareaOffset.left}px`;
      //   // 阿语
      // } else {
      //   // 英语从左定位
      //   dom.style.right = '';
      //   dom.style.left = `${this.cursorCoordinate.left + 20 - this.textareaOffset.left}px`;
      //   console.log(this.cursorCoordinate.left);
      // }
    },
    // popover选中事件
    onItemClick(data) {
      this.getFocusIndex();
      this.textarea =
        this.textarea.slice(0, this.searchStrtIndex) +
        data +
        ' ' +
        this.textarea.slice(this.searchEndIndex);
      // 设置光标的位置为选中数据空格的后一位
      this.setFocusIndex(this.searchStrtIndex + data.length + 1);
      $('#textareaId').val(this.textarea);
      editClass($('#textareaId')[0]);
      setTimeout(() => {
        this.searchText = null;
        $('#textareaId').focus();
      }, 300);
    },
    // 草稿箱延迟上报
    draftSaveTime() {
      // 如果保存草稿状态为完成，并且满足文本、图片、视频任意条件，则可以走2s延迟保存草稿操作
      if (this.draftSaveFinish) {
        this.draftSaveFinish = false;
        this.draftSaveTimes = setTimeout(() => {
          this.draftSave();
        }, 2000);
      }
    },
    // 草稿箱保存接口
    draftSave() {
      if (this.textarea.length > 0 || this.getUploadImg.length > 0 || this.uploadMediaId !== '') {
        const params = {
          content: JSON.stringify({
            text: this.textarea,
            power: this.selectVal.name,
            img: this.getUploadImg,
            video: {
              fid: this.uploadMediaId,
              pid: this.$store.state.video.attr.pid,
              duration: this.$store.state.video.attr.duration,
            },
          }),
          formalV: this.formalV,
        };
        Object.assign(params, this.draftId ? { draftId: this.draftId } : {});
        this.$store.dispatch('ajax', {
          req: {
            method: 'post',
            url: 'api/pc/draft/save',
            data: params,
          },
          onSuccess: ({ data }) => {
            this.draftId = data.id;
            this.formalV = data.v;
          },
          onFail: ({ error }) => {
            this.$message.error(error);
          },
          onComplete: () => {
            this.draftSaveFinish = true;
          },
        });
      }
    },
    // 发博
    sendBlog() {
      const media = [];
      this.releaseLoading = true;
      if (this.uploadMediaId !== '') {
        media.push({
          type: 2,
          id: this.uploadMediaId,
          fid: this.uploadMediaId,
          duration: this.$store.state.video.attr.duration,
        });
      } else if (this.getUploadImg.length > 0) {
        const list = this.getUploadImg.map(item => {
          return {
            type: 1,
            id: item.pid,
            pid: item.pid,
            height: 1080,
            width: 1080,
          };
        });
        media.push(...list);
      }
      const params = {
        text: this.textarea,
        visible: this.selectVal.id,
        media: JSON.stringify(media),
      };
      Object.assign(
        params,
        this.draftId ? { draftId: this.draftId } : {},
        this.formalV ? { v: this.formalV } : {},
      );
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: 'api/pc/status/create',
          data: params,
        },
        onSuccess: () => {
          this.$message.success(this.$t('publisher.successed'));
          this.textarea = '';
          if (this.$refs.uploadV) {
            this.$refs.uploadV.deleteVideo();
          }
          this.$store.dispatch('publisher/setUploadImg', []);
          this.uploadImgShow = false;
          this.uploadVideoShow = false;
          Bus.$emit('refreshDraft');
        },
        onFail: ({ error }) => {
          this.$message.error(error);
        },
        onComplete: () => {
          this.releaseLoading = false;
        },
      });
    },
    // 关闭视频上传功能
    onCloseVideoUpload() {
      this.uploadVideoShow = false;
    },
    // 关闭图片上传功能
    onCloseImgUpload() {
      this.uploadImgShow = false;
      this.$store.dispatch('publisher/setUploadImg', []);
    },
    // 点击图片上传
    onUploadImg() {
      if (this.uploadMediaStatus === 1 || this.uploadMediaStatus === 3) {
        this.$confirm(this.$t('publisher.videoDialogTitle'), '', {
          confirmButtonText: this.$t('publisher.confirm'),
          cancelButtonText: this.$t('publisher.cancel'),
        })
          .then(() => {
            this.$refs.uploadV.deleteVideo();
            this.uploadImgShow = true;
            this.uploadVideoShow = false;
          })
          .catch(() => {});
      } else {
        this.uploadVideoShow = false;
        this.uploadImgShow = true;
      }
    },
    // 点击视频上传
    onUploadVideo() {
      if (this.getUploadImg.length > 0) {
        this.$confirm(this.$t('publisher.imgDialogTitle'), '', {
          confirmButtonText: this.$t('publisher.confirm'),
          cancelButtonText: this.$t('publisher.cancel'),
        })
          .then(() => {
            this.uploadImgShow = false;
            this.uploadVideoShow = true;
            this.$store.dispatch('publisher/setUploadImg', []);
          })
          .catch(() => {});
      } else {
        this.uploadVideoShow = true;
        this.uploadImgShow = false;
      }
    },
    // 图片上传成功回调
    onUploadImgSuccess() {
      this.draftSave();
    },
    // 视频上传成功回调
    onUploadVideoSuccess() {
      this.draftSave();
    },
  },
};
</script>

<style lang="less" scoped>
.com-publisher {
  background: #ffffff;
  border-radius: 6px;
  width: 782px;
  position: relative;
  margin: 20px auto;
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
        text-align: center;
        color: #777f8e;
      }
      .red {
        color: #ee3b23;
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
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
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
        .el-dropdown-link {
          outline: none;
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
  }
  .el-divider {
    margin: 0;
    background-color: #f1f1f3;
  }
}
.el-dropdown-menu {
  min-width: 160px;
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
