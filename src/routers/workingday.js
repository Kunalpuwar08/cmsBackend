const express = require("express");
const router = express.Router();

router.get("/working-days", (req, res) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const dayOfMonth = today.getDate();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let workingDaysCount = 0;
    let todayDayCount = 0;
  
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
  
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDaysCount++;
  
        if (day <= dayOfMonth) {
          todayDayCount++;
        }
      }
    }
  
    res.json({ workingDaysCount, todayDayCount });
  });

  module.exports = router;