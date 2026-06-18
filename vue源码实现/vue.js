class Vue {
    constructor(options){
        this.$options = options;
        this.$watchEvent = {}
        
        if(options.beforeCreate && typeof options.beforeCreate === 'function') options.beforeCreate.bind(this)();
        
        this.$data = options.data;
        this.proxyData();
        this.observe();
        
        if(options.created && typeof options.created === 'function') options.created.bind(this)();
        if(options.beforeMount && typeof options.beforeMount === 'function') options.beforeMount.bind(this)();
        this.$el = document.querySelector(options.el);
        this.compile(this.$el);
        if(options.mounted && typeof options.mounted === 'function') options.mounted.bind(this)();
        
    }

    observe(){
        for (let key in this.$data) {
            let value = this.$data[key];
            let that = this;
            Object.defineProperty(this.$data, key, {
                get(){
                    return value;
                },
                set(newVal){
                    value = newVal;
                    if (that.$watchEvent[key]) {
                        that.$watchEvent[key].forEach((watch,index) => {
                            watch.update();
                        });
                    }
                }
            })
        }
    }

    compile(node) {
        node.childNodes.forEach((child, index) => {
            // 如果子节点是元素节点，则递归编译
            if (child.nodeType === 1) {
                // 如果子节点有@click属性，则绑定事件
                if (child.hasAttribute('@click')) {
                    let fn = child.getAttribute('@click');
                    child.addEventListener('click', (event) => {
                        this.eventFn = this.$options.methods[fn].bind(this);
                        this.eventFn(event);
                    });
                }

                // 如果子节点有v-model属性，则绑定数据
                if (child.hasAttribute('v-model')) {
                    let key = child.getAttribute('v-model').trim();
                    if (this.hasOwnProperty(key)) {
                        child.value = this[key];
                    }

                    // 监听输入时间，实现双向绑定
                    child.addEventListener('input', (event) => {
                        this[key] = child.value;
                    });
                }

                // 如果子节点有子节点，则递归编译
                if (child.childNodes.length > 0) {
                    this.compile(child);
                }
            }
            // 如果子节点是文本节点, 则替换文本内容
            if (child.nodeType === 3) {
                let text = child.textContent;
                let reg = /\{\{(.*?)\}\}/g;
                child.textContent = text.replace(reg, (match, p1) => {
                    p1 = p1.trim();
                    if (this.hasOwnProperty(p1)) {
                        let watch = new Watch(this, p1, child, 'textContent')
                        if (this.$watchEvent[p1]) {
                            this.$watchEvent[p1].push(watch);
                        } else {
                            this.$watchEvent[p1] = [];
                            this.$watchEvent[p1].push(watch);
                        }
                    }
                    return this.$data[p1];
                });
            }
        })
    }

    /**
     * 数据劫持实现：
     */
    proxyData(){
        for (let key in this.$data) {
            Object.defineProperty(this, key, {
                get(){
                    return this.$data[key];
                },
                set(val){
                    this.$data[key] = val;
                }
            })
        }
    }
}

class Watch {
    constructor(vm, key, node, attr){
        this.vm = vm;
        this.key = key;
        this.node = node;
        this.attr = attr;
    }
    update(){
        this.node[this.attr] = this.vm[this.key];
    }
}