import { setDoc, doc } from 'firebase/firestore'
export const firestoreFuncs = () => {
    const db = useFirestore()

    const { errorMess, alert, isError, resetAll } = useShowUserFeedBack()
    const setUserDocument = async (collectionName: string, payload: any) => {
        const user = await getCurrentUser()
        resetAll()
        try {
            await setDoc(doc(db, collectionName, `${user.uid}`), payload)
        } catch (error: any) {
            isError.value = true
            // console.log(error.code)
            errorMess.value = error.code
            alert.value = true
        }
    }
    return {
        setUserDocument
    }
}
