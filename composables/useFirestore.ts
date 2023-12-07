import { setDoc, addDoc, doc, collection, deleteDoc, updateDoc } from 'firebase/firestore'
export const firestoreFuncs = () => {
    const db = useFirestore()

    const { errorMess, alert, isError, resetAll } = useShowUserFeedBack()
    const setUserDocument = async (collectionName: string, id: string, payload: any,merge:boolean=false) => {
        const user = await getCurrentUser()

        resetAll()
        try {
            await setDoc(doc(db, collectionName, id), payload,{merge:merge})
            return true
        } catch (error: any) {
            console.log('e', error)
            isError.value = true

            errorMess.value = error.code
            alert.value = true
            return false
        }
    }

    const addDocument = async (collectionName: string, payload: any) => {
        resetAll()
        try {
            const docRef = await addDoc(collection(db, collectionName), payload)
            return docRef.id
        } catch (error: any) {
            console.log('e', error)
            isError.value = true

            errorMess.value = error.code
            alert.value = true
            return null
        }
    }
    const deleteDocument = async (collectionName: string, id: string) => {
        resetAll()
        try {

            await deleteDoc(doc(db, collectionName, id));
            return true

        }
        catch (error: any) {
            console.log('e', error)
            isError.value = true

            errorMess.value = error.code
            alert.value = true
            return false
        }
    }
    const updateDocument = async (collection: string, id: string, payload: any) => {
        resetAll()
        try {
            const docRef = doc(db, collection, id)

            await updateDoc(docRef, payload);
            return true

        }
        catch (error: any) {
            console.log('e', error)
            isError.value = true

            errorMess.value = error.code
            alert.value = true
            return false
        }
    }
    return {
        setUserDocument, addDocument, deleteDocument,updateDocument
    }
}
