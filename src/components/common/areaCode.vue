<!--
  * @Author: jianbang
  * @Description: 不同国家手机号区号选择器
 -->

<template>
  <div>1234</div>
</template>

<script>
export default {
  name: 'AreaCode',
  props: {},
  components: {},
  data() {
    return {
      areaCodeList: [],
    };
  },
  created() {
    this.getArea();
  },
  methods: {
    getArea() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: '/web/country/list',
        },
        onSuccess: res => {
          console.log(res);
        },
      });
    },
    async onReload() {
      this.reloadLoading = true;
      await this.getArea();
      this.reloadLoading = false;
    },
  },
};
</script>

<style lang="less" scoped></style>
