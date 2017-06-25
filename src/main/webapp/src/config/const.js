define([], function() {
    return {
        PAGE: {
            INIT_CURRENT_PAGE: 1,
            INIT_PAGE_SIZE: 10
        },
        MODEL: {
            URL: {
                LIST: '/workflow/model/list',
                ADD: '/workflow/model/add',
                REMOVE: '/workflow/model/remove',
                DEPLOY: '/workflow/model/deploy',
                EXPORT: '/workflow/model/export'
            },
            ROUTER: {
                LIST: '/model_list',
                ADD: '/model_add'
            }
        },
        PROCESS: {
            URL: {
                LIST: '/workflow/process/list',
                REMOVE: '/workflow/process/remove',
                READ_PROCESS_RESOURCE: '/workflow/process/resource/read',
                ACTIVE_PROCESS: '/workflow/process/update/active',
                SUSPEND_PROCESS: '/workflow/process/update/suspend',
                CONVERT_TO_MODEL: '/workflow/process/convert-to-model',
                GET_START_FORM: '/workflow/process/get-form/start',
                START_PROCESS: '/workflow/process/start-process'
            },
            ROUTER: {
                LIST: '/process_list'
            }
        },
        TABLE: {
            URL: {
                LIST: 'http://localhost:8989/default/table_find_id',
                GET: 'http://localhost:8989/default/table_get_id'
            }
        },
        QUERY_STATEMENT: {
            URL: {
                LIST: 'http://localhost:8989/default/querystatement_page',
                ADD: 'http://localhost:8989/default/querystatement_update',
                UPDATE: 'http://localhost:8989/default/querystatement_update',
                REMOVE: 'http://localhost:8989/default/querystatement_del_id',
                GET: 'http://localhost:8989/default/querystatement_get_id'
            },
            ROUTER: {
                LIST: '/query_statement_list',
                ADD: '/query_statement_add',
                EDIT: '/query_statement_edit',
                VIEW: '/query_statement_view',
                STEP_CONFIG_DATA_SOURCE: '/step_config_data_source',
                STEP_CONFIG_TABLE: '/step_config_table',
                STEP_CONFIG_QUERY_STATEMENT: '/step_config_query_statement'
            }
        },
        QUERY_STATEMENT_CREATE_STORE: {
            dataSourceId: '',
            tables: [],
            queryStatementModel: {
                name: '',
                description: '',
                primaryTable: {},
                joinTables: [],
                selectColumns: [],
                whereConditions: []
            },
            clear: function () {
                this.dataSourceId = '',
                    this.tables = [],
                    this.queryStatementModel = {
                        name: '',
                        description: '',
                        primaryTable: {},
                        joinTables: [],
                        selectColumns: [],
                        whereConditions: []
                    }
            }
        },
        SEPARATOR: {
            SPACE_SPLIT: ' ',
            DOT_SPLIT: '.',
            ON_SPLIT: ' ON ',
            EQ_SPLIT: ' = ',
            AND_SPLIT: ' AND ',
            UNDERLINE_SPLIT: '_',
            COLON_SPLIT: ':',
            POUND_SIGN_SPLIT: '#'
        }
    }
})