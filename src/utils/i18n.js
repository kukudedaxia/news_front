import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from '@/language/en';
import zh from '@/language/zh';
import store from '../store/index';
import request from './request';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'zh', // 设置默认语言环境
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
  },
});

export default i18n;
const loadedLanguages = ['zh', 'en']; // 我们的默认语言

export function setI18nLanguage(lang) {
  i18n.locale = lang;
  store.dispatch('changeLanguage', lang);
  request.defaults.headers.common['Accept-Language'] = lang;
  document.querySelector('html').setAttribute('lang', lang);
  appendMeta();
  return lang;
}

export function loadLanguageAsync(lang) {
  if (i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      return import(/* webpackChunkName: "lang-[request]" */ `@/language/${lang}`)
        .then(msgs => {
          if (msgs.default) {
            i18n.setLocaleMessage(lang, msgs.default[lang]);
            loadedLanguages.push(lang);
            return setI18nLanguage(lang);
          }
        })
        .catch(() => console.log('import loaded failed'));
    }
    return Promise.resolve(setI18nLanguage(lang));
  }
  return Promise.resolve();
}

const appendMeta = () => {
  const metas = document.getElementsByTagName('meta');
  let flag = false;
  let oldMeta;
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === 'description') {
      flag = true;
      oldMeta = metas[i];
    }
  }
  if (flag) {
    document.getElementsByTagName('head')[0].removeChild(oldMeta);
  }
  const meta = document.createElement('meta');
  meta.name = 'description';
  meta.content = i18n.t('content');
  const lastMeta = document.getElementsByTagName('link')[0];
  document.head.insertBefore(meta, lastMeta);
};
