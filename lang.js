
function getLangFromStore() {
  const lang = localStorage.getItem('lang') || 'ru';
  return lang
}

function setLangToStore(value) {
  localStorage.setItem('lang', value)
}

async function setLoadingPage(func) {
  document.getElementById('loading').className = 'active'
  await func()
  setTimeout(()=> {document.getElementById('loading').className = ''}, 500)
}


async function getJSON () {
  const lang = await getLangFromStore()
  if(sessionStorage.getItem(lang)) {
    return JSON.parse(sessionStorage.getItem(lang))
  }
  let resp;
  await setLoadingPage(async () => {
    resp = await fetch(`./lang/${lang}.json`).then(resp => resp.json())
    sessionStorage.setItem(lang, JSON.stringify(resp))
  })

  return resp
}

async function main() {
  const json = await getJSON()
  const lang = await getLangFromStore()
  
  const loading = document.getElementById('loading');
  const label_one = document.getElementById('field_1_label');
  const label_two = document.getElementById('field_2_label');
  const title = document.getElementById('title');
  const desc = document.getElementById('desc');
  const label_resp = document.getElementById('result');
  const button = document.getElementById('btn');
  const spanRu = document.getElementById('ru');
  const spanEn = document.getElementById('en');

  loading.innerText = json.loading
  spanEn.className =  lang === 'en' ? 'active' : ''
  spanRu.className = lang === 'ru' ? 'active' : ''
  label_one.innerText = json.field_1
  label_two.innerText = json.field_2
  title.innerText = json.title
  desc.innerText = json.desc
  spanRu.innerText = json.ru
  spanEn.innerText = json.en
  label_resp.innerText = json.result
  button.innerText = json.copy
}

main()