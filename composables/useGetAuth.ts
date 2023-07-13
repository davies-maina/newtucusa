import { User } from 'firebase/auth'
const authUser = () => {
// let user:User | null
const currentAuthUser = ref<User | null>(null)
const setCurrentAuthUser = (user:User | null) => {
currentAuthUser.value = user
}
return {
    currentAuthUser,
    setCurrentAuthUser
}
}
export default authUser
