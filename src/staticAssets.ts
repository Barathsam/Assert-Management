import path from 'node:path'
import express, { type Express } from 'express'

const VENDOR = [
    ['/vendor/bootstrap', 'bootstrap/dist'],
    ['/vendor/bootstrap-icons', 'bootstrap-icons/font'],
    ['/vendor/jquery', 'jquery/dist'],
    ['/vendor/datatables', 'datatables.net-bs5'],
    ['/vendor/datatables-core', 'datatables.net']
]

export const mountStatic = (app: Express, root: string) => {
    app.use(express.static(path.join(root, 'src', 'public')))
    VENDOR.forEach(([url, dir]) =>
        app.use(url as string, express.static(path.join(root, 'node_modules', dir as string)))
    )
}
