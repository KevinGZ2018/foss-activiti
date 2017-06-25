define([ 'vue', 'axios', 'globalConst' ], function(Vue, axios, globalConst) {

    return {
        findDataSources: function (data1, data2) {
            return axios.get(globalConst.DATA_SOURCE.URL.LIST +  "/currentPage=" + data1 + "/pageSize=" + data2)
        },
        getDataSource: function (data) {
            return axios.get(globalConst.DATA_SOURCE.URL.GET + "/" + data)
        },
        addDataSource: function (data) {
            return axios.post(globalConst.DATA_SOURCE.URL.ADD, data)
        },
        updateDataSource: function (data) {
            return axios.post(globalConst.DATA_SOURCE.URL.UPDATE, "datasource=" + data)
        }
    }
})