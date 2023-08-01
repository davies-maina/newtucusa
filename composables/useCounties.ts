import counties from '../helpers/counties'
export const getCounties = () => {
    const finalCounties:string[] = []
    counties.forEach((county) => {
        finalCounties.push(county.name)
    })
    return {
        finalCounties
    }
}
