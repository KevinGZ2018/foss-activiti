;
'use strict';
/**
 * setting application context.
 */
var ctx = window['ctx'] || "";
/**
 * define the require configure.
 */
var requireConfig = {
    baseUrl : ctx + '/src',
    //urlArgs : '_v=1.0.2',
    paths : {
        /**
         * define require plugin.
         */
        text : 'libs/text',
        css : 'libs/css',
        html : 'libs/html',
        /**
         * define vue
         */
        vue : "libs/vue",
        vuerouter : "libs/vue-router",
        vueresource : "libs/vue-resource.min",
        vuex : "libs/vuex",
        iview : "libs/iview",
        iviewcss : "libs/iview",
        customcss : "libs/custom",
        /**
         * common js
         */
        underscore : "libs/underscore-min",
        axios : "libs/axios.min",
        util : "libs/util",
        routes: "routes",
        globalConst: "config/const",
        views: "views",
        apis: "apis",
        app: "app",
        tab: "tab",
        remove: "remove",
        startProcessModal: 'views/process/startProcessModal'
    },
    shim : {
        vue : {
            exports : "vue"
        },
        vuerouter : {
            deps : [ "vue" ],
            exports : "vuerouter"
        },
        vueresource : {
            deps : [ "vue" ],
            exports : "vueresource"
        },
        vuex : {
            deps : [ "vue" ],
            exports : "vuex"
        },
        iview : {
            deps : [ "vue", "css!iviewcss", "css!customcss" ],
            exports : "iview"
        },
        axios : {
            exports: "axios"
        },
        underscore: {
            exports: "_"
        },
        util : {
            exports: "util"
        }
    }
};
/**
 * use the configuration.
 */
requirejs.config(requireConfig);
/**
 * loading the app.js file undering the html page directory.
 */
require([ 'vue', 'vuerouter', 'iview', 'vuex', 'routes', 'tab', 'app' ],
    function(Vue, VueRouter, iView, Vuex, Routes) {
    //Vue.config.debug = true
    //Vue.config.devtools = true
    /**@see http://www.tuicool.com/articles/jIRrAfI**/
    Vue.use(VueRouter)
    Vue.use(iView)
    Vue.use(Vuex)

    //Vue.http.options.emulateJSON = true

    // 将axios插件对象附加到vue的原型上
    // Vue.prototype.$http = axios

    // 配置自定义过滤器E
    Vue.filter('localDateString', function(value) {
        return new Date(value).toLocaleString()
    })

    var hasRoute = {};
    var router = new VueRouter({
        mode : 'hash',
        //mode : 'history',
        routes : Routes
    })

/*    var RouterHelper = function(name) {
        var args = Array.prototype.slice.call(arguments, 1), children = [];
        for (var i = 0; i < args.length; i++) {
            children.push(RouterHelper(args[i]))
        }
        var route = {
            path : name,
            component : function(resolve) {
                require([ "views/" + name ], resolve)
            }
        }
        children.length > 0 && (route.children = children)
        return route
    }*/

    router.beforeEach(function(to, from, next) {
        var path = to.path
        if (path == '/') {
            to = {
                path : '/index'
            }
            return next(to)
        } else if (hasRoute[path] == null) {
            hasRoute[path] = 1
            //router.addRoutes([ RouterHelper(path) ])
            return next(to)
        }
        next()

    })

    router.afterEach((to, from, next) => {
        iView.LoadingBar.finish();
        window.scrollTo(0, 0);
    })

    new Vue({
        el: '#app',
        router: router
    })

});
