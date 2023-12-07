const pdf = ref<string | null>(null)
export const usePdf = () => {

  const setPdf = (url: string) => {
    // console.log(pdf)
    // console.log(url)
    pdf.value = url
    // sessionStorage.setItem('pdf',url)
  }
  const getPdf = () => {
    return pdf.value
  }

  return {
    getPdf, setPdf
  }
}
