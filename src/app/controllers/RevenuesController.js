const Revenue = require("../models/Revenue");
const dayjs = require("dayjs");

function getMonthRange(month, year) {
  const date = dayjs(`${year}-${month}-01`);
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1; // dayjs months are 0-indexed
  const today = dayjs();

  const startOfMonth = date.startOf("month");

  let endOfMonth;
  if (month == currentMonth && year == currentYear) {
    // If the month is the current month, set end date to today
    endOfMonth = today;
  } else {
    // For past months, set the end date to the last day of the month
    endOfMonth = date.endOf("month");
  }

  return {
    startOfMonth: startOfMonth.format("YYYY-MM-DD"),
    endOfMonth: endOfMonth.format("YYYY-MM-DD"),
  };
}

class RevenueController {
  getRevenueMonth(req, res, next) {
    let { month, year } = req.query;

    // Validate month and year
    const currentYear = dayjs().year();
    const currentMonth = dayjs().month() + 1;

    if (!month || isNaN(month) || month < 1 || month > 12) {
      month = currentMonth;
    }

    if (!year || isNaN(year) || year < 1900 || year > currentYear + 10) {
      year = currentYear;
    }

    const { startOfMonth, endOfMonth } = getMonthRange(month, year);

    Revenue.getRevenueMonth(startOfMonth, endOfMonth, function (data) {
      res.json(data);
    });
  }
}

module.exports = new RevenueController();