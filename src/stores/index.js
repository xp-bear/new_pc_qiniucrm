import { defineStore } from "pinia";

export const useStore = defineStore({
  id: "useStore",
  state: () => ({
    userObj: {}, //保存用户信息
    cardDataArray: [], //查询到的卡片数组
    pageIndex: 1, //当前页码
    pageTotal: 24, //当前页码的总条数
    pageCount: 0, //所有符合条件的条数
    activeCount: 4, //左侧侧边栏选择。

    DrawerDataFlag: false, //抽屉组件的展开状态
    DrawerDataItem: "", //当前抽屉展示的数据
    DrawerDataIndex: 0, //当前卡片索引
  }),
  getters: {},
  actions: {},
});

/*



    
     


*/
