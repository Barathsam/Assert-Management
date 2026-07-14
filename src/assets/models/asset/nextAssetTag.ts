import { QueryTypes, type Transaction } from 'sequelize'
import { BusinessRuleError } from '../../../common/errors/businessRuleError'
import { sequelize } from '../../../db/sequelize'

export const nextAssetTag = async (categoryId: number, branchId: number, tx: Transaction): Promise<string> => {
    const rows = await sequelize.query<{ tag: string }>(
        `SELECT c.code || '-' || b.code || '-' || lpad(nextval('asset_tag_seq')::text, 6, '0') AS tag
           FROM asset_categories c, branches b
          WHERE c.id = :categoryId AND b.id = :branchId`,
        { replacements: { categoryId, branchId }, type: QueryTypes.SELECT, transaction: tx }
    )
    if (!rows[0]) throw new BusinessRuleError('Unknown category or branch.')
    return rows[0].tag
}
