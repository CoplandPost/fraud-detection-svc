export interface Validation<responseType = Promise<Error | null>> {
  validate (input: any): responseType
}
