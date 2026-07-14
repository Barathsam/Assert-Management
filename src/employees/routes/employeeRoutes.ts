import type { Router } from 'express'
import { routerGet, routerPost } from '../../routerMethods'
import { activateEmployeeController } from '../controller/activateEmployee'
import { createEmployeeController } from '../controller/createEmployee'
import { deactivateEmployeeController } from '../controller/deactivateEmployee'
import { editEmployeeForm } from '../controller/editEmployeeForm'
import { listEmployees } from '../controller/listEmployees'
import { newEmployeeForm } from '../controller/newEmployeeForm'
import { showEmployee } from '../controller/showEmployee'
import { updateEmployeeController } from '../controller/updateEmployee'
import { employeeSchema, employeeStatusSchema } from '../validation/employeeSchemas'

const registerReads = (router: Router) => {
    routerGet(router, '/employees', listEmployees)
    routerGet(router, '/employees/new', newEmployeeForm)
    routerGet(router, '/employees/:id', showEmployee)
    routerGet(router, '/employees/:id/edit', editEmployeeForm)
}

const registerWrites = (router: Router) => {
    routerPost(router, '/employees', employeeSchema, createEmployeeController)
    routerPost(router, '/employees/:id', employeeSchema, updateEmployeeController)
    routerPost(router, '/employees/:id/deactivate', employeeStatusSchema, deactivateEmployeeController)
    routerPost(router, '/employees/:id/activate', employeeStatusSchema, activateEmployeeController)
}

export const registerEmployeeRoutes = (router: Router) => {
    registerReads(router)
    registerWrites(router)
}
