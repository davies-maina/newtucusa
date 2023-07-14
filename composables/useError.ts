export const useShowUserFeedBack = () => {
    const alert = useState<boolean>('alert', () => false)

    const isError = useState<boolean>('iserror', () => false)
    const errorMess = useState<string>('errormess', () => '')
    const successMess = useState<string>('successmess', () => '')

    function resetAll () {
        alert.value = false
        isError.value = false
        errorMess.value = ''
        successMess.value = ''
    }

    return {
        alert, isError, errorMess, successMess, resetAll
    }
}
