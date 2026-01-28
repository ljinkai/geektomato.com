<template>
    <Layout :hide="true" title="周报 | 极客番茄">
        <Header/>
        <div class="weekly">
            <div class="weekly-container">
                <h1 class="weekly-title">极客番茄周报</h1>
                <div class="weekly-content">
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/a_JCI0a5WRJtmXFg4Ug1Og">极客番茄「30」- Github的私有仓库被黑客勒索</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/gtrq3Xlv9F4mHlTSryQY5A">极客番茄「29」- 手上没货，怎样在线开店赚钱？</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/N4wCTa_eeYxZwIp93yIiTQ">极客番茄「28」- 聪明钱都去亚洲的区块链和加密货币市场啦</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/RU8VPXEHCl84zTk9DlXrGw">极客番茄「27」-  Create Without Code 无代码创造工具集147个</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/2UGZCzjkKH06OPsl3cK59Q">极客番茄「26」-  Level的站点一年收入了$1,063,125</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/ad7qKehuHwIrhzr1OV5WDA">极客番茄「25」- 地址栏里如果放上动画emoji表情会怎么样？</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/UyszZWJjQoMbNZBJWB_7Fw">极客番茄「24」- 这些人并不存在，考验你眼力的时候到了</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/Pq2D9wqLwx7x3RT6nV8pQQ">极客番茄「23」- 不需要一行代码搭建网站和应用</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/Lrlwk95qNInlbzryISaz8w">极客番茄「22」- 社会的焦虑需要一个改变的Web网络</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/LQqAcUT9XMznGg_GRRUT9A">极客番茄「21」- 一个摄影师被鲸鱼吞进了嘴里</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/P4e5tgdUCNgxSiy-fQDxgA">极客番茄「20」- 一只鹰，身上的GPS记录了20年的飞行轨迹</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/5a9Wak9OeYbnSLwym7f7Fw">极客番茄「19」- 4个男人专为女士们创建了一个网站，价值5600万美金</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/_KViUXERBKPiz9N_1qmxvQ">极客番茄「18」- 卖空气一年能赚23万美金</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/yLmNGXP2_Nwl-d4xZTlm6w">极客番茄「17」- 中国和美国之间一定会发生战争吗？</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/OHNkRj2eM-IIDVCVMh5czg">极客番茄「16」- Google Play Store 已经对PWA开放啦</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/r5y0uSRsT9UL33aHnsG36Q">极客番茄「15」- 敲代码25年，这仅仅是个开始</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/n6MqS9mhv_VO-vN0rnqEWA">极客番茄「14」- 你一年蹲坑多长？值多少钱？</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/WZLzmwpWw3RmMWhEgAVWaA">极客番茄「13」- 天赋到处都是，而机会却不是</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/l0s0Sb8uPudYvyxdbItzrg">极客番茄「12」- 我是这样收割你们的信用卡账号密码的</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/wsnDOwVA6EQXboABqmHs5g">极客番茄「11」- 致命的手势：美国人的“停止”对阿拉伯人却是打招呼的“hi”</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/vvqVJMoDQeaNtBsDutW0uw">极客番茄「10」- 最智能的广告牌：看，大灰机！</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/EsuuIri9j4GwVjk_XPagHg">极客番茄「9」- Quora数据泄露达1亿用户</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/swYuTt5Ko0KFQ1O5NTdAzA">极客番茄「8」- 我是中国人，谷歌的蜻蜓项目必须继续</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/yggnD4aXEJPm4yWGqGZv7Q">极客番茄「7」- 直播测试-Google是否一直在监听你的麦克风</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/ev1TKrOn43ANVrqYApseTw">极客番茄「6」- 我们和这群羊没有区别</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/H9TEUGpnfxVuYGEUe0OhzQ">极客番茄「5」- 无限循环楼梯</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/GsfPSIpS6qmohaU4pOz4Tg">极客番茄「4」- 最好的报复就是巨大的成功</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/hoFfo7iRbBMcpmVHx44SFA">极客番茄「3」- 洗屁屁的用到头上，外国小哥火遍了全世界</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/Yb1mOYmDTeCUuOMCa8HMrA">极客番茄「2」- 通过帮助中心来黑掉数百家公司、前Google工程师对中国审查制度的评价、不用代...</a>
                    <a class="weekly-link" target="blank" href="https://mp.weixin.qq.com/s/R6kqvyxT4Tpkt5-4vUVqiw">极客番茄「1」- React的工作面试、真实的Google Cloud、Walt 写WebAssem...</a>
                </div>

            </div>
        </div>
        <Footer></Footer>
    </Layout>

</template>

<style lang="stylus">
    @import 'index.styl'
</style>

<script type="text/babel">
import axios from 'axios'
import tools from 'tools'
import Header from 'component/header/header'
import Footer from 'component/footer/footer'
import {Form, FormItem, Input, Button, Message, Row, Col} from 'element-ui'
// import RSA from 'framework/encrypt/SRA.js'
axios.defaults.headers.post['x-csrf-token'] = tools.getCookie('csrfToken')

export default {
    name: 'ViewItem',
    components: {
        Header,
        Footer,
        Form,
        FormItem,
        Input,
        Button,
        Message,
        'el-row': Row,
        'el-col': Col
    },
    data() {
        return {
        }
    },
    computed: {
    },
    created() {
    },
    mounted() {},
    methods: {
        submitForm() {
        }
    }
}
</script>
