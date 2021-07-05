<template>
  <div class="scheduled_live">
    <p class="title">
      Appointment List
    </p>
    <ul>
      <li v-for="item in 5" :key="item">
        <img
          src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202106%2F08%2F20210608103243_1e19d.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1627729841&t=981c92fd4308f515b003935cc114a26c"
        />
        <div class="right-box">
          <div>
            <p>Title: XXXXX</p>
            <p>Time: XXXXXX</p>
            <p>Permission: XXXXX</p>
          </div>
          <div class="btn-operation">
            <el-button type="primary" size="small">Start Live</el-button>
            <el-button type="primary" plain size="small">Copy URL</el-button>
            <el-button type="primary" plain size="small">Copy Key</el-button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.scheduled_live {
  text-align: left;
  height: 100%;
  overflow-y: auto;
  .title {
    font-weight: bold;
  }
  ul {
    li {
      padding: 20px 0;
      display: flex;
      border-bottom: 2px solid #ffffff;
      & > img {
        width: 150px;
        height: 200px;
        object-fit: cover;
      }
      .right-box {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        p {
          margin-bottom: 15px;
        }
      }
      .btn-operation {
        display: flex;
      }
    }
  }
}
</style>
