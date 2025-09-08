#!/usr/bin/env node

/**
 * html-docs-generator.cjs
 *
 * **Complete HTML Documentation Generator**
 * Generates HTML documentation from curated food database.
 * Uses external CSS file, relies on curator output for normalized names.
 */

const fs = require("fs");
const path = require("path");

// --- Argument Parsing ---
const args = process.argv.slice(2);
const fileArgs = [];

// Validate arguments and reject any flags
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith("--") || arg.startsWith("-")) {
    console.error(`❌ Error: Unknown parameter '${arg}'`);
    console.error(`This script does not accept any flags or parameters`);
    console.error(`Usage: node html-docs-generator.cjs <curated-abridged.json> [output.html]`);
    process.exit(1);
  } else {
    fileArgs.push(arg);
  }
}

const inputFile = fileArgs[0];
const outputFile = fileArgs[1] || path.join("static", "database-docs.html");

if (!inputFile) {
  console.error(
    "Usage: node html-docs-generator.cjs <curated-abridged.json> [output.html]"
  );
  console.error(
    "  Example: node html-docs-generator.cjs curated-data-abridged.json static/database-docs.html"
  );
  process.exit(1);
}

// --- Utility Functions ---

function loadInputData(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Input file not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`📖 Loading: ${filePath}`);
  const rawData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (rawData.metadata && rawData.foods) {
    console.log(
      `📋 Found metadata: ${rawData.metadata.name || "Unknown source"}`
    );
    return { metadata: rawData.metadata, foods: rawData.foods };
  } else if (Array.isArray(rawData)) {
    console.log(`⚠️  Legacy format detected - no metadata available`);
    return { metadata: null, foods: rawData };
  } else {
    console.error(
      `❌ Invalid input format - expected {metadata, foods} or array`
    );
    process.exit(1);
  }
}

function generateFdcLink(sourceId) {
  if (!sourceId) return "";
  return `https://fdc.nal.usda.gov/fdc-app.html#/food-details/${sourceId}/nutrients`;
}

function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function generateFoodRows(food) {
  let html = "";

  // Use appName if available (from enhanced curator), fallback to original name
  const appDisplayName = food.appName || food.name;
  const originalName = food.name.replace(/\*$/, ""); // Remove asterisk if present
  const hasCollapsed = food.collapsedFrom && food.collapsedFrom.length > 0;
  
  // Check if display name already has asterisk to avoid duplicates
  const displayNameHasAsterisk = appDisplayName.endsWith('*');
  const cleanDisplayName = displayNameHasAsterisk ? appDisplayName.slice(0, -1) : appDisplayName;

  // Handle both new measures array format and legacy single measure format
  let measures = [];
  if (food.measures && Array.isArray(food.measures)) {
    // New multi-measure format
    measures = food.measures;
  } else {
    // Legacy single measure format
    measures = [{
      measure: food.measure || "",
      calcium: parseFloat(food.calcium || 0)
    }];
  }

  // Generate rows for each measure
  measures.forEach((measureData, index) => {
    const isFirstMeasure = index === 0;
    const hasMultipleMeasures = measures.length > 1;
    const measureRowspan = isFirstMeasure ? measures.length : 0;
    
    html += `          <tr class="included-row${isFirstMeasure ? '' : ' measure-continuation'}" id="${isFirstMeasure ? `food-${food.appId}` : ''}" data-app-name="${escapeHtml(
      cleanDisplayName.toLowerCase()
    )}" data-original-name="${escapeHtml(originalName.toLowerCase())}">\n`;
    
    // App ID column - only show on first measure row
    if (isFirstMeasure) {
      html += `            <td class="app-id" rowspan="${measureRowspan}">${food.appId}</td>\n`;
    }
    
    // App Name column - only show on first measure row  
    if (isFirstMeasure) {
      html += `            <td class="app-name" rowspan="${measureRowspan}">
              ${escapeHtml(cleanDisplayName)}${
        hasCollapsed ? '<span class="group-indicator">*</span>' : ""
      }
            </td>\n`;
    }
    
    // Original Name column - only show on first measure row
    if (isFirstMeasure) {
      html += `            <td class="original-name" rowspan="${measureRowspan}">${escapeHtml(originalName)}</td>\n`;
    }
    
    // Calcium and Measure columns - show for each measure
    html += `            <td class="calcium">${measureData.calcium} mg</td>\n`;
    html += `            <td class="measure">${escapeHtml(measureData.measure)}</td>\n`;
    
    // Calcium per 100g column - only show on first measure row
    if (isFirstMeasure) {
      html += `            <td class="calcium-per-100g" rowspan="${measureRowspan}">${
        food.calciumPer100g !== null && food.calciumPer100g !== undefined
          ? food.calciumPer100g + " mg"
          : "N/A"
      }</td>\n`;
    }
    
    // Source info column - only show on first measure row
    if (isFirstMeasure) {
      html += `            <td class="source-info" rowspan="${measureRowspan}">
              <span class="subset-badge">${escapeHtml(
                food.subset || "N/A"
              )}</span>
              <a href="${generateFdcLink(
                food.sourceId
              )}" target="_blank" class="source-link">${
        food.sourceId || "N/A"
      }</a>
            </td>\n`;
    }
    
    html += `          </tr>\n`;
  });

  // Collapsed food rows
  if (hasCollapsed) {
    for (const collapsed of food.collapsedFrom) {
      // Handle both new measures array format and legacy single measure format for collapsed foods
      let collapsedMeasures = [];
      if (collapsed.measures && Array.isArray(collapsed.measures)) {
        // New multi-measure format
        collapsedMeasures = collapsed.measures;
      } else {
        // Legacy single measure format
        collapsedMeasures = [{
          measure: collapsed.measure || "",
          calcium: parseFloat(collapsed.calcium || 0)
        }];
      }

      // Display all measures for collapsed food (similar to main food handling)
      collapsedMeasures.forEach((measureData, index) => {
        const isFirstMeasure = index === 0;
        const hasMultipleMeasures = collapsedMeasures.length > 1;
        const measureRowspan = isFirstMeasure ? collapsedMeasures.length : 0;
        
        html += `          <tr class="collapsed-row${isFirstMeasure ? '' : ' measure-continuation'}" data-original-name="${escapeHtml(
          collapsed.name.toLowerCase()
        )}">\n`;
        
        // Collapsed connector - only show on first measure row
        if (isFirstMeasure) {
          html += `            <td class="collapsed-connector" rowspan="${measureRowspan}">
              <div class="tree-line"></div>
            </td>\n`;
        }
        
        html += `            <td></td>\n`; // Empty column
        
        // Collapsed name - only show on first measure row
        if (isFirstMeasure) {
          html += `            <td class="collapsed-name" rowspan="${measureRowspan}">${escapeHtml(collapsed.name)}</td>\n`;
        }
        
        // Calcium and Measure columns - show for each measure
        html += `            <td class="collapsed-calcium">${measureData.calcium} mg</td>\n`;
        html += `            <td class="collapsed-measure">${escapeHtml(measureData.measure)}</td>\n`;
        
        // Calcium per 100g - only show on first measure row
        if (isFirstMeasure) {
          html += `            <td class="collapsed-calcium-per-100g" rowspan="${measureRowspan}">${
            collapsed.calciumPer100g !== null && collapsed.calciumPer100g !== undefined
              ? collapsed.calciumPer100g + " mg"
              : "N/A"
          }</td>\n`;
        }
        
        // Source info - only show on first measure row
        if (isFirstMeasure) {
          html += `            <td class="source-info" rowspan="${measureRowspan}">
              <span class="subset-badge">${escapeHtml(
                collapsed.subset || food.subset || "N/A"
              )}</span>
              <a href="${generateFdcLink(
                collapsed.sourceId
              )}" target="_blank" class="source-link">${
            collapsed.sourceId || "N/A"
          }</a>
            </td>\n`;
        }
        
        html += `          </tr>\n`;
      });
    }
  }

  return html;
}

function generateSourceSection(metadata) {
  if (!metadata) {
    return `
      <section class="source-info-section">
        <h3>Source Information</h3>
        <p>No metadata available for this dataset.</p>
      </section>`;
  }

  const sourceLinks = metadata.sourceUrls
    ? metadata.sourceUrls
        .map(
          (source) =>
            `<a href="${
              source.url
            }" target="_blank" class="source-link">${escapeHtml(
              source.name
            )}</a>`
        )
        .join(" • ")
    : "No source URLs available";

  return `
      <section class="source-info-section">
        <h3>Source Information</h3>
        <div class="metadata-grid">
          <div class="metadata-item">
            <span class="metadata-label">Database Name</span>
            <span class="metadata-value">${escapeHtml(
              metadata.name || "Unknown"
            )}</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">Version</span>
            <span class="metadata-value">${escapeHtml(
              metadata.version || "Unknown"
            )}</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">Last Updated</span>
            <span class="metadata-value">${escapeHtml(
              metadata.created || "Unknown"
            )}</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">Author</span>
            <span class="metadata-value">${escapeHtml(
              metadata.author || "Unknown"
            )}</span>
          </div>
        </div>
        
        <div class="description-section">
          <span class="metadata-label">Description</span>
          <p class="metadata-description">${escapeHtml(
            metadata.description || "No description available"
          )}</p>
        </div>
        
        <div class="source-links-section">
          <span class="metadata-label">Original Sources</span>
          <div class="source-links">${sourceLinks}</div>
        </div>
        
        ${
          metadata.notes
            ? `
        <div class="notes-section">
          <span class="metadata-label">Processing Notes</span>
          <div class="processing-notes">
            <div class="notes-preview" id="notes-preview">
              ${escapeHtml(metadata.notes.split('. ').slice(0, 2).join('. ') + '.')}
            </div>
            <div class="notes-full" id="notes-full" style="display: none;">
              ${escapeHtml(metadata.notes).replace(/\n/g, '<br>')}
            </div>
            <button class="toggle-notes-btn" id="toggle-notes" onclick="toggleNotes()">Read more</button>
          </div>
        </div>`
            : ""
        }
      </section>`;
}

function generateHtmlDocument(bodyContent, totalRows, generatedDate, metadata) {
  const sourceSection = generateSourceSection(metadata);

  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Food Database Documentation - Calcium Tracker</title>
  <link rel="stylesheet" href="database-docs.css">
</head>
<body>
  <div class="page-container">
    <header class="header">
      <h1>Food Database Documentation</h1>
      <p>Complete transparency into your calcium tracking database</p>
      <button class="theme-toggle" onclick="toggleTheme()">🌙 Dark Mode</button>
    </header>

    <div class="search-section">
      <div class="search-container">
        <input 
          type="text" 
          id="searchInput"
          class="search-input" 
          placeholder="Search foods, sources, or calcium values..."
          autocomplete="off"
        >
        <button class="search-clear" id="searchClear" onclick="clearSearch()">✕</button>
      </div>
      <div class="search-results-count" id="resultsCount"></div>
    </div>

    ${sourceSection}

    <section class="explanation-section">
      <h4>Understanding This Documentation</h4>
      <div class="explanation-grid">
        <div class="explanation-item">
          <h5>Representative Foods</h5>
          <p>Foods shown with <span style="color: var(--secondary); font-weight: 600;">*</span> represent groups of nutritionally similar foods. All foods in a group have identical calcium values.</p>
        </div>
        <div class="explanation-item">
          <h5>Multiple Serving Sizes</h5>
          <p>Foods marked with "(multiple servings)" show all available serving size options from the USDA source data, displayed as multiple rows with different calcium values per serving.</p>
        </div>
        <div class="explanation-item">
          <h5>Collapsed Foods</h5>
          <p>Indented foods with tree connectors show which items were grouped under representative foods to simplify the database while maintaining accuracy.</p>
        </div>
        <div class="explanation-item">
          <h5>Filtered Foods</h5>
          <p>Some foods from the original USDA source were filtered to optimize app size. Missing foods can be added as custom entries or by creating your own curated database.</p>
        </div>
      </div>
    </section>

    <section class="stats-section">
      <div class="stats-info">
        <div class="stat-item">
          <span class="stat-number" id="totalFoods">0</span>
          <span class="stat-label">Foods Available</span>
        </div>
        <div class="stat-item">
          <span class="stat-number" id="collapsedFoods">0</span>
          <span class="stat-label">Foods Grouped</span>
        </div>
        <div class="stat-item">
          <span class="stat-number" id="totalEntries">${totalRows.toLocaleString()}</span>
          <span class="stat-label">Total Entries</span>
        </div>
      </div>
      <div class="generated-info">
        Generated: ${generatedDate}
      </div>
    </section>

    <div class="table-container">
      <table id="foodTable">
        <thead>
          <tr>
            <th>App ID</th>
            <th>Name (in app)</th>
            <th>Original Source Name</th>
            <th>Calcium</th>
            <th>Serving Size</th>
            <th>Ca per 100g</th>
            <th>Source & ID</th>
          </tr>
        </thead>
        <tbody>
${bodyContent}
        </tbody>
      </table>
    </div>
  </div>

  <script>
    // Search functionality
    let searchInput = document.getElementById('searchInput');
    let searchClear = document.getElementById('searchClear');
    let resultsCount = document.getElementById('resultsCount');
    let table = document.getElementById('foodTable');
    let allRows = Array.from(table.querySelectorAll('tbody tr'));
    let totalFoodsSpan = document.getElementById('totalFoods');
    let collapsedFoodsSpan = document.getElementById('collapsedFoods');

    // Calculate and display statistics
    let includedFoods = allRows.filter(row => row.classList.contains('included-row')).length;
    let collapsedFoods = allRows.filter(row => row.classList.contains('collapsed-row')).length;
    totalFoodsSpan.textContent = includedFoods.toLocaleString();
    collapsedFoodsSpan.textContent = collapsedFoods.toLocaleString();

    // Search input handlers
    searchInput.addEventListener('input', function(e) {
      let query = e.target.value.trim().toLowerCase();
      
      if (query.length === 0) {
        showAllRows();
        searchClear.style.display = 'none';
        resultsCount.textContent = '';
        return;
      }
      
      searchClear.style.display = 'block';
      filterRows(query);
    });

    function filterRows(query) {
      let visibleGroups = new Set();
      
      // First pass: find all matching rows
      allRows.forEach(row => {
        let matches = false;
        let appName = row.dataset.appName || '';
        let originalName = row.dataset.originalName || '';
        let cellText = Array.from(row.cells).map(cell => cell.textContent.toLowerCase()).join(' ');
        
        if (appName.includes(query) || originalName.includes(query) || cellText.includes(query)) {
          matches = true;
          
          // Mark groups for visibility
          if (row.classList.contains('collapsed-row')) {
            let parentRow = row.previousElementSibling;
            while (parentRow && !parentRow.classList.contains('included-row')) {
              parentRow = parentRow.previousElementSibling;
            }
            if (parentRow && parentRow.id) {
              visibleGroups.add(parentRow.id);
            }
          } else if (row.classList.contains('included-row')) {
            visibleGroups.add(row.id);
          }
        }
      });
      
      // Second pass: apply visibility with group hierarchy
      allRows.forEach(row => {
        let shouldShow = false;
        
        if (row.classList.contains('included-row')) {
          shouldShow = visibleGroups.has(row.id);
        } else if (row.classList.contains('collapsed-row')) {
          let parentRow = row.previousElementSibling;
          while (parentRow && !parentRow.classList.contains('included-row')) {
            parentRow = parentRow.previousElementSibling;
          }
          shouldShow = parentRow && visibleGroups.has(parentRow.id);
        }
        
        row.classList.toggle('hidden', !shouldShow);
      });
      
      // Update results count
      let finalVisible = allRows.filter(row => !row.classList.contains('hidden')).length;
      resultsCount.textContent = finalVisible > 0 ? 
        \`Showing \${finalVisible.toLocaleString()} of \${allRows.length.toLocaleString()} entries\` : 
        'No matching entries found';
    }

    function showAllRows() {
      allRows.forEach(row => row.classList.remove('hidden'));
    }

    function clearSearch() {
      searchInput.value = '';
      showAllRows();
      searchClear.style.display = 'none';
      resultsCount.textContent = '';
      searchInput.focus();
    }

    // Theme toggle functionality
    function toggleTheme() {
      let currentTheme = document.documentElement.getAttribute('data-theme');
      let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      
      let button = document.querySelector('.theme-toggle');
      button.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
      
      localStorage.setItem('docs_theme', newTheme);
    }

    // Initialize theme from localStorage
    function initializeTheme() {
      let savedTheme = localStorage.getItem('docs_theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        let button = document.querySelector('.theme-toggle');
        button.textContent = savedTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
      }
    }

    // Toggle notes expansion
    function toggleNotes() {
      let preview = document.getElementById('notes-preview');
      let full = document.getElementById('notes-full');
      let button = document.getElementById('toggle-notes');
      
      if (full.style.display === 'none') {
        preview.style.display = 'none';
        full.style.display = 'block';
        button.textContent = 'Show less';
      } else {
        preview.style.display = 'block';
        full.style.display = 'none';
        button.textContent = 'Read more';
      }
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', initializeTheme);
    searchInput.focus();
  </script>
</body>
</html>`;
}

// --- Main Processing ---
async function main() {
  console.log(`🚀 HTML Documentation Generator - Starting...`);

  const inputData = loadInputData(inputFile);
  const { metadata, foods } = inputData;

  console.log(`📊 Processing ${foods.length} foods for documentation...`);

  // Sort foods by appId
  foods.sort((a, b) => a.appId - b.appId);

  // Generate HTML content
  console.log(`🔨 Generating HTML documentation...`);
  let bodyContent = "";
  let totalRows = 0;

  for (const food of foods) {
    bodyContent += generateFoodRows(food);
    totalRows += 1;
    if (food.collapsedFrom && food.collapsedFrom.length > 0) {
      totalRows += food.collapsedFrom.length;
    }
  }

  const generatedDate = new Date().toISOString().split("T")[0];
  const htmlDocument = generateHtmlDocument(
    bodyContent,
    totalRows,
    generatedDate,
    metadata
  );

  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created directory: ${outputDir}`);
  }

  // Write HTML file
  fs.writeFileSync(outputFile, htmlDocument, "utf8");

  // Calculate statistics
  const includedFoods = foods.length;
  const collapsedFoods = foods.reduce((total, food) => {
    return total + (food.collapsedFrom ? food.collapsedFrom.length : 0);
  }, 0);
  const fileSize = (fs.statSync(outputFile).size / 1024).toFixed(1);

  // Log completion
  console.log(`✅ Documentation generated: ${outputFile}`);
  console.log(`📄 File size: ${fileSize} KB`);
  console.log(`📊 Statistics:`);
  console.log(`   • ${includedFoods} foods included in app`);
  console.log(`   • ${collapsedFoods} foods collapsed under representatives`);
  console.log(`   • ${totalRows} total entries documented`);
  if (metadata) {
    console.log(`📋 Source: ${metadata.name || "Unknown"}`);
  }
  console.log(`🔗 Deep-linking available via #food-{appId} anchors`);
  console.log(`💡 Note: Requires database-docs.css in same directory`);
  console.log(`🎉 HTML documentation generation complete!`);
}

// --- CLI Execution ---
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Error:", error.message);
    process.exit(1);
  });
}
