import { Controller, Get, Middleware, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { Op } from 'sequelize';

import { Inventory, Reservation } from '../models'

const timeSlots = [0, 15, 30, 45]

interface RezRequest extends Request {
    reqDate?: number
    inventory?: Inventory;
}

const validate_post = (req: Request, res: Response, next) => {
    if (req.header("Content-Type") != "application/json") {
        return res.status(400).json({ message: `Invalid content-type: ${req.header("Content-Type")}` });
    }
    if (typeof req.body !== 'object') {
        return res.status(400).json({ message: 'Request body must be an object' });
    }
    next();
}

const hasDateInventory = async (req: RezRequest, res: Response, next) => {
    let entry: Inventory
    let reqDate = Date.parse(req.params.date);
    if (isNaN(reqDate) || !reqDate) {
        return res.status(400).json({ message: `invalid date: ${req.params.date}` });
    }
    entry = await Inventory.findOne({
        where: {
            schedule_start: {
                [Op.lte]: reqDate
            },
            schedule_end: {
                [Op.gt]: reqDate
            }
        },
        order: [['created', 'DESC']]
    })
    if (entry) {
        req.reqDate = reqDate
        req.inventory = entry
    }
    next();
}

@Controller('api/inventory')
export class InventoryController {

    @Get('')
    private async getAll(req: Request, res: Response) {
        let reservations = await Inventory.findAll();
        return res.json(reservations).status(200)
    }

    @Post('')
    @Middleware(validate_post)
    private async create(req: Request, res: Response) {
        let entry: Inventory
        try {
            entry = new Inventory(req.body)
            entry.save();
        } catch (err) {
            return res.status(400).json({ message: `Invalid request: ${err})` });
        }
        return res.json(entry.toJSON()).status(201)
    }

    @Get(':id')
    private async getInventory(req: Request, res: Response) {
        let entry: Inventory
        let invId = req.params.id;
        if (!uuidValidate(invId) || !(uuidVersion(invId) === 4)) {
            return res.status(400).json({ message: `id is not a valid uuid: ${invId}` });
        }
        entry = await Inventory.findByPk(req.params.id)
        if (entry) {
            return res.json(entry.toJSON()).status(200)
        } else {
            return res.status(404).json({ message: `${invId} not found` });
        }
    }

    @Get('dates/:date')
    @Middleware(hasDateInventory)
    private async getInventoryforDay(req: RezRequest, res: Response) {
        let entry = req.inventory
        if (entry.days[new Date(req.reqDate).getDay()]) {
            return res.json(entry.toJSON()).status(200)
        } else {
            return res.status(404).json({ message: `No Inventory for ${req.reqDate}` });
        }
    }

    @Get('dates/:date/slots/:hour')
    @Middleware(hasDateInventory)
    private async getInventorySlotsforHour(req: RezRequest, res: Response) {
        let entry = req.inventory
        let reqDate = new Date(req.reqDate)
        let reqHour = parseInt(req.params.hour)
        let availableSlots = {}
        if (entry && entry.days[reqDate.getDay()] && reqHour >= entry.time_slot_start && reqHour <= entry.time_slot_end) {
            // Get slots
            for (let timeSlot of timeSlots) {
                let rezSlot = new Date(reqDate)
                rezSlot.setHours(reqHour)
                rezSlot.setMinutes(timeSlot)

                availableSlots[timeSlot] = entry.slots - (await Reservation.getReservationsAtTime(rezSlot)).length
            }
        }
        return res.status(200).json({ slots: availableSlots });
    }
}
