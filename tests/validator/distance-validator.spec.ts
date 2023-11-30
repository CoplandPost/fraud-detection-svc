import { DistanceLessThanAllowed, MissingParamError } from "@/application/errors"
import { DistanceValidator } from "../../src/validation/job/distance-validator"


describe('Distance Validator', () => {
  it('should define alloweddistance', async () => {
    const sut = new DistanceValidator('noField', 5)
    sut.setAllowedDistance(20)
    expect(sut).toMatchObject({allowedDistance: 20})
  })

  it('should return missing param error if missing field', async () => {
    const sut = new DistanceValidator('noField', 5)
    const error = await sut.validate({ distance: 10})
    expect(error).toEqual(new MissingParamError('noField'))
  })

  it('should return null if distance is less than limit', async () => {
    const sut = new DistanceValidator('distance', 5)
    const error = await sut.validate({ distance: 10})
    expect(error).toBeNull()
  })

  it('should return null if distance is less than limit', async () => {
    const sut = new DistanceValidator('distance', 5)
    const error = await sut.validate({ distance: 1})
    expect(error).toEqual(new DistanceLessThanAllowed(1, 5))
  })
})