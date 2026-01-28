// app/extend/application.js
// this 就是 ctx.helper 对象，在其中可以调用 ctx.helper 上的其他方法，或访问属性

module.exports = {
    /**
     * Generate URL path(without host) for route. Takes the route name and a map of named params.
     * @method Helper#pathFor
     * @param {String} name - Router Name
     * @param {Object} params - Other params
     *
     * @example
     * ```js
     * app.get('home', '/index.htm', 'home.index');
     * ctx.helper.pathFor('home', { by: 'recent', limit: 20 })
     * => /index.htm?by=recent&limit=20
     * ```
     * @return {String} url path(without host)
     */
    pathFor(name, params) {
        return this.app.router.url(name, params)
    },
    setHeaderInCookie(userInfo) {
        if (userInfo) {
            const date = new Date()
            date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * 730)
            this.ctx.cookies.set('geektomato_head', encodeURIComponent(JSON.stringify(userInfo)), {expires: date, signed: false, httpOnly: false})
        }
    }
}
