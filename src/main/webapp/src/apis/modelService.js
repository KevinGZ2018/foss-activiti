define([ 'vue', 'axios', 'globalConst' ], function(Vue, axios, globalConst) {

    return {
        findModels: function (data1, data2) {
            return axios.get(globalConst.MODEL.URL.LIST +  "/" + data1 + "/" + data2)
        },
        getModel: function (data) {
            return axios.get(globalConst.MODEL.URL.GET + "/" + data)
        },
        addModel: function (data) {
            return axios.post(globalConst.MODEL.URL.ADD, data)
        },
        editModel: function (data) {
            window.open("/modeler.html?modelId=" + data)
        },
        deployModel: function (data) {
            return axios.post(globalConst.MODEL.URL.DEPLOY + "/" + data)
        },
        exportModel: function (id, exportType) {
            window.open(globalConst.MODEL.URL.EXPORT + "/" + id + "/" + exportType)
        }
    }
})