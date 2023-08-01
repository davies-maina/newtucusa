import constituencies from '~/helpers/constituencies'

export const getConstituencies = () => {
    const getAllCons = constituencies.map(item => item.name)
    const getWards = (conname:string) => {
        const constituency = () => constituencies.find(item => item.name === conname)
        if (constituency()) {
            return constituency()?.wards
        }
    }

//     const allConstituencies:string[] = []
//     const cons = constituencies.forEach((cons) => {
//     allConstituencies.push(cons.name)
// })
return {
    getAllCons, getWards
}
}
