import { Validation } from "@/application/contracts/validation"
import { DistanceLessThanAllowed, MissingParamError } from "@/application/errors"

export class DistanceValidator implements Validation {
  constructor (
    private readonly field: string,
    private readonly allowedDistance: number
  ) {}
  async validate(input: any): Promise<Error> {
    if (!input[this.field]) return new MissingParamError(this.field)
    if (input[this.field] < this.allowedDistance) return new DistanceLessThanAllowed(input[this.field], this.allowedDistance)
    return null
  }
}