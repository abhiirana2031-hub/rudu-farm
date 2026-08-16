// Removed Prisma type dependency
export function calculateMilkAmount(quantity: number, fat: number, snf: number, rule: any) {
  const baseRate = Number(rule.baseRate);
  const fatMult = Number(rule.fatMultiplier);
  const snfMult = Number(rule.snfMultiplier);
  
  // Rate = Base Rate + (FAT * FAT Multiplier) + (SNF * SNF Multiplier)
  const ratePerLtr = baseRate + (fat * fatMult) + (snf * snfMult);
  const totalAmount = ratePerLtr * quantity;
  
  // Round to 2 decimals
  return {
    rate: Math.round(ratePerLtr * 100) / 100,
    amount: Math.round(totalAmount * 100) / 100
  };
}
