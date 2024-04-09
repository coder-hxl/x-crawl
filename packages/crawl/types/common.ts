export interface AnyObject {
  [key: string | number | symbol]: any
}

export type MapTypeObject<T extends object, E extends string = ''> = {
  [P in keyof T as Exclude<P, E>]: T[P]
}

export type MapTypeEmptyObject<T extends object, E extends string = ''> = {
  [P in keyof T as Exclude<P, E>]?: T[P]
}
