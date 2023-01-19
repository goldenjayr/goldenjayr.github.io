
export const createActionButtonElement = (content) => {
  const element = document.createElement('button')
  element.innerHTML = content
  element.style.fontSize = "100px";
  element.style.border = 'none'
  element.style.backgroundColor = '#00FB95'
  element.style.borderRadius = '20px'
  element.style.padding = '20px 100px'
  return element
}