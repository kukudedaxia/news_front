<!--
 * @Author: jianbang
 * @Description: 通用-图片上传组件
-->
<template>
  <div class="com-upload_image">
    <draggable
      v-model="fileList"
      group="people"
      :move="onDragMove"
      animation="300"
      filter=".uploader"
    >
      <transition-group name="fade_top1" class="grid">
        <div class="img-list-box" v-for="(item, index) in fileList" :key="item.id">
          <img
            :src="`${uploadImgUrl}/orj1080/${item.pid}.jpg`"
            :onerror="
              `this.onerror=null;this.src='https://img.bee-cdn.com/images/default_w_orj1080.gif#110'`
            "
            class="img"
          />
          <!-- loading\faile 蒙层 -->
          <div class="mantle" v-if="item.loading != undefined && item.pid == ''">
            <img
              src="@/assets/images/publisher/media_icon_loading@3x.png"
              class="icon-loading"
              v-if="item.loading"
            />
            <div class="icon-reset" v-if="!item.loading" @click="onImgReset(item.id)"></div>
          </div>
          <div class="icon-close" @click="onimgClose(index)"></div>
        </div>
        <el-upload
          class="uploader"
          action="#"
          ref="upload"
          drag
          multiple
          accept=".jpg, .jpeg, .png, .gif, .tiff, .webp, .heic"
          :limit="18"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-exceed="onExceed"
          v-if="fileList.length < 18"
          key="uploader"
        >
          <div class="uploader-icon"></div>
        </el-upload>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import $ from 'jquery';
import { fileByBase64, base64ByBlob, getCrc32, getMd5 } from '@/utils/upload';
import draggable from 'vuedraggable';

export default {
  name: 'UploadImage',
  computed: {
    uploadImgUrl() {
      return process.env.VUE_APP_UPLOAD_IMG_URL;
    },
    user() {
      return this.$store.state.userInfo;
    },
  },
  watch: {
    fileList: {
      handler(data) {
        this.$emit('onImgChange', data);
        this.$store.dispatch('publisher/setUploadImg', data);
      },
      deep: true,
      immediate: true,
    },
  },
  components: {
    draggable,
  },
  data() {
    return {
      file: '', // 待上传的文件
      // 待上传的文件参数
      fileParams: {
        id: '',
        pid: '',
        loading: true,
      },
      fileList: this.$store.state.publisher.imgList,
      // 上传的图片map集合，主要是用作上传图片失败重试
      filesMap: {},
    };
  },
  methods: {
    // 超过最大上传数钩子
    onExceed() {
      this.$message.error(this.$t('publisher.maxImg'));
    },
    // 图片上传前拦截函数
    beforeAvatarUpload(file) {
      // 检查网络
      if (!navigator.onLine) {
        this.$message.error(this.$t('netError'));
      }
      // 上传图片不能大于30M
      else if (file.size > 1024 * 1024 * 30) {
        this.$message.error(this.$t('publisher.imgMaxSize'));
      } else if (this.fileList.length >= 18) {
        this.$message.error(this.$t('publisher.maxImg'));
      } else {
        // debugger;
        setTimeout(() => {
          const id = new Date().getTime(); // 每张上传中的图片都会设置一个唯一的以毫秒为单位的时间戳
          this.filesMap[id] = {
            id,
            file,
          };
          this.fileList.push({
            id,
            pid: '',
            loading: true,
          });
          this.uploadImg(file, id);
        }, 100);
      }
      return false;
    },
    // 图片上传
    async uploadImg(file, id) {
      try {
        const base64 = await fileByBase64(file);
        const blob = await base64ByBlob(base64);
        const md5 = await getMd5(blob);
        const cs = await getCrc32(blob);
        const form = new FormData();
        form.append('file', blob);
        $.ajax({
          type: 'post',
          data: form.get('file'),
          // eslint-disable-next-line prettier/prettier
              url: `${process.env.VUE_APP_UPLOAD_URL}/upload.json?file_source=1&cs=${cs}&ent=alpha&appid=339644097&uid=${this.user.id}&raw_md5=${md5}&mpos=1&logo=1&nick=${this.$store.state.userInfo.username}`,
          async: true,
          contentType: 'application/x-www-form-urlencoded',
          processData: false,
          crossDomain: true, //设置跨域为true
          xhrFields: {
            withCredentials: true, //默认情况下，标准的跨域请求是不会发送cookie的
          },
          headers: {
            Accept: 'application/json',
          },
          success: res => {
            const index = this.fileList.findIndex(item => item.id === id);
            if (res.ret) {
              // 通过上面的时间戳为id，在数组中找到对应数据，并替换
              if (index !== -1) {
                this.readImgInform(file).then(({ width, height }) => {
                  this.fileList.splice(index, 1, {
                    id,
                    pid: res.pic.pid,
                    width,
                    height,
                    piiic: this.verifyLongPic({ width, height }),
                  });
                  this.$emit('onUploadImgSuccess');
                });
              }
            } else {
              // 如果图片上传失败，应该如何处理？
              if (index !== -1) {
                this.fileList.splice(index, 1, {
                  id: this.filesMap[id].id,
                  pid: '',
                  loading: false,
                });
              }
              this.$message.error(this.$t('live.uploadErr'));
            }
          },
          error: () => {
            this.$message.error(this.$t('live.uploadErr'));
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 上传失败，再次尝试上传
    onImgReset(id) {
      const index = this.fileList.findIndex(item => item.id === id);
      this.fileList.splice(index, 1, {
        id: this.filesMap[id].id,
        pid: '',
        loading: true,
      });
      this.uploadImg(this.filesMap[id].file, id);
    },
    // 删除已上传的单张图片
    onimgClose(index) {
      this.fileList.splice(index, 1);
    },
    // 图片列表拖拽自定义事件
    onDragMove(e) {
      //不允许停靠
      if (e.relatedContext.index == this.fileList.length) return false;
      //不允许拖拽
      if (e.draggedContext.index == this.fileList.length) return false;
      return true;
    },
    // 读取图片宽高
    readImgInform(file) {
      return new Promise(resolve => {
        //读取图片数据
        const reader = new FileReader();
        reader.onload = function(e) {
          const data = e.target.result;
          // //加载图片获取图片真实宽度和高度
          const image = new Image();
          image.onload = function() {
            const width = image.width;
            const height = image.height;
            resolve({ width, height });
          };
          image.src = data;
        };
        reader.readAsDataURL(file);
      });
    },
    // 验证长图
    verifyLongPic({ width, height }) {
      return height / width > 16 / 9;
    },
  },
};
</script>

<style lang="less" scoped>
.com-upload_image {
  padding-top: 12px;
  padding-bottom: 8px;
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
    grid-template-rows: repeat(auto-fill, 100px);
    grid-row-gap: 12px;
    grid-column-gap: 12px;
  }
  .uploader {
    width: 100px;
    height: 100px;
    border: 1px solid var(--color-13);
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    transition: 0.3s;
    /deep/.el-upload {
      width: 100%;
      height: 100%;
      .el-upload-dragger {
        width: 100%;
        height: 100%;
        border: none;
      }
    }
    .uploader-icon {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: url('../../assets/images/publisher/conmpose_icon_morepics@3x.png') no-repeat;
      background-size: 20px;
      transition: 0.3s;
    }
  }
  .uploader:hover {
    border-color: var(--color-1);
    .uploader-icon {
      background-image: url('../../assets/images/publisher/conmpose_icon_morepics_red@3x.png');
    }
  }
  .img-list-box {
    width: 100px;
    height: 100px;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    .img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
    .icon-close {
      width: 8px;
      height: 8px;
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
      background: url('../../assets/images/publisher/media_icon_close_small_normal@3x.png')
        no-repeat;
      background-size: 8px;
      transition: 0.3s;
      &:hover {
        background-image: url('../../assets/images/publisher/media_icon_close_click@3x.png');
      }
    }
    .mantle {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      .icon-loading {
        width: 30px;
        height: 30px;
        animation: turn 1s linear infinite;
      }
      .icon-reset {
        width: 30px;
        height: 30px;
        cursor: pointer;
        background: url('../../assets/images/publisher/media_icon_uploadagain@3x.png') no-repeat;
        background-size: 30px;
        transition: 0.3s;
        &:hover {
          background-image: url('../../assets/images/publisher/media_icon_uploadagain_click@3x.png');
        }
      }
    }
  }
}
</style>
