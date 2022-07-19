/**
 * @author jianbang
 * @description 全局注册使用频率高的ui组件
 */

import {
  Dialog,
  Notify,
  Toast,
  Skeleton,
  Tab,
  Tabs,
  List,
  Field,
  Switch,
  Uploader,
  Loading,
  Radio,
  RadioGroup,
  Sticky,
  Checkbox,
  CheckboxGroup,
  CountDown,
  Overlay,
  NoticeBar,
  Swipe,
  SwipeItem,
  Image as VanImage,
  Cell,
  CellGroup,
  Popup,
} from 'vant';
import Vue from 'vue';

const configList = [
  {
    name: 'dialog',
    source: Dialog,
    isFunction: true, // 函数挂载
    isComponent: true, // 组件挂载
  },
  {
    name: 'Overlay',
    source: Overlay,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'Uploader',
    source: Uploader,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'notify',
    source: Notify,
    isFunction: true,
    isComponent: true,
  },
  {
    name: 'toast',
    source: Toast,
    isFunction: true,
    isComponent: true,
  },
  {
    name: 'skeleton',
    source: Skeleton,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'Tab',
    source: Tab,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'Tabs',
    source: Tabs,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'List',
    source: List,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'Field',
    source: Field,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'Switch',
    source: Switch,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'Loading',
    source: Loading,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'Radio',
    source: Radio,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'RadioGroup',
    source: RadioGroup,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'Sticky',
    source: Sticky,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'Checkbox',
    source: Checkbox,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'CheckboxGroup',
    source: CheckboxGroup,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'Countdown',
    source: CountDown,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'VanImage',
    source: VanImage,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'NoticeBar',
    source: NoticeBar,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'Swipe',
    source: Swipe,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'SwipeItem',
    source: SwipeItem,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'Cell',
    source: Cell,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'CellGroup',
    source: CellGroup,
    isFunction: false,
    isComponent: true,
  },
  {
    name: 'Popup',
    source: Popup,
    isFunction: false,
    isComponent: true,
  },
];

configList.forEach(item => {
  if (item.isComponent) {
    Vue.use(item.source);
  }
  if (item.isFunction) {
    Vue.prototype[`$${item.name}`] = item.source;
  }
});
