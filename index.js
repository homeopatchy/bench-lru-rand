var uuid = require('uuid/v1')

var hashlru = require('hashlru')
var hashlruMultilayer = require('hashlru-multilayer')
var ModernLRU = require('modern-lru')
var LRUCache = require('lru_cache').LRUCache
var LRUFast = require('lru-fast').LRUCache

var layers = 12

var algs = {
  'hashlru': function (n) { return hashlru(n/2) },
  'hashlru-multilayer': function (n) { return hashlruMultilayer((n/layers)|0, layers) },
  'modern-lru': function (n) { return new ModernLRU(n) },
  'lru_cache': function (n) { return new LRUCache(n) },
  'lru-fast': function (n) { return new LRUFast(n) },
}

function shuffle(arr) {
  var tmp, rndIndex, index = arr.length
  while (index) {
    rndIndex = Math.floor(Math.random() * index--)
    tmp = arr[index]
    arr[index] = arr[rndIndex]
    arr[rndIndex] = tmp 
  }
}

function bench (n) {
  for (var values = {}, i = n * 2; i--;) {
    values[uuid()] = uuid()
  }
  var keys = Object.keys(values)
  for (var actions = [], i = n / 2; i--;) {
    actions.push({ action: 'get', key: keys[n - i] })
    actions.push({ action: 'set', key: keys[n - i], value: values[keys[n - i]] })
    actions.push({ action: 'get', key: keys[i] })
    actions.push({ action: 'set', key: keys[i], value: values[keys[i]] })
  }
  return [values, actions]
}

function run(actions, values, alg, n) {
  var lru = alg(n)
  var hits = 0
  var misses = 0
  var start = Date.now()
  for (var v, i = actions.length; i--;) {
    v = lru[actions[i].action](actions[i].key, actions[i].value)
    if (actions[i].action === 'get') {
      if (v === values[actions[i].key]) hits++
      else misses++
    }
  }
  return [Math.round(n/(Date.now() - start)), hits, misses]
}

var N = 100000
var C = 10000
var data = bench(N)
var values = data[0]
var actions = data[1]

shuffle(actions)

console.log('name\t\t\tperf\thits\tmisses')
console.log('-\t\t\t-\t-\t-')

for(var name in algs) {
  var v = run(actions, values, algs[name], C)
  console.log([name].concat(v[0])
    .join(new Array(4 - ((name.length / 8)|0)).join('\t'))
    + '\t' + v[1] + '\t' + v[2])
}
