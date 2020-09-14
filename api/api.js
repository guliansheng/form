import {  message } from 'ant-design-vue';
//处理get请求，传入参数对象拼接
let formatUrl = obj => {
  let params = Object.values(obj).reduce((a, b, i) => `${a}${Object.keys(obj)[i]}=${b}&`, '?');
  return params.substring(0, params.length - 1);
};

let Fetch = (url, option = {}) => {
  option.headers = option.headers || {};

  const m = (option.method || '').toLocaleLowerCase();
  // get query format
  if (m == 'get') {
    if (option.query) {
      url = url + formatUrl(option.query);
    }
  }
  //对非get类请求头和请求体做处理
  if (m === 'post' || m === 'put' || m === 'delete') {
    option.headers['Content-Type'] = option.headers['Content-Type'] || 'application/json';
    option.body = JSON.stringify(option.body);
  }
  option.headers['tenantCode'] = 'ca5c8704-40c8-4805-9d44-f0934a8d144f';
  return new Promise((resolve, reject) => {
    fetch(url, option)
      .then(response => {
        status = response.status;
        if (response.status+'' === '200') {
          return response;
        }
      })
      .then(parseJSON)
      .then(response => {
        // response.status = status;
        // if (response.status >= 401) {

        // }
        if (response.success) {
          resolve(response)
          return
        }
        response.message && message.error(response.message)
        reject(response)
      })
      .catch(error => {
        reject(error)
        // Fetch.otherError && Fetch.otherError(error.message);
      });
  });
};

//response 转化
function parseJSON(response) {
  return response.json();
}

let baseUrl = 'http://10.0.0.12:9097/api'
let serviceName = ''

export function getModelById(id, options) {
  return Fetch(`${baseUrl}${serviceName}/v1/form/get/${id}`,{
    ...options,
    method: 'POST'
  })
}

export function saveModel(options) {
  return Fetch(`${baseUrl}${serviceName}/v1/form/save`, {
    ...options,
    method: 'POST'
  })
}