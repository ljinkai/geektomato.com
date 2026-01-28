<template>
    <Layout :hide="true" title="添加">
        <div class="login-container">
            <div class="blue-shadow"></div>
            <div class="login-content">
                <div class="title">添加</div>

                <Form :model="form" :rules="rules" ref="updateForm" class="login-window" label-width="56px">
                    <FormItem label="内容" prop="content">
                        <Input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入内容"
                                v-model="form.content">
                        </Input>
                    </FormItem>

                    <FormItem class="submit-container">
                        <Button type="primary" class="login-submit upcase" :loading="Loading" @click="submitForm">添加</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    </Layout>

</template>

<style lang="stylus">
    @import 'index.styl'
</style>

<script type="text/babel">
import axios from 'axios'
import tools from 'tools'
import {Form, FormItem, Input, Button, Message, Radio} from 'element-ui'
// import RSA from 'framework/encrypt/SRA.js'
axios.defaults.headers.post['x-csrf-token'] = tools.getCookie('csrfToken')

export default {
    name: 'AddItem',
    components: {
        Form,
        FormItem,
        Input,
        Button,
        Message,
        'el-radio': Radio
    },
    data() {
        // const image = null// tools.getBodyData('image')
        // const {captchaId, imageData } = (image && image.result) || {};

        return {
            form: {
                content: ''
            },
            rules: {
                content: [
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
            const submitURL = '/addItem'
            const {content} = this.form
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.Loading = true
                    axios.post(submitURL,
                        {
                            allContent: content
                        })
                        .then(response => {
                            tools.responseHandler(response, (result) => {
                                Message({showClose: true, message: `更新成功: ${result.data}`, type: 'success', duration: 0})
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
