import { Validation } from "@/application/contracts/validation"
import { MissingParamError } from "@/application/errors"

export class RequiredFieldValidator implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly relation?: string
    ) {}
  async validate (input: any): Promise<Error | null> {
    
    if (input[this.fieldName] === undefined) {
      return new MissingParamError(this.fieldName)
    }
    return null
  }
}
