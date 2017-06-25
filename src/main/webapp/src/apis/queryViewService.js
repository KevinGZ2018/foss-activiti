define([ 'vue', 'axios', 'globalConst' ], function(Vue, axios, globalConst) {

    return {
        queryPage: function (data1, data2, data3) {
            return axios.post("/default/query_page/" + data1 + "/" + data2, "conditions=" + data3)
        }
    }
})