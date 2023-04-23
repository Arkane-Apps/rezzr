import { Op } from 'sequelize'
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  IsDate,
  IsInt,
  IsUUID,
  Min,
  Max,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid'

import { Reservation } from './Reservation'

export class TimeSlots {
  0: number = 0
  15: number = 0
  30: number = 0
  45: number = 0
}

@Table({ tableName: 'inventory' })
export class Inventory extends Model<Inventory> {
  @PrimaryKey
  @Default(uuidv4)
  @IsUUID(4)
  @Column(DataType.UUID)
  id: string

  @IsDate
  @AllowNull(false)
  @NotNull
  @Column({
    type: DataType.DATEONLY,
    validate: {
      isLessThanScheduleEnd(value) {
        if (value >= this.schedule_end) {
          throw new Error('schedule_end must be greater than schedule_start.')
        }
      },
    },
  })
  schedule_start: Date

  @IsDate
  @AllowNull(false)
  @NotNull
  @Column({
    type: DataType.DATEONLY,
    validate: {
      isGreaterThanScheduleStart(value) {
        if (value <= this.schedule_start) {
          throw new Error('schedule_end must be greater than schedule_start.')
        }
      },
    },
  })
  schedule_end: Date

  @IsDate
  @AllowNull(false)
  @NotNull
  @Min(0)
  @Max(22)
  @Column({
    type: DataType.INTEGER,
    validate: {
      isLessThanTimeSlotEnd(value) {
        if (parseInt(value) >= this.time_slot_end) {
          throw new Error('time_slot_end must be greater than time_slot_start')
        }
      },
    },
  })
  time_slot_start: number

  @AllowNull(false)
  @IsInt
  @NotNull
  @Min(1)
  @Max(23)
  @Column({
    type: DataType.INTEGER,
    validate: {
      isGreaterThanTimeSlotStart(value) {
        if (parseInt(value) <= this.time_slot_start) {
          throw new Error('time_slot_end must be greater than time_slot_start')
        }
      },
    },
  })
  time_slot_end: number

  @AllowNull(false)
  @NotNull
  @Column(DataType.ARRAY(DataType.BOOLEAN))
  days: boolean[]

  @IsInt
  @AllowNull(false)
  @NotNull
  @Min(0)
  @Column(DataType.INTEGER)
  party_size: number

  @IsInt
  @AllowNull(false)
  @NotNull
  @Min(0)
  @Column(DataType.INTEGER)
  slots: number

  @CreatedAt
  @IsDate
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created: Date

  @UpdatedAt
  @IsDate
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updated: Date

  @DeletedAt
  @IsDate
  @Column(DataType.DATE)
  deleted: Date

  public static async getInventroyForDateTime(dateTime: Date) {
    /**
     * Gets the inventory that applies to a certain time
     */
    console.log(`dateTime value: "${dateTime}"`)
    let foundInventory = await Inventory.findOne({
      where: {
        schedule_start: {
          [Op.lte]: dateTime.getTime(),
        },
        schedule_end: {
          [Op.gt]: dateTime.getTime(),
        },
      },
      order: [['created', 'DESC']],
    })
    if (foundInventory) {
      return foundInventory.dataValues
    }
    return undefined
  }

  public static async getAvailableSlotsForHour(requestTime: Date) {
    /**
     * returns an object containing the available slots for the provided time
     * @param {Date} requestTime the time to check for. Only date and hours values are used
     */
    console.log(`requestTime value: "${requestTime}"`)
    let foundInventory = await Inventory.getInventroyForDateTime(requestTime)
    let availableSlots = new TimeSlots()
    let isOnActiveDay = foundInventory.days[requestTime.getDay()]
    let isInSlotRange =
      requestTime.getHours() >= foundInventory.time_slot_start &&
      requestTime.getHours() <= foundInventory.time_slot_end
    if (foundInventory && isOnActiveDay && isInSlotRange) {
      // Get slots
      for (let timeSlot in availableSlots) {
        let rezSlot = new Date(requestTime)
        rezSlot.setMinutes(parseInt(timeSlot))
        availableSlots[timeSlot] =
          foundInventory.slots - (await Reservation.getReservationsAtTime(rezSlot)).length
      }
    }
    return availableSlots
  }
}
