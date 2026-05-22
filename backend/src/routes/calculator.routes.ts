import { Router } from "express";
import { sendSuccess } from "../utils/apiResponse";

const router = Router();

router.post("/mortgage", (req, res) => {
  const { principal, annualRate, years, downPayment = 0 } = req.body;
  const loan = Math.max(0, Number(principal) - Number(downPayment));
  const monthlyRate = Number(annualRate) / 100 / 12;
  const n = Number(years) * 12;

  let monthlyPayment = 0;
  if (monthlyRate > 0) {
    monthlyPayment = (loan * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  } else {
    monthlyPayment = loan / n;
  }

  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - loan;

  sendSuccess(res, {
    monthlyPayment: Math.round(monthlyPayment),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    loanAmount: loan,
  });
});

router.post("/roi", (req, res) => {
  const { purchasePrice, monthlyRent, annualExpenses = 0, appreciationRate = 5 } = req.body;
  const price = Number(purchasePrice);
  const rent = Number(monthlyRent) * 12;
  const expenses = Number(annualExpenses);
  const netIncome = rent - expenses;
  const cashOnCash = price > 0 ? (netIncome / price) * 100 : 0;
  const projectedValue = price * Math.pow(1 + Number(appreciationRate) / 100, 5);

  sendSuccess(res, {
    annualRent: rent,
    netOperatingIncome: netIncome,
    cashOnCashReturn: Math.round(cashOnCash * 100) / 100,
    fiveYearProjectedValue: Math.round(projectedValue),
    roiPercent: Math.round((cashOnCash + Number(appreciationRate)) * 100) / 100,
  });
});

router.post("/area-convert", (req, res) => {
  const { value, from, to } = req.body;
  const units: Record<string, number> = {
    SQFT: 1,
    SQYD: 9,
    MARLA: 272.25,
    KANAL: 5445,
    ACRE: 43560,
    SQM: 10.7639,
  };
  const sqft = Number(value) * (units[from] || 1);
  const converted = sqft / (units[to] || 1);
  sendSuccess(res, { value: Math.round(converted * 100) / 100, from, to });
});

export default router;
