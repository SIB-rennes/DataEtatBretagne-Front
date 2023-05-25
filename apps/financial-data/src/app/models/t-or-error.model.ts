
export interface TOrError<T> {
    data?: T
    error?: Error | any
}