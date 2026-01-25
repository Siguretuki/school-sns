type Stringifiable = string | number | boolean | bigint | undefined
type ArrayStringifiable = Array<string> | Array<number> | Array<bigint>

export const convertQueryParams = <
  T extends Record<PropertyKey, Stringifiable | ArrayStringifiable>,
>(
  params?: T,
): { [K in keyof T]: string | Array<string> | undefined } | undefined => {
  if (params === undefined) return undefined
  const result = {} as { [K in keyof T]: string | Array<string> | undefined }

  for (const key in params) {
    const value = params[key]
    if (Array.isArray(value)) {
      result[key] = value.map((v) => String(v))
    } else if (value === undefined) {
      result[key] = undefined
    } else {
      result[key] = String(value)
    }
  }

  return result
}
