<i18n>
{
    "en": {
        "title": "Contact us",
        "p1": "User Feedback Email",
        "email": "contact@mena.bee.to"
    },
    "ar": {
        "title": "تواصل معنا",
        "p1": "البريد الإلكتروني للتواصل عند وجود ملاحظات:",
        "email": "contact@mena.bee.to"
    }
}
</i18n>
<template>
  <div class="wrap docs ardocs" id="docs">
    <h1>{{ $t('title') }}</h1>
    <p>{{ $t('p1') }}</p>
    <div class="text-right">
      <a
        href="mailto:contact@mena.bee.to"
        data-href="mailto:contact@mena.bee.to"
        target="_blank"
        rel="noopener noreferrer"
        spellcheck="false"
        ><span data-string="true">{{ $t('email') }} </span></a
      >
    </div>
  </div>
</template>
<script>
export default {
  name: 'Concat',
  mounted() {
    document.getElementById('docs').style.minHeight = window.innerHeight - 56 - 100 - 41 + 'px';
  },
};
</script>
<style lang="less" scoped>
.wrap {
  //   min-height: 770px;
}
</style>
