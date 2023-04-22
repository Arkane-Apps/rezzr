import { Request, Response } from 'express'

const validatePost = (req: Request, res: Response, next: Function) => {
    console.log(`next type: ${typeof next}`)
    if (req.header("Content-Type") != "application/json") {
        return res.status(400).json({ message: `Invalid content-type: ${req.header("Content-Type")}` });
    }
    if (typeof req.body !== 'object') {
        return res.status(400).json({ message: 'Request body must be an object' });
    }
    next();
}

export default validatePost