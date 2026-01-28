<template>
    <LoginLayout :hide="true" title="geektomato.com-reset">
        <div class="login-container">
            <div class="blue-shadow"></div>
            <div class="login-content">
                <div class="title">修改密码</div>

                <Form :model="form" :rules="rules" ref="resetForm" class="login-window" label-width="80px">
                    <FormItem label="旧密码" prop="oldPwd">
                        <Input v-model="form.oldPwd" type="password"/>
                    </FormItem>
                    <FormItem label="新密码" prop="newPwd">
                        <Input type="password" v-model="form.newPwd" auto-complete="off" @keyup.enter.native="submitForm"/>
                    </FormItem>
                    <FormItem label="确认密码" prop="confirmPwd">
                        <Input type="password" v-model="form.confirmPwd" auto-complete="off" @keyup.enter.native="submitForm"/>
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
    name: 'Reset',
    components: {
        Form,
        FormItem,
        Input,
        Button,
        Message,
        LoginLayout
    },
    data() {
        const validateNewPwd = (rule, value = '', callback) => {
            if (value.length < 6 || !(/[a-zA-Z]/g.test(value) && /[0-9]/g.test(value))) {
                callback(new Error('新密码至少6位，且包含数字和字母。'))
            } else if (value === this.data.form.oldPwd) {
                callback(new Error('新密码不能和旧密码一样。'))
            } else {
                callback()
            }
        }
        const validateConfirmPwd = (rule, value = '', callback) => {
            if (value !== this.data.form.newPwd) {
                callback(new Error('输入的密码不一致。'))
            } else {
                callback()
            }
        }
        return {
            form: {
                oldPwd: '',
                newPwd: '',
                confirmPwd: ''
            },
            rules: {
                oldPwd: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ],
                newPwd: [
                    {required: true, message: '请输入新密码', trigger: 'blur'},
                    {validator: validateNewPwd, trigger: 'blur'}
                ],
                confirmPwd: [
                    {required: true, message: '请重复新密码', trigger: 'blur'},
                    {validator: validateConfirmPwd, trigger: 'blur'}
                ]
            },
            Loading: false
        }
    },
    methods: {
        submitForm() {
            const formName = 'resetForm'
            const submitURL = '/account/reset'
            const {oldPwd, newPwd} = this.form
            const userName = JSON.parse(tools.getCookie('x_header')).userName

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.Loading = true
                    axios.post(submitURL, {
                        username: userName,
                        oldpassword: oldPwd,
                        newpassword: newPwd
                    }).then(response => {
                        tools.responseHandler(response, result => {
                            Message({showClose: true, message: result.info, type: 'success'})
                            tools.deleteCookie('x_header')
                            localStorage.removeItem('privilege')
                            window.location.href = '/login'
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
