define(['vue', 'axios'], function(Vue, axios) {

    var remove = Vue.extend({
        template : '<div><template></template></div>',
        methods: {
            remove: function(url) {
                if(confirm("确定要删除记录？")) {
                    axios.get(url).then((response) => {
                        if(response.data === 'success') {
                            this.$Message.success('删除成功!')
                            this.$emit('refresh');
                        } else {
                            this.$Message.error('删除失败!')
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            }
        }
    });

    Vue.component('remove-component', remove);
})
