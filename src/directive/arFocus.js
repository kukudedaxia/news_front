/**
 * @author jianbang
 * @description 自定义指令，检测输入框是否输入阿语，并改变文本布局方向
 */

import Vue from 'vue';
import store from '../store';
import { editClass, checkSpecial } from './arFocusTools';

Vue.directive('arInput', {
  inserted: (el, binding, vnode) => {
    let cb_name = binding.expression;
    let cb = vnode.context[cb_name];
    //单独做element操作
    if (el.tagName == 'DIV') {
      let domTextArea = el.querySelector('textarea');
      domTextArea.value = checkSpecial(domTextArea.value);
    }
    el.addEventListener('keyup', event => {
      if (event.key == '#') {
        event.target.value = checkSpecial(event.target.value);
      }
    });

    // input事件触发
    el.addEventListener('input', () => {
      handler();
    });

    // change事件触发
    el.addEventListener('change', () => {
      // 此时dom的值还未更新，需要加个异步函数，无法使用Vue.nextTick,因为不是一个实例
      setTimeout(() => {
        handler();
      });
    });

    function handler() {
      if (el.tagName === 'INPUT') {
        editClass(el);
        cb && cb();
        return;
      }

      // 当使用ui组件，input/textarea做了封装时，找寻其后代输入元素
      let domTextArea = el.querySelector('textarea');
      if (domTextArea) {
        const state = editClass(domTextArea);
        cb && cb(state);
      }
    }

    // 给所有绑定了arInput指令的el-input里的textarea元素加上 'pub-rtl'类
    // 必须在阿语环境下
    if (store.state.lang === 'ar') {
      let domTextArea = el.querySelector('textarea');
      if (domTextArea) {
        const state = editClass(domTextArea);
        cb && cb(state);
      }
      // domTextArea && domTextArea.classList.add('pub-rtl');
    }
  },
  unbind: el => {
    // eslint-disable-next-line prettier/prettier
    el.removeEventListener('arInput', () => { });
  },
});
