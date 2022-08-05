<template>
  <div class="content">
    <article class="markdown-body">
      <md />
    </article>
  </div>
</template>
<script>
import 'github-markdown-css/github-markdown-light.css';
import md from './help.md';
export default {
  name: 'Help',
  components: {
    md,
  },
};
</script>
<style lang="less" scoped>
.content {
  /deep/.markdown-body {
    padding: 0 18px;
    background: #f9f9fb;
  }
}
</style>
