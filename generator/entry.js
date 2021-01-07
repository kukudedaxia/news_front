/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const createEl = function(tag, props) {
  let el = document.createElement(tag);
  if (props) {
    for (let k in props) {
      el.setAttribute(k, props[k]);
    }
  }
  return el;
};
const parseLink = function(files) {
  let oFragment = document.createDocumentFragment();
  for (let file in files) {
    if (file === 'favicon.ico') {
      continue;
    }
    if (/\.js/.test(files[file]) || /\.css/.test(files[file])) {
      let props = {
        rel: 'prefetch',
        href: files[file],
      };
      if (file === 'app.js' || file === 'chunk-vendors.js') {
        props = {
          rel: 'preload',
          href: files[file],
          as: 'script',
        };
      } else if (file === 'app.css' || file === 'chunk-vendors.css') {
        props = {
          rel: 'preload',
          href: files[file],
          as: 'style',
        };
      }
      let el = createEl('link', props);
      oFragment.appendChild(el);
    }
  }
  return oFragment;
};
const parseScript = function(files) {
  let bodyFragment = document.createDocumentFragment();
  let headFragment = document.createDocumentFragment();
  for (let file in files) {
    if (file === 'favicon.ico') {
      continue;
    }
    let tag = '';
    let props = null;
    if (/\.js$/.test(files[file])) {
      tag = 'script';
      props = {
        type: 'text/javascript',
        src: files[file],
      };
    } else if (/\.css$/.test(files[file])) {
      tag = 'link';
      props = {
        rel: 'stylesheet',
        href: files[file],
      };
    }
    if (tag) {
      let el = createEl(tag, props);
      tag === 'script' ? bodyFragment.appendChild(el) : headFragment.appendChild(el);
    }
  }
  return { bodyFragment, headFragment };
};
const init = function() {
  if (!assetManifest) {
    return;
  }
  const entry = document.querySelector('script[entry]');
  const linkDOM = parseLink(assetManifest['files'] || {});
  const scriptDOM = parseScript(assetManifest['entrypoints'] || []);
  document.head.appendChild(linkDOM);
  document.head.appendChild(scriptDOM.headFragment);
  document.body.appendChild(scriptDOM.bodyFragment);
  entry && entry.parentNode.removeChild(entry);
};
