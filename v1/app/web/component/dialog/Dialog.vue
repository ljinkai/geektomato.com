<template>
    <Dialog :visible.sync="visible" class="meg-dialog" @open="open" :close-on-click-modal="false" :modal="!isMobile">
        <div class="vuebar" v-bar="{
                preventParentScroll: true,
                scrollThrottle: 30
            }">
            <div class="vuebar-content dialog-vuebar">
                <slot :freshTag="freshTag"></slot>
            </div>
        </div>
    </Dialog>
</template>

<script>
import Vue from 'vue'
import {Dialog} from 'element-ui'
import Vuebar from 'vuebar'

Vue.use(Vuebar)

export default {
    components: {
        Dialog
    },
    props: ['show'],
    watch: {
        visible: function(val) {
            const {show} = this
            show !== val && this.$emit('update:show', val)
        },
        show: function(val) {
            const {visible} = this
            val !== visible && (this.visible = val)
        }
    },
    provide: function() {
        return {
            closeDialog: this.close
        }
    },
    data() {
        const {show} = this
        const innerHeight = (EASY_ENV_IS_BROWSER && window.innerHeight) || 0
        const innerWidth = (EASY_ENV_IS_BROWSER && window.innerWidth) || 0
        let maxH = 600

        if (innerWidth > 800) {
            maxH = innerHeight * 0.8 - 48
        } else {
            maxH = innerHeight - 48
        }

        return {
            isMobile: innerWidth && innerWidth < 767,
            visible: show,
            maxH,
            freshTag: 0
        }
    },
    created() {},
    methods: {
        open() {
            let {freshTag} = this
            this.freshTag = ++freshTag
        },
        close() {
            this.visible = false
        }
    }
}
</script>
<style lang="stylus">
@import '~theme/tools.styl'

.meg-dialog
    .el-dialog
        width: 100%
        max-width: 880px
        margin-top: 8vh !important
        // max-height: calc(100% - 20vh)
    .el-dialog__headerbtn
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15)
        background-color: #ffffff
        width: 36px
        height: 36px
        border-radius: 50%
        top: -14px
        right: -16px
        font-size: 22px
        z-index: 2001
    .el-dialog__header
        padding: 0
    .el-dialog__body
        padding: 0

.vuebar 
    width: 100%

// .vuebar-content
    // max-height: 600px

.vb > .vb-dragger {
    z-index: 5;
    width: 12px;
    right: 0;
}

.vb > .vb-dragger > .vb-dragger-styler {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: rotate3d(0,0,0,0);
    transform: rotate3d(0,0,0,0);
    -webkit-transition:
        background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
    transition:
        background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
    background-color: rgba(48, 121, 244,.2);
    margin: 5px 5px 5px 0;
    border-radius: 20px;
    height: calc(100% - 10px);
    display: block;
}

.vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(48, 121, 244,.3);
}

.vb > .vb-dragger:hover > .vb-dragger-styler {
    background-color: rgba(48, 121, 244,.5);
    margin: 0px;
    height: 100%;
}

.vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(48, 121, 244,.5);
    margin: 0px;
    height: 100%;
}

.vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(48, 121, 244,.5);
}

@media (max-width: 1441px)
    .meg-dialog
        .el-dialog
            margin-top: 7vh !important
            max-height: none !important
            height: auto !important
        .info-container 
            .vuebar-content
                max-height: 330px
        // .dialog-vuebar
        //     max-height: 680px !important

@media (max-width: 880px)
    .meg-dialog
        .el-dialog
            height: auto !important
            width: 100% !important
            min-height: 100% !important
            margin: 0 !important
        .el-dialog__headerbtn
            top: 16px
            right: 22px
            width: 29px
            height: 29px
            font-size: 22px
        .dialog-vuebar
            box-sizing: border-box !important
            padding-right: 15px !important

</style>
