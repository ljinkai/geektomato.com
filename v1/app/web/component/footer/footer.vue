<template>
    <div class="footer-container">
        <div class="footer-container-body max-width">
            © 2018-2020 极客番茄 <a href="http://beian.miit.gov.cn/">京ICP备15012272号-4</a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Footer',
    components: {},
    props: {},
    data() {
        return {}
    },
    computed: {},
    created() {},
    methods: {
        openAbout() {
            typeof gtag !== 'undefined' && gtag('event', 'about', {event_category: 'dash_home'})
        }
    }
}
</script>

<style lang="stylus">
@import '~theme/tools.styl'
.footer-container
    background-color: #ffffff;
    height: 90px;
    line-height: 180%
    width 100%
    bottom 0px
    .footer-container-body
        font-size: 12px;
        color: #aea79f;
        padding-top 30px
        text-align center
        border-top 1px #eee solid
        .footer-container-items
            display flex
            justify-content left
            .footer-container-item
                margin-right 15px
                // margin-top 24px
                cursor pointer
                display block
            .footer-container-item:hover
                color black
        .footer-down
            height 36px
            margin-top 2px
            margin-left 15px

@media (max-width: $media-screen-desktop-min)
    .header-container
        padding 0px 15px
    .footer-container-items
        display none !important
</style>
