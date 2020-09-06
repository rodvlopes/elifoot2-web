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
  startAltF1SaveWatcher()
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
  .catch (function (error) {
      console.log('Request failed to load', error)
  })
}

async function saveIndexedDb() {
  const updated = await ci.persist()
  await cache.put(IDB_KEY, updated)
}

function startAltF1SaveWatcher() {
  let saveInProgress = false
  let enterPressed  = 0
  const f1 = 112
  const enter = 13

  document.addEventListener("keydown", function(e){
    if (e.keyCode == f1 && e.altKey) {
        saveInProgress = true
        enterPressed = 0
    }
    if (saveInProgress && e.keyCode == enter) {
        enterPressed++
    }
    if (saveInProgress && e.keyCode == enter && enterPressed > 1) {
        saveInProgress = false
        if (user) {
          setTimeout(save, 1000)
        }
        setTimeout(saveIndexedDb, 1000)
    }
  })
}

