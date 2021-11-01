import { Request, Response, NextFunction } from "express";

const NotFoundMiddleware = (req: Request, res: Response, next?: NextFunction) => {
    res.status(404);
    res.format({
        html: function () {
            res.render('404', { url: req.url })
        },
        json: function () {
            res.json({ error: 'Not found' })
        },
        default: function () {
            res.type('txt').send('Not found')
        }
    })
}

export default NotFoundMiddleware