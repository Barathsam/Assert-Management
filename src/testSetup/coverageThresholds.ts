const full = { branches: 100, functions: 100, lines: 100, statements: 100 }

export const coverageThresholds = {
    'src/common/**': full,
    'src/assets/domain/**': full,
    'src/employees/domain/**': full,
    'src/reports/domain/**': full,
    'src/stock/domain/**': full,
    'src/assets/models/**': { branches: 80, functions: 90, lines: 90, statements: 90 },
    'src/assets/service/**': { branches: 85, functions: 90, lines: 90, statements: 90 },
    'src/assets/controller/**': { branches: 80, functions: 85, lines: 85, statements: 85 },
    'src/employees/**': { branches: 75, functions: 80, lines: 80, statements: 80 },
    'src/masters/**': { branches: 70, functions: 75, lines: 75, statements: 75 },
    'src/reports/**': { branches: 70, functions: 75, lines: 75, statements: 75 },
    'src/stock/**': { branches: 70, functions: 75, lines: 75, statements: 75 },
    'src/dashboard/**': { branches: 70, functions: 75, lines: 75, statements: 75 }
}
