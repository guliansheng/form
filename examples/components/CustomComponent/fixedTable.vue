<template>
  <div>
    <a-table :data-source="data" bordered :pagination="false" :showHeader="false">
      <a-table-column key="label" title="label" data-index="label" />
      <a-table-column key="action" title="Action">
        <template slot-scope="text">
          <a-input style="height: 24px; line-height: 24px" :placeholder="record.options.placeholder" @change="handleChange($event, text)"/>
        </template>
      </a-table-column>
    </a-table>
  </div>
</template>
<script>
export default {
  name: "fixedTable",
  props: ['record'],
  computed: {
    data() {
      return this.record.options && (this.record.options.options || [])
    },
    values() {
      if (this.record.options && this.record.options.options) {
        return this.record.options.options.map(val => {
          return {[val.value]: ''}
        })
      } else {
        return []
      }
    }
  },
  methods: {
    handleChange(e, text) {
      this.values.forEach(val => {
        let keys = Object.keys(val)
        if (keys[0] === text.value) {
          val[text.value] = e.target.value
        }
      })
      // 使用 onChange 事件修改值
      this.$emit("change", this.values);
    }
  }
};
</script>
<style lang="less" scoped>
  /deep/ .ant-table-tbody > tr > td {
    padding: 10px 12px;
    input {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      box-shadow: none;
    }
  }
  /deep/ .ant-table-tbody > tr > td:first-child{
    background: #fbfbfb;
  }
</style>
