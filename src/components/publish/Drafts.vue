<!--
 * @Author: jianbang
 * @Description: 草稿箱组件
-->
<template>
  <div class="com-drafts flex-align">
    <div class="text-box flex-align">
      <p :class="['blog-text text-overflow-3', { 'pub-rtl': tools.checkAr(draftData.text) }]">
        {{ draftData.text }}
      </p>
      <div class="text-bottom flex-align">
        <p class="time">
          {{
            `${$moment(new Date(data.lastModifyTime)).format('DD/MM/YYYY HH:mm ')} 
            · 
            ${$t(draftData.power)}`
          }}
        </p>
        <el-button
          type="text"
          class="btn-del"
          :loading="delLoading"
          @click.stop="onDeleteConfirm"
          >{{ $t('publisher.delete') }}</el-button
        >
      </div>
    </div>
    <div class="img" v-if="draftData.img && draftData.img.length > 0">
      <img
        :src="`${uploadImgUrl}/orj1080/${draftData.img[0].pid}.jpg`"
        :onerror="
          `this.onerror=null;this.src='https://img.bee-cdn.com/images/default_w_orj1080.gif#110'`
        "
      />
      <div class="cover" v-if="draftData.img.length > 1" dir="ltr">
        {{ `+${draftData.img.length - 1}` }}
      </div>
      <img :src="lang === 'en' ? piiic : piiicAr" class="piiic" v-if="draftData.img[0].piiic" />
    </div>
    <div class="video" v-if="draftData.video && draftData.video.fid">
      <img
        :src="`${uploadImgUrl}/orj1080/${draftData.video.pid}.jpg`"
        :onerror="
          `this.onerror=null;this.src='https://img.bee-cdn.com/images/default_w_orj1080.gif#110'`
        "
      />
      <span class="time">
        {{ transformVideoTime(draftData.video.duration) }}
      </span>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import piiic from '@/assets/images/pic_piiic@3x.png';
import piiicAr from '@/assets/images/pic_piiic_A@3x.png';

export default {
  name: 'ComDrafts',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    draftData() {
      return JSON.parse(this.data.content);
    },
    uploadImgUrl() {
      return process.env.VUE_APP_UPLOAD_IMG_URL;
    },
    lang() {
      return this.$store.state.lanuage;
    },
  },
  data() {
    return {
      delLoading: false, // 删除时的loading
      piiic,
      piiicAr,
    };
  },
  methods: {
    // 删除草稿
    onDeleteConfirm() {
      this.$confirm(this.$t('publisher.drageDialogTitle'), '', {
        confirmButtonText: this.$t('publisher.confirm'),
        cancelButtonText: this.$t('publisher.cancel'),
      })
        .then(() => {
          this.delLoading = true;
          this.onDelete();
          // 将删除中的事件暴露给上级组件，为了防止删除中可再次编辑
          this.$emit('draftNotEdit');
        })
        .catch(() => {});
    },
    onDelete() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'get',
          url: 'api/pc/draft/del',
          params: {
            id: this.data.id,
          },
        },
        onSuccess: () => {
          // 如果删除成功，手动将删除项移除，部分safari删除后不会调用查询接口
          this.$message.success(this.$t('live.success'));
          this.$emit('deleteDraftSuccess', this.data.id);
        },
        onFail: ({ error }) => {
          this.$message.error(error);
          // 如果删除失败，则将草稿设为可编辑状态
          this.$emit('draftCanEdit');
        },
        onComplete: () => {
          this.delLoading = false;
        },
      });
    },

    transformVideoTime(seconds) {
      const duration = Math.ceil(seconds);
      let m1 = moment.duration(duration, 'seconds');
      let hours = m1.get('hours');
      let mins = m1.get('minutes');
      let sec = m1.get('seconds');
      mins = mins > 9 ? mins : '0' + mins;
      sec = sec > 9 ? sec : '0' + sec;
      if (hours > 0) {
        return `${hours}:${mins}:${sec}`;
      } else {
        return `${mins}:${sec}`;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.com-drafts {
  padding: 18px 20px;
  background: #ffffff;
  border-bottom: 1px solid #f6f6f6;
  transition: 0.3s;
  &:hover {
    cursor: pointer;
    background: #f9f9fb;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.04);
  }
  .text-box {
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    height: 89px;
    .blog-text {
      font-family: Tahoma;
      font-size: 16px;
      color: #333333;
      letter-spacing: 0;
      line-height: 20px;
      width: 100%;
      text-align: justify;
    }
    .text-bottom {
      width: 100%;
      justify-content: space-between;
      .time {
        font-family: Tahoma;
        font-size: 12px;
        color: #777f8e;
      }
      .btn-del {
        font-family: Tahoma;
        font-size: 12px;
        color: #b9bdc7;
        letter-spacing: 0;
        line-height: 16px;
        padding: 0;
        cursor: pointer;
        transition: 0.3s;
        &:hover {
          color: #ff536c;
        }
      }
    }
  }
  .img {
    width: 120px;
    height: 89px;
    background: #d8d8d8;
    border: 0 solid rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    margin-left: 20px;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .cover {
      background: #d8d8d8;
      background: rgba(0, 0, 0, 0.3);
      border: 0 solid rgba(0, 0, 0, 0.03);
      border-radius: 6px;
      font-family: Tahoma;
      font-size: 28px;
      color: #ffffff;
      letter-spacing: 0;
      text-align: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .piiic {
      width: 31px;
      height: 19px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  .video {
    width: 120px;
    height: 89px;
    background: #d8d8d8;
    border: 0 solid rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    margin-left: 20px;
    overflow: hidden;
    position: relative;
    .time {
      display: inline-block;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ffffff;
      text-align: right;
      text-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 8px;
      right: 12px;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
html[lang='ar'] {
  .com-drafts .img {
    margin-left: 0;
    margin-right: 20px;
    .piiic {
      left: 0;
      right: auto;
    }
  }
  .com-drafts .video {
    margin-left: 0;
    margin-right: 20px;
    .time {
      left: 12px;
      right: auto;
    }
  }
}
</style>
