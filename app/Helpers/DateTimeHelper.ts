import { DateTime } from 'luxon'

export default class DateTimeHelper {
  public static readonly secondsInMillis: number = 1000
  public static readonly minutesInMillis: number = this.secondsInMillis * 60
  public static readonly hoursInMillis: number = this.minutesInMillis * 60
  public static readonly daysInMillis: number = this.hoursInMillis * 24

  private constructor() {
    // cant be instantiated
  }

  /**
   * Returns the difference between two dates in milliseconds
   */
  public static diffInMilliseconds(firstDate: DateTime, secondDate: DateTime): number {
    const firstDateInMilliseconds = firstDate.toMillis()
    const secondDateInMilliseconds = secondDate.toMillis()
    const diffInMilliseconds = secondDateInMilliseconds - firstDateInMilliseconds

    return diffInMilliseconds
  }

  /**
   * Returns the difference between two dates in days
   */
  public static diffInDays(firstDate: DateTime, secondDate: DateTime): number {
    const diffInMilliseconds = this.diffInMilliseconds(firstDate, secondDate)
    const diffInDays = diffInMilliseconds / this.daysInMillis

    return diffInDays
  }
}
