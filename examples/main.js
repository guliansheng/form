// 引入@babel/polyfill处理兼容
import "@babel/polyfill";

import Vue from "vue";
import App from "./App.vue";
import router from "./router/";

import KFormDesign from "../packages/index";
import FixedTable from "./components/CustomComponent/fixedTable.vue";
// let Cmp = {
//   name: "cmp",
//   render: function(h) {
//     return h("div", "我是自定义组件");
//   }
// };
KFormDesign.setConfig({
  title: "自定义控件",
  list: [
    {
      type: "fixedTable", // 表单类型
      label: "固定表格", // 标题文字
      icon: "icon-gallery",
      component: FixedTable,
      options: {
        defaultValue: undefined,
        width: "100%",
        placeholder: "待填写",
        dynamicKey: "",
        dynamic: false,
        options: [
          {label: '项目1', value: ''},
          {label: '项目2', value: ''}
        ]
      },
      model: "",
      key: "",
      rules: [
        {
          required: false,
          message: "必填项"
        }
      ]
    }
  ]
});
Vue.use(KFormDesign);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
