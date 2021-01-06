<template>
  <div id="text" class="text"></div>
</template>

<script>
export default {
  name: 'TextAnimation',
  props: {
    effect: {
      type: String,
      default: 'normal',
    },
    value: {
      type: String,
      default:
        '土地是以它的肥沃和收获而被估价的。才能也是土地，不过它生产的不是粮食，而是真理。如果只能滋生瞑想和幻想的话，即使再大的才能也只是砂地或盐池，那上面连小草也长不出来的。',
    },
    speed: {
      type: Number,
      default: 15,
    },
  },
  mounted() {
    this.animation();
  },
  methods: {
    animation() {
      console.log(this);
      var element = document.getElementById('text');
      var arr = this.value.split('');
      var i = 0;
      const that = this;
      var timer = setInterval(() => {
        var randomN = Math.floor(Math.random() * 4) + 1;
        var randomEffect = null;
        if (randomN === 1) {
          randomEffect = 'fadeInRightBig';
        }
        if (randomN === 2) {
          randomEffect = 'fadeInLeftBig';
        }
        if (randomN === 3) {
          randomEffect = 'fadeInUpBig';
        }
        if (randomN === 4) {
          randomEffect = 'fadeInDownBig';
        }
        let className = 'tip';
        if (that.effect !== 'normal') {
          if (this.effect !== 'random') {
            className += ` animated fadeIn${that.effect.substring(0, 1).toUpperCase() +
              that.effect.substring(1)}`;
          } else {
            className += ` animated ${randomEffect}`;
          }
        }
        var span = document.createElement('span');
        span.style.display = 'inline-block';
        span.innerHTML = arr[i];
        span.setAttribute('class', 'tip');
        element.appendChild(span);
        setTimeout(() => {
          span.setAttribute('class', className);
        }, 30);
        i++;
        if (i >= arr.length - 1) {
          console.log('end');
          clearInterval(timer);
        }
      }, this.speed);
    },
  },
};
</script>

<style lang="less">
.text {
  width: 420px;
  height: 280px;
  background: rgba(187, 236, 234, 0.2);
  margin: 0 auto;
  margin-top: 35px;
  padding: 15px;
  font-size: 25px;
  line-height: 45px;
  border-radius: 5px;
  -webkit-box-shadow: 3px 3px 3px 4px rgba(105, 152, 211, 0.44);
  -moz-box-shadow: 3px 3px 3px 4px rgba(105, 152, 211, 0.44);
  box-shadow: 3px 3px 3px 4px rgba(105, 152, 211, 0.44);
  text-align: left;
}
</style>
