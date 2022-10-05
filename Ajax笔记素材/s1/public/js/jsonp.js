function jsonp(options) {
    // 动态创建script标签
    var script = document.createElement('script');
    // 拼接字符串的变量
    var params = '';
    for (var attr in options.data) {
        params += '&' + attr + '=' + options.data[attr];
    }
    // 产生随机的函数名称
    var fnName = 'myJsonp' + Math.random().toString().replace('.', '');
    // 它已经不是一个全局函数了
    // 我们要想办法将它变成全部函数
    window[fnName] = options.success;
    // 为 script 标签添加 src 属性
    script.src = options.url + '?callback=' + fnName + params;
    // 将 script 便签追加到页面中
    document.body.appendChild(script);
    // 为 script 标签添加 onload事件
    script.onload = function () {
        document.body.removeChild(script);
    }
}