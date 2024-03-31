import dateformat from 'dateformat'

export default (str: string, ...args: any[]) => {
    try {
        return dateformat(str, ...args)
    } catch {
        return 'Неверная дата'
    }
}
