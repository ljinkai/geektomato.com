const content = '<div id="app" :style="{opacity: isService ? 0 : 1}"><slot></slot></div>'

const template = `<!DOCTYPE html> 
<html lang="en">
<head>
    <title>{{vTitle}}</title>
    <meta name="keywords" :content="vKeywords">
    <meta name="description" :content="vDescription">
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
</head>
<body :class="vBaseClass">
${content}
    
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-85358197-11"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-85358197-11');
</script>

</body>
</html>`

export default {
    name: 'LoginLayout',
    props: ['title', 'description', 'keywords', 'baseClass'],
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

            return keywords || (seo && seo.keywords) || 'E-Commerce with blockchain, action mining'
        },
        vDescription() {
            const {description, $root} = this
            const {seo} = $root

            return description || (seo && seo.description) || 'The first Crypto only E-Commerce platform with 100% refund. Shop more than 100 products with Cybermiles Tokens (CMT) on Blocktonic.io.We are changing the furture of E-Commerce with blockchain and cryptocurrency.'
        },
        vBaseClass() {
            const {baseClass, $root} = this
            
            return baseClass || $root.baseClass || ''
        }
    },
    template: EASY_ENV_IS_NODE ? template : content
}
