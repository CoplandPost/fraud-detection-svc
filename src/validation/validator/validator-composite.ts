import { Validation } from "@/application/contracts/validation"

export class ValidatorComposite implements Validation {
  constructor (private readonly validators: Array<Validation<any>>) {}

  async validate (input: any): Promise<Error | null> {
    let error: any = null
    for (const validator of this.validators) {
      error = validator.validate(input)
      if (error) {
        return error
      }
    }
    return error
  }
}
