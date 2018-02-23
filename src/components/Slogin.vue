<style scoped >
.login-form {
    position: fixed;
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
import { login, isAuthenticated } from '../qc-api'
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
        isAuthenticated()
            .then(response => {
                this.$router.push({ path: '/' })
            })
            .catch(err => {
                console.log('正在打开登录页面')
            })
    },
    methods: {
        handleSubmit(name) {
            const vm = this
            this.$refs[name].validate(function(valid) {
                if (valid) {
                    login(vm.formCustom)
                        .then(vm.$router.push({ path: '/' }))
                        .catch(err => {
                            console.log(err)
                            vm.$router.go(0)
                        })
                }
            })
        }
    }
}
</script>
