export class DistanceLessThanAllowed extends Error {
  constructor (distance: number, allowedDistance: number) {
    super(`Distance travelled is ${distance} but less than allowed ${allowedDistance}`)
    this.name = `DistanceLessThanAllowed`
  }
}