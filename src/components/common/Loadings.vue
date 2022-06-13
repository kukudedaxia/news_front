<template>
  <div class="loading">
    <span class="loading-box"></span>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    loadingBgTrans() {
      return this.$store.getters['route/getLoadingBgTrans'];
    },
  },
};
</script>

<style lang="less" scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  // background-image: transparent;
  z-index: 10000;
  overflow: hidden;
  .loading-box {
    width: 44px;
    height: 44px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: loading 1.1s ease infinite;
    -webkit-animation: loading 1.1s ease infinite;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  @keyframes loading {
    2% {
      background-image: url('../../assets/images/loading/loading_00000.png');
    }
    4% {
      background-image: url('../../assets/images/loading/loading_00001.png');
    }
    6% {
      background-image: url('../../assets/images/loading/loading_00002.png');
    }
    8% {
      background-image: url('../../assets/images/loading/loading_00003.png');
    }
    10% {
      background-image: url('../../assets/images/loading/loading_00004.png');
    }
    12% {
      background-image: url('../../assets/images/loading/loading_00005.png');
    }
    14% {
      background-image: url('../../assets/images/loading/loading_00006.png');
    }
    16% {
      background-image: url('../../assets/images/loading/loading_00007.png');
    }
    18% {
      background-image: url('../../assets/images/loading/loading_00008.png');
    }
    20% {
      background-image: url('../../assets/images/loading/loading_00009.png');
    }
    22% {
      background-image: url('../../assets/images/loading/loading_00010.png');
    }
    24% {
      background-image: url('../../assets/images/loading/loading_00011.png');
    }
    26% {
      background-image: url('../../assets/images/loading/loading_00012.png');
    }
    28% {
      background-image: url('../../assets/images/loading/loading_00013.png');
    }
    30% {
      background-image: url('../../assets/images/loading/loading_00014.png');
    }
    32% {
      background-image: url('../../assets/images/loading/loading_00015.png');
    }
    34% {
      background-image: url('../../assets/images/loading/loading_00016.png');
    }
    36% {
      background-image: url('../../assets/images/loading/loading_00017.png');
    }
    38% {
      background-image: url('../../assets/images/loading/loading_00018.png');
    }
    40% {
      background-image: url('../../assets/images/loading/loading_00019.png');
    }
    42% {
      background-image: url('../../assets/images/loading/loading_00020.png');
    }
    44% {
      background-image: url('../../assets/images/loading/loading_00021.png');
    }
    46% {
      background-image: url('../../assets/images/loading/loading_00022.png');
    }
    48% {
      background-image: url('../../assets/images/loading/loading_00023.png');
    }
    50% {
      background-image: url('../../assets/images/loading/loading_00024.png');
    }
    52% {
      background-image: url('../../assets/images/loading/loading_00025.png');
    }
    54% {
      background-image: url('../../assets/images/loading/loading_00026.png');
    }
    56% {
      background-image: url('../../assets/images/loading/loading_00027.png');
    }
    58% {
      background-image: url('../../assets/images/loading/loading_00028.png');
    }
    60% {
      background-image: url('../../assets/images/loading/loading_00029.png');
    }
    62% {
      background-image: url('../../assets/images/loading/loading_00030.png');
    }
    64% {
      background-image: url('../../assets/images/loading/loading_00031.png');
    }
    64% {
      background-image: url('../../assets/images/loading/loading_00031.png');
    }
    66% {
      background-image: url('../../assets/images/loading/loading_00032.png');
    }
    68% {
      background-image: url('../../assets/images/loading/loading_00033.png');
    }
    70% {
      background-image: url('../../assets/images/loading/loading_00034.png');
    }
    72% {
      background-image: url('../../assets/images/loading/loading_00035.png');
    }
    74% {
      background-image: url('../../assets/images/loading/loading_00036.png');
    }
    76% {
      background-image: url('../../assets/images/loading/loading_00037.png');
    }
    78% {
      background-image: url('../../assets/images/loading/loading_00038.png');
    }
    80% {
      background-image: url('../../assets/images/loading/loading_00039.png');
    }
    82% {
      background-image: url('../../assets/images/loading/loading_00040.png');
    }
    84% {
      background-image: url('../../assets/images/loading/loading_00041.png');
    }
    86% {
      background-image: url('../../assets/images/loading/loading_00042.png');
    }
    88% {
      background-image: url('../../assets/images/loading/loading_00043.png');
    }
    90% {
      background-image: url('../../assets/images/loading/loading_00044.png');
    }
    92% {
      background-image: url('../../assets/images/loading/loading_00045.png');
    }
    94% {
      background-image: url('../../assets/images/loading/loading_00046.png');
    }
    96% {
      background-image: url('../../assets/images/loading/loading_00047.png');
    }
    98% {
      background-image: url('../../assets/images/loading/loading_00048.png');
    }
    100% {
      background-image: url('../../assets/images/loading/loading_00049.png');
    }
  }
}
// 透明背景
.loading-bg-trans {
  background: transparent !important;
}
</style>
