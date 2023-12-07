export const plaintext = (text: string) => {
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
  }
  
  export const checkStringLength = (text: string) => {
    const words = text.trim().split(/\s+/);
    if (words.length > 20) {
      return true
    }
    else {
      return false
    }
  }
  export const sliceString = (text: string) => {
    return text.slice(0, 200)
  }