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
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'inventory' })
export class Inventory extends Model<Inventory> {
    @PrimaryKey
    @Default(uuidv4())
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
                    throw new Error('schedule_end must be greater than schedule_start.');
                }
            }
        }
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
                    throw new Error('schedule_end must be greater than schedule_start.');
                }
            }
        }
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
                if (value >= this.time_slot_end) {
                    throw new Error('time_slot_end must be greater than time_slot_start');
                }
            }
        }
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
                if (value <= this.time_slot_start) {
                    throw new Error('time_slot_end must be greater than time_slot_start');
                }
            }
        }
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
        defaultValue: DataType.NOW
    })
    created: Date;

    @UpdatedAt
    @IsDate
    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW
    })
    updated: Date;

    @DeletedAt
    @IsDate
    @Column(DataType.DATE)
    deleted: Date;
}