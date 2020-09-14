<template>
  <div>
    <k-form-design @save='save'/>
  </div>
</template>

<script>
import {saveModel} from '../../../api/api.js'
export default {
  methods:{
    /**
     * 保存
     * @param {String} param
     */
    save(param){
      saveModel({
        body:{
          id: '5f56ea6d526e785ce41c313a',
          form: param
        }
      }).then(res => {
        this.$message.success('保存成功 ！')
      }).catch(err => {
        
      })
    }
  }
}
</script>
