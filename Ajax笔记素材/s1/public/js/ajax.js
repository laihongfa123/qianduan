function ajax(options) {
    // 配置的是默认值
    let defaults = {
        type: 'get',
        url: '',
        data: '',
        processData: true,//是否对数据进行处理
        contentType: true,//使用默认请求头
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function () { },
        error: function () { },
        callback: function () { },
    };
    // 使用 options 对象中的属性覆盖 defaults 对象中的属性
    Object.assign(defaults, options);
    // 是否对数据进行处理
    let params = '';// params 是拼接请求参数的变量
    if (defaults.processData) {
        // 循环用户传递过来的参数
        for (let attr in defaults.data) {
            // 将参数装换为字符串格式
            params += `${attr}=${defaults.data[attr]}&`
        }
        // 将参数最后面的’&‘截取掉，将截取后的结果重新赋值给 params 变量
        params = params.substr(0, params.length - 1);
        // console.log('处理好的数据:', params);
    } else {
        params = defaults.data
        // console.log('数据：', params)
    }
    // 1.创建ajax对象
    const xhr = new XMLHttpRequest();
    defaults.callback(xhr);
    //当发送跨域请求时，携带cookie信息
    // xhr.withCredentials = true;
    // xhr.withCredentials = true;
    // 处理get请求方式
    if (defaults.type == 'get') {
        defaults.url = `${defaults.url}?${params}`;
    }
    // console.log('ajax配置对象:', defaults)
    /* 2.告诉 Ajax 对象要向那里发送请求，以什么方式发送请求 */
    xhr.open(defaults.type, defaults.url);
    // 处理请求方式为 post
    if (defaults.type == 'post') {
        const contentType = '';
        // 是否使用请求头
        if (defaults.contentType) {
            const contentType = defaults.header['Content-Type'];
            // 设置请求参数格式的类型
            xhr.setRequestHeader('Content-Type', contentType);
        }
        // 判断用户希望的请求参数格式的类型
        // 如果类型为json
        if (contentType == 'application/json') {
            // 向服务器端传递json数据格式的参数
            xhr.send(JSON.stringify(defaults.data));
        } else {
            // 先服务器端传递普通类型的请求参数
            xhr.send(params);
        }
    } else {
        xhr.send(); // 发送get请求
    }
    // 监听 xhr对象下面的onload事件,当xhr对象接收完响应数据后触发
    xhr.onload = function () {
        // xhr.getResponseHeader : 获取响应头中的数据
        const contentType = xhr.getResponseHeader('Content-Type');
        // 服务器端返回的数据
        let responseText = xhr.responseText;
        // 如果响应类型中包含 application/json
        if (contentType.includes('application/json')) {
            // JSON字符串转换成JSON对象
            responseText = JSON.parse(responseText);
        }
        // 当 http 状态码为 200 的时候
        if (xhr.status == 200) {
            // 请求成功，调用请求成功情况的函数
            defaults.success(responseText, xhr);
        } else {
            // 请求失败，调用请求失败情况的函数
            defaults.error(responseText, xhr);
        }
    }

}