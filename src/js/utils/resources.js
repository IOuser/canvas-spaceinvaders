let resourceCache = {};
let readyCallbacks = [];

function load(resOrArr) {
  if(resOrArr instanceof Array) {
    resOrArr.forEach(res => _load(res));
  } else {
    _load(resOrArr);
  }
}

function _load(res) {
  if(resourceCache[res.name]) {
    return resourceCache[res.name];
  } else {
    switch(res.type) {
      case 'img':
        _loadImg(res);
        break;
      case 'audio':
        _loadAudio(res);
        break;
    }
  }
}

function _loadImg(res) {
  let img = new Image();
  img.onload = function() {
    resourceCache[res.name] = img;

    if(isReady()) {
      readyCallbacks.forEach(function(func) { func(); });
    }
  };
  resourceCache[res.name] = false;
  img.src = res.url;
}

function _loadAudio(res) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', res.url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function() {
    resourceCache[res.name] = this.response;
    if(isReady()) {
      readyCallbacks.forEach(function(func) { func(); });
    }
  };
  xhr.send();
}

function get(name) {
  return resourceCache[name];
}

function isReady() {
  let ready = true;
  for(let k in resourceCache) {
    if(resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
      ready = false;
    }
  }
  return ready;
}

function onReady(func) {
  readyCallbacks.push(func);
}

export default {
  load,
  get,
  onReady,
  isReady
}