import { Validation } from "@/application/contracts/validation"
import { DistanceLessThanAllowed, MissingParamError } from "@/application/errors"

export interface DistanceValidator {
  setAllowedDistance (distance: number): void
}
export class DistanceValidator implements Validation, DistanceValidator {
  private allowedDistance = 0
  constructor (
    private readonly field: string,
    allowedDistance: number
  ) {
    this.allowedDistance = allowedDistance
  }
  async validate(input: any): Promise<Error> {
    if (!input[this.field]) return new MissingParamError(this.field)
    const distance = typeof input[this.field] === 'string' && input[this.field].includes('Mile') ? parseFloat(input[this.field].replace('Mile', '')) : parseFloat(input[this.field])
    if (distance < this.allowedDistance) return new DistanceLessThanAllowed(input[this.field], this.allowedDistance)
    return null
  }

  setAllowedDistance (distance: number): void {
    this.allowedDistance = distance
  }
}