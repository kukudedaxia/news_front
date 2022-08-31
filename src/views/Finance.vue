<template>
  <div class="wrap finance">
    <div class="menu-title hidden-sm-and-down">融资</div>
    <div class="content">
      <div class="top">
        <h2>加密项目和公司最近的融资轮次</h2>
        <p>根据所有筹款活动，Bcaca 列出了所有加密和区块链项目最近的所有筹款轮次。</p>
      </div>
      <div class="filter">
        <el-popover
          placement="bottom"
          width="200"
          trigger="click"
          v-for="(value, key, index) in filter"
          :key="index"
          class="pop"
        >
          <div class="filter-content">
            <ul>
              <li v-for="(item, index) in value" :key="index">
                <span>{{ item.label }}</span>
              </li>
            </ul>
          </div>
          <el-button slot="reference" round size="small" class="filter-btn">
            {{ filerKey[key] }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
        </el-popover>

        <el-input
          v-model="keywords"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          class="search"
          size="medium"
          type="search"
          @change="Search"
          width="300"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="tables">
        <el-table v-loading="loading" :data="list" style="width: 100%" max-height="1000">
          <el-table-column type="expand" width="50" label="展开">
            <template slot-scope="props">
              <p>
                这里是一对描述，根据所有筹款活动，Bcaca
                列出了所有加密和区块链项目最近的所有筹款轮次。
                这里是一对描述，根据所有筹款活动，Bcaca
                列出了所有加密和区块链项目最近的所有筹款轮次。
                这里是一对描述，根据所有筹款活动，Bcaca
                列出了所有加密和区块链项目最近的所有筹款轮次。
              </p>
            </template>
          </el-table-column>
          <el-table-column label="项目" prop="name" width="160">
            <template slot-scope="scope">
              <div class="avator">
                <img :src="scope.row.img" />
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="类别">
            <template slot-scope="scope">
              <div class="tags">
                <el-tag
                  v-for="(oItem, index) in scope.row.tags"
                  :key="index"
                  type="info"
                  class="tag"
                  >{{ oItem }}</el-tag
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column label="融资数量" prop="mount" />

          <el-table-column label="投资者" width="300">
            <template slot-scope="scope">
              <div class="avators">
                <div class="avator" v-for="(oItem, index) in scope.row.people" :key="index">
                  <img :src="oItem.img" />
                  <span>{{ oItem.name }}</span>
                </div>
                <span class="more">…</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="资助日期" prop="time" class="times" align="right" />
        </el-table>
        <div class="pagination">
          <el-pagination
            layout="prev, pager, next, jumper, total"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const filter = {
  type: [
    {
      label: '全部',
      value: 'all',
    },
    {
      label: 'CeFi',
      value: 'all',
    },
    {
      label: '去中心经融',
      value: 'all',
    },
    {
      label: 'NFT',
      value: 'all',
    },
    {
      label: 'web3',
      value: 'all',
    },
    {
      label: '基础设施投资',
      value: 'all',
    },
    {
      label: '其他',
      value: 'all',
    },
  ],
  count: [
    {
      label: '< 100 万美元',
      value: 1,
    },
    {
      label: '100 万美元 - 500 万美元',
      value: 2,
    },
    {
      label: '500 万美元 - 1000 万美元',
      value: 1,
    },
    {
      label: '1000 万美元 - 5000 万美元',
      value: 1,
    },
    {
      label: '5000 万美元 - 1亿美元',
      value: 1,
    },
    {
      label: '1亿美元以上',
      value: 1,
    },
  ],
  time: [
    {
      label: '全部',
      value: 'all',
    },
    {
      label: '2022',
      value: '2022',
    },
    {
      label: '2021',
      value: '2021',
    },
    {
      label: '2020',
      value: '2020',
    },
    {
      label: '2019',
      value: '2019',
    },
    {
      label: '2018',
      value: '2018',
    },
    {
      label: '2017',
      value: '2017',
    },
    {
      label: '2016',
      value: '2016',
    },
    {
      label: '2015',
      value: '2015',
    },
    {
      label: '2014',
      value: '2014',
    },
    {
      label: '2013',
      value: '2014',
    },
  ],
};
export default {
  label: 'Finance',
  data() {
    return {
      filter: filter,
      filerKey: {
        time: '时间',
        count: '融资金额',
        type: '类别',
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      list: [
        {
          name: '沃尔德',
          img: 'https://s1.coincarp.com/logo/project/vauld.png?style=36',
          tags: ['Defi', 'NFT'],
          mount: '200万美元',
          people: [
            {
              name: 'LuneX 风险投资公司',
              img: 'https://s1.coincarp.com/logo/investor/lunex-ventures.png?style=36',
            },
            {
              name: '北区',
              img: 'https://s1.coincarp.com/logo/investor/northzone.png?style=36',
            },
          ],
          time: '2020 年 12 月 22 日',
        },
        {
          name: '沃尔德',
          img: 'https://s1.coincarp.com/logo/project/vauld.png?style=36',
          tags: ['Defi', 'NFT'],
          mount: '200万美元',
          people: [
            {
              name: 'LuneX 风险投资公司',
              img: 'https://s1.coincarp.com/logo/investor/lunex-ventures.png?style=36',
            },
            {
              name: '北区',
              img: 'https://s1.coincarp.com/logo/investor/northzone.png?style=36',
            },
          ],
          time: '2020 年 12 月 22 日',
        },
      ],
      keywords: '',
    };
  },
  created() {},
  methods: {
    handleCurrentChange() {},
    Search() {},
  },
};
</script>
<style lang="less" scoped>
.wrap {
  max-width: 1120px;
  margin: 0 auto;
  border-right: 1px solid hsla(0, 0%, 53%, 0.2);
  min-height: 100vh;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.menu-title {
  padding: 20px 20px;
  font-size: 20px;
  font-weight: 600;
  line-height: 20px;
  border-bottom: 1px solid hsla(0, 0%, 53%, 0.2);
  color: #010102;
}
.top {
  h2 {
    color: #474d56;
    font-size: 22px;
    font-weight: bold;
  }
  p {
    font-size: 15px;
    color: #666;
    margin-top: 10px;
  }
}
.filter {
  margin: 16px 0;
  display: flex;
  width: 600px;
  .filter-btn {
    color: #333;
    &:hover,
    &:focus {
      background: #f1f1f1;
      border: 1px solid #dcdfe6;
    }
  }
  .pop {
    margin-right: 10px;
  }
  .search {
    max-width: 200px;
    width: 200px;
    margin-left: 50px;
    /deep/.el-input__inner {
      border-radius: 20px;
    }
  }
}
.filter-content {
  max-height: 200px;
  overflow: auto;
  &::-webkit-scrollbar {
    // background-color: transparent;
    // display: none;
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ced4db;
    border-radius: 6px;
  }
  li {
    cursor: pointer;
    width: 100%;
    height: 34px;
    line-height: 35px;
    padding-right: 10px;
    display: block;
    padding: 0 5px;
    border-radius: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:hover {
      background: #eef2f7;
    }
  }
}

.tables {
  width: 100%;
  padding: 0 20px;
  font-size: 14px;
  color: #333;
  font-weight: bold;
  .avatar {
    display: flex;
    align-items: center;
    img {
      width: 30px;
      height: 30px;
      margin-right: 4px;
    }
  }
  .avators {
    display: flex;
  }
  .avator {
    display: flex;
    align-items: center;
    img {
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }
  }
  .tags {
    .tag {
      background: #eef2f7;
      margin-right: 4px;
      cursor: pointer;
      border: none;
      &:hover {
        background: #e1edff;
        color: #3688fc;
      }
    }
  }
}
.pagination {
  margin-top: 20px;
}
.more {
  cursor: pointer;
  background: #eef2f7;
  width: 24px;
  height: 24px;
  line-height: 20px;
  text-align: center;
  border-radius: 24px;
  margin-left: 10px;
  &:hover {
    background: #e1edff;
    color: #3688fc;
  }
}
</style>
