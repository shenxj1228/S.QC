<style scoped>
.login-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ivu-form-item {
  padding-top: 2.5em;
}
</style>

<template>
   <Card class='login-form' style="width: 500px;background:rgba(255,255,255,0.85)!important;">
        <h2 slot="title" >
         <Icon type="locked"></Icon>
            登录QC                       
        </h2>
       
       <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80" >
        <FormItem label="域账号" prop="account">
            <Input type="text"  v-model="formCustom.account" ></Input>
        </FormItem>
        <FormItem label="密码" prop="passwd">
            <Input type="password"  v-model="formCustom.passwd"></Input>
        </FormItem>
       
        <FormItem>
            <Button long type="success" @click="handleSubmit('formCustom')" >登 录</Button>
        </FormItem>
    </Form>
   </Card>
</template>
<script>
export default {
  name: 'Slogin',
  data: function() {
    const validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入域账号'))
      } else {
        callback()
      }
    }
    const validatePasswd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }

    return {
      formCustom: {
        passwd: '',
        account: ''
      },
      ruleCustom: {
        account: [{ validator: validateAccount, trigger: 'blur' }],
        passwd: [{ validator: validatePasswd, trigger: 'blur' }]
      }
    }
  },
  created: function(params) {
    this.$http.get('/qcbin/rest/is-authenticated').then(
      response => {
        this.$router.push({ path: '/' })
      },
      response => {}
    )
  },
  methods: {
    handleSubmit(name) {
      const vm = this
      this.$refs[name].validate(function(valid) {
        if (valid) {
          vm
            .$http({
              url: '/qcbin/authentication-point/authenticate',
              method: 'get',
              auth: {
                username: vm.formCustom.account,
                password: vm.formCustom.passwd
              }
            })
            .then(
              res => {
                if (res.status === 200) {
                  vm.$router.push({ path: '/' })
                }
              },
              res => {
                console.log(res)
              }
            )
            .catch(err => {
              console.log(333)
              vm.$router.go(0)
            })
        }
      })
    }
  }
}
</script>
