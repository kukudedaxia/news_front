/**
 * @author jianbang
 * @description v-arInput 自定义指令的暴露方法
 */

import tools from '@/utils/tools';
import store from '../store';

// 给输入元素(input, textarea)添加/删除右对其类
export function editClass(dom) {
  const { lang } = store.state;
  // 如果首字母是阿语，则输入右排列
  if (tools.checkAr(dom.value) === true) {
    dom.classList.add('pub-rtl');
    dom.classList.remove('con-left');
    return true;
  }
  // 如果首字母是英文，则输入左排列
  if (tools.checkAr(dom.value) === false) {
    dom.classList.remove('pub-rtl');
    dom.classList.add('con-left');
    return false;
  }
  // 如果输入框请空，在阿语下右排列，英文下左排列
  if (dom.value === '') {
    if (lang === 'ar') {
      // dom.classList.add('pub-rtl');
      dom.classList.remove('con-left');
    } else {
      dom.classList.remove('pub-rtl');
    }
  }
}

// 检测特殊字符
export function checkSpecial(str) {
  var arr = str.split(' ');
  var newArr = arr.map(item => {
    if (item.includes('#')) {
      const index = item.indexOf('#');
      // 检测下一个字符是英文还是阿语
      const next = index + 1 == item.length ? '' : item[index + 1];
      let newStr;
      if (tools.checkAr(next)) {
        newStr = item.substring(0, index) + '\u200F#' + item.substring(index + 1);
      } else {
        newStr = item.substring(0, index) + '\u200E#' + item.substring(index + 1);
      }
      return newStr;
    }
    return item;
  });
  return newArr.join(' ');
}
