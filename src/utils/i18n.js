import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messages from '@/language/en';
import store from '../store/index';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en', // 设置默认语言环境
  fallbackLocale: 'en',
  messages,
});

export default i18n;
const loadedLanguages = ['en']; // 我们的默认语言

export function setI18nLanguage(lang) {
  i18n.locale = lang;
  store.dispatch('changeLanguage', lang);
  document.querySelector('html').setAttribute('lang', lang);
  if (lang == 'ar') {
    document.querySelector('html').setAttribute('dir', 'rtl');
  } else {
    document.querySelector('html').removeAttribute('dir');
  }
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
