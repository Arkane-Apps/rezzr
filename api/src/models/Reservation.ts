import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  IsDate,
  IsEmail,
  IsInt,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { v4 as uuidv4, version as uuidVersion, validate as uuidValidate } from 'uuid'

import { Inventory } from './Inventory'
import { ValidationError } from 'sequelize'

export const RESERVATIONS_FULL_ERROR = 'ReservationsFullError'

export class FullReservationsError extends ValidationError {
  constructor(errors: any) {
    super(RESERVATIONS_FULL_ERROR, errors)
    this.name = RESERVATIONS_FULL_ERROR
  }
}

@Table({ tableName: 'reservations' })
export class Reservation extends Model<Reservation> {
  @PrimaryKey
  @Default(uuidv4)
  @Column(DataType.UUID)
  id: string

  @AllowNull(false)
  @NotNull
  @Column(DataType.STRING)
  name: string

  @AllowNull(false)
  @NotNull
  @IsEmail
  @Column(DataType.STRING)
  email: string

  @AllowNull(false)
  @NotNull
  @IsInt
  @Column(DataType.INTEGER)
  party_size: number

  @AllowNull(false)
  @NotNull
  @IsDate
  @Column({
    type: DataType.DATE,
    validate: {
      isValidTimeslot(value: Date) {
        let minutes = value.getMinutes()
        if (minutes <= 0 || minutes >= 60 || minutes % 15 != 0) {
          throw new Error(`timeslot must be in 15 minute increments not: '${value}'`)
        }
      },
      async isAvailable(value: Date) {
        let minutesStr = value.getMinutes()
        let hourSlots = await Inventory.getAvailableSlotsForHour(value)
        // Wrapping the whole condition in a !(not) here so that short circuiting will catch the
        // invalid key
        if (!(minutesStr in hourSlots && hourSlots[minutesStr] >= 0)) {
          throw new FullReservationsError({
            reservation_time: `timeslot is unavailable: '${value}'`,
          })
        }
      },
    },
  })
  reservation_time: Date

  @DeletedAt
  @IsDate
  @Column(DataType.DATE)
  deleted_at: Date

  @CreatedAt
  @IsDate
  @Column(DataType.DATE)
  created_at: Date

  @UpdatedAt
  @IsDate
  @Column(DataType.DATE)
  updated_at: Date

  public static async getAllReservations() {
    /** Get all reservations */
    let rezs = await Reservation.findAll()
    return rezs.map(x => x.dataValues)
  }

  public static async getReservation(rezId: string) {
    /**
     * Get a single reservation by it's ID
     * Returns undefined if not found or invalid ID
     * @param {string} rezId The uuid for the record
     */
    let rez: Reservation
    if (uuidValidate(rezId) && uuidVersion(rezId) === 4) {
      rez = await Reservation.findByPk(rezId)
      if (rez) {
        return rez.toJSON()
      }
    }
    // If we can't find it or it's not valid, just return undefined
    return undefined
  }

  public static async getReservationsAtTime(reservationTime: Date) {
    let rezs = await Reservation.findAll({
      where: {
        reservation_time: reservationTime.getTime(),
      },
    })
    return rezs.map(x => x.dataValues)
  }
}
