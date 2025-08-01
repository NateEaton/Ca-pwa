<script>
  import { onMount, onDestroy } from "svelte";
  import { calciumState } from "$lib/stores/calcium";
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

  // Touch handling
  let touchStartX = 0;
  let touchStartY = 0;
  let isScrolling = false;

  // Date picker
  let showDatePicker = false;

  onMount(async () => {
    resetToCurrentDate();
    await switchView("weekly");
  });

  function resetToCurrentDate() {
    currentDayOffset = 0;
    currentWeekOffset = 0;
    currentMonthOffset = 0;
    currentYearOffset = 0;
    lastReferenceDate = null;
  }

  function handleBackClick() {
    goto("/");
  }

  async function switchView(viewType) {
    const currentReferenceDate = lastReferenceDate || getCurrentPeriodDate();
    currentView = viewType;
    clearDetailMode();

    syncViewOffsets(currentReferenceDate);
    lastReferenceDate = currentReferenceDate;

    try {
      await loadDataForView();
      updateViewButtons();
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
    const allData = await getAllJournalData();

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

    let subtitle = `${weekStart.toLocaleDateString("en-US", {
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
          .filter((d) => !d.isFuture && d.value > 0)
          .reduce((sum, d) => sum + d.value, 0) /
          Math.max(1, data.filter((d) => !d.isFuture && d.value > 0).length)
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
        shortDate: day.toString(),
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
          .filter((d) => !d.isFuture && d.value > 0)
          .reduce((sum, d) => sum + d.value, 0) /
          Math.max(1, data.filter((d) => !d.isFuture && d.value > 0).length)
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
          .filter((d) => !d.isFuture && d.value > 0)
          .reduce((sum, d) => sum + d.value, 0) /
          Math.max(1, data.filter((d) => !d.isFuture && d.value > 0).length)
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
    // Remove detail line if it exists
    if (chartCanvas) {
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

    if (selectedBarIndex === index && isDetailMode) {
      clearDetailMode();
      return;
    }

    selectedBarIndex = index;
    isDetailMode = true;
  }

  function updateViewButtons() {
    // This will be handled by reactive classes in template
  }

  async function getAllJournalData() {
    const journalData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("calcium_foods_")) {
        const date = key.replace("calcium_foods_", "");
        try {
          const foods = JSON.parse(localStorage.getItem(key));
          if (foods && foods.length > 0) {
            journalData[date] = foods;
          }
        } catch (error) {
          console.error(`Error parsing journal data for ${date}:`, error);
        }
      }
    }
    return journalData;
  }

  function calculateGoalAchievement() {
    if (!currentData?.data.length) return 0;

    if (currentView === "daily") {
      const dayTotal = currentData.totalValue || 0;
      return dayTotal >= $calciumState.settings.dailyGoal
        ? 100
        : Math.round((dayTotal / $calciumState.settings.dailyGoal) * 100);
    }

    const validDays = currentData.data.filter(
      (item) => !item.isFuture && item.value > 0
    );
    if (validDays.length === 0) return 0;

    const goalsAchieved = validDays.filter((item) => item.goalMet).length;
    return Math.round((goalsAchieved / validDays.length) * 100);
  }

  function getTrackingInfo() {
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
  }

  $: isAtCurrentPeriod =
    (currentView === "daily" && currentDayOffset >= 0) ||
    (currentView === "weekly" && currentWeekOffset >= 0) ||
    (currentView === "monthly" && currentMonthOffset >= 0) ||
    (currentView === "yearly" && currentYearOffset >= 0);

  $: if (currentData) {
    renderChart();
    // Auto-scroll for monthly view
    if (currentView === "monthly" && chartScrollWrapper) {
      setTimeout(() => {
        scrollToCurrentDay();
      }, 50);
    }
  }

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
        // Show only even hours (00, 02, 04, etc.)
        label.textContent = index % 2 === 0 ? item.shortDate : "";
      } else {
        label.textContent = item.shortDate;
      }
      chartLabels.appendChild(label);
    });

    // Add detail line for selected bar (after all bars are created)
    if (selectedBarIndex >= 0 && selectedBarIndex < data.length) {
      const detailLine = document.createElement("div");
      detailLine.className = "chart-detail-line";
      
      // Calculate positioning based on view type
      let leftPosition;
      if (currentView === "yearly") {
        // For yearly view with space-between layout, calculate position differently
        const barCount = data.length;
        if (barCount > 1) {
          const barSpacing = 100 / (barCount - 1); // Space between bars in space-between layout
          leftPosition = `${selectedBarIndex * barSpacing}%`;
        } else {
          leftPosition = "50%"; // Center if only one bar
        }
      } else {
        // For other views with flex layout, center on the bar
        leftPosition = `${((selectedBarIndex + 0.5) / data.length) * 100}%`;
      }
      
      detailLine.style.left = leftPosition;
      console.log(`Adding detail line for ${currentView} view at position ${leftPosition}, selectedBarIndex: ${selectedBarIndex}`);
      
      // Ensure the line is visible by setting additional styles
      detailLine.style.position = 'absolute';
      detailLine.style.top = '0';
      detailLine.style.height = '100%';
      detailLine.style.width = '3px';
      detailLine.style.backgroundColor = '#ffc107'; // Yellow color directly
      detailLine.style.zIndex = '50';
      
      chartCanvas.appendChild(detailLine);
    }
  }

  function createGoalLine(maxValue) {
    const goalLine = document.createElement("div");
    goalLine.className = "goal-line";
    const goalPercent = ($calciumState.settings.dailyGoal / maxValue) * 100;
    goalLine.style.bottom = `${goalPercent}%`;
    goalLine.style.position = "absolute";
    goalLine.style.width = "100%";
    goalLine.style.left = "0";
    chartCanvas.appendChild(goalLine);
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
</script>

<svelte:head>
  <title>Statistics - My Calcium</title>
</svelte:head>

<div class="stats-page">
  <!-- Header -->
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <button class="back-button" on:click={handleBackClick}>
          <span class="material-icons">arrow_back</span>
        </button>
      </div>
      <div class="header-center">
        <h1>Statistics</h1>
      </div>
      <div class="header-right">
        <!-- Empty for symmetry -->
      </div>
    </div>
  </header>

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
      <div class="stats-summary-card" class:detail-mode={isDetailMode}>
        <div class="stats-period-container">
          <button
            class="stats-nav-btn stats-nav-prev"
            on:click={navigatePrevious}
          >
            <span>&lt;</span>
          </button>
          <div class="stats-period-wrapper">
            <div
              class="stats-period"
              on:click={() => (showDatePicker = !showDatePicker)}
            >
              {currentData.subtitle}
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
            <span>&gt;</span>
          </button>
        </div>
        <div class="stats-main-value">
          <span class="stats-value">
            {#if isDetailMode && selectedBarIndex >= 0}
              {currentData.data[selectedBarIndex].value}
            {:else if currentView === "daily"}
              {currentData.totalValue || 0}
            {:else}
              {currentData.averageValue}
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
        <div
          class="chart-scroll-wrapper"
          bind:this={chartScrollWrapper}
          on:scroll={syncLabelsScroll}
        >
          <div class="chart-canvas {currentView}-view" bind:this={chartCanvas}>
            <!-- Chart will be rendered here -->
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
            <div class="stat-value">{calculateGoalAchievement()}%</div>
            <div class="stat-label">Goal Achieved</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">schedule</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{getTrackingInfo()}</div>
            <div class="stat-label">Tracked</div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .stats-page {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    height: 100vh;
    background-color: var(--background);
    z-index: 2000;
    overflow: hidden;
    box-shadow: var(--shadow);
  }

  .header {
    background: var(--primary-color);
    color: white;
    padding: var(--spacing-lg);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--shadow);
    flex-shrink: 0;
  }

  .header-content {
    display: grid;
    grid-template-columns: var(--touch-target-min) 1fr var(--touch-target-min);
    align-items: center;
    max-width: 30rem; /* 480px equivalent but fluid */
    margin: 0 auto;
  }

  .header-left {
    display: flex;
    align-items: center;
  }

  .header-center {
    text-align: center;
  }

  .header-center h1 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin: 0;
  }

  .header-right {
    display: flex;
    justify-content: flex-end;
  }

  .back-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: 50%;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
  }

  .back-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .back-button .material-icons {
    font-size: var(--icon-size-lg);
  }

  .stats-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-lg);
    padding-bottom: 5rem; /* 80px converted to rem */
  }

  .stats-view-controls {
    margin-bottom: var(--spacing-xl);
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
    margin-bottom: var(--spacing-2xl);
    box-shadow: var(--shadow);
    border: 1px solid var(--divider);
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
  }

  .stats-summary-card.detail-mode {
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

  .stats-nav-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: var(--font-size-lg);
    font-weight: bold;
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
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
    font-size: var(--font-size-base);
    font-weight: 500;
    color: var(--text-primary);
    cursor: pointer;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--spacing-xs);
    transition: background-color 0.2s ease;
  }

  .stats-period:hover {
    background-color: var(--divider);
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
    margin-bottom: var(--spacing-2xl);
    background-color: var(--surface);
    border-radius: var(--spacing-sm);
    border: 1px solid var(--divider);
    overflow: hidden;
  }

  .chart-scroll-wrapper {
    position: relative;
    height: 16.25rem; /* 260px converted to rem */
    overflow-x: auto;
    overflow-y: hidden;
    padding: var(--spacing-lg);
    scroll-behavior: smooth;
  }

  .chart-canvas {
    position: relative;
    height: 100%;
    display: flex;
    align-items: flex-end;
    gap: 0.125rem; /* 2px converted */
    min-width: 100%;
    padding: 0.125rem var(--spacing-sm) 0 var(--spacing-sm);
  }

  .chart-canvas.daily-view {
    gap: 0.0625rem; /* 1px converted */
  }

  .chart-canvas.monthly-view {
    min-width: 50rem; /* 800px converted */
  }

  .chart-canvas.weekly-view {
    gap: var(--spacing-sm); /* Proper spacing for weekly bars */
  }

  .chart-canvas.yearly-view {
    justify-content: space-between;
    gap: var(--spacing-xs);
  }

  .chart-labels-wrapper {
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-lg);
  }

  .chart-labels-wrapper::-webkit-scrollbar {
    display: none;
  }

  .chart-labels {
    display: flex;
    gap: 0.125rem; /* 2px converted */
    width: 100%;
    padding: 0 var(--spacing-sm);
  }

  .chart-labels::-webkit-scrollbar {
    display: none;
  }

  .chart-labels.daily-view {
    gap: 0.0625rem; /* 1px converted */
    min-width: 100%;
  }

  .chart-labels.weekly-view {
    gap: var(--spacing-sm); /* Match chart canvas gap */
    min-width: 100%;
  }

  .chart-labels.monthly-view {
    min-width: 50rem; /* 800px converted */
    gap: 0.125rem;
  }

  .chart-labels.yearly-view {
    justify-content: space-between;
    gap: 0.0625rem;
    min-width: 100%;
  }

  :global(.chart-bar) {
    flex: 1 1 0;
    min-width: 0;
    background-color: var(--primary-color);
    border-radius: 2px 2px 0 0;
    transition: all 0.2s ease;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    min-height: 4px;
  }

  :global(.chart-bar:hover) {
    opacity: 0.8;
    transform: scaleY(1.05);
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

  :global(.bar-value) {
    font-size: 0.6rem;
    font-weight: 600;
    color: white;
    padding: 2px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  :global(.goal-line) {
    border-top: 2px dashed var(--secondary-color);
    height: 0;
    opacity: 0.8;
  }

  :global(.chart-detail-line) {
    position: absolute;
    top: 0;
    height: 100%;
    width: 3px;
    background-color: var(--secondary-color);
    opacity: 1;
    pointer-events: none;
    z-index: 50;
    box-shadow: 0 0 4px rgba(255, 193, 7, 0.6);
  }

  .chart-label {
    flex: 1 1 0;
    min-width: 0;
    text-align: center;
    font-size: var(--font-size-xs);
    font-weight: 500;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
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

  /* Mobile responsive */
  @media (max-width: 30rem) { /* 480px equivalent */
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
      padding: 0.125rem var(--spacing-xs) 0 var(--spacing-xs);
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
