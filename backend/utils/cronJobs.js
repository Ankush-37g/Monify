import cron from "node-cron";
import { Income } from "../models/IncomeModel.js";
import { Expense } from "../models/ExpenseModel.js";
import { User } from "../models/UserModel.js";
import sendEmail from "./sendEmail.js";

export const initCronJobs = () => {
  // Initialize the cron jobs
  setupRecurringTransactionsJob();
  console.log("Cron jobs setup completed");
};

const updateNextDate = (currentDate, frequency) => {
  const newDate = new Date(currentDate);
  switch (frequency) {
    case "daily":
      newDate.setDate(newDate.getDate() + 1);
      break;
    case "weekly":
      newDate.setDate(newDate.getDate() + 7);
      break;
    case "monthly":
      newDate.setMonth(newDate.getMonth() + 1);
      break;
    case "yearly":
      newDate.setFullYear(newDate.getFullYear() + 1);
      break;
    default:
      throw new Error(`Unknown frequency: ${frequency}`);
  }
  return newDate;
};

const setupRecurringTransactionsJob = () => {
  cron.schedule("0 0 * * *", async () => {

  console.log("Running recurring job");

  const today = new Date();

  try {
    // ======= RECURRING INCOMES =======
    const recurringIncomes = await Income.find({ isRecurring: true, nextDate: { $lte: today } });

    await Promise.all(
      recurringIncomes.map(async (income) => {

        try {
          // Create new income
          await Income.create({
            incomeSource: income.incomeSource,
            amount: income.amount,
            date: today,
            user: income.user,
            isRecurring: false,
          });

          // Update nextDate
          income.nextDate = updateNextDate(income.nextDate, income.frequency);
          await income.save();

          const user = await User.findById(income.user)

          // Send email notification
          if (user && user.email) {

              sendEmail(
              income.user.email,
              "Recurring Income Added",
              `Your recurring income "${income.incomeSource}" of ₹${income.amount} has been added on ${today.toDateString()}.`
            );
          }
        } 
        catch (err) 
        {
          console.error(`Failed to process income ${income._id}:`, err.message);
        }
      })
    );

    // ======= RECURRING EXPENSES =======
    const recurringExpenses = await Expense.find({ isRecurring: true, nextDate: { $lte: today } });

    await Promise.all(
      recurringExpenses.map(async (expense) => {
        try {
          // Create new expense
          await Expense.create({
            expenseCategory: expense.expenseCategory,
            amount: expense.amount,
            date: today,
            user: expense.user,
            isRecurring: false,
          });

          // Update nextDate
          expense.nextDate = updateNextDate(expense.nextDate, expense.frequency);
          await expense.save();

           const user = await User.findById(expense.user)

          // Send email notification
          if (user && user.email) {

              sendEmail(
              expense.user.email,
              "Recurring Expense Added",
              `Your recurring expense "${expense.expenseCategory}" of ₹${expense.amount} has been added on ${today.toDateString()}.`
            );
          }
        } catch (err) {
          console.error(`Failed to process expense ${expense._id}:`, err.message);
        }
      })
    );

    console.log("Recurring job completed successfully.");

  } catch (err) {
    console.error("Error running recurring job:", err.message);
  }
  });
};
