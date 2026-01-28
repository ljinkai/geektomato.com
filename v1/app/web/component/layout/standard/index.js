import ContentLayout from './main'

const content = '<div id="app" :style="{opacity: isService ? 0 : 1}"><ContentLayout><slot></slot></ContentLayout></div>'

const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <title>{{vTitle}}</title>
    <meta name="keywords" :content="vKeywords">
    <meta name="description" :content="vDescription">
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
    <meta name="msapplication-TileColor" content="#da532c">
    <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon.png">
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
</head>
<body :class="vBaseClass"> 
${content}
</body>
<!--<script src="/plugin/jstz-1.0.4.min.js"></script>-->
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-85358197-11"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-85358197-11');
</script>
<script>
function onloadCallback() {}
</script>
</html>`

export default {
    name: 'Layout',
    props: ['title', 'description', 'keywords', 'baseClass', 'hide'],
    components: {ContentLayout},
    data() {
        return {
            isService: EASY_ENV_IS_NODE
        }
    },
    computed: {
        vTitle() {
            const {title, $root} = this
            const {seo} = $root

            return title || (seo && seo.title) || '极客番茄'
        },
        vKeywords() {
            const {$root, keywords} = this
            const {seo} = $root

            return keywords || (seo && seo.keywords) || '极客番茄'
        },
        vDescription() {
            const {description, $root} = this
            const {seo} = $root

            return description || (seo && seo.description) || '极客番茄'
        },
        vBaseClass() {
            const {baseClass, $root} = this
            
            return baseClass || $root.baseClass || ''
        }
    },
    template: EASY_ENV_IS_NODE ? template : content
}
