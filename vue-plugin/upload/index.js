import Upload from './upload.vue';

const install = function (Vue, opts = {}) {
  if (install.installed) return;
  Vue.component('PUpload', Upload);
}
export default install;
