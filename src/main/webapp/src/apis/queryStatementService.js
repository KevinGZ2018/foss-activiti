define([ 'vue', 'axios', 'globalConst' ], function(Vue, axios, globalConst) {

    return {
        findQueryStatements: function (data1, data2) {
            return axios.get(globalConst.QUERY_STATEMENT.URL.LIST +  "/currentPage=" + data1 + "/pageSize=" + data2)
        },
        getQueryStatement: function (data) {
            return axios.get(globalConst.QUERY_STATEMENT.URL.GET + "/" + data)
        },
        addQueryStatement: function (data) {
            return axios.post(globalConst.QUERY_STATEMENT.URL.ADD, data)
        },
        updateQueryStatement: function (data) {
            return axios.post(globalConst.QUERY_STATEMENT.URL.UPDATE, "queryStatement=" + data)
        },
        findTables: function (data) {
            return axios.get(globalConst.TABLE.URL.LIST + "/" + data)
        },
        getQueryStatementByName: function(data) {
            return axios.get("/default/querystatement_get_name/" + data)
        }
    }
})