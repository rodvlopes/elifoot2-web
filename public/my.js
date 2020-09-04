const urlParams = new URLSearchParams(window.location.search)
const user = urlParams.get('user')
const IDB_KEY = `game.jsdos.${user}`

async function myinit(elem) {
  let url = "elifoot2.jsdos"
  window.cache = await emulators.cache()

  try {
    const buffer = await cache.get(IDB_KEY)
    url = URL.createObjectURL(new Blob([buffer]))
    console.log('Found state on indexedDB')
  }
  catch (e) {
    console.log(`No ${IDB_KEY} on indexedDB`)
  }

  if (user) { //recover from server
    const buffer = await xhrLoad(user)  
    if (buffer.byteLength) {
        console.log('Found state on server')
        url = URL.createObjectURL(new Blob([buffer]))
    }
    else
        console.log("No data on server side for this user")
  }

  console.log('url', url)
  ci = await Dos(elem).run(url) 
  startPersistenceWatcher()
}

async function save() {
  const updated = await ci.persist()
  await xhrSave(updated)
}

function xhrSave(val) {
  console.log('xhrSave')
  return fetch(`/elifoot2/save/${user}`, {
    type: "application/octet-stream",
    method: "POST",
    body: val,
    headers: new Headers({'content-type': 'application/octet-stream'}),
  }).then(function (response) {
    return response.text()
  })
  .then(function (result) {
      console.log('Server renponded', result)
  })
  .catch (function (error) {
      console.log('Request failed to save', error)
  })
}

function xhrLoad(fs) {
  console.log('xhrLoad')
  return fetch(`/elifoot2/load/${user}`, {
    method: "GET",
  }).then(function (response) {
    return response.arrayBuffer()
  })
 // .then(function(text){
 //     if (!text) return null
 //     return new Uint8Array(atob(text).split(',')) 
 // })
  .catch (function (error) {
      console.log('Request failed to load', error)
  })
}

function startPersistenceWatcher() {
  setInterval(async () => {
    const updated = await ci.persist()
    await cache.put(IDB_KEY, updated)
  }, 5000)
}


function foo() {
  console.log('foo')
  return fetch(`test`, {
    method: "POST",
    body: new Uint8Array([1,2,3,4,5])
  }).then(function (response) {
    return response.text();
  })
  .then(function (result) {
      console.log('Server renponded', result);
  })
  .catch (function (error) {
      console.log('Request failed to load', error);
  })
}
