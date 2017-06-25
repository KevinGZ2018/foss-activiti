define([ 'vue', 'html!views/queryView/queryView.html', 'apis/queryViewService', 'apis/queryStatementService', 'underscore' ],
    function(Vue, html, queryViewService, queryStatementService) {

        var queryView = Vue.extend({
            template : html,
            data () {
                return {
                    columns: [{
                        title: '',
                        key: ''
                    }],
                    rows: [],
                    pageSizeOpts: [10, 20],
                    totalCount: 0,
                    conditions: {
                        currentPage: 1,
                        pageSize: 10
                    },
                    searchConditions: [],
                    dataSourceName: '',
                    queryStatementName: ''
                }
            },
            methods: {
                refresh () {
                    this.searchConditions = _.map(this.searchConditions, function(searchCondition) {
                        searchCondition.paramValue = ""
                        return searchCondition
                    })
                    this.search()
                },
                changePage (current) {
                    this.conditions.currentPage = current
                    this.getDataPage()
                },
                changePageSize (pageSize) {
                    this.conditions.pageSize = pageSize
                    this.getDataPage()
                },
                getDataPage () {
                    queryViewService.queryPage(this.dataSourceName, this.queryStatementName,
                        encodeURIComponent(JSON.stringify(this.conditions))).then((response) => {

                        var resultData = response.data
                        this.$set(this.$data, 'rows', resultData.rows)
                        this.$set(this.$data, 'totalCount', resultData.totalCount)

                    }).catch((error) => {
                        console.log(error)
                    })
                },
                search () {

                    this.conditions = {
                        currentPage: 1,
                        pageSize: this.conditions.pageSize
                    }

                    for(var i in this.searchConditions) {
                        var searchCondition = this.searchConditions[i]
                        if(searchCondition.paramValue != '') {
                            this.conditions[searchCondition.paramName] = searchCondition.paramValue.trim()
                        }
                    }

                    this.getDataPage()
                },
                init (dataSourceName, queryStatementName) {

                    this.dataSourceName = dataSourceName
                    this.queryStatementName = queryStatementName

                    queryStatementService.getQueryStatementByName(this.queryStatementName).then((response) => {

                        var resultData = response.data
                            var selectBody = resultData.selectBody
                            var whereBody = resultData.whereBody

                            this.columns = []
                            var selectColumns = selectBody.split(", ")
                            for (var selectColumn in selectColumns) {
                                var key = selectColumns[selectColumn].split(" ")[1]
                                this.columns.push({title: key, key: key})
                            }

                            this.searchConditions = []
                            if(whereBody.length > 2) {
                                whereBody = whereBody.substr(1, whereBody.length - 2)
                                var whereColumns = whereBody.split('][')
                                for(var i in whereColumns) {
                                    var whereColumn = whereColumns[i].split(" ")
                                    if("AND" == whereColumn[0]) {
                                        this.searchConditions.push({
                                            name: whereColumn[1],
                                            paramName: whereColumn[3].substr(1, whereColumn[3].length-1),
                                            paramValue: ""
                                        })
                                    }
                                }
                            }

                            this.getDataPage()

                        })
                        .catch((error) => {
                            console.log(error)
                        })

                },
                load (dataSourceName, queryStatementName, data) {
                    this.dataSourceName = dataSourceName
                    this.queryStatementName = queryStatementName
                    var columns = data.columns
                    var searchConditions = data.searchConditions
                    var conditions = data.conditions
                    var pageSizeOpts = data.pageSizeOpts

                    if(columns != undefined) {
                        this.$set(this.$data, 'columns', columns)
                    }

                    if(searchConditions != undefined) {
                        this.$set(this.$data, 'searchConditions', searchConditions)
                    }

                    if(conditions != undefined) {
                        for(var key in conditions) {
                            this.conditions[key] = conditions[key]
                        }
                    }

                    if(pageSizeOpts != undefined) {
                        this.$set(this.$data, 'pageSizeOpts', pageSizeOpts)
                    }

                    this.getDataPage()
                }
            },
            watch: {
                dataSourceName: function () {
                    this.getDataPage()
                },
                queryStatementName: function() {
                    this.getDataPage()
                }
            }
        });

        Vue.component('query-view-component', queryView);
})