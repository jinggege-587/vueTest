import Vue from 'vue';
import VueResource from 'vue-resource';
import querystring from 'querystring';
import {
  filterData
} from '@/assets/js/utils';
// import url from './url';
const url = require('./url');

const baseUrl = 'http://localhost:3000';

Vue.use(VueResource);

Vue.http.options.emulateJSON = true;

const isMock = process.env.MOCK


export default function (Vue, {router,store}) {
  if (!Vue.prototype.$message) {
    console.error('You have to use ElementUI')
    return
  }
  const debug = process.env.NODE_ENV !== 'production'

  let info = (log, ...arg) => {
    debug && console.log(log, ...arg)
  }

  // 统一处理ajax数据返回
  const handleSuccess = (data, success, failure) => {
    if (data.result == '100') {
      let res = data.data || data.resultParm
      success && success(res)
      info(res)
    } else {
      failure && failure(data)
      console.warn(data)
    }
  }

  const _error = err => {
    Vue.prototype.$message({
      type: 'error',
      message: err && err.errorMessage
    })
    console.error(err)
  }

  // 处理ajax最后的异常
  const handleFail = function (err, cb) {
    if (err.status == '404') {
      Vue.prototype.$message({
        title: '404',
        message: 'uri地址不存在'
      })
    } else if (err.status == '407') {
      Vue.prototype.$message({
        title: '公告',
        message: '系统维护中',
        showConfirmButton: false,
        closeOnClickModal: false
      })
    } else if (err.status == '413') {
      Vue.prototype.$message({
        title: '413',
        message: '超出服务器上传限制',
        showConfirmButton: false,
        closeOnClickModal: false
      })
    } else {
      Vue.prototype.$message({
        title: '提示',
        message: "网络异常" + (err.status ? '：' + err.status : '')
      })
    }
    cb && cb(err)
  }

  const ajax = (config, success, fail, isLoading) => {
    filterData(config.params)
    filterData(config.data)
    config.headers = 'Access-Control-Allow-Headers'
    let loading = null,
        isLoadingFun = Object.prototype.toString.call(isLoading) === '[object Function]'
    if (fail && isLoading && !isLoadingFun) {
        loading = Vue.prototype.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading'
        })
    }
    isLoadingFun && isLoading(true);
    return Vue.http[config.method](config.url, config.params).then(res => {
        res = res.body;
        let failure = fail || _error
        handleSuccess(res, success, failure)
        loading && loading.close()
        isLoadingFun && isLoading(false)
        return res;
    }, err => {
        handleFail(err)
        loading && loading.close()
        isLoadingFun && isLoading(false)
        return err;
    });
  }


  const handleApi = function () {
    let api = {}
    for (let key in url) {
      if (url.hasOwnProperty(key)) {
        api[key] = ({
          param,
          method = 'get',
          ...res
        }, success, failure = _error, isLoading = true) => {
            let config = {
                url: (isMock) ? "/mock/" + key : baseUrl + url[key],
                method: method,
                ...res
            }
            config.params = param;
            return ajax(config, success, failure, isLoading)
        }
      }
    }
    return api
  }

  function getBody(xhr) {
    const text = xhr.responseText || xhr.response;
    if (!text) {
      return text;
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  }
  /* 全局登入守卫 */
  router.beforeEach((to, from, next) => {
    // if(process.env.HOST === 'localhost'){ return next() }
    let toName = to.name
    if (!to.meta.noLogin && store.getters.getUser || to.meta.updateSms) {
      ajax({
        url: isMock ? '/mock/getUser' : baseUrl + url.getUser,
        method: 'get',
      }, data => {
        store.dispatch("loginSuccess", data).then(() => {
          next()
        })
      }, err => {
        let router = {
          name: 'login'
        }
        if (toName !== 'sendImported') {
          Vue.prototype.$message({
            type: 'error',
            message: err && err.errorMessage
          })
          router.query = {
            to: to.path
          }
        }
        next(router)
      }, false)
    } else {
      next()
    }
  })
  Vue.prototype.$api = window.$api = handleApi()
  Vue.prototype.$ajax = ({
    error = _error,
    success = () => {},
    data = {},
    ...option
  } = {}) => {
    let xhr = new XMLHttpRequest();
    let {
      type,
      url,
      async
    } = option
    let method = type || 'GET'
    xhr.onerror = e => {
      handleFail(e);
    };
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        return handleFail(getBody(xhr), error)
      }
      handleSuccess(getBody(xhr), success, error)
    };

    let params = querystring.stringify(data),
      param = null

    if (method.toLocaleUpperCase() === 'POST') {
      param = params
    } else {
      url = url + "?" + params
    }

    xhr.open(method.toLocaleUpperCase(), url, async ===false ? false : true)

    if (option.withCredentials && 'withCredentials' in xhr) {
      xhr.withCredentials = true;
    }
    const headers = option.headers || {};
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    for (let item in headers) {
      if (headers.hasOwnProperty(item) && headers[item] !== null) {
        xhr.setRequestHeader(item, headers[item]);
      }
    }

    xhr.send(param)

    return xhr
  }
}
