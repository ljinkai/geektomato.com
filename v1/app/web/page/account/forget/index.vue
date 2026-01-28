<template>
    <LoginLayout :hide="true" title="geektomato.com-reset">
        <div class="login-container">
            <div class="blue-shadow"></div>
            <div class="login-content">
                <div class="title">忘记密码</div>

                <Form :model="form" :rules="rules" ref="emailForm" class="login-window" label-width="80px">
                    <FormItem label="用户名" prop="userName">
                        <Input v-model="form.userName" type="text"/>
                    </FormItem>
                    <FormItem class="submit-container">
                        <Button type="primary" class="login-submit upcase" :loading="Loading" @click="submitForm">确 认</Button>
                    </FormItem>
                </Form>

                <p class="contact">如在修改密码过程中遇到问题，请联系 b@geektomatoapp.com</p>
            </div>
        </div>
    </LoginLayout>

</template>

<style lang="stylus">
    @import 'index.styl'
</style>

<script type="text/babel">
import axios from 'axios'
import tools from 'tools'
import {Form, FormItem, Input, Button, Message} from 'element-ui'
import LoginLayout from 'component/layout/login'
axios.defaults.headers.post['x-csrf-token'] = tools.getCookie('csrfToken')

export default {
    name: 'Forget',
    components: {
        Form,
        FormItem,
        Input,
        Button,
        Message,
        LoginLayout
    },
    data() {
        return {
            form: {
                userName: ''
            },
            rules: {
                userName: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ]
            },
            Loading: false
        }
    },
    methods: {
        submitForm() {
            const formName = 'emailForm'
            const submitURL = '/account/_forget'
            const host = window.location.protocol + '//' + window.location.host
            const {userName} = this.form

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.Loading = true
                    axios.post(submitURL, {
                        userName,
                        host
                    }).then(response => {
                        tools.responseHandler(response, result => {
                            Message({showClose: true, message: '邮件已发送，请注意查收', type: 'success'})
                        }, result => {
                            Message({showClose: true, message: result._msg, type: 'error'})
                        })
                        this.Loading = false
                    }).catch(error => {
                        this.Loading = false
                        Message({showClose: true, message: tools.errorContent(error), type: 'error'})
                    })
                }
            })
        }
    }
}
</script>
