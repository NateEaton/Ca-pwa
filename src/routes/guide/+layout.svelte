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
  import "../../app.css";
</script>

<div class="app-container">
  <slot />
</div>

<style>
  .app-container {
    max-width: 480px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--surface);
    position: relative;
    box-shadow: var(--shadow);
  }

  @media (max-width: 480px) {
    .app-container {
      max-width: 100%;
      box-shadow: none;
    }
  }
</style>