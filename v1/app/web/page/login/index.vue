<template>
    <LoginLayout :hide="true" title="极客番茄-login">
        <div class="login-container">
            <div class="blue-shadow"></div>
            <div class="login-content">
                <div class="title">极客番茄</div>

                <Form :model="form" :rules="rules" ref="loginForm" class="login-window" label-width="56px">
                    <FormItem label="用户名" prop="userName">
                        <Input v-model="form.userName" type="text"/>
                    </FormItem>
                    <FormItem label="密码" prop="password">
                        <Input type="password" v-model="form.password" auto-complete="off" @keyup.enter.native="submitForm"/>
                    </FormItem>
                    <FormItem label="验证码" prop="imgCode" class="image-code-container">
                        <Input type="text" v-model="form.imgCode" auto-complete="off" @keyup.enter.native="submitForm"/>
                        <span class="pointer" v-html="imageBlock" @click="_getImageCaptcha" alt="点击刷新"></span>
                        <!--<img :src="getImageBase" @click="_getImageCaptcha" alt="点击刷新" class="pointer">-->
                    </FormItem>
                    <FormItem class="submit-container">
                        <Button type="primary" class="login-submit upcase" :loading="Loading" @click="submitForm">登录</Button>
                    </FormItem>
                </Form>
                <p class="contact"><a href="/account/forget" target="_self" style="color: #3a8ee6">忘记密码</a> 如在登录过程中遇到问题，请联系 b@geektomatoapp.com</p>
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
// import RSA from 'framework/encrypt/SRA.js'
import LoginLayout from 'component/layout/login'
axios.defaults.headers.post['x-csrf-token'] = tools.getCookie('csrfToken')

export default {
    name: 'Login',
    components: {
        Form,
        FormItem,
        Input,
        Button,
        Message,
        LoginLayout
    },
    data() {
        // const image = null// tools.getBodyData('image')
        // const {captchaId, imageData } = (image && image.result) || {};

        return {
            form: {
                userName: '',
                email: '',
                password: '',
                imgCode: '',
                captchaId: ''
            },
            rules: {
                userName: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                email: [
                    {required: true, message: '请输入帐号', trigger: 'blur'},
                    {type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change']}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ],
                imgCode: [
                    {required: true, message: '请输入验证码', trigger: 'blur'}
                ]
            },
            imageBlock: null,
            Loading: false
        }
    },
    computed: {
    },
    created() {
        this.imageBlock = this.imgCaptha ? this.imgCaptha : ''
    },
    mounted() {},
    methods: {
        _getImageCaptcha() {
            const url = '/login/imgCaptcha'
            axios.post(url, {})
                .then(response => {
                    tools.responseHandler(response, function(result) {
                        this.imageBlock = result
                    }.bind(this),
                    function(result) {
                        Message({showClose: true, message: result._msg, type: 'error'})
                    })
                })
                .catch(error => {
                    Message({showClose: true, message: tools.errorContent(error), type: 'error'})
                })
        },
        submitForm() {
            const formName = 'loginForm'
            const submitURL = '/login/submit'

            const {password, imgCode, userName} = this.form

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.Loading = true
                    axios.post(submitURL,
                        {
                            userName,   
                            password,
                            imgCode
                        })
                        .then(response => {
                            tools.responseHandler(response, function(result) {
                                // result.result && (result.result.username = email);
                                // this.$cookie.set('x_header', JSON.stringify(result.result), {expires: '3h' });
                                const headerObj = {'userId': result.userId, 'userName': result.userName, 'role': result.role, 'email': result.email, 'token': result.token}
                                tools.setCookie('x_header', JSON.stringify(headerObj), 1)
                                // set privilege to local storage
                                localStorage.setItem(`privilege`, `${JSON.stringify(result.privilege)}`)
                                localStorage.setItem(`role`, `${JSON.stringify(result.role)}`)

                                window.location.href = tools.getQueryString('back') || '/'
                            },
                            function(result) {
                                this._getImageCaptcha()
                                Message({showClose: true, message: result._msg, type: 'error'})
                            }.bind(this))

                            this.Loading = false
                        })
                        .catch(error => {
                            this.Loading = false
                            this._getImageCaptcha()
                            Message({showClose: true, message: tools.errorContent(error), type: 'error'})
                        })
                }
            })
        }
    }
}
</script>
