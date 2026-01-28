// tools

const tools = {
    /**
     * 获取url参数
     */
    getQueryString: name => {
        if (EASY_ENV_IS_NODE) return ''

        const {
            search,
            hash
        } = window.location
        const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        const str = search + hash
        const r = str.substr(1).match(reg)

        if (r != null) return decodeURIComponent(decodeURIComponent(r[2]))
        return ''
    },

    replaceUrl: (name, replace) => {
        if (EASY_ENV_IS_NODE) return ''
        const {
            search,
            hash
        } = window.location
        const reg = new RegExp('(' + name + '=)([A-Za-z0-9_]+)(&|$)', 'g')
        const str = search + hash
        let res = str.replace(reg, replace ? ('$1' + replace + '$3') : '')
        
        if (str.indexOf(name + '=') < 0) {
            res = search + (search ? '&' : '?') + name + '=' + replace + hash
        } else if (res.length < 2) {
            res = ''
        }

        return res
    },

    urlSeo: (url) => {
        if (EASY_ENV_IS_NODE) return ''

        url = url.toLowerCase().replace(/ - /g, '-').replace(/ /g, '-').replace(/,/g, '-').replace(/，/g, '-').replace(/'/g, '-')
            .replace(/"/g, '-').replace(/\?/g, '-').replace(/？/g, '')

        return url
    },

    getBodyData: name => {
        if (EASY_ENV_IS_NODE) return '{}'
        let res = decodeURIComponent(document.body.getAttribute(`data-${name}`)) || '{}'
        if (document.body.getAttribute(`data-${name}`) === null || document.body.getAttribute(`data-${name}`) === 'undefined') {
            res = decodeURIComponent(window[name]) || '{}'
        }

        try {
            res = JSON.parse(res)
        } catch (e) {}
        
        return res
    },

    /**
     * first letter upper
     */
    firstLetterUpper: str => {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
    },

    /**
     * getCookie
     */
    getCookie: name => {
        if (EASY_ENV_IS_NODE) return null
        const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`)
        const arr = document.cookie.match(reg)

        if (arr) return decodeURIComponent(arr[2])
        return null
    },

    setCookie: (name, value, day, path = '/' ) => {
        if (EASY_ENV_IS_NODE) return
        var Days = day || 30
        var exp = new Date()
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
        document.cookie = `${name}=${encodeURIComponent(value)};path=${path};expires=${exp.toGMTString()}`
    },

    deleteCookie: (name,path = '/' ) => {
        if (EASY_ENV_IS_NODE) return
        document.cookie = `${name}=; path=${path}; expires=Thu, 01-Jan-70 00:00:01 GMT`
    },
    /**
     * 根据时间戳返回标准时间
     */
    formatTime: stamp => {
        console.log('stamp:' + stamp)
        let date = null;
        if (stamp) {
            date = new Date(stamp);
        } else {
            date = new Date();
        }
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = date.getUTCDate();
        const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return mon[month] + ' ' + day + 'th, ' + year;
    },
	/**
     * local storage
	 */

	/**
     * error content
     */
    errorContent: (xhr, errorType, error) => {
        let content = 'An unexpected error occurred. Please try again later'
        if (xhr && xhr.response && xhr.response.statusText) {
            content = xhr.response.status + ' ' + xhr.response.statusText
        } else if (error) {
            content = error
        } else if (errorType) {
            content = errorType
        }

        return content
    },

    /**
     * 格式化图片, 参考webapp
     * @param {string} url urlstring
     * @param {number} size * 提供这几个尺寸[i100,i200,i300,i400,i800,i1080][a50,a100,a200]
     * @param {string} modal a: 头像,i:单品
     */
    imageFilter: (url = '', size = 400, modal = 'i') => {
        if (!url || (url && !url.length)) return url
        size = parseInt(size)
        let paramStr = `f_auto,t_${modal}${size}`

        if (url.indexOf('/deleted/') > 0) return url

        if (url.indexOf('/prod/') > -1 || url.indexOf('/test/') > -1) {
            url = url.replace(/\/prod\//, 'f_auto,w_' + size + '/prod/')
            url = url.replace(/\/test\//, 'f_auto,w_' + size + '/test/')
        } else if (url.indexOf('facebook') > -1) {
            url = url.replace(/\/facebook/, '/facebook/' + paramStr)
        } else if (url.indexOf('gplus') > -1) {
            url = url.replace(/\/gplus/, '/gplus/' + paramStr)
        } else if (url.indexOf('f_auto') > 0) {
            url = url.replace(/upload\/[\w,]+/g, 'upload/' + paramStr)
        } else {
            url = url.replace(/upload/, 'upload/' + paramStr)
        }

        if (url.indexOf("cloudinary.com") > 0 || url.indexOf("res.geektomatoapp.com") > 0) {
            url = url.replace(/http:/, 'https:').replace(/res.geektomatoapp.com/, 'fivemiles-res.cloudinary.com')
        }

        return url
    },

    /**
     * format res
     */
    responseHandler: (response, success, fail) => {
        if (EASY_ENV_IS_NODE) return ''
        const content = 'error, Please try again later!'
        const responseData = response.data;
        let result = (responseData && responseData.data) || {}
        
        if (result && (result.err_code || result.err_msg)) {
	        result['_msg'] = result.err_msg
	        fail(result)
        } else if (responseData.success) {
            success(result)
        }
    },

    /**
     * url unit
     */
    getUrlUnit: (url, data) => {
        url += '/?'
        let params = ''
        for (let key in data) {
            params += '&' + key + '=' + data[key]
        }
        params = params.length > 0 ? params.substring(1) : ''
        url = url + params
        return url
    },

    /**
     * login user
     */
    isLogin: () => {
        let user = tools.getCookie('geektomato_head') || '{}'
        user = JSON.parse(user)
        return !!user.userToken
    },

    /**
     * get Login User info
     */
    getUser: () => {
        let user = tools.getCookie('geektomato_head') || '{}'
        user = JSON.parse(user)
        return !!user.userToken ? user : null
    },

    /**
     * 浮点数减法
     */
    accSub: (arg1, arg2) => {
        let r1, r2
        try {
            r1 = arg1.toString().split('.')[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split('.')[1].length
        } catch (e) {
            r2 = 0
        }
        const m = Math.pow(10, Math.max(r1, r2)) // last modify by deeka //动态控制精度长度
        const n = r1 >= r2 ? r1 : r2
        return ((arg1 * m - arg2 * m) / m).toFixed(n)
    },

    /**
     * 页面跳转
     * @param url
    */
    gotoPage: (url) => {
        if (EASY_ENV_IS_NODE) return null
        window.location.href = url
    },

    /**
     * 本地化时间
     * @param timestamp
    */
    localTime: time => {
        const createDateObj = new Date(time)
        time = createDateObj.toLocaleDateString() 
            + ' ' + createDateObj.getHours().toString().padStart(2, '0') 
            + ':' + createDateObj.getMinutes().toString().padStart(2, '0') 
            + ':' + createDateObj.getSeconds().toString().padStart(2, '0')
        return time
    },

    /**
     * 本地化时间
     * @param timestamp
     */
    yearMonthDay: time => {
        const createDateObj = new Date(time)
        time =  `${createDateObj.getUTCFullYear()}-${(createDateObj.getUTCMonth() + 1).toString().padStart(2, '0')}-${createDateObj.getUTCDate().toString().padStart(2, '0')}`
        return time
    },

    /**
     * PST 时间
     * @param timestamp
     */
    pstTime: time => {
        let date = new Date(time);
        let utcDate = new Date(date.toUTCString());
        utcDate.setHours(utcDate.getHours()-16);
        let usDate = new Date(utcDate);

        usDate = usDate.getFullYear() + '/' + (usDate.getMonth() + 1) + '/' + usDate.getDate()
            + ' ' + usDate.getHours().toString().padStart(2, '0')
            + ':' + usDate.getMinutes().toString().padStart(2, '0')
            + ':' + usDate.getSeconds().toString().padStart(2, '0') + ' PST'
        return usDate
    },

    /**
     * 数组笛卡尔乘积
     * [...tools.cartesian(...[[1,2],[3,4]]) to [[1,3],[1,4],[2,3],[2,4]]
    */
    cartesian: function*(head, ...tail) {
        const remaining = tail.length > 0 ? this.cartesian(...tail) : [[]]
        for (let r of remaining) for (let h of head) yield [h, ...r]
    },
    
    /**
     * 去除字符串前后空格 并做空值判断
     * @param string
    */
    isInvalid: str => {
        const _str = str.replace(/(^\s*)|(\s*$)/g, '')
        return _str.length === 0
    },

    /**
     * 
     * 判断正整数/[1−9]+[0−9]
     * 
    */
    isNumber: str => {
        const re = /^[1-9]+[0-9]*]*$/
        return re.test(str)
    },

    /**
     * 数组去重
     * @param Array
    */
    uniqueArr: arr => {
        return Array.from(new Set(arr))
    },
    /**
     * 数字除以100, 保留2位
     * @param String
     */
    formatDivide: number => {
        if (!number && number !== 0) return ''
        return (parseInt(number) / 100).toFixed(2)
    }
}

export default tools
