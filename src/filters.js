// import parseTime, formatTime and set to filter

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
 export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        // time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  if (new Date('2049-09-01') < date) {
    return '永久'
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  // if (('' + time).length === 10) {
  //   time = parseInt(time) * 1000
  // } else {
  //   time = +time
  // }
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        // time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }

  const now = Date.now()

  const diff = (now - date) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return (Math.ceil(diff / 60) - 1) + '分钟前'
  } else if (diff < 3600 * 24) {
    return (Math.ceil(diff / 3600) - 1) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(date, option)
  } else {
    return (
      date.getMonth() +
      1 +
      '月' +
      date.getDate() +
      '日' +
      date.getHours() +
      '时' +
      date.getMinutes() +
      '分'
    )
  }
}

export function shortAddress (str) {
  if (str && str.length > 8) {
    return str.substring(0, 4) + '...' + str.substring(str.length - 3, str.length)
  } else {
    return str
  }
}

export function shortAddress6 (str) {
  if (str && str.length > 8) {
    return str.substring(0, 6) + '...' + str.substring(str.length - 6, str.length)
  } else {
    return str
  }
}
/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * Upper case first char
 * @param {String} string
 */
export function Json2String(obj) {
  return JSON.stringify(obj, null, 4);
}

export function currency(obj) {
  return isNaN(parseInt(obj)) ? 0 : (parseInt(obj) / 100000000).toFixed(2)
}

export function capacity(obj) {
  let size = isNaN(parseInt(obj)) ? 0 : parseInt(obj)
  let _suffix = ' GB';
  if (obj / 1000 / 1000 > 1) {
    size = obj / 1000 / 1000;
    _suffix = ' PB';
  } else if (obj / 1000 > 1) {
    size = obj / 1000;
    _suffix = ' TB';
  }
  return (size.toFixed(2)) + _suffix
}

export function getDuration(second) {
  var days = Math.floor(second / 86400);
  var hours = Math.floor((second % 86400) / 3600);
  var minutes = Math.floor(((second % 86400) % 3600) / 60);
  var seconds = Math.floor(((second % 86400) % 3600) % 60);
  var duration = (days ? days + '天' : '') + (hours ? hours + '小时' : '') + (minutes ? minutes + '分' : '') + seconds + '秒';
  return duration;
}
