import { BusinessRuleError } from '../../../common/errors/businessRuleError'
import { STATUS_LABEL } from '../../../common/labels/labels'
import type { AssetStatus } from '../../../common/types/assetStatus'
import type { AssetAction } from '../../types/assetAction'
import { isLegalTransition, isTerminal } from './legalTransitions'

const scrappedMessage = (assetTag: string) =>
    `${assetTag} has been scrapped. Scrapping is final — a scrapped asset cannot be issued, returned, repaired or scrapped again.`

const illegalMessage = (action: AssetAction, from: AssetStatus, assetTag: string) =>
    `Cannot ${action.toLowerCase().replace(/_/g, ' ')} ${assetTag}: it is currently ${STATUS_LABEL[from]}.`

export const assertTransition = (action: AssetAction, from: AssetStatus, assetTag: string): void => {
    if (isTerminal(from)) throw new BusinessRuleError(scrappedMessage(assetTag))
    if (!isLegalTransition(action, from)) throw new BusinessRuleError(illegalMessage(action, from, assetTag))
}
