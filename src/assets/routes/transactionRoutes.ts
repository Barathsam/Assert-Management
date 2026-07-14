import type { Router } from 'express'
import { routerGet, routerPost } from '../../routerMethods'
import { completeRepairController } from '../controller/transaction/completeRepair'
import { issueAssetController } from '../controller/transaction/issueAsset'
import { issueFormController } from '../controller/transaction/issueForm'
import { issuePickController } from '../controller/transaction/issuePick'
import { repairCompleteFormController } from '../controller/transaction/repairCompleteForm'
import { returnAssetController } from '../controller/transaction/returnAsset'
import { returnFormController } from '../controller/transaction/returnForm'
import { returnPickController } from '../controller/transaction/returnPick'
import { scrapAssetController } from '../controller/transaction/scrapAsset'
import { scrapFormController } from '../controller/transaction/scrapForm'
import { scrapPickController } from '../controller/transaction/scrapPick'
import { sendToRepairController } from '../controller/transaction/sendToRepair'
import { sendToRepairFormController } from '../controller/transaction/sendToRepairForm'
import {
    issueSchema,
    repairCompleteSchema,
    returnSchema,
    scrapSchema,
    sendToRepairSchema
} from '../validation/transactionSchemas'

const registerIssue = (router: Router) => {
    routerGet(router, '/issue', issuePickController)
    routerGet(router, '/assets/:id/issue', issueFormController)
    routerPost(router, '/assets/:id/issue', issueSchema, issueAssetController)
}

const registerReturn = (router: Router) => {
    routerGet(router, '/return', returnPickController)
    routerGet(router, '/assets/:id/return', returnFormController)
    routerPost(router, '/assets/:id/return', returnSchema, returnAssetController)
}

const registerRepair = (router: Router) => {
    routerGet(router, '/assets/:id/send-to-repair', sendToRepairFormController)
    routerPost(router, '/assets/:id/send-to-repair', sendToRepairSchema, sendToRepairController)
    routerGet(router, '/assets/:id/repair-complete', repairCompleteFormController)
    routerPost(router, '/assets/:id/repair-complete', repairCompleteSchema, completeRepairController)
}

const registerScrap = (router: Router) => {
    routerGet(router, '/scrap', scrapPickController)
    routerGet(router, '/assets/:id/scrap', scrapFormController)
    routerPost(router, '/assets/:id/scrap', scrapSchema, scrapAssetController)
}

export const registerTransactionRoutes = (router: Router) =>
    [registerIssue, registerReturn, registerRepair, registerScrap].forEach((register) => register(router))
