<template>
  <div class="option-change-container">
    <a-row v-if="type === 'option'" :gutter="8">
      <div class="option-change-box" v-for="(val, index) in value" :key="index">
        <a-col :span="12"
          ><a-input v-model="val.label" placeholder="名称"
        /></a-col>
        <a-col :span="9"><a-input v-model="val.value" placeholder="值"/></a-col>
        <a-col :span="3"
          ><div @click="handleDelete(index)" class="option-delete-box">
            <a-icon type="delete" /></div
        ></a-col>
      </div>
      <a-col :span="24"><a @click="handleAdd">添加</a></a-col>
    </a-row>

    <a-row v-if="type === 'cascader'" :gutter="8">
      <el-tree :data="copyValue" node-key="value" :expand-on-click-node="false" :indent="14" :default-expanded-keys="expandKeys" @node-expand="nodeExpand" @node-collapse="nodeCollapse">
        <div slot-scope="{ node, data }" style="width: 100%;display: flex">
          <div style="flex: 1"><a-input style="height: 24px; line-height: 24px" :value="node.label" @blur="optChange($event, node, data)" :ref="node.id"/></div>
          <div style="width: 80px">
            <a-button
              style="padding:0 5px"
              type="link"
              @click="() => appendOpt(node, data)">
              添加
            </a-button>
            <a-button
              style="padding:0 5px"
              type="link"
              @click="() => removeOpt(node, data)">
              删除
            </a-button>
          </div>
        </div>
      </el-tree>
<!--      <a-tree :tree-data="copyValue" node-key="value" :expand-on-click-node="false" :indent="12" :default-expanded-keys="expandKeys" @node-expand="nodeExpand" @node-collapse="nodeCollapse">-->
<!--        <div slot="title" slot-scope="{ title }" style="width: 100%;display: flex">-->
<!--          <div style="flex: 1"><a-input style="height: 24px; line-height: 24px" :value="node.label" @blur="optChange($event, node, data)" /></div>-->
<!--          <div style="width: 80px">-->
<!--            <a-button-->
<!--              style="padding:0 5px"-->
<!--              type="link"-->
<!--              @click="() => appendOpt(node, data)">-->
<!--              添加-->
<!--            </a-button>-->
<!--            <a-button-->
<!--              style="padding:0 5px"-->
<!--              type="link"-->
<!--              @click="() => removeOpt(node, data)">-->
<!--              删除-->
<!--            </a-button>-->
<!--          </div>-->
<!--        </div>-->
<!--      </a-tree>-->
      <a-col :span="24"><a @click="handleAdd">添加</a></a-col>
    </a-row>

    <a-row v-if="type === 'rules'" :gutter="8">
      <span v-for="(val, index) in value" :key="index">
        <div class="option-change-box" v-if="index !== 0">
          <a-col :span="18"
            ><a-input v-model="val.message" placeholder="提示信息"
          /></a-col>
          <a-col :span="18"
            ><a-input v-model="val.pattern" placeholder="正则表达式pattern"
          /></a-col>
          <a-col :span="6"
            ><div @click="handleDelete(index)" class="option-delete-box">
              <a-icon type="delete" /></div
          ></a-col>
        </div>
      </span>
      <a-col :span="24"><a @click="handleAddRules">增加校验</a></a-col>
    </a-row>
    <a-row v-else-if="type === 'colspan'" :gutter="8">
      <div class="option-change-box" v-for="(val, index) in value" :key="index">
        <a-col :span="18"
          ><a-input-number
            style="width:100%"
            :max="24"
            v-model="val.span"
            placeholder="名称"
        /></a-col>
        <a-col :span="6"
          ><div @click="handleDelete(index)" class="option-delete-box">
            <a-icon type="delete" /></div
        ></a-col>
      </div>
      <a-col :span="24"><a @click="handleAddCol">添加</a></a-col>
    </a-row>
  </div>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 * description 修改多选、下拉、单选等控件options的组件，添加移除校验规制的组件
 */
export default {
  name: "KChangeOption",
  props: {
    value: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      default: "option"
    }
  },
  data() {
    return {
      expandKeys: [],
      addOptId: ''
    }
  },
  computed: {
    copyValue() {
      // return this.formatValue(JSON.parse(JSON.stringify(this.value)))
      return this.value
    }
  },
  methods: {
    formatValue(data) {
      return data.map((val, index) => {
        if (val.children && val.children.length) {
          val.children = this.formatValue(val.children)
          return {
            ...val,
            id: index
          }
        }
        return {
          ...val,
          id: index
        }
      })
    },
    unFormatValue(data) {
      return data.map(val => {
        if (val.children && val.children.length) {
          val.children = this.unFormatValue(val.children)
          return {
            label: val.title,
            value: val.key,
            children: val.children
          }
        }
        return {
          label: val.title,
          value: val.key
        }
      })
    },
    removeEmptyValue(data) {
      return data.filter(val => {
        if (val.children && val.children.length) {
          this.removeEmptyValue(val.children)
          return val.value
        }
        return val.value
      })
    },
    nodeExpand(e) {
      this.expandKeys.push(e.value)
    },
    nodeCollapse(e) {
      this.expandKeys = this.expandKeys.filter(val => val !== e.value)
    },
    optChange(e, node, data) {
      if (e.srcElement.value) {
        data.label = data.value = e.srcElement.value
        // this.copyValue
        this.$emit("input", [...this.copyValue])
      }else {
        this.removeOpt(node, data)
      }
    },
    appendOpt(node, data) {
      data.children.push({
        label: '',
        value: '',
        children: []
      })
      this.expandKeys.push(data.value)
      this.$nextTick(() => {
        window.addOptId = ''
        data.children.forEach(val => {
          if(!val.value) {
            window.addOptId = val.$treeNodeId
          }
        })
        setTimeout(() => {
          this.$refs[window.addOptId].$el.focus()
        }, 0)
      })
    },
    removeOpt(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.value === data.value);
      children.splice(index, 1);
      this.expandKeys = this.expandKeys.filter(val => val !== data.value)
      this.$emit("input", [...this.copyValue])
    },
    handleAdd() {
      // 添加
      let value = this.value
      // if (this.type === 'cascader') {
      //   value = this.unFormatValue(this.copyValue)
      // }
      let addData = [
        ...value,
        {
          label: '',
          value: '',
          children: []
        }
      ];
      // console.log(addData)
      this.$emit("input", addData);
    },
    handleAddCol() {
      // 添加栅格Col
      let addData = [
        ...this.value,
        {
          span: 12,
          list: []
        }
      ];
      this.$emit("input", addData);
    },
    handleAddRules() {
      let addData = [
        ...this.value,
        {
          pattern: "",
          message: ""
        }
      ];
      this.$emit("input", addData);
    },
    handleDelete(deleteIndex) {
      // 删除
      this.$emit(
        "input",
        this.value.filter((val, index) => index !== deleteIndex)
      );
    }
  }
};
</script>
<style lang="less" scoped>
.option-change-container {
  width: calc(100% - 8px);
}
.option-change-box {
  height: 38px;
  padding-bottom: 6px;
  .option-delete-box {
    margin-top: 3px;
    background: #ffe9e9;
    color: #f22;
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 50%;
    overflow: hidden;
    transition: all 0.3s;
    &:hover {
      background: #f22;
      color: #fff;
    }
  }
}
</style>
