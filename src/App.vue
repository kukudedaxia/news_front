<template>
  <div id="app">
    <div id="nav">
      <Header />
    </div>
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/header';
import Footer from '@/components/footer';

export default {
  name: 'APP',
  components: {
    Header,
    Footer
  },
};
</script>
