import { Op } from 'sequelize'
import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  IsDate,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'



@Table({ tableName: 'reservations' })
export class Reservation extends Model<Reservation> {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string

  @Column(DataType.UUID)
  schedule_id: string

  @Column(DataType.STRING)
  name: string

  @Column(DataType.STRING)
  email: string

  @Column(DataType.INTEGER)
  party_size: number

  @AllowNull(false)
  @NotNull
  @IsDate
  @Column(DataType.DATE)
  reservation_time: Date

  @DeletedAt
  deleted_at: Date

  @CreatedAt
  created_at: Date

  @UpdatedAt
  updated_at: Date

  public static async getReservations(reservationTime: Date) {
    let rezs = await Reservation.findAll({
      where: {
        reservation_time: reservationTime
      }
    })
    return rezs.map(x => x.dataValues)
  }
}
