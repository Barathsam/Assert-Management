import { UniqueConstraintError } from 'sequelize'
import { createBranchTest } from '../../../masters/models/testFactory/createBranch'
import { seedEmployeeData } from '../../seed/employee'
import { createEmployeeTest } from '../testFactory/createEmployee'
import { createEmployee } from './createEmployee'

describe('createEmployee', () => {
    test('should create an employee against the given branch', async () => {
        const branch = await createBranchTest()
        const actual = await createEmployee({ ...seedEmployeeData, branchId: branch.id })
        expect(actual).toMatchObject({
            employeeCode: 'EMP0001',
            firstName: 'Asha',
            lastName: 'Menon',
            designation: 'Field Engineer',
            branchId: branch.id
        })
    })

    test('should start an employee active and with no exit date', async () => {
        const actual = await createEmployeeTest()
        expect(actual.isActive).toBe(true)
        expect(actual.dateOfExit).toBeNull()
    })

    test('should reject a duplicate employee code', async () => {
        const first = await createEmployeeTest()
        const duplicate = createEmployeeTest({ branchId: first.branchId, email: 'other@example.com' })
        await expect(duplicate).rejects.toBeInstanceOf(UniqueConstraintError)
    })

    test('should reject a duplicate email', async () => {
        const first = await createEmployeeTest()
        const duplicate = createEmployeeTest({ branchId: first.branchId, employeeCode: 'EMP0002' })
        await expect(duplicate).rejects.toBeInstanceOf(UniqueConstraintError)
    })

    test('should allow the optional fields to be null', async () => {
        const branch = await createBranchTest()
        const actual = await createEmployee({
            ...seedEmployeeData,
            branchId: branch.id,
            email: null,
            phone: null,
            designation: null,
            department: null,
            dateOfJoining: null
        })
        expect(actual.email).toBeNull()
        expect(actual.dateOfJoining).toBeNull()
    })
})
