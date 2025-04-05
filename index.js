const field1 = document.getElementById('field_1');
const field2 = document.getElementById('field_2');
const resp = document.getElementById('resp');
const btn = document.getElementById('btn');
const langBtn = document.getElementById('lang');

function isObject(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

function deepMerge(target, source) {
  if (!isObject(target)) {
    return source;
  }

  const output = { ...target };

  Object.keys(source).forEach(key => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (isObject(targetValue) && isObject(sourceValue)) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      output[key] = [...targetValue, ...sourceValue];
    } else {
      output[key] = sourceValue;
    }
  });

  return output;
}

const handler = {
  set: async function(target, fieldName, newValue) {
    target[fieldName] = newValue;

    if(target.field_1 && target.field_2){
      const value = await deepMerge(target.field_2, target.field_1)
      resp.innerText = JSON.stringify(value, null, 3)
      
      return true
    }
  }

}

const fields = new Proxy({}, handler)

const handleFieldChange = (event, fieldName) => {
  fields[fieldName] = JSON.parse(event.target.value);
}

const handleClick = () => {
  navigator.clipboard.writeText(JSON.stringify(deepMerge(fields.field_2, fields.field_1)))
}

field1.addEventListener('change', (event)=> handleFieldChange(event, 'field_1'))
field2.addEventListener('change', (event)=> handleFieldChange(event, 'field_2'))
btn.addEventListener('click', handleClick)
langBtn.addEventListener('click', (e)=>{
  const lang = localStorage.getItem('lang') == 'ru' ? 'en' : 'ru';
  setLangToStore(lang)
  main()
})