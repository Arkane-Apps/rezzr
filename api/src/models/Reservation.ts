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
import { v4 as uuidv4, version as uuidVersion, validate as uuidValidate } from 'uuid';



@Table({ tableName: 'reservations' })
export class Reservation extends Model<Reservation> {
  @PrimaryKey
  @Default(uuidv4())
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
          throw new Error(`timeslot must be in 15 minute increments not: '${value}'`);
        }
      }
    }
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
    let rez: Reservation;
    if (uuidValidate(rezId) && uuidVersion(rezId) === 4) {
      rez = await Reservation.findByPk(rezId)
      if (rez) {
        return (rez.toJSON())
      }
    }
    // If we can't find it or it's not valid, just return undefined
    return undefined;
  }

  public static async getReservationsAtTime(reservationTime: Date) {
    let rezs = await Reservation.findAll({
      where: {
        reservation_time: reservationTime
      }
    })
    return rezs.map(x => x.dataValues)
  }
}
