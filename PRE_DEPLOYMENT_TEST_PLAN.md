# Pre-Deployment Test Plan
**Version:** 1.0
**Last Updated:** November 20, 2025

## Quick Test Suite (15-20 minutes)

### Test Environment Setup
- [ ] PWA deployed to dev environment
- [ ] Worker deployed to dev environment (if testing sync)
- [ ] Two devices available for sync testing (optional)

---

## Core Functionality Tests

### 1. Food Tracking (5 minutes)
**Goal:** Verify core tracking functionality works after console.log removal

- [ ] **Add Database Food**
  - Click + button on main screen
  - Search for "milk"
  - Select a food item
  - Adjust serving size
  - Click "Add Entry"
  - ✅ Entry appears on main screen with correct calcium value

- [ ] **Add Custom Food**
  - Click + button
  - Click add_circle icon (custom food mode)
  - Enter name: "Test Food"
  - Enter calcium: 250mg
  - Enter serving: "1 cup"
  - Click "Add Entry"
  - ✅ Custom food appears in list

- [ ] **Edit Entry**
  - Tap an existing entry
  - Change serving size
  - Click "Update Entry"
  - ✅ Entry updates correctly

- [ ] **Delete Entry**
  - Tap an entry
  - Click trash icon
  - ✅ Entry is removed

- [ ] **Date Navigation**
  - Swipe left/right on summary card
  - Use arrow buttons
  - ✅ Date changes, entries update

---

### 2. Smart Scan (3 minutes - if API keys configured)
**Goal:** Verify barcode/OCR functionality after code cleanup

- [ ] **Barcode Scan**
  - Click + button → camera icon
  - Scan a UPC barcode (or use manual entry)
  - ✅ Product info loads
  - ✅ Calcium value populated
  - Add entry successfully

- [ ] **OCR Scan** (if VITE_OCR_API_KEY configured)
  - Switch to "Nutrition Label" tab
  - Capture nutrition label photo
  - ✅ Calcium extracted correctly
  - Add entry successfully

---

### 3. Statistics & Reports (2 minutes)
**Goal:** Verify chart rendering after innerHTML cleanup

- [ ] **Statistics Page**
  - Navigate to Stats page
  - Switch between Daily/Weekly/Monthly/Yearly views
  - ✅ Charts render correctly
  - ✅ No JavaScript errors in console
  - Tap a chart bar
  - ✅ Detail popup shows correct value

- [ ] **Report Page**
  - Navigate to Report page
  - ✅ Report generates with data
  - ✅ No layout issues

---

### 4. Data Management (5 minutes)
**Goal:** Verify data operations work correctly

- [ ] **Database Browser**
  - Navigate to Data page
  - Search for a food
  - ✅ Search works correctly
  - Sort by Name/Calcium/Type
  - ✅ Sorting works
  - Apply calcium filter
  - ✅ Filtering works
  - Toggle food visibility (checkbox)
  - ✅ Hidden foods don't appear in Add Food dialog

- [ ] **Backup**
  - Go to Settings → Data
  - Click "Create Backup"
  - ✅ JSON file downloads
  - ✅ File contains journal entries, custom foods, settings

- [ ] **Export CSV**
  - Go to Settings → Data
  - Click "Export to CSV"
  - ✅ CSV file downloads
  - ✅ Opens in spreadsheet app correctly

- [ ] **Restore** (caution: use test data!)
  - Go to Settings → Data
  - Click "Restore Data"
  - Select a backup file
  - ✅ Data restores correctly
  - ✅ Page reloads
  - ✅ All data present after reload

---

### 5. Sync Functionality (5 minutes - requires worker update)
**Goal:** Verify sync works with new CORS configuration

- [ ] **Create Sync - Device 1**
  - Go to Settings → Data → Sync
  - Click "Create New Sync"
  - ✅ QR code displays
  - ✅ Share URL shown
  - ✅ Sync status shows "Synced"

- [ ] **Join Sync - Device 2**
  - Open app on second device
  - Go to Settings → Data → Sync
  - Click "Join Existing Sync"
  - Scan QR code or paste URL
  - ✅ Successfully joins sync
  - ✅ Data from Device 1 appears

- [ ] **Bidirectional Sync**
  - Add entry on Device 1
  - ✅ Entry appears on Device 2 within 30 seconds
  - Add entry on Device 2
  - ✅ Entry appears on Device 1 within 30 seconds

- [ ] **Manual Sync**
  - Click cloud icon in header
  - ✅ Sync completes without errors
  - ✅ Status shows "Synced"

---

### 6. Offline Functionality (2 minutes)
**Goal:** Verify PWA works offline

- [ ] **Disconnect Network**
  - Turn off Wi-Fi or use browser offline mode
  - ✅ App still loads and functions
  - Add food entries
  - ✅ Entries save to IndexedDB
  - Navigate between pages
  - ✅ All pages work (except sync/scan)

---

### 7. PWA Installation (2 minutes)
**Goal:** Verify PWA can be installed

- [ ] **Desktop Installation**
  - Look for install prompt in browser
  - Click "Install"
  - ✅ App installs to desktop/home screen
  - ✅ Launches in standalone window
  - ✅ All features work in installed mode

- [ ] **Mobile Installation** (if testing on mobile)
  - Browser shows "Add to Home Screen" prompt
  - Add to home screen
  - ✅ Icon appears
  - ✅ Opens as standalone app

---

## Console Verification

### Browser Console Checks
**Goal:** Verify no debug logging in production

- [ ] **Open Browser DevTools (F12)**
  - Navigate through all pages
  - Perform various actions (add food, sync, etc.)
  - ✅ NO console.log messages appear
  - ✅ Only console.error for actual errors (if any)
  - ✅ No unexpected errors or warnings

---

## Regression Testing Checklist

### Quick Smoke Test
- [ ] All navigation buttons work
- [ ] No visual layout issues
- [ ] Modal dialogs open/close correctly
- [ ] Form inputs accept values
- [ ] Date picker works
- [ ] Settings save correctly
- [ ] Theme switching works (Light/Dark/Auto)
- [ ] No JavaScript errors in console

---

## Test Results

**Test Date:** _______________
**Environment:** [ ] Dev  [ ] Prod
**Tester:** _______________

### Pass/Fail Summary
- Core Functionality: _______ / 4 passed
- Smart Scan: _______ / 2 passed (if applicable)
- Statistics: _______ / 1 passed
- Data Management: _______ / 4 passed
- Sync: _______ / 4 passed (if applicable)
- Offline: _______ / 1 passed
- PWA Install: _______ / 1 passed

**Total Score:** _______ / _______ tests passed

### Issues Found
```
Issue 1:
  Description:
  Severity: [Critical/High/Medium/Low]
  Steps to Reproduce:

Issue 2:
  ...
```

### Sign-Off
- [ ] All critical tests passed
- [ ] No blocking issues found
- [ ] Ready for production deployment

**Approved By:** _______________
**Date:** _______________

---

## Notes

- This is a **manual test plan** - execute each test step interactively
- For automated testing in the future, consider:
  - Playwright for E2E tests
  - Vitest for unit tests
  - Cypress for integration tests
