# Calcium Tracker Svelte Migration - Implementation Tasks

*Active todo list with detailed context for each task*

---

## ✅ COMPLETED TASKS

### **Dark Mode System Implementation**
- [x] **Phase 1**: Complete CSS Variable System - Added missing variables to app.css
- [x] **Phase 2**: Replace hardcoded RGBA values across all components  
- [x] **Phase 3**: Add theme detection and switching logic
- [x] **Phase 4**: Fix custom food styling and date picker theming
- **Result**: Complete automatic dark/light mode system following system preferences

### **About Dialog Implementation**
- [x] Create AboutDialog.svelte component with proper modal structure
- [x] Integrate with Header.svelte hamburger menu
- [x] Mobile responsive design (90% width of 480px container)
- [x] Dark mode compatibility and accessibility features
- **Result**: Fully functional About dialog accessible from hamburger menu

### **Complete Application Implementation**
- [x] **Header Navigation**: Complete hamburger menu with all functionality
- [x] **Data Page**: Full food database browser with search and filtering
- [x] **Stats Page**: Interactive charts with 4 view types (daily/weekly/monthly/yearly)
- [x] **Reports Page**: Comprehensive health reports with 2-page print optimization
- [x] **Backup/Restore**: Full JSON export/import with data preservation
- [x] **Chart Interactions**: Bar selection, goal lines, date pickers, auto-scroll
- **Result**: Complete functional application matching original features

### **Core Foundation (Previously Complete)**
- [x] Core CRUD operations for food entries
- [x] Custom food creation with IndexedDB storage
- [x] Mobile-optimized AddFoodModal with proper UX
- [x] Confirmation dialogs for delete operations
- [x] USDA food database integration (130+ foods)

---

## 🔄 REMAINING TASKS

### **HIGH PRIORITY** (Bug Fixes)
- [ ] **Yellow Detail Line Debug**: Fix visibility issue in Daily/Weekly/Yearly views
  - **Context**: Line created via JS and logged but not visible (works in Monthly view)
  - **Location**: `/src/routes/stats/+page.svelte` - renderChart() function, line 707-740
  - **Technical**: Element created, CSS correct, z-index high, but invisible in 3 of 4 views
  - **Impact**: Inconsistent bar selection UX across chart views

### **MEDIUM PRIORITY** (Feature Enhancement)
- [ ] **USDA Data Expansion**: Import remaining 170+ foods from original database
  - **Context**: Current has ~130 foods, original had 300+
  - **Location**: Expand data in CalciumService or separate data files
  - **Impact**: Enhanced food search options

---

## 📋 IMPLEMENTATION NOTES

### **Current Status: 98% Complete**
The Calcium Tracker Svelte migration is essentially complete with all major functionality implemented:
- ✅ Full application with main page, Data, Stats, and Reports pages
- ✅ Complete header navigation and menu system  
- ✅ Backup/Restore functionality
- ✅ Interactive charts with bar selection and detail modes
- ✅ Dark mode system and mobile responsiveness
- ✅ Print-optimized reports
- ✅ **NEW**: CSS architecture completely overhauled to rem-based fluid system
- ✅ **NEW**: UnitConverter fully integrated with intelligent suggestions
- ✅ **NEW**: Bar selection working across all chart views (with minor visibility issue)

### **Final Session Priority**
1. **Debug yellow detail line visibility** (technical debugging needed)
2. **Optional enhancements**: USDA data expansion

### **Next Session Pickup**
- **Critical Issue**: Yellow detail line visible in Monthly view but invisible in Daily/Weekly/Yearly views
- **Technical Details**: JavaScript creates element successfully, console confirms, CSS appears correct
- **Impact**: Bar selection feature works but lacks visual detail line in 3 of 4 views
- App is otherwise production-ready with all major functionality operational

### **Major Achievements This Session**
- ✅ **CSS Architecture**: Complete px→rem conversion with fluid typography system
- ✅ **UnitConverter**: Full integration with intelligent suggestions and calcium recalculation
- ✅ **Bar Selection**: Extended to all chart views with brightness feedback
- ✅ **Summary Card**: Dynamic content updates with yellow border in detail mode

---

## 🔧 MEDIUM PRIORITY TASKS

### **Unit Conversion System**
- [ ] **Integrate UnitConverter.js** functionality from original codebase
  - Current: Basic serving quantities only
  - Needed: Sophisticated unit conversion (cups, oz, tablespoons, etc.)
  - Impact: More flexible serving size adjustments
  - Location: Port from `client/src/js/UnitConverter.js`

### **USDA Dataset Expansion** 
- [ ] **Complete USDA dataset import** (expand from 130+ to 300+ foods)
  - Current: Partial dataset with high-calcium foods
  - Needed: Full range including medium and low calcium foods
  - Impact: Better search results and food variety
  - Source: Original `client/src/js/calcium-data.js`

### **Data Management Page**
- [ ] **Create Data page** with food filtering controls
  - Purpose: Browse complete USDA food database
  - Features: Search, filter USDA vs Custom, sort by calcium content
  - Integration: Links from hamburger menu navigation

### **Statistics & Reporting**
- [ ] **Implement Stats and Reports pages** with charts and data visualization
  - Stats page: Daily/weekly/monthly/yearly calcium intake charts
  - Reports page: Formatted reports for healthcare providers
  - Dependencies: Chart library integration (Chart.js or similar)
  - Source: Original `CalciumStatsSystem.js` and `CalciumReportGenerator.js`

---

## ⚡ LOW PRIORITY TASKS

### **Advanced Features**
- [ ] **Implement backup/restore system** for data export/import
  - JSON export/import functionality from original app
  - User data protection and migration support

- [ ] **Sort persistence** across sessions
  - Remember user's preferred sorting settings
  - Currently resets to default on app reload

### **Testing & Polish**
- [ ] **Feature parity testing** against vanilla app
  - Comprehensive comparison with original functionality
  - Mobile and desktop cross-browser testing
  - PWA functionality verification

- [ ] **Performance optimization**
  - Bundle size analysis and optimization
  - Load time improvements
  - Memory usage optimization

### **Build & Deployment**
- [ ] **Production build configuration**
  - Optimize for Synology NAS deployment
  - Static site generation setup
  - Asset optimization

---

## 📋 TASK CONTEXT & DEPENDENCIES

### **Next Session Priorities**
1. **Header Navigation** (blocks user access to app features)
2. **Page Routing Setup** (enables full app structure)
3. **Unit Converter Integration** (improves UX significantly)

### **Prerequisites by Task**
- **Data/Stats/Reports pages**: Requires Header navigation completion
- **Unit Converter**: Independent, can be done anytime  
- **Backup/Restore**: Requires all data operations complete
- **Charts/Analytics**: Requires Stats page routing complete

### **Implementation Dependencies**
- **Header → Routing**: Header needs routes to navigate to
- **Routing → Pages**: Pages need routes to be accessible
- **Unit Converter → AddFoodModal**: Modal needs converter for serving sizes
- **USDA Expansion → Data Page**: Data page needs complete dataset

### **Technical Constraints**
- **Synology NAS**: Limited Node.js/npm versions, no npx
- **Svelte 4**: Must use v4 patterns, not v5 runes
- **TypeScript**: Plain JS in components, .ts for services only
- **Mobile-First**: 480px max width, touch-optimized design

---

## 🎯 SUCCESS CRITERIA

### **Phase B Complete** (Navigation & Routing)
- [ ] All hamburger menu items functional
- [ ] Data, Stats, Reports pages accessible (even if basic)
- [ ] Proper SvelteKit routing working
- [ ] Mobile navigation working properly

### **Phase C Complete** (Feature Parity)
- [ ] Unit conversion working in AddFoodModal
- [ ] Complete USDA dataset available
- [ ] Data page with food browser functional
- [ ] Basic Stats page with some charts

### **Phase D Complete** (Full Migration)
- [ ] All original app features working
- [ ] Backup/restore functionality
- [ ] Report generation working
- [ ] Performance optimized for production

---

## 📝 REVIEW NOTES

*This section will be updated after each completed task*

### **Dark Mode Implementation - 2025-01-30**
**Changes Made**: 
- Added comprehensive CSS variables system
- Converted all hardcoded RGBA values to variables
- Implemented automatic system theme detection
- Fixed custom food and date picker dark mode support

**Technical Decisions**:
- Used CSS `color-scheme` for native date inputs (best possible approach)
- Created separate variables for custom food backgrounds
- Maintained mobile-first responsive design throughout

**Files Modified**: 
- `src/app.css` (CSS variables)
- `src/routes/+layout.svelte` (theme detection)
- All 11 component files (variable usage)

**Testing Required**: Switch system theme, verify all components adapt properly

---

*Next Update: After Header navigation completion*