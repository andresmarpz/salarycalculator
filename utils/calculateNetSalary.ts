interface SalaryInputs {
  salaryUYU: number
  salaryUSD: number
  hasBPS: boolean
  hasIRPF: boolean
}

export function calculateNetSalary({ salaryUYU, salaryUSD, hasBPS, hasIRPF }: SalaryInputs): number {
  let totalSalary = salaryUYU + salaryUSD * 40 // Assuming 1 USD = 40 UYU
  let netSalary = totalSalary

  if (hasBPS) {
    netSalary -= totalSalary * 0.15 // Assuming 15% BPS contribution
  }

  if (hasIRPF) {
    // Simple IRPF calculation (this should be more complex in a real scenario)
    if (totalSalary > 50000) {
      netSalary -= (totalSalary - 50000) * 0.25
    }
  }

  return Math.round(netSalary)
}

