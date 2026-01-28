<template>
    <div class="header-main-container">
        <div class="header-main">
            <div class="header-container">
                <div class="header-left">
                    <a class="header-logo-a" href="/">
                        <img class="header-logo-img" src="~asset/images/logo/logo_366x366.png"/>
                        <span class="header-logo-title">极客番茄</span>
                    </a>
                </div>
                <div class="header-right">
                    <div class="header-right-item"><a style="cursor: pointer" @click="dialogZSXQVisible = true">加入免费知识星球</a></div>
                    <div class="header-right-item"><a href="/weekly" target="_self">周报</a></div>
                    <div class="header-right-item"><a href="/about" target="_self">关于</a></div>
                </div>
            </div>
        </div>
        <Dialog :title="dialogTitle" :visible.sync="dialogFormVisible" custom-class="reg-dialog" :modal="!isMobile">
            <div class="login-container">
                <Row>
                    <el-col :span="10" class="reg-dialog-col-left">
                        <div class="login-product-container">
                            <div class="login-product-protect">
                                <div class="login-product-icon login-product-icon1"></div><div class="login-product-text">Buyer Protection</div>
                            </div>
                            <div class="login-product-protect">
                                <div class="login-product-icon login-product-icon2"></div><div class="login-product-text">Secure Payments</div>
                            </div>
                            <div class="login-product-protect">
                                <div class="login-product-icon login-product-icon3"></div><div class="login-product-text">30-Day Returns</div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="14" class="reg-dialog-col-right">
                        <div class="login-reg">
                            <Row>
                                <Button class="invite-reg-facebook" :loading='loadingFacebook' @click="facebookLogin" id="facebookLogin" icon="el-icon-edit login-facebook-icon">Continue with Facebook</Button>
                            </Row>
                            <Row>
                                <Button class="invite-reg-google" :loading='loadingGoogle' v-bind:class="{'invite-reg-btn-unavailable': !googleBtnEnableFlag}" id="googleLogin" icon="el-icon-edit login-google-icon" @click="googleGA">Continue with Google</Button>
                            </Row>
                        </div>

                        <div class="login-form" v-if="formPage === 'login'">
                            <div class="login-tip">
                                Or sign in with an email address
                            </div>
                            <Form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="100px" class="demo-ruleForm">
                                <FormItem prop="email">
                                    <Input v-model="loginForm.email" :placeholder="Email" maxlength="50"/>
                                    <!--<div class="group">-->
                                        <!--<input type="text" v-model="loginForm.email" prop="email" required>-->
                                        <!--<span class="bar"></span>-->
                                        <!--<label>{{Email}}</label>-->
                                    <!--</div>-->
                                </FormItem>
                                <FormItem prop="password">
                                    <Input type="password" v-model="loginForm.password"  :placeholder="Password" auto-complete="off" @keyup.enter.native="submitForm('sign-in')"/>
                                </FormItem>

                                <FormItem>
                                    <div class="login-msg">{{retMsg}}</div>
                                </FormItem>
                            </Form>
                        </div>
                        <div class="login-reg-form" v-if="formPage === 'reg'">
                            <div class="login-tip">
                                Or sign up with an email address
                            </div>
                            <Form :model="regForm" :rules="regRules" ref="regForm" label-width="100px" class="demo-ruleForm">
                                <Row>
                                    <el-col :span="12">
                                        <FormItem prop="firstName">
                                            <Input v-model="regForm.firstName" :placeholder="FirstName" class="login-reg-short-input" maxlength="20"/>
                                        </FormItem>
                                    </el-col>
                                    <el-col :span="12">
                                        <FormItem prop="lastName">
                                            <Input v-model="regForm.lastName" :placeholder="LastName" maxlength="20"/>
                                        </FormItem>
                                    </el-col>
                                </Row>
                                <FormItem prop="emailReg">
                                    <Input v-model="regForm.emailReg" :placeholder="Email" maxlength="50"/>
                                </FormItem>
                                <FormItem prop="passwordReg">
                                    <Input type="password" v-model="regForm.passwordReg" :placeholder="Password" auto-complete="off" @keyup.enter.native="submitForm('sign-up')"/>
                                </FormItem>
                                <FormItem>
                                    <div class="login-msg">{{retMsg}}</div>
                                </FormItem>
                            </Form>
                        </div>
                        <div id="widgetId" class="g-recaptcha"></div>
                        <div v-if="formPage === 'login'">
                            <Button type="primary" class="login-submit" :loading="loginFormLoading" @click="submitForm('sign-in')">Sign In</Button>
                            <div class="login-bottom">
                                <div class="login-bottom-extend">
                                    <span>Need an account?</span>
                                    <span class="login-bottom-sign" @click="formPage = 'reg'; dialogTitle = 'Sign Up'">Sign up here</span>
                                    <!--<a href="/reset" ng-click="forgotpassword($event)" ng-if="status === 'signIn'" class="ng-scope">Forgot Password?</a>-->
                                </div>
                            </div>
                        </div>
                        <div v-if="formPage === 'reg'">
                            <Button type="primary" class="login-submit" :loading="regFormLoading" @click="submitForm('sign-up')">Sign Up</Button>
                            <div class="login-bottom">
                                <div class="login-bottom-extend">
                                    <span>Already have an account?</span>
                                    <span class="login-bottom-sign" @click="formPage = 'login'; dialogTitle = 'Sign In'">Sign in here</span>
                                    <!--<a href="/reset" ng-click="forgotpassword($event)" ng-if="status === 'signIn'" class="ng-scope">Forgot Password?</a>-->
                                </div>
                            </div>
                        </div>
                    </el-col>
                </Row>
            </div>
        </Dialog>
        <Dialog :visible.sync="dialogInfoVisible" custom-class="info-dialog" :modal="!isMobile">
            <div class="infoPop-container">
                <div v-if="isLogin">
                    <div class="info-item" @click="userDropDown('loginOut')">
                        Sign out
                    </div>
                    <div class="info-item" @click="userDropDown('order')">
                        My orders
                    </div>
                </div>
                <div v-if="!isLogin">
                    <div class="info-item" @click="showPop">
                        Sign In/Sign Up
                    </div>
                </div>

                <div class="info-split"></div>
                <a class="info-item" href="/info/tutorial">
                    Tutorial
                </a>
                <a class="info-item" href="/info/contact">
                    Contact Us
                </a>
                <a class="info-item" href="https://help.geektomato.com/hc/en-us/categories/360001058414-geektomato-Dash" target="_blank">
                    FAQs
                </a>
            </div>
        </Dialog>
        <Dialog :visible.sync="dialogZSXQVisible" top="20px" custom-class="reg-dialog zsxq-dialog">
            <div class="zsxq-container">
                <span style="font-weight: bold">「极客番茄」知识星球(限时)免费加入</span>，促进大家交流互动，在这里分享英文，提高阅读知识面，结识志同道合的小伙伴。
                我们在这里每天一篇极客英文，用英语看世界。
                <img class="zsxq-img" src="~asset/images/zsxq/geektomato_zsxq.png">

            </div>
        </Dialog>
    </div>
</template>

<script>
// import Vue from 'vue'
import {
    Button,
    Form,
    FormItem,
    Input,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Dialog,
    Row,
    Message,
    Col
} from 'element-ui'

// import VueCookie from 'vue-cookie'
import axios from 'axios'
import tools from 'tools'
import DialogNew from 'component/dialog/Dialog'

axios.defaults.headers.post['x-csrf-token'] = tools.getCookie('csrfToken')

export default {
    name: 'Header',
    components: {
        Dropdown,
        DropdownMenu,
        DropdownItem,
        Button,
        Form,
        FormItem,
        Input,
        Dialog,
        Row,
        'el-col': Col,
        Message,
        DialogNew
    },
    props: ['show'],
    watch: {
        dialogFormVisible: function(val) {
            const {show} = this
            show !== val && this.$emit('update:show', val)
        },
        show: function(val) {
            this.dialogFormVisible = val
            this._showPop()
        }
    },
    data() {
        const cookie = JSON.parse(tools.getCookie('geektomato_head') || '{}')
        const innerWidth = (EASY_ENV_IS_BROWSER && window.innerWidth) || 0

        return {
            isMobile: innerWidth && innerWidth < 767,
            userName: cookie.nick || '',
            dialogFormVisible: false,
            dialogInfoVisible: false,
            dialogZSXQVisible: false,
            dialogTitle: 'Sign In',
            Email: 'Email Address',
            Password: 'Password',
            FirstName: 'First Name',
            LastName: 'Last Name',
            loading: false,
            retMsg: '',
            recapchaResponse: '',
            formPage: 'login',
            loginForm: {
                email: '',
                password: '',
                recaptcha: ''
            },
            regForm: {
                firstName: '',
                lastName: '',
                emailReg: '',
                passwordReg: '',
                recaptcha: ''
            },
            loginRules: {
                email: [
                    {required: true, message: 'Please Input Email', trigger: 'blur'},
                    {type: 'email', message: 'Please Input Correct Email', trigger: ['blur', 'change']}
                ],
                password: [
                    {required: true, message: 'Please Input Password', trigger: 'blur'},
                    {min: 6, max: 16, message: '6-16 characters', trigger: 'blur'}
                ]
            },
            regRules: {
                firstName: [
                    {required: true, message: 'Please Input First Name', trigger: 'blur'}
                ],
                lastName: [
                    {required: true, message: 'Please Input Last Name', trigger: 'blur'}
                ],
                emailReg: [
                    {required: true, message: 'Please Input Email', trigger: 'blur'},
                    {type: 'email', message: 'Please Input Correct Email', trigger: ['blur', 'change']}
                ],
                passwordReg: [
                    {required: true, message: 'Please Input Password', trigger: 'blur'},
                    {min: 6, max: 16, message: '6-16 characters', trigger: 'blur'},
                    {validator: this.validatePassForInclude, trigger: 'blur'}
                ]
            },
            googleBtnEnableFlag: false,
            loadingFacebook: false,
            loadingGoogle: false,
            isLogin: !!cookie.nick,
            loginUser: {
                nick: cookie.nick,
                portrait: tools.imageFilter(cookie.portrait, 100, 'i')
            },
            grecaptchaRender: false,
            loginFormLoading: false,
            regFormLoading: false
        }
    },
    computed: {},
    created() {},
    methods: {
        validatePassForInclude: (rule, value, callback) => {
            var i = /[0-9]+/
            var str = /[A-Za-z]/
            if (!i.test(value)) {
                callback(new Error('need contain number!'))
            } else if (!str.test(value)) {
                callback(new Error('need contain letter!'))
            } else {
                callback()
            }
        },
        userDropDown: function(command) {
            if (!EASY_ENV_IS_BROWSER) return

            if (command === 'loginOut') {
                tools.deleteCookie('geektomato_head')
                window.location.href = '/'
            } else if (command === 'reset') {
                window.location.href = '/account/reset'
            } else if (command === 'order') {
                window.location.href = '/order/list'
                typeof gtag !== 'undefined' && gtag('event', 'orders', {event_category: 'dash_home'})
            }
        },
        showPop() {
            this.dialogInfoVisible = false
            this.dialogFormVisible = true
            this._showPop()
        },
        _showPop() {
            // setTimeout(() => {
            this.detectGAPI()
            // }, 2000)

            this.recapchaDetect()
        },
        showUserInfo() {
            this.dialogInfoVisible = true
        },
        submitForm(status) {
            if (status === 'sign-in') {
                this.doLogin()
            } else if (status === 'sign-up') {
                this.doSignUp()
            }
        },
        recaptchaReset() {
            grecaptcha.reset()
            // $('#loginBtn').addClass('disabled')
            // $('#widgetId').data('response', '')
            this.recapchaResponse = ''
        },
        recapchaDetect() {
            let _self = this
            if (this.grecaptchaRender) {
                return true
            }
            let count = 0
            let flag = setInterval(() => {
                if (count >= 50) {
                    clearInterval(flag)
                }
                if (typeof grecaptcha === 'undefined') {
                } else {
                    if (this.grecaptchaRender) {
                        return true
                    }
                    clearInterval(flag)
                    this.grecaptchaRender = true
                    grecaptcha.render('widgetId', {
                        'sitekey': '6LctzEoUAAAAAKad6uq_crrFv2lwqqEHPse316qW',
                        'callback': function(response) {
                            _self.recapchaResponse = response
                            // $(".com_btn_login").css("background-color", "#ff8830");
                            // $(".com_btn_login").css("cursor", "pointer");
                            // $(".com_btn_login:hover").css("cursor", "pointer");
                            // $("#loginBtn").removeClass('disabled');
                        },
                        'expired-callback': function() {
                            // $("#loginBtn").addClass('disabled');
                        }
                    })
                }
                count++
            }, 200)
        },
        doLogin() {
            this.$refs['loginForm'].validate((valid) => {
                if (!this.recapchaResponse) {
                    return true
                }
                if (valid) {
                    this.loginFormLoading = true
                    this.loginForm['response'] = this.recapchaResponse
                    axios.post('/login', this.loginForm)
                        .then(response => {
                            tools.responseHandler(response, (res) => {
                                if (res && res.status === 400) {
                                    alert(res.msg)
                                    this._cancelLoading()
                                } else if (res.token) {
                                    // do upload
                                    typeof gtag !== 'undefined' && gtag('event', 'sign_in', {event_category: 'dash_home'})
                                    this._afterLogin(res)
                                }
                            },
                            (result) => {
                                Message({showClose: true, message: result._msg, type: 'error'})
                                this._cancelLoading()
                            })
                        })
                        .catch(error => {
                            Message({showClose: true, message: tools.errorContent(error), type: 'error'})
                            this._cancelLoading()
                        })
                }
            })
        },
        doSignUp() {
            this.$refs['regForm'].validate((valid) => {
                if (!this.recapchaResponse) {
                    return true
                }
                if (valid) {
                    this.regFormLoading = true
                    const timezone = jstz.determine()
                    this.regForm['timezone'] = timezone.name()
                    this.regForm['response'] = this.recapchaResponse
                    this.regForm['email'] = this.regForm.emailReg
                    this.regForm['password'] = this.regForm.passwordReg

                    axios.post('/login/signUp', this.regForm)
                        .then(response => {
                            tools.responseHandler(response, (res) => {
                                if (res && res.status === 400) {
                                    alert(res.msg)
                                    this._cancelLoading()
                                } else if (res.token) {
                                    // do upload
                                    this._afterLogin(res)
                                    typeof gtag !== 'undefined' && gtag('event', 'sign_up', {event_category: 'dash_home'})
                                }
                            },
                            (result) => {
                                Message({showClose: true, message: result._msg, type: 'error'})
                                this._cancelLoading()
                            })
                        })
                        .catch(error => {
                            Message({showClose: true, message: tools.errorContent(error), type: 'error'})
                            this._cancelLoading()
                        })
                }
            })
        },
        _cancelLoading() {
            this.loadingFacebook = false
            this.loadingGoogle = false
            this.loginFormLoading = false
            this.regFormLoading = false
            this.recaptchaReset()
        },
        facebookLogin() {
            let _self = this
            if (this.loadingFacebook) {
                return false
            }
            this.loadingFacebook = true
            window.FB.login(function(response) {
                if (response.authResponse) {
                    var token = response.authResponse.accessToken
                    FB.api('/me', function(response) {
                        if (response.name) {
                            // do fivemiles login
                            var headImg = 'http://res.geektomatoapp.com/image/facebook/' + response.id
                            var timezone = jstz.determine()
                            var param = {
                                'fb_userid': response.id,
                                'fb_username': response.name,
                                'fb_headimage': headImg,
                                'fb_token': token,
                                'fb_email': response.email,
                                'timezone': timezone.name()
                            }

                            const url = '/login/facebook'
                            axios.post(url, param)
                                .then(response => {
                                    tools.responseHandler(response, (res) => {
                                        if (res && res.status === 400) {
                                            alert(res.msg)
                                            _self._cancelLoading()
                                        } else if (res.token) {
                                            // do upload
                                            _self._afterLogin(res)
                                            typeof gtag !== 'undefined' && gtag('event', 'facebook', {event_category: 'dash_home'})
                                        }
                                    },
                                    (result) => {
                                        Message({showClose: true, message: result._msg, type: 'error'})
                                        _self._cancelLoading()
                                    })
                                })
                                .catch(error => {
                                    Message({showClose: true, message: tools.errorContent(error), type: 'error'})
                                    _self._cancelLoading()
                                })
                        } else {
                            _self._cancelLoading()
                        }
                    })
                } else {
                    console.log('User cancelled login or did not fully authorize.')
                    _self._cancelLoading()
                }
            }, {scope: 'email,public_profile'})
            gtag('event', 'facebook', {
                'event_category': 'invite_friend'
            })
        },
        googleBtnEnable() {
            this.googleBtnEnableFlag = true
        },
        googleGA() {
            gtag('event', 'google', {
                'event_category': 'invite_friend'
            })
        },
        detectGAPI() {
            let count = 0
            let flag = setInterval(() => {
                if (count >= 50) {
                    clearInterval(flag)
                }
                if (typeof gapi === 'undefined') {
                } else {
                    clearInterval(flag)
                    this.googleBtnEnable()
                    this.startGoogle()
                }
                count++
            }, 200)
        },
        startGoogle() {
            if (typeof gapi === 'undefined') {
            } else {
                gapi.load('auth2', () => {
                    // Retrieve the singleton for the GoogleAuth library and set up the client.
                    let auth2 = gapi.auth2.init({
                        client_id: '368343050402-hsh3dfn26ofk5ahmchutklh0nl9s1jju.apps.googleusercontent.com',
                        cookiepolicy: 'single_host_origin',
                        // Request scopes in addition to 'profile' and 'email'
                        scope: 'profile email'

                    })
                    auth2.attachClickHandler(document.getElementById('googleLogin'), {}, this.onGoogleSuccess, this.onGoogleFailure)
                })
            }
        },
        onGoogleSuccess(googleUser) {
            let _self = this
            if (this.loadingGoogle) {
                return false
            }
            let profile = googleUser.getBasicProfile()
            let id = profile.getId()
            let name = profile.getName()
            let email = profile.getEmail()
            let image_url = 'http://res.geektomatoapp.com/image/gplus/' + id
            let auth_response = googleUser.getAuthResponse()
            let id_token = auth_response.id_token
            let access_token = auth_response.access_token
            let timezone = jstz.determine()

            let param = {
                'gg_id': id,
                'gg_display_name': name,
                'gg_email': email,
                'gg_photo_url': image_url,
                'gg_id_token': id_token,
                'gg_access_token': access_token,
                'gg_refresh_token': '',
                'timezone': timezone.name()
            }
            this.loadingGoogle = true
            axios.post('/login/google', param)
                .then(response => {
                    tools.responseHandler(response, (res) => {
                        if (res && res.status === 400) {
                            alert(res.msg)
                            _self._cancelLoading()
                        } else if (res.token) {
                            typeof gtag !== 'undefined' && gtag('event', 'google', {event_category: 'dash_home'})
                            this._afterLogin(res)
                        }
                    }, (result) => {
                        Message({showClose: true, message: result._msg, type: 'error'})
                        _self._cancelLoading()
                    })
                }).catch(error => {
                    Message({showClose: true, message: tools.errorContent(error), type: 'error'})
                    _self._cancelLoading()
                })
        },
        onGoogleFailure(error) {
            console.log(JSON.stringify(error, undefined, 2))
        },
        _afterLogin(res) {
            const backUrl = decodeURIComponent(tools.getQueryString('back'))
            
            if (res.token) {
                let header = {
                    'mail': res.email,
                    'nick': res.nickname,
                    'portrait': res.portrait,
                    'userToken': res.token,
                    'userId': res.id,
                    'dealership': res.dealership
                }
                if (header.nick === '') {
                    if (res.first_name && res.first_name.length > 0) {
                        header.nick += res.first_name
                    }
                    if (res.last_name && res.last_name.length > 0) {
                        header.nick += ' ' + res.last_name
                    }
                }
                tools.setCookie('geektomato_head', JSON.stringify(header), 730)
                this.isLogin = true

                if (backUrl) {
                    window.location.href = backUrl
                } else {
                    window.location.reload()
                }
                // this.loginUser = {'nick': header.nick, 'portrait': header.portrait}
                // this.dialogFormVisible = false
            }
        }
    }
}
</script>

<style lang="stylus">
@import '~theme/tools.styl'
/*@import 'index.styl'*/

$height = 66px
.header-main
    position fixed
    z-index 10
    top 0px
    left 0px
    width 100%
    background-color white
.header-container
    display: flex
    justify-content: space-between
    // align-items: center
    height: $height
    padding: 0px 25px 0px 20px;
    flex-shrink: 0
    .header-logo-img
        width: 40px;
        height: 40px;
        margin-top 10px
    .header-logo-a
        display flex
    .header-logo-title
        color #fd0000
    .header-right
        .header-user-info
            width 24px;
            margin-top: 14px;
            cursor pointer
        .header-right-item
            font-size 14px
            font-weight 500
            margin-left 15px
            a
                color $color_geektomato
    .header-left
        height: $height
        line-height: $height
        display flex
    .header-right
        display flex
        justify-content right
        line-height 66px
        .header-user
            display flex
            .header-user-img
                width 36px
                height 36px
                border-radius 36px
                margin-top 7px
            .header-user-name
                color: #242424
                font-size 14px
                line-height: 50px;
                margin: 0px 15px;
    .el-breadcrumb
        display: inline-block
    .el-dropdown-menu
        top: 45px !important
    .el-dropdown-link
        cursor: pointer
        outline: none
    .el-breadcrumb__item
        &:last-child .el-breadcrumb__inner
            color: #0091e8
        &:first-child .el-breadcrumb__inner
            color: #606266
.loginPop-layout
    width:100%
.loginPop-logo
    img
        width:60px;
        height:60px;
.login-container
    .login-product-container
        padding-right 15px
        .login-product-protect
            margin-top 30px
            display flex
            flex-wrap: wrap
            .login-product-icon
                width 24px
                height 24px
                display block
            .login-product-icon1
                background-size 100%
            .login-product-icon2
                background-size 100%
            .login-product-icon3
                background-size 100%
            .login-product-text
                margin-left 24px
                opacity: 0.21;
                font-family: OpenSans;
                font-size: 18px;
                font-weight: bold;
                color: #000000;
    .login-product
        width 100%
    .login-submit
        width:100%
        height: 30px;
        padding 0px
        border-radius: 30px;
        background-color: #bdbdbd;
    .login-msg
        color: #ff5e1b
        text-align:center
    .login-reg
        .invite-reg-facebook
            width: 100%;
            height: 30px;
            padding 0px
            border none
            border-radius: 30px;
            background-color: #4762a0;
            color white
            margin-bottom 10px
            justify-content: center;
            display: flex;
            line-height: 20px;
        .invite-reg-google
            width: 100%;
            height: 30px;
            padding 0px
            border none
            border-radius: 30px;
            background-color: #c8422f;
            color white
            justify-content: center;
            display: flex;
            line-height: 20px;
    .login-reg-short-input
        padding-right 6px
    .login-tip
        text-align: left;
        margin: 20px 0px;
        color: #bdbdbd;
        font-weight: 400;
    .g-recaptcha
        margin-bottom 15px
        min-height 50px
        width: 300px;
        height: 75px;
        background-color #e4e4e4
    .el-form-item__label
        width: 100% !important;
        display: block;
        text-align: left;
    .el-form-item__content
        margin-left: 0px !important
    .el-input__inner
        border: none;
        border-bottom: 1px #bdbdbd solid;
        border-radius: 0px;
        padding 0px
    .login-bottom-extend
        font-size: 16px;
        margin-top 12px
        text-align center
        .login-bottom-sign
            color: #ff8f0a;
            font-weight: 700;
            margin-left: 5px;
            cursor: pointer;
    .login-facebook-icon
        width: 20px;
        height: 20px;
        line-height: 19px;
        background-size 8px
    .login-facebook-icon:before
        content " " !important
    .login-google-icon
        width: 20px;
        height: 20px;
        line-height: 19px;
        background-size 16px
        margin-left: -17px
    .login-google-icon:before
        content " " !important
.reg-dialog
    .el-dialog__header
        text-align: center;
        .el-dialog__title
            letter-spacing: 0.2px;
            color: #656565;
            font-size 24px
            font-weight: 300;
    .el-dialog__headerbtn
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);
        background-color: #fff;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        top: -14px;
        right: -16px;
        font-size: 22px;
.info-dialog
    position: absolute;
    right: 0px;
    top: 0px;
    width: 280px;
    height: 100%;
    margin-top 0px !important
    .info-split
        height: 1px;
        background-color: #f4f4f4;
        width: 100%
    .info-item
        font-size 14px
        margin 30px 15px;
        color: #080416;
        cursor pointer
        display block
    .info-item:hover
        opacity 0.8
/*.zsxq-dialog*/

.zsxq-container
    font-size: 15px;
    line-height: 26px;
    .zsxq-img
        width: 100%;
        max-width: 380px;
        margin 20px auto 0px auto
        display block
@media (max-width: 1024px)
    .reg-dialog
        .reg-dialog-col-left
            display none
        .reg-dialog-col-right
            width 100%
        .el-dialog__headerbtn
            top: -5px
            right: -5px

@media (max-width: 767px)
    .footer-container-body
        justify-content center
        .footer-container-items
            display none

@media (max-width: $phone)
    .info-dialog
        width: 100% !important
        margin: 0 !important
    .reg-dialog
        .el-dialog__header
            padding-top: 38px
        .el-dialog__headerbtn
            top: 8px
            right: 8px

</style>
