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
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { calciumState, calciumService } from "$lib/stores/calcium";
  import { DATABASE_METADATA } from "$lib/data/foodDatabase";

  let reportData = null;
  let isLoading = true;

  // Report generation functions
  async function generateReportData() {
    const allData = await getAllJournalData();
    const dates = Object.keys(allData).sort();

    return {
      metadata: {
        generatedAt: new Date().toISOString(),
        reportDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        dailyGoal:
          $calciumState.dailyGoal || $calciumState.settings?.dailyGoal || 1000,
        appVersion: "My Calcium v1.0",
      },
      summary: await generateSummary(allData, dates),
      yearlyChart: await generateYearlyChartData(allData),
      monthlyChart: await generateMonthlyChartData(allData),
      recentActivity: await generateRecentActivity(allData),
    };
  }

  async function getAllJournalData() {
    // Use the IndexedDB method that reads from the new journalEntries store
    return await calciumService.getAllJournalData();
  }

  async function generateSummary(allData, dates) {
    if (dates.length === 0) {
      return {
        totalDaysTracked: 0,
        averageDaily: 0,
        goalPercentage: 0,
        trackingPeriod: "No data available",
      };
    }

    const dailyTotals = dates.map((date) => {
      const foods = allData[date];
      const total = foods.reduce((sum, food) => sum + food.calcium, 0);
      return { date, total };
    });

    const totals = dailyTotals.map((d) => d.total);
    const averageDaily = Math.round(
      totals.reduce((sum, total) => sum + total, 0) / totals.length
    );

    const dailyGoal =
      $calciumState.dailyGoal || $calciumState.settings?.dailyGoal || 1000;
    const daysAtGoal = dailyTotals.filter((d) => d.total >= dailyGoal).length;
    const goalPercentage = Math.round((daysAtGoal / dates.length) * 100);

    return {
      totalDaysTracked: dates.length,
      averageDaily,
      goalPercentage,
      trackingPeriod: `${formatDateForReport(dates[0])} to ${formatDateForReport(dates[dates.length - 1])}`,
    };
  }

  async function generateRecentActivity(allData) {
    const today = new Date();
    // Use local date instead of UTC to avoid timezone issues
    const todayLocal = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const weekData = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(todayLocal);
      date.setDate(date.getDate() - (6 - i));
      const dateStr =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");

      const foods = allData[dateStr] || [];
      const totalCalcium = foods.reduce((sum, food) => sum + food.calcium, 0);
      const dailyGoal =
        $calciumState.dailyGoal || $calciumState.settings?.dailyGoal || 1000;
      const goalMet = totalCalcium >= dailyGoal;

      weekData.push({
        date: formatDateForReport(dateStr),
        dayName: new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
          weekday: "short",
        }),
        totalCalcium,
        goalMet,
      });
    }

    return weekData;
  }

  async function generateYearlyChartData(allData) {
    const today = new Date();
    const yearlyData = [];
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

    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const isFutureMonth = monthDate > today;

      // Get all days in this month that have data
      const monthDays = Object.keys(allData).filter((dateStr) => {
        const date = new Date(dateStr);
        return date.getFullYear() === year && date.getMonth() === month;
      });

      let averageDaily = 0;
      let goalMet = false;

      if (monthDays.length > 0 && !isFutureMonth) {
        const monthTotal = monthDays.reduce((sum, dateStr) => {
          const foods = allData[dateStr];
          return sum + foods.reduce((daySum, food) => daySum + food.calcium, 0);
        }, 0);
        averageDaily = Math.round(monthTotal / monthDays.length);
        const dailyGoal =
          $calciumState.dailyGoal || $calciumState.settings?.dailyGoal || 1000;
        goalMet = averageDaily >= dailyGoal;
      }

      yearlyData.push({
        month: monthNames[month],
        fullMonth: monthDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        }),
        value: averageDaily,
        goalMet,
        isFuture: isFutureMonth,
        daysTracked: monthDays.length,
      });
    }

    return yearlyData;
  }

  async function generateMonthlyChartData(allData) {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 29); // 30 days total including today

    const monthlyData = [];

    // Generate data for last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(thirtyDaysAgo.getDate() + i);

      const dateStr =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");

      const isToday = dateStr === today.toISOString().split("T")[0];
      const isFuture = date > today;

      const foods = allData[dateStr] || [];
      const totalCalcium = foods.reduce((sum, food) => sum + food.calcium, 0);
      const dailyGoal =
        $calciumState.dailyGoal || $calciumState.settings?.dailyGoal || 1000;
      const goalMet = totalCalcium >= dailyGoal;

      monthlyData.push({
        date: dateStr,
        day: date.getDate().toString(),
        fullDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        value: totalCalcium,
        goalMet,
        isToday,
        isFuture,
      });
    }

    const startDate = thirtyDaysAgo.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endDate = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return {
      data: monthlyData,
      monthName: `Last 30 Days (${startDate} - ${endDate})`,
    };
  }

  function formatDateForReport(dateStr) {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getYearlyChartData(yearlyChart, dailyGoal) {
    const dataValues = yearlyChart
      .filter((m) => !m.isFuture && m.daysTracked > 0)
      .map((m) => m.value);
    const maxValue =
      dataValues.length > 0
        ? Math.max(...dataValues, dailyGoal) * 1.2
        : dailyGoal * 1.2;

    const goalLineHeight = (dailyGoal / maxValue) * 100;

    return {
      maxValue,
      goalLineHeight,
      bars: yearlyChart.map((month) => {
        if (month.isFuture || month.daysTracked === 0) {
          return {
            heightPercent: 2,
            barClass: "chart-bar future-bar",
            title: "No data",
          };
        }
        const heightPercent = Math.max((month.value / maxValue) * 100, 2);
        const barClass = month.goalMet ? "chart-bar" : "chart-bar below-goal";
        return {
          heightPercent,
          barClass,
          title: `${month.fullMonth}: ${month.value}mg avg (${month.daysTracked} days)`,
        };
      }),
    };
  }

  function getMonthlyChartData(monthlyChart, dailyGoal) {
    const dataValues = monthlyChart.data
      .filter((d) => !d.isFuture && d.value > 0)
      .map((d) => d.value);
    const maxValue =
      dataValues.length > 0
        ? Math.max(...dataValues, dailyGoal) * 1.2
        : dailyGoal * 1.2;

    const goalLineHeight = (dailyGoal / maxValue) * 100;

    return {
      maxValue,
      goalLineHeight,
      bars: monthlyChart.data.map((day) => {
        if (day.isFuture || day.value === 0) {
          const barClass = day.isFuture
            ? "chart-bar future-bar"
            : "chart-bar no-data-bar";
          return {
            heightPercent: 2,
            barClass,
            title: day.isFuture ? "Future date" : "No data",
          };
        }
        const heightPercent = Math.max((day.value / maxValue) * 100, 2);
        const barClass = day.goalMet ? "chart-bar" : "chart-bar below-goal";
        const todayClass = day.isToday ? " today-bar" : "";
        return {
          heightPercent,
          barClass: barClass + todayClass,
          title: `${day.fullDate}: ${day.value}mg`,
        };
      }),
    };
  }

  function handlePrint() {
    window.print();
  }

  onMount(async () => {
    try {
      reportData = await generateReportData();
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      isLoading = false;
    }

    // No keyboard event listeners needed
  });

  $: yearlyChartData = reportData
    ? getYearlyChartData(reportData.yearlyChart, reportData.metadata.dailyGoal)
    : null;
  $: monthlyChartData = reportData
    ? getMonthlyChartData(
        reportData.monthlyChart,
        reportData.metadata.dailyGoal
      )
    : null;
</script>

<svelte:head>
  <title>Report - My Calcium</title>
</svelte:head>

<div class="report-page">
  <div class="report-content">
    {#if isLoading}
      <div class="loading">
        <div class="loading-spinner">
          <span class="material-icons">hourglass_empty</span>
        </div>
        <p>Generating report...</p>
      </div>
    {:else if reportData}
      <!-- Report Header -->
      <div class="report-header">
        <h2>Calcium Intake Health Report</h2>
        <p class="report-date">Generated: {reportData.metadata.reportDate}</p>
        <p class="daily-goal">
          Daily Goal: {reportData.metadata.dailyGoal}mg calcium
        </p>
      </div>

      {#if reportData.summary.totalDaysTracked === 0}
        <p class="no-data"><em>No tracking data available.</em></p>
      {:else}
        <!-- Summary Statistics -->
        <div class="report-section">
          <h3>Summary Statistics</h3>
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-value">
                {reportData.summary.totalDaysTracked}
              </div>
              <div class="summary-label">Days Tracked</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">
                {reportData.summary.averageDaily}mg
              </div>
              <div class="summary-label">Average Daily</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">
                {reportData.summary.goalPercentage}%
              </div>
              <div class="summary-label">Days at Goal</div>
            </div>
          </div>
          <p class="tracking-period">
            <strong>Tracking Period:</strong>
            {reportData.summary.trackingPeriod}
          </p>
        </div>

        <!-- Yearly Chart -->
        {#if reportData.yearlyChart.filter((m) => m.daysTracked > 0).length > 0}
          <div class="report-section">
            <h3>12-Month Progress Trend</h3>
            <div class="chart-container">
              <div class="chart-canvas yearly-chart">
                <div
                  class="goal-line"
                  style="top: {100 - yearlyChartData.goalLineHeight}%;"
                >
                  <span class="goal-label"
                    >Goal: {reportData.metadata.dailyGoal}mg</span
                  >
                </div>
                {#each yearlyChartData.bars as bar}
                  <div
                    class={bar.barClass}
                    style="height: {bar.heightPercent}%"
                    title={bar.title}
                  ></div>
                {/each}
              </div>
              <div class="chart-labels">
                {#each reportData.yearlyChart as month}
                  <div class="chart-label">{month.month}</div>
                {/each}
              </div>
            </div>
          </div>
        {/if}

        <!-- Monthly Chart -->
        {#if reportData.monthlyChart.data.filter((d) => d.value > 0).length > 0}
          <div class="report-section">
            <h3>{reportData.monthlyChart.monthName} - Daily View</h3>
            <div class="chart-container">
              <div class="chart-canvas monthly-chart">
                <div
                  class="goal-line"
                  style="top: {100 - monthlyChartData.goalLineHeight}%;"
                >
                  <span class="goal-label"
                    >Goal: {reportData.metadata.dailyGoal}mg</span
                  >
                </div>
                {#each monthlyChartData.bars as bar}
                  <div
                    class={bar.barClass}
                    style="height: {bar.heightPercent}%"
                    title={bar.title}
                  ></div>
                {/each}
              </div>
              <div class="chart-labels monthly-labels">
                {#each reportData.monthlyChart.data as day}
                  <div class="chart-label">{day.day}</div>
                {/each}
              </div>
            </div>
          </div>
        {/if}

        <!-- Recent Activity -->
        <div class="report-section">
          <h3>Recent 7 Days Activity</h3>
          <table class="recent-activity-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Calcium</th>
                <th>Goal Status</th>
              </tr>
            </thead>
            <tbody>
              {#each reportData.recentActivity as day}
                <tr>
                  <td>{day.date}</td>
                  <td>{day.dayName}</td>
                  <td>{day.totalCalcium.toFixed(2)}mg</td>
                  <td class={day.goalMet ? "goal-met" : "goal-not-met"}>
                    {day.goalMet ? "✓ Goal Met" : "✗ Below Goal"}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}

      <!-- Report Footer -->
      <div class="report-footer">
        <p><strong>Report generated by My Calcium</strong></p>
        <p>
          This report is intended for sharing with healthcare professionals.
        </p>
        <p>
          Data is self-reported and based on data curated from the following data sources: {DATABASE_METADATA.name}.
        </p>
      </div>
    {:else}
      <p class="error">Error generating report. Please try again.</p>
    {/if}

    <!-- Scroll spacer -->
    <div class="scroll-spacer" aria-hidden="true"></div>
  </div>

  <!-- FAB Container -->
  <div class="fab-container">
    <button class="fab" title="Print Report" on:click={handlePrint}>
      <span class="fab-icon material-icons">print</span>
    </button>
  </div>
</div>

<style>
  .report-page {
    min-height: 100vh;
    background-color: var(--background);
    display: flex;
    flex-direction: column;
  }

  /* Floating Action Button Container */
  .fab-container {
    position: fixed;
    bottom: max(var(--spacing-xl), env(safe-area-inset-bottom));
    right: max(var(--spacing-xl), env(safe-area-inset-right));
    left: max(var(--spacing-xl), env(safe-area-inset-left));
    max-width: 27.5rem; /* 440px equivalent */
    margin: 0 auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    pointer-events: none;
    z-index: 1000;
  }

  .fab-container .fab {
    pointer-events: auto;
    background: var(--primary-color);
    color: white;
    border: none;
    box-shadow: var(--shadow-lg);
    width: 3.5rem; /* 56px equivalent */
    height: 3.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fab-container .fab:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-lg);
  }

  .fab-container .fab .fab-icon {
    font-size: var(--icon-size-lg);
    font-family: "Material Icons";
  }

  .report-content {
    flex: 1;
    max-width: 480px;
    margin: 0 auto;
    padding: 24px 16px;
    width: 100%;
    box-sizing: border-box;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    text-align: center;
  }

  .loading-spinner {
    margin-bottom: 1rem;
    animation: spin 2s linear infinite;
  }

  .loading-spinner .material-icons {
    font-size: 2rem;
    color: var(--primary-color);
  }

  .loading p {
    color: var(--text-secondary);
    margin: 0;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .report-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--border);
  }

  .report-header h2 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  .report-date {
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
  }

  .daily-goal {
    color: var(--primary-color);
    font-weight: 500;
    font-size: 1rem;
    margin: 0;
  }

  .report-section {
    margin-bottom: 1.5rem;
  }

  .report-section h3 {
    color: var(--primary-color, #1976d2);
    margin-bottom: 0.75rem;
    font-size: 1.25rem;
    font-weight: 500;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--primary-color, #1976d2);
    display: block;
    width: 100%;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .summary-card {
    background-color: var(--surface);
    border: 1px solid var(--divider, #e0e0e0);
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    box-shadow: var(--shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .summary-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 0.25rem;
  }

  .summary-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .tracking-period {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin: 0;
  }

  .chart-container {
    margin: 20px 0;
    padding: 20px 15px;
    background: var(--surface);
    border-radius: 12px;
    box-shadow: var(--shadow);
    border: 1px solid var(--divider, #e0e0e0);
  }

  .chart-canvas {
    height: 300px;
    display: flex;
    align-items: flex-end;
    padding: 0;
    position: relative;
    border: 1px solid var(--divider, #e0e0e0);
    border-radius: 8px;
    background: var(--background);
    margin-bottom: 10px;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    gap: 2px;
  }

  .goal-line {
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 1px;
    background: transparent;
    border-top: 2px dashed var(--secondary-color);
    opacity: 0.8;
    z-index: 1;
    pointer-events: none;
  }

  .goal-label {
    position: absolute;
    right: 8px;
    top: -24px;
    font-size: 0.75rem;
    color: var(--secondary-color);
    font-weight: 500;
  }

  .chart-bar {
    flex: 1 1 0;
    min-width: 0;
    background-color: var(--primary-color);
    border-radius: 4px 4px 0 0;
    position: relative;
    transition: all 0.2s ease;
    border: 2px solid transparent;
    z-index: 2;
  }

  .chart-bar.below-goal {
    background-color: var(--error-color);
  }

  .chart-bar.future-bar {
    background-color: var(--divider);
    opacity: 0.3;
  }

  .chart-bar.no-data-bar {
    background-color: var(--divider);
    opacity: 0.5;
  }

  .chart-bar.today-bar {
    box-shadow: 0 0 0 2px var(--secondary-color);
    position: relative;
  }

  .chart-bar.today-bar::after {
    content: "";
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background-color: var(--secondary-color);
    border-radius: 50%;
  }

  .chart-labels {
    display: flex;
    gap: 2px;
    padding: 0;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    overscroll-behavior-x: contain;
    width: 100%;
  }

  .chart-labels::-webkit-scrollbar {
    display: none;
  }

  .chart-label {
    flex: 1 1 0;
    min-width: 0;
    text-align: center;
    font-size: 9px;
    color: var(--text-secondary);
    white-space: nowrap;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    font-weight: 500;
  }

  .yearly-chart .chart-label {
    font-size: 12px;
    height: 50px;
  }

  .monthly-labels .chart-label {
    font-size: 9px;
    height: 40px;
  }

  .recent-activity-table {
    width: 100%;
    border-collapse: collapse;
    background-color: var(--surface);
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--divider, #e0e0e0);
    margin-bottom: 0.5rem;
  }

  .recent-activity-table th,
  .recent-activity-table td {
    padding: 8px 6px;
    text-align: left;
    border-bottom: 1px solid var(--divider, #e0e0e0);
  }

  .recent-activity-table th {
    background-color: var(--surface-variant);
    color: var(--text-primary);
    font-weight: 500;
    font-size: 0.8rem;
  }

  .recent-activity-table td {
    color: var(--text-primary);
    font-size: 0.8rem;
  }

  .recent-activity-table tr:last-child td {
    border-bottom: none;
  }

  .goal-met {
    color: var(--primary-color, #1976d2) !important;
    font-weight: 500;
  }

  .goal-not-met {
    color: var(--error-color, #f44336) !important;
    font-weight: 500;
  }

  .report-footer {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--divider, #e0e0e0);
    text-align: center;
  }

  .report-footer p {
    color: var(--text-secondary);
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
    line-height: 1.2;
  }

  .no-data {
    text-align: center;
    color: var(--text-secondary);
    font-style: italic;
    padding: 2rem;
  }

  .error {
    text-align: center;
    color: var(--error-color);
    padding: 2rem;
  }

  .scroll-spacer {
    height: 80px;
  }

  /* Mobile responsive */
  @media (max-width: 480px) {
    .report-content {
      padding: 16px 12px;
    }

    .summary-grid {
      grid-template-columns: 1fr;
    }

    .recent-activity-table th,
    .recent-activity-table td {
      padding: 8px 4px;
      font-size: 0.8rem;
    }

    .fab-container {
      bottom: max(var(--spacing-md), env(safe-area-inset-bottom));
      right: max(var(--spacing-xl), env(safe-area-inset-right));
      left: max(var(--spacing-xl), env(safe-area-inset-left));
      max-width: 100%;
      padding: 0 var(--spacing-sm);
    }

    .fab-container .fab .fab-icon {
      font-size: var(--icon-size-lg);
    }
  }

  /* Print styles */
  @media print {
    /* Hide header and navigation when printing */
    :global(.app-container > header),
    :global(.app-container .header),
    :global(header) {
      display: none !important;
    }

    .fab-container {
      display: none !important;
    }

    .report-content {
      max-width: none;
      padding: 0;
    }

    .chart-container {
      page-break-inside: avoid;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .chart-canvas {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      background: white !important;
      border: 1px solid #000 !important;
    }

    .chart-bar {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      background-color: #1976d2 !important;
    }

    .chart-bar.below-goal {
      background-color: #f44336 !important;
    }

    .chart-bar.future-bar,
    .chart-bar.no-data-bar {
      background-color: #e0e0e0 !important;
    }

    .goal-line {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      border-top: 2px dashed #ffc107 !important;
    }

    .report-section {
      page-break-inside: avoid;
    }

    .report-section h3 {
      color: #1976d2 !important;
      border-bottom: 2px solid #1976d2 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .recent-activity-table {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      border-collapse: collapse !important;
      width: 100% !important;
      margin: 20px 0 !important;
      border: none !important;
    }

    .recent-activity-table th,
    .recent-activity-table td {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      padding: 6px 4px !important;
      text-align: left !important;
      border: none !important;
      border-bottom: 1px solid #e0e0e0 !important;
      font-size: 0.75rem !important;
      line-height: 1.2 !important;
    }

    .recent-activity-table th {
      background-color: transparent !important;
      font-weight: bold !important;
      color: #333 !important;
      border-bottom: 2px solid #ccc !important;
    }

    .recent-activity-table tr:last-child td {
      border-bottom: none !important;
    }

    .goal-met {
      color: #1976d2 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .goal-not-met {
      color: #f44336 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .scroll-spacer {
      display: none;
    }
  }

  /* Force light theme for print regardless of current theme */
  @media print {
    /* Reset to light theme variables for print */
    :root,
    :global([data-theme="dark"]) {
      --background: #ffffff !important;
      --surface: #ffffff !important;
      --surface-variant: #f0f0f0 !important;
      --text-primary: #212121 !important;
      --text-secondary: #757575 !important;
      --text-hint: #9e9e9e !important;
      --divider: #e0e0e0 !important;
      --primary-color: #1976d2 !important;
      --error-color: #f44336 !important;
      --secondary-color: #ffc107 !important;
    }

    /* Ensure all text renders in dark for print */
    * {
      color: #000 !important;
      background-color: transparent !important;
    }

    /* Re-apply specific colors for important elements */
    .report-header h2,
    .report-section h3 {
      color: #1976d2 !important;
    }

    .summary-value {
      color: #1976d2 !important;
    }

    .report-date,
    .daily-goal,
    .summary-label,
    .tracking-period,
    .report-footer p {
      color: #666 !important;
    }

    .goal-met {
      color: #1976d2 !important;
    }

    .goal-not-met {
      color: #f44336 !important;
    }

    /* Ensure white background for all containers */
    .report-page,
    .report-content,
    .summary-card,
    .chart-container {
      background-color: #ffffff !important;
    }
  }
</style>
