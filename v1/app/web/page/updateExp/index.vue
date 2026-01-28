<template>
    <LoginLayout :hide="true" title="qunheying.com">
        <div class="login-container">
            <div class="blue-shadow"></div>
            <div class="login-content">
                <div class="title">qunheying.com</div>

                <Form :model="form" :rules="rules" ref="updateForm" class="login-window" label-width="56px">
                    <FormItem label="用户名" prop="userName">
                        <Input v-model="form.userName" type="text"/>
                    </FormItem>
                    <FormItem label="密码" prop="password">
                        <Input type="password" v-model="form.password" auto-complete="off" @keyup.enter.native="submitForm"/>
                    </FormItem>
                    <FormItem label="天数" prop="day" style="text-align: left">
                        <div>
                            <el-radio v-model="form.day" label="31" border>31天  (1个月)</el-radio>
                        </div>
                        <div>
                            <el-radio v-model="form.day" label="91" border>91天  (3个月)</el-radio>
                        </div>
                        <div>
                            <el-radio v-model="form.day" label="183" border>183天(6个月)</el-radio>
                        </div>
                        <div>
                            <el-radio v-model="form.day" label="365" border>365天(12个月)</el-radio>
                        </div>
                        <div>
                            <el-radio v-model="form.day" label="30" border>30天 (1个月高级)</el-radio>
                        </div>
                    </FormItem>
                    <FormItem class="submit-container">
                        <Button type="primary" class="login-submit upcase" :loading="Loading" @click="submitForm">更新</Button>
                    </FormItem>
                </Form>
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
import {Form, FormItem, Input, Button, Message, Radio} from 'element-ui'
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
        LoginLayout,
        'el-radio': Radio
    },
    data() {
        // const image = null// tools.getBodyData('image')
        // const {captchaId, imageData } = (image && image.result) || {};

        return {
            form: {
                userName: '',
                password: '',
                day: '31'
            },
            rules: {
                userName: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                day: [
                    {required: true, message: '请输入天数', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
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
        submitForm() {
            const formName = 'updateForm'
            const submitURL = '/qun/updateExp'
            const {password, day, userName} = this.form

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.Loading = true
                    axios.post(submitURL,
                        {
                            userName,
                            password,
                            day
                        })
                        .then(response => {
                            tools.responseHandler(response, (result) => {
                                if (result.expirationAt) {
                                    Message({showClose: true, message: `更新成功 ${result.expirationAt}`, type: 'success', duration: 0})
                                }
                            },
                            (result) => {
                                Message({showClose: true, message: result._msg, type: 'error'})
                            })

                            this.Loading = false
                        })
                        .catch(error => {
                            this.Loading = false
                            Message({showClose: true, message: tools.errorContent(error), type: 'error'})
                        })
                }
            })
        }
    }
}
</script>
