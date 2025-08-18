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

<svelte:head>
  <title>User Guide - My Calcium</title>
</svelte:head>

<div class="guide-container">
  <div class="guide-section">
    <h2>Introduction</h2>
    <p>
      Welcome to My Calcium! This guide will help you get the most out of the
      app.
    </p>
  </div>

  <div class="guide-section">
    <h2>Tracking Foods</h2>
    <p>
      To track your calcium intake, tap the circular "+" button on the main
      screen. You can search the food database or add your own custom foods.
    </p>
    <p><em>(More content will go here...)</em></p>
  </div>

  <div class="guide-section">
    <h2>Syncing Between Devices</h2>
    <p>
      You can sync your data across multiple devices. To get started, go to <strong
        >Settings > Data > Sync</strong
      >.
    </p>
    <p><em>(More content will go here...)</em></p>
  </div>
</div>

<style>
  .guide-container {
    padding: var(--spacing-xl);
  }

  .guide-section {
    margin-bottom: var(--spacing-2xl);
  }

  h2 {
    color: var(--text-primary);
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-sm);
  }

  p {
    color: var(--text-secondary);
    line-height: 1.6;
  }
</style>
