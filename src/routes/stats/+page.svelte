<!--
 * My Calcium Tracker PWA
 * Copyright (C) 2025 Nathan A. Eaton Jr.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
-->

<script>
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import { calciumState, calciumService } from "$lib/stores/calcium";
  import { goto } from "$app/navigation";
  import { formatDate, isToday, getTodayString } from "$lib/utils/dateUtils";

  // Stats state
  let currentView = "weekly";
  let currentData = null;
  let selectedBarIndex = -1;
  let isDetailMode = false;
  let originalSummaryData = null;

  // Navigation offsets
  let currentWeekOffset = 0;
  let currentMonthOffset = 0;
  let currentYearOffset = 0;
  let currentDayOffset = 0;

  // Reference date for view synchronization
  let lastReferenceDate = null;

  // Chart elements
  let chartCanvas;
  let chartLabels;
  let chartScrollWrapper;
  let goalLineContainer;
  let hasScrolled = false;

  // Touch handling
  let touchStartX = 0;
  let touchStartY = 0;
  let isScrolling = false;
  let summaryCardElement;

  // Date picker
  let showDatePicker = false;

  // Navigation event handlers
  function handleKeydown(event) {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        navigatePrevious();
        break;
      case "ArrowRight":
        event.preventDefault();
        navigateNext();
        break;
    }
  }

  function handleTouchStart(event) {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isScrolling = false;
  }

  function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) return;

    const touch = event.touches[0];
    const diffX = touchStartX - touch.clientX;
    const diffY = touchStartY - touch.clientY;

    // Determine if this is a vertical scroll (ignore horizontal swipes)
    if (Math.abs(diffY) > Math.abs(diffX)) {
      isScrolling = true;
      return;
    }
  }

  function handleTouchEnd(event) {
    if (!touchStartX || !touchStartY || isScrolling) {
      touchStartX = 0;
      touchStartY = 0;
      isScrolling = false;
      return;
    }

    const touch = event.changedTouches[0];
    const diffX = touchStartX - touch.clientX;
    const diffY = touchStartY - touch.clientY;

    // Minimum swipe distance (50px)
    const minSwipeDistance = 50;

    // Ensure horizontal swipe is dominant
    if (
      Math.abs(diffX) > Math.abs(diffY) &&
      Math.abs(diffX) > minSwipeDistance
    ) {
      if (diffX > 0) {
        // Swipe left - go to next period
        navigateNext();
      } else {
        // Swipe right - go to previous period
        navigatePrevious();
      }
    }

    touchStartX = 0;
    touchStartY = 0;
    isScrolling = false;
  }

  onMount(async () => {
    resetToCurrentDate();
    await switchView("weekly");

    // Add keyboard event listener
    document.addEventListener("keydown", handleKeydown);
  });

  onDestroy(() => {
    // Clean up event listeners
    document.removeEventListener("keydown", handleKeydown);

    if (summaryCardElement) {
      summaryCardElement.removeEventListener("touchstart", handleTouchStart);
      summaryCardElement.removeEventListener("touchmove", handleTouchMove);
      summaryCardElement.removeEventListener("touchend", handleTouchEnd);
    }
  });

  function resetToCurrentDate() {
    currentDayOffset = 0;
    currentWeekOffset = 0;
    currentMonthOffset = 0;
    currentYearOffset = 0;
    lastReferenceDate = null;
  }

  async function switchView(viewType) {
    const currentReferenceDate = lastReferenceDate || getCurrentPeriodDate();
    currentView = viewType;
    clearDetailMode();

    hasScrolled = false;

    syncViewOffsets(currentReferenceDate);
    lastReferenceDate = currentReferenceDate;

    try {
      await loadDataForView();
      //updateViewButtons();
      requestAnimationFrame(renderChart);
    } catch (error) {
      console.error("Error switching view:", error);
    }
  }

  function syncViewOffsets(referenceDate) {
    const today = new Date();
    const todayNormalized = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const refNormalized = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      referenceDate.getDate()
    );

    switch (currentView) {
      case "daily":
        currentDayOffset = Math.floor(
          (refNormalized - todayNormalized) / (1000 * 60 * 60 * 24)
        );
        break;
      case "weekly":
        const todayWeekStart = new Date(todayNormalized);
        todayWeekStart.setDate(
          todayNormalized.getDate() - todayNormalized.getDay()
        );
        const refWeekStart = new Date(refNormalized);
        refWeekStart.setDate(refNormalized.getDate() - refNormalized.getDay());
        currentWeekOffset = Math.floor(
          (refWeekStart - todayWeekStart) / (1000 * 60 * 60 * 24 * 7)
        );
        break;
      case "monthly":
        currentMonthOffset =
          (refNormalized.getFullYear() - todayNormalized.getFullYear()) * 12 +
          (refNormalized.getMonth() - todayNormalized.getMonth());
        break;
      case "yearly":
        currentYearOffset =
          refNormalized.getFullYear() - todayNormalized.getFullYear();
        break;
    }
  }

  async function loadDataForView() {
    const allData = await calciumService.getAllJournalData();

    switch (currentView) {
      case "daily":
        currentData = await generateDailyData(allData);
        break;
      case "weekly":
        currentData = await generateWeeklyData(allData);
        break;
      case "monthly":
        currentData = await generateMonthlyData(allData);
        break;
      case "yearly":
        currentData = await generateYearlyData(allData);
        break;
    }
  }

  async function generateDailyData(allData) {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + currentDayOffset);

    const dateStr =
      targetDate.getFullYear() +
      "-" +
      String(targetDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(targetDate.getDate()).padStart(2, "0");

    const dayFoods = allData[dateStr] || [];
    const isFuture = targetDate > today;

    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const hourFoods = dayFoods.filter((food) => {
        if (!food.timestamp) return hour === 12;
        const foodHour = new Date(food.timestamp).getHours();
        return foodHour === hour;
      });

      const hourTotal = hourFoods.reduce((sum, food) => sum + food.calcium, 0);

      return {
        date: dateStr,
        hour: hour,
        displayHour: formatHour(hour),
        shortHour: hour.toString().padStart(2, "0"),
        value: isFuture ? 0 : hourTotal,
        foods: hourFoods,
        foodCount: hourFoods.length,
        isFuture: isFuture && hour > today.getHours(),
        isCurrentHour:
          dateStr ===
            today.getFullYear() +
              "-" +
              String(today.getMonth() + 1).padStart(2, "0") +
              "-" +
              String(today.getDate()).padStart(2, "0") &&
          hour === today.getHours(),
      };
    });

    const dayTotal = hourlyData.reduce((sum, hour) => sum + hour.value, 0);
    const hoursWithData = hourlyData.filter((hour) => hour.value > 0).length;

    return {
      title: "Hourly Intake",
      subtitle: targetDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      data: hourlyData,
      unit: "mg",
      averageValue:
        hoursWithData > 0 ? Math.round(dayTotal / hoursWithData) : 0,
      totalValue: dayTotal,
      maxValue: Math.max(...hourlyData.map((h) => h.value)),
      minValue: Math.min(
        ...hourlyData.filter((h) => !h.isFuture).map((h) => h.value)
      ),
    };
  }

  async function generateWeeklyData(allData) {
    const data = [];
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay());
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(currentWeekStart.getDate() + currentWeekOffset * 7);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");
      const todayStr =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");
      const isToday = dateStr === todayStr;
      const isFuture = date > today;

      const foods = allData[dateStr] || [];
      const totalCalcium = foods.reduce((sum, food) => sum + food.calcium, 0);

      data.push({
        date: dateStr,
        displayDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        shortDate: dayNames[i],
        value: isFuture ? 0 : totalCalcium,
        goalMet: totalCalcium >= $calciumState.settings.dailyGoal,
        foodCount: foods.length,
        isToday: isToday,
        isFuture: isFuture,
        foods: foods,
      });
    }

    const weekEndDate = new Date(weekStart);
    weekEndDate.setDate(weekStart.getDate() + 6);

    // Conditionally include year based on screen size
    const isSmallScreen =
      typeof window !== "undefined" && window.innerWidth <= 480;

    let subtitle = isSmallScreen
      ? `${weekStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${weekEndDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`
      : `${weekStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${weekEndDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;

    return {
      title: "Average",
      subtitle: subtitle,
      data: data,
      unit: "mg",
      averageValue: Math.round(
        data
          .filter((d) => !d.isFuture) // Remove: && d.value > 0
          .reduce((sum, d) => sum + d.value, 0) /
          Math.max(1, data.filter((d) => !d.isFuture).length) // Remove: && d.value > 0
      ),
      maxValue: Math.max(...data.map((d) => d.value)),
      minValue: Math.min(
        ...data.filter((d) => !d.isFuture).map((d) => d.value)
      ),
    };
  }

  async function generateMonthlyData(allData) {
    const today = new Date();
    const targetMonth = new Date(
      today.getFullYear(),
      today.getMonth() + currentMonthOffset,
      1
    );
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");
      const todayStr =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");
      const isToday = dateStr === todayStr;
      const isFuture = date > today;

      const foods = allData[dateStr] || [];
      const totalCalcium = foods.reduce((sum, food) => sum + food.calcium, 0);

      data.push({
        date: dateStr,
        displayDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        shortDate: date.toLocaleDateString("en-US", { weekday: "short" }),
        chartLabel: day.toString(),
        value: isFuture ? 0 : totalCalcium,
        goalMet: totalCalcium >= $calciumState.settings.dailyGoal,
        foodCount: foods.length,
        isToday: isToday,
        isFuture: isFuture,
        foods: foods,
      });
    }

    return {
      title: "Average",
      subtitle: targetMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      data: data,
      unit: "mg",
      averageValue: Math.round(
        data
          .filter((d) => !d.isFuture) // Remove: && d.value > 0
          .reduce((sum, d) => sum + d.value, 0) /
          Math.max(1, data.filter((d) => !d.isFuture).length) // Remove: && d.value > 0
      ),
      maxValue: Math.max(...data.map((d) => d.value)),
      minValue: Math.min(
        ...data.filter((d) => !d.isFuture).map((d) => d.value)
      ),
    };
  }

  async function generateYearlyData(allData) {
    const today = new Date();
    const targetYear = today.getFullYear() + currentYearOffset;
    const data = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(targetYear, month, 1);
      const isFutureMonth = monthDate > today;

      const monthDays = Object.keys(allData).filter((dateStr) => {
        const [year, monthStr, day] = dateStr.split("-");
        const date = new Date(
          parseInt(year),
          parseInt(monthStr) - 1,
          parseInt(day)
        );
        return date.getFullYear() === targetYear && date.getMonth() === month;
      });

      let averageDaily = 0;
      if (monthDays.length > 0 && !isFutureMonth) {
        const monthTotal = monthDays.reduce((sum, dateStr) => {
          const foods = allData[dateStr];
          return sum + foods.reduce((daySum, food) => daySum + food.calcium, 0);
        }, 0);
        averageDaily = Math.round(monthTotal / monthDays.length);
      }

      data.push({
        date:
          monthDate.getFullYear() +
          "-" +
          String(monthDate.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(monthDate.getDate()).padStart(2, "0"),
        displayDate: monthDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        shortDate: monthNames[month],
        value: averageDaily,
        goalMet: averageDaily >= $calciumState.settings.dailyGoal,
        daysTracked: monthDays.length,
        isFuture: isFutureMonth,
      });
    }

    return {
      title: "Average",
      subtitle: targetYear.toString(),
      data: data,
      unit: "mg",
      averageValue: Math.round(
        data
          .filter((d) => !d.isFuture) // Remove: && d.value > 0
          .reduce((sum, d) => sum + d.value, 0) /
          Math.max(1, data.filter((d) => !d.isFuture).length) // Remove: && d.value > 0
      ),
      maxValue: Math.max(...data.map((d) => d.value)),
      minValue: Math.min(
        ...data.filter((d) => !d.isFuture).map((d) => d.value)
      ),
    };
  }

  function formatHour(hour) {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  }

  async function navigatePrevious() {
    switch (currentView) {
      case "daily":
        currentDayOffset--;
        break;
      case "weekly":
        currentWeekOffset--;
        break;
      case "monthly":
        currentMonthOffset--;
        break;
      case "yearly":
        currentYearOffset--;
        break;
    }
    clearDetailMode();
    await loadDataForView();
    lastReferenceDate = getCurrentPeriodDate();
  }

  async function navigateNext() {
    if (currentView === "daily" && currentDayOffset >= 0) return;
    if (currentView === "weekly" && currentWeekOffset >= 0) return;
    if (currentView === "monthly" && currentMonthOffset >= 0) return;
    if (currentView === "yearly" && currentYearOffset >= 0) return;

    switch (currentView) {
      case "daily":
        currentDayOffset++;
        break;
      case "weekly":
        currentWeekOffset++;
        break;
      case "monthly":
        currentMonthOffset++;
        break;
      case "yearly":
        currentYearOffset++;
        break;
    }
    clearDetailMode();
    await loadDataForView();
    lastReferenceDate = getCurrentPeriodDate();
  }

  function handleDateChange(event) {
    const selectedDate = new Date(event.target.value + "T00:00:00");
    syncViewOffsets(selectedDate);
    lastReferenceDate = selectedDate;
    loadDataForView();
    showDatePicker = false;
  }

  function goToToday() {
    const today = new Date();
    syncViewOffsets(today);
    lastReferenceDate = today;
    loadDataForView();
    showDatePicker = false;
  }

  function getCurrentPeriodDate() {
    const today = new Date();
    const todayNormalized = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    switch (currentView) {
      case "daily":
        const dayDate = new Date(todayNormalized);
        dayDate.setDate(todayNormalized.getDate() + currentDayOffset);
        return dayDate;
      case "weekly":
        const weekDate = new Date(todayNormalized);
        weekDate.setDate(todayNormalized.getDate() + currentWeekOffset * 7);
        return weekDate;
      case "monthly":
        const monthDate = new Date(todayNormalized);
        monthDate.setMonth(todayNormalized.getMonth() + currentMonthOffset);
        return monthDate;
      case "yearly":
        const yearDate = new Date(todayNormalized);
        yearDate.setFullYear(todayNormalized.getFullYear() + currentYearOffset);
        return yearDate;
      default:
        return todayNormalized;
    }
  }

  function clearDetailMode() {
    selectedBarIndex = -1;
    isDetailMode = false;
    originalSummaryData = null;

    // Remove selected state from all bars
    if (chartCanvas) {
      chartCanvas.querySelectorAll(".chart-bar.selected").forEach((bar) => {
        bar.classList.remove("selected");
      });

      // Remove detail line if it exists
      const detailLine = chartCanvas.querySelector(".chart-detail-line");
      if (detailLine) {
        detailLine.remove();
      }
    }
  }

  function showBarDetail(item, index) {
    if (!originalSummaryData) {
      originalSummaryData = {
        title: currentData.title,
        subtitle: currentData.subtitle,
        value: currentData.averageValue || currentData.totalValue,
      };
    }

    // If clicking the same bar, clear detail mode
    if (selectedBarIndex === index && isDetailMode) {
      clearDetailMode();
      return;
    }

    // Clear previous selection
    if (chartCanvas) {
      chartCanvas.querySelectorAll(".chart-bar.selected").forEach((bar) => {
        bar.classList.remove("selected");
      });

      // Remove existing detail line
      const existingLine = chartCanvas.querySelector(".chart-detail-line");
      if (existingLine) {
        existingLine.remove();
      }
    }

    // Set new selection
    selectedBarIndex = index;
    isDetailMode = true;

    // Add selected state to clicked bar and create detail line
    if (chartCanvas) {
      const bars = chartCanvas.querySelectorAll(".chart-bar");
      if (bars[index]) {
        bars[index].classList.add("selected");

        // Create detail line using the original positioning method
        const detailLine = document.createElement("div");
        detailLine.className = "chart-detail-line active";

        // Position the line at the center of the selected bar
        const barRect = bars[index].getBoundingClientRect();
        const containerRect = chartCanvas.getBoundingClientRect();
        const linePosition =
          barRect.left - containerRect.left + barRect.width / 2 - 1;

        // Line extends 110% height for better visual coverage

        detailLine.style.left = `${linePosition}px`;
        detailLine.style.top = `0px`;
        detailLine.style.height = `110%`;
        chartCanvas.appendChild(detailLine);
      }
    }
  }

  function updateViewButtons() {
  }

  // Reactive statement for goal achievement
  $: goalAchievement = (() => {
    if (!currentData?.data.length) return 0;

    if (currentView === "daily") {
      const dayTotal = currentData.totalValue || 0;
      return dayTotal >= $calciumState.settings.dailyGoal
        ? 100
        : Math.round((dayTotal / $calciumState.settings.dailyGoal) * 100);
    }

    const allNonFutureDays = currentData.data.filter(
      (item) => !item.isFuture // Remove: && item.value > 0
    );
    if (allNonFutureDays.length === 0) return 0;

    // Calculate average and express as percentage of goal
    const totalValue = allNonFutureDays.reduce(
      (sum, item) => sum + item.value,
      0
    );
    const averageValue = totalValue / allNonFutureDays.length;
    const percentageOfGoal =
      (averageValue / $calciumState.settings.dailyGoal) * 100;

    return Math.round(percentageOfGoal);
  })();

  // Reactive statement for tracking info
  $: trackingInfo = (() => {
    if (!currentData?.data.length) return "0 periods";

    switch (currentView) {
      case "daily":
        const hoursWithData = currentData.data.filter(
          (item) => !item.isFuture && item.value > 0
        ).length;
        return `${hoursWithData} of 24 hours`;
      case "weekly":
        const daysWithData = currentData.data.filter(
          (item) => !item.isFuture && item.value > 0
        ).length;
        return `${daysWithData} of 7 days`;
      case "monthly":
        const validDays = currentData.data.filter((item) => !item.isFuture);
        const monthDaysWithData = validDays.filter(
          (item) => item.value > 0
        ).length;
        return `${monthDaysWithData} of ${validDays.length} days`;
      case "yearly":
        const monthsWithData = currentData.data.filter(
          (item) => !item.isFuture && item.value > 0
        ).length;
        return `${monthsWithData} months`;
      default:
        return `${currentData.data.length} periods`;
    }
  })();

  $: isAtCurrentPeriod =
    (currentView === "daily" && currentDayOffset >= 0) ||
    (currentView === "weekly" && currentWeekOffset >= 0) ||
    (currentView === "monthly" && currentMonthOffset >= 0) ||
    (currentView === "yearly" && currentYearOffset >= 0);

  // Set up touch listeners when summary card element becomes available
  $: if (summaryCardElement) {
    summaryCardElement.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    summaryCardElement.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    summaryCardElement.addEventListener("touchend", handleTouchEnd, {
      passive: false,
    });
  }

  $: if (currentData) {
    requestAnimationFrame(renderChart);
  }

  afterUpdate(() => {
    if (currentView === "monthly" && chartScrollWrapper && !hasScrolled) {
      scrollToCurrentDay();
      hasScrolled = true;
    }
  });

  function renderChart() {
    if (!currentData || !currentData.data.length || !chartCanvas) return;

    // Clear existing content
    chartCanvas.innerHTML = "";
    chartLabels.innerHTML = "";

    const data = currentData.data;
    const dataMax = currentData.maxValue;
    const goal = $calciumState.settings.dailyGoal;
    const chartCeiling = Math.max(dataMax, goal);
    const maxValue = chartCeiling * 1.25;

    // Set the --bar-count variable for the CSS Grid layout
    const count = data.length;
    chartCanvas.style.setProperty("--bar-count", count);
    chartLabels.style.setProperty("--bar-count", count);

    // Create goal line for all views
    createGoalLine(maxValue);

    // Create bars and labels
    data.forEach((item, index) => {
      // Create bar
      const bar = document.createElement("div");
      bar.className = "chart-bar";

      const heightPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
      bar.style.height = `${Math.max(heightPercent, 2)}%`;

      // Apply styling
      if (item.isFuture) {
        bar.classList.add("future-day");
      } else if (item.value === 0) {
        bar.classList.add("no-data");
      } else if (!item.goalMet && currentView !== "daily") {
        bar.classList.add("below-goal");
      }

      if (item.isToday || item.isCurrentHour) {
        bar.classList.add("today");
      }

      if (selectedBarIndex === index) {
        bar.classList.add("selected");
      }

      // Add click handler - allow selection for all non-future items
      if (!item.isFuture) {
        bar.addEventListener("click", (e) => {
          e.stopPropagation();
          showBarDetail(item, index);
        });
        bar.style.cursor = "pointer";
      }

      chartCanvas.appendChild(bar);

      // Create label
      const label = document.createElement("div");
      label.className = "chart-label";
      if (currentView === "daily") {
        // Show all hour labels but hide odd hours visually
        label.textContent = item.shortHour;
        if (index % 2 !== 0) {
          label.style.visibility = "hidden";
        }
      } else {
        // Use chartLabel for monthly view (day numbers), shortDate for others
        label.textContent =
          currentView === "monthly" && item.chartLabel
            ? item.chartLabel
            : item.shortDate;
      }
      chartLabels.appendChild(label);
    });

    // Add detail line for selected bar (after all bars are created)
    if (selectedBarIndex >= 0 && selectedBarIndex < data.length) {
      // Use the original positioning method from pre-refactor code
      const bars = chartCanvas.querySelectorAll(".chart-bar");
      if (bars[selectedBarIndex]) {
        const detailLine = document.createElement("div");
        detailLine.className = "chart-detail-line active";

        // Position the line at the center of the selected bar using getBoundingClientRect
        const barRect = bars[selectedBarIndex].getBoundingClientRect();
        const containerRect = chartCanvas.getBoundingClientRect();
        const linePosition =
          barRect.left - containerRect.left + barRect.width / 2 - 1;

        // Line extends 110% height for better visual coverage

        detailLine.style.left = `${linePosition}px`;
        detailLine.style.top = `0px`;
        detailLine.style.height = `110%`;
        chartCanvas.appendChild(detailLine);
      }
    }
  }

  function createGoalLine(maxValue) {
    if (!goalLineContainer) return;
    
    // Clear any existing goal line
    goalLineContainer.innerHTML = "";
    
    const goalLine = document.createElement("div");
    goalLine.className = "goal-line";
    const goalPercent = ($calciumState.settings.dailyGoal / maxValue) * 100;
    goalLine.style.bottom = `${goalPercent}%`;
    goalLine.style.position = "absolute";
    goalLine.style.width = "100%";
    goalLine.style.left = "0";
    goalLineContainer.appendChild(goalLine);
  }

  function scrollToCurrentDay() {
    if (currentView !== "monthly" || !chartScrollWrapper || !currentData)
      return;

    const today = new Date();
    const todayStr =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    // Find today's index in the data
    const todayIndex = currentData.data.findIndex(
      (item) => item.date === todayStr
    );

    if (todayIndex >= 0) {
      const containerWidth = chartScrollWrapper.clientWidth;
      const totalBars = currentData.data.length;
      const barWidth = chartScrollWrapper.scrollWidth / totalBars;

      // Calculate scroll position to center today with some left margin
      const targetScroll = Math.max(
        0,
        todayIndex * barWidth - containerWidth / 2 + barWidth / 2
      );
      chartScrollWrapper.scrollLeft = targetScroll;
      // Sync labels scroll
      if (chartLabels && chartLabels.parentElement) {
        chartLabels.parentElement.scrollLeft = targetScroll;
      }
    }
  }

  function syncLabelsScroll() {
    if (chartScrollWrapper && chartLabels && chartLabels.parentElement) {
      chartLabels.parentElement.scrollLeft = chartScrollWrapper.scrollLeft;
    }
  }

  function handleDatePickerKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showDatePicker = !showDatePicker;
    }
  }
</script>

<svelte:head>
  <title>Statistics - My Calcium</title>
</svelte:head>

<div class="stats-page">
  <div class="stats-content">
    <!-- Time Period Controls -->
    <div class="stats-view-controls">
      <div class="view-options">
        <button
          class="view-option"
          class:active={currentView === "daily"}
          on:click={() => switchView("daily")}
        >
          <span class="material-icons">schedule</span>
          <span>Daily</span>
        </button>
        <button
          class="view-option"
          class:active={currentView === "weekly"}
          on:click={() => switchView("weekly")}
        >
          <span class="material-icons">view_week</span>
          <span>Weekly</span>
        </button>
        <button
          class="view-option"
          class:active={currentView === "monthly"}
          on:click={() => switchView("monthly")}
        >
          <span class="material-icons">calendar_month</span>
          <span>Monthly</span>
        </button>
        <button
          class="view-option"
          class:active={currentView === "yearly"}
          on:click={() => switchView("yearly")}
        >
          <span class="material-icons">calendar_today</span>
          <span>Yearly</span>
        </button>
      </div>
    </div>

    {#if currentData}
      <!-- Summary Card -->
      <div
        class="stats-summary-card"
        class:detail-mode={isDetailMode}
        bind:this={summaryCardElement}
      >
        <div class="stats-period-container">
          <button
            class="stats-nav-btn stats-nav-prev"
            on:click={navigatePrevious}
          >
            <span class="material-icons">chevron_left</span>
          </button>
          <div class="stats-period-wrapper">
            <div
              class="stats-period"
              class:is-current-period={isAtCurrentPeriod}
              on:click={() => (showDatePicker = !showDatePicker)}
              on:keydown={handleDatePickerKeydown}
              role="button"
              tabindex="0"
            >
              {currentData.subtitle}
              <span class="material-icons">calendar_today</span>
            </div>
            {#if showDatePicker}
              <div class="calendar-popup">
                <input
                  type="date"
                  value={getCurrentPeriodDate().toISOString().split("T")[0]}
                  on:change={handleDateChange}
                  class="date-input"
                />
                <button class="today-btn" on:click={goToToday}>
                  <span class="material-icons">today</span>
                  Today
                </button>
              </div>
            {/if}
          </div>
          <button
            class="stats-nav-btn stats-nav-next"
            on:click={navigateNext}
            style:visibility={isAtCurrentPeriod ? "hidden" : "visible"}
          >
            <span class="material-icons">chevron_right</span>
          </button>
        </div>
        <div class="stats-main-value">
          <span class="stats-value">
            {#if isDetailMode && selectedBarIndex >= 0}
              {currentData.data[selectedBarIndex].value.toFixed(2)}
            {:else if currentView === "daily"}
              {(currentData.totalValue || 0).toFixed(2)}
            {:else}
              {currentData.averageValue.toFixed(2)}
            {/if}
          </span>
          <span class="stats-unit">mg</span>
        </div>
        <div class="stats-description">
          <div class="stats-left">
            <div class="stats-title">
              {#if isDetailMode && selectedBarIndex >= 0}
                {#if currentView === "daily"}
                  {currentData.data[selectedBarIndex].displayHour}
                {:else if currentView === "weekly"}
                  {currentData.data[selectedBarIndex].shortDate}
                  {currentData.data[selectedBarIndex].date.split("-")[2]}
                {:else if currentView === "monthly"}
                  {currentData.data[selectedBarIndex].shortDate}
                  {currentData.data[selectedBarIndex].date.split("-")[2]}
                {:else}
                  {currentData.data[selectedBarIndex].shortDate}
                {/if}
              {:else}
                Overview
              {/if}
            </div>
          </div>
          <div class="stats-center">
            <div class="stats-center-content"></div>
          </div>
          <div class="stats-right">
            <div class="stats-subtitle">
              {#if isDetailMode && selectedBarIndex >= 0}
                {#if currentView === "daily"}
                  Hourly Total
                {:else if currentView === "yearly"}
                  Daily Avg
                {:else}
                  Daily Total
                {/if}
              {:else if currentView === "daily"}
                Daily Total
              {:else}
                Daily Avg
              {/if}
            </div>
          </div>
        </div>
      </div>

      <!-- Chart Container -->
      <div class="chart-container">
        <div class="chart-area">
          <div
            class="chart-scroll-wrapper"
            bind:this={chartScrollWrapper}
            on:scroll={syncLabelsScroll}
          >
            <div class="chart-canvas {currentView}-view" bind:this={chartCanvas}>
              <!-- Chart will be rendered here -->
            </div>
          </div>
          <div class="goal-line-container" bind:this={goalLineContainer}>
            <!-- Goal line will be rendered here -->
          </div>
        </div>
        <div class="chart-labels-wrapper">
          <div class="chart-labels {currentView}-view" bind:this={chartLabels}>
            <!-- Labels will be rendered here -->
          </div>
        </div>
      </div>

      <!-- Additional Stats -->
      <div class="additional-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">flag</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{$calciumState.settings.dailyGoal} mg</div>
            <div class="stat-label">Daily Goal</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">trending_up</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{goalAchievement}%</div>
            <div class="stat-label">Goal Achieved</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">schedule</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{trackingInfo}</div>
            <div class="stat-label">Tracked</div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .stats-page {
    background-color: var(--background);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .stats-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-lg);
  }

  .stats-view-controls {
    margin-bottom: var(--spacing-sm);
  }

  .view-options {
    display: flex;
    gap: var(--spacing-sm);
    justify-content: center;
    background-color: var(--surface);
    border-radius: var(--spacing-sm);
    padding: var(--spacing-xs);
    border: 1px solid var(--divider);
  }

  .view-option {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    background: none;
    border-radius: 0.375rem; /* 6px converted */
    cursor: pointer;
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--text-secondary);
    transition: all 0.2s ease;
    flex: 1;
    justify-content: center;
    min-height: var(--touch-target-min);
  }

  .view-option:hover {
    background-color: var(--divider);
    color: var(--text-primary);
  }

  .view-option.active {
    background-color: var(--primary-color);
    color: white;
  }

  .view-option .material-icons {
    font-size: var(--icon-size-md);
  }

  .stats-summary-card {
    background-color: var(--surface);
    border-radius: var(--spacing-md);
    padding: var(--spacing-md) var(--spacing-xl);
    margin-bottom: var(--spacing-sm);
    box-shadow: var(--shadow);
    border: 1px solid var(--divider);
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
  }

  .stats-summary-card.detail-mode {
    background-color: var(--custom-food-bg);
    border-color: var(--secondary-color);
    box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
  }

  .stats-period-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-lg);
  }

  .stats-period-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .stats-period {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
    cursor: pointer;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--spacing-sm);
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    min-width: 10rem; /* 160px equivalent - wider for better mobile experience */
    justify-content: center;
  }

  .calendar-popup {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--surface);
    border-radius: var(--spacing-sm);
    box-shadow: var(--shadow-lg);
    padding: var(--spacing-lg);
    z-index: 1000;
    margin-top: var(--spacing-sm);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    border: 1px solid var(--divider);
  }

  .date-input {
    border: 1px solid var(--divider);
    border-radius: var(--spacing-xs);
    padding: var(--spacing-sm);
    font-size: var(--font-size-base);
    background: var(--background);
    color: var(--text-primary);
  }

  .date-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .today-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--spacing-sm);
    cursor: pointer;
    font-size: var(--font-size-sm);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    justify-content: center;
    transition: all 0.2s;
  }

  .today-btn:hover {
    background: var(--primary-color-dark);
    transform: translateY(-1px);
  }

  .today-btn .material-icons {
    font-size: var(--icon-size-sm);
  }

  .stats-nav-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
  }

  .stats-nav-btn:hover {
    background-color: var(--divider);
    color: var(--text-primary);
  }

  .stats-period {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
    cursor: pointer;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--spacing-sm);
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    min-width: 8rem; /* 128px equivalent - match main page */
    justify-content: center;
  }

  .stats-period:hover {
    background-color: var(--surface-variant);
  }

  .stats-period .material-icons {
    font-size: var(--icon-size-md);
    color: var(--text-secondary);
  }

  .stats-period.is-current-period {
    background-color: var(--primary-color);
    color: white;
    font-weight: 700;
  }

  .stats-period.is-current-period:hover {
    background-color: var(--primary-color-dark);
  }

  .stats-period.is-current-period .material-icons {
    color: white;
  }

  .calendar-popup {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--surface);
    border-radius: var(--spacing-sm);
    box-shadow: var(--shadow-lg);
    padding: var(--spacing-lg);
    z-index: 1000;
    margin-top: var(--spacing-sm);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    border: 1px solid var(--divider);
    min-width: 12rem;
  }

  .date-input {
    border: 1px solid var(--divider);
    border-radius: var(--spacing-xs);
    padding: var(--spacing-sm);
    font-size: var(--input-font-ideal);
    background: var(--background);
    color: var(--text-primary);
    min-height: var(--touch-target-min);
  }

  .date-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .today-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--spacing-xl);
    cursor: pointer;
    font-size: var(--font-size-sm);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    transition: all 0.2s;
    justify-content: center;
    min-height: var(--touch-target-min);
  }

  .today-btn:hover {
    background: var(--primary-color-dark, #1565c0);
    transform: translateY(-1px);
  }

  .today-btn .material-icons {
    font-size: var(--icon-size-md);
  }

  .stats-main-value {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-lg);
  }

  .stats-value {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--primary-color);
    line-height: 1;
  }

  .stats-unit {
    font-size: var(--font-size-xl);
    font-weight: 500;
    color: var(--text-secondary);
  }

  .stats-description {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: var(--spacing-md);
  }

  .stats-left {
    text-align: left;
  }

  .stats-center {
    text-align: center;
  }

  .stats-right {
    text-align: right;
  }

  .stats-title {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--text-primary);
  }

  .stats-subtitle {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--text-secondary);
  }

  .chart-container {
    margin-bottom: var(--spacing-sm);
    background-color: var(--surface);
    border-radius: var(--spacing-sm);
    border: 1px solid var(--divider);
    overflow: hidden;
  }

  .chart-area {
    position: relative;
    height: 16.25rem; /* 260px - same as chart-scroll-wrapper */
  }

  .goal-line-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    padding: var(--spacing-lg) 0;
    z-index: 10;
  }

  .chart-scroll-wrapper {
    position: relative;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    padding: var(--spacing-lg) 0;
    scroll-behavior: smooth;
    width: 100%;
  }

  .chart-canvas {
    display: grid;
    height: 100%; /* <<< THIS IS THE CRITICAL RESTORED LINE */
    align-items: end; /* This anchors the bars to the bottom */
    grid-auto-flow: column;
    grid-template-columns: repeat(var(--bar-count, 1), minmax(0, 1fr));
    gap: var(--bar-gap, 2px);
    /* min-width: 100%; */
    padding: 0 var(--spacing-sm);
  }

  .chart-labels {
    display: grid;
    align-items: end; /* This aligns the labels to the bottom */
    grid-auto-flow: column;
    grid-template-columns: repeat(var(--bar-count, 1), minmax(0, 1fr));
    gap: var(--bar-gap, 2px);
    /* min-width: 100%; */
    padding: 0 var(--spacing-sm);
    text-align: center;
  }

  .chart-labels-wrapper {
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 0 0 var(--spacing-lg) 0;
  }

  .chart-labels-wrapper::-webkit-scrollbar {
    display: none;
  }

  .chart-labels::-webkit-scrollbar {
    display: none;
  }

  .chart-canvas.daily-view,
  .chart-labels.daily-view {
    --bar-gap: 1px;
  }

  .chart-canvas.weekly-view,
  .chart-labels.weekly-view {
    --bar-gap: var(--spacing-sm);
  }

  .chart-canvas.yearly-view,
  .chart-labels.yearly-view {
    --bar-gap: var(--spacing-xs);
  }

  /* Monthly view requires horizontal scrolling */
  .chart-canvas.monthly-view,
  .chart-labels.monthly-view {
    /* min-width: max-content; */
    grid-template-columns: repeat(var(--bar-count), 1.25rem);
    --bar-gap: 2px;
  }
  :global(.chart-bar) {
    background-color: var(--primary-color);
    border-radius: 2px 2px 0 0;
    transition: all 0.2s ease;
    cursor: pointer;
    min-height: 4px;
    height: auto;
    align-self: end;
  }

  /* Disable hover effects on touch devices to prevent stuck hover states */
  @media (hover: hover) and (pointer: fine) {
    :global(.chart-bar:hover) {
      opacity: 0.8;
      transform: scaleY(1.05);
    }
  }

  :global(.chart-bar.selected) {
    filter: brightness(1.3);
    transform: scaleY(1.02);
  }

  :global(.chart-bar.future-day) {
    background-color: var(--divider);
    cursor: not-allowed;
  }

  :global(.chart-bar.no-data) {
    background-color: var(--text-hint);
  }

  :global(.chart-bar.below-goal) {
    background-color: var(--error-color);
  }

  :global(.chart-bar.today) {
    background-color: var(--secondary-color);
  }

  :global(.goal-line) {
    border-top: 2px dashed var(--secondary-color);
    height: 0;
    opacity: 0.8;
  }

  :global(.chart-canvas.daily-view .goal-line) {
    display: none;
  }

  :global(.chart-detail-line) {
    position: absolute;
    width: 2px;
    background-color: var(--secondary-color);
    opacity: 0;
    pointer-events: none;
    z-index: 50;
    box-shadow: 0 0 4px rgba(255, 193, 7, 0.6);
    transition: opacity 0.2s ease;
  }

  :global(.chart-detail-line.active) {
    opacity: 1;
  }

  .chart-label {
    text-align: center;
    font-size: var(--font-size-xs);
    font-weight: 500;
    color: var(--text-secondary);
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .additional-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
  }

  .stat-card {
    background-color: var(--surface);
    border-radius: var(--spacing-sm);
    padding: var(--spacing-lg) var(--spacing-md);
    text-align: center;
    border: 1px solid var(--divider);
    transition: all 0.2s ease;
  }

  .stat-card:hover {
    box-shadow: var(--shadow);
    transform: translateY(-1px);
  }

  .stat-icon {
    margin-bottom: var(--spacing-sm);
  }

  .stat-icon .material-icons {
    font-size: var(--icon-size-lg);
    color: var(--primary-color);
  }

  .stat-value {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
  }

  .stat-label {
    font-size: var(--font-size-xs);
    font-weight: 500;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.03125rem; /* 0.5px converted */
  }

  /* Fallback for narrow devices to prevent overflow */
  @media (max-width: 400px) {
    .chart-canvas:not(.monthly-view),
    .chart-labels:not(.monthly-view) {
      min-width: max-content; /* Allow scrolling on small screens */
    }
  }

  /* Mobile responsive */
  @media (max-width: 30rem) {
    /* 480px equivalent */
    .stats-content {
      padding: var(--spacing-md);
      padding-bottom: 5rem;
    }

    .view-option span:not(.material-icons) {
      display: none;
    }

    .view-option {
      padding: 0.625rem; /* 10px converted */
    }

    .stats-summary-card {
      padding: var(--spacing-md) var(--spacing-lg);
    }

    .stats-value {
      font-size: var(--font-size-2xl);
    }

    .additional-stats {
      gap: var(--spacing-sm);
    }

    .stat-card {
      padding: var(--spacing-md) var(--spacing-sm);
    }

    /* Fix mobile chart alignment */
    .chart-canvas {
      gap: var(--spacing-xs);
      padding: 0 var(--spacing-xs);
    }

    .chart-canvas.weekly-view {
      gap: var(--spacing-xs); /* Tighter gap on mobile */
    }

    .chart-labels {
      gap: var(--spacing-xs);
      padding: 0 var(--spacing-xs);
    }

    .chart-labels.weekly-view {
      gap: var(--spacing-xs); /* Match mobile chart canvas gap */
    }

    .chart-label {
      font-size: 0.7rem; /* Slightly smaller than --font-size-xs for mobile */
      min-width: 0;
    }
  }
</style>
