////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// WIP
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function onEdit(e) {
  var range = e.range;
  if (range.getColumn() == 13 && SpreadsheetApp.getActiveSheet().getName() == "WIP") {
    //SpreadsheetApp.getUi().alert(val);
    var new_value = vLookup(range.getValue(), SpreadsheetApp.openById("").getSheetByName("Data Values"), 6, 7, 0);
    SpreadsheetApp.getActiveSheet().getRange(range.getRow(), range.getColumn() + 1).setValue(new_value);
  };
};


function vLookup(search_value, sheet, col_search_num, col_return_num, case_match) {
  // Calculate last row depending on column searchedsheet
  var lrow = sheet.getRange(1, col_search_num).getDataRegion(SpreadsheetApp.Dimension.ROWS).getLastRow();
  for (var i = 2; i <= lrow; i++) {
    if (case_match == 0) {
      if (search_value.toLowerCase() == sheet.getRange(i, col_search_num).getValue().toLowerCase()) {
        return sheet.getRange(i, col_return_num).getValue();
      };
    } else {
      if (search_value == sheet.getRange(i, col_search_num).getValue()) {
        return sheet.getRange(i, col_return_num).getValue();
      };
    };
  };
};







////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// Working WIP
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


/*
@NotOnlyCurrentDoc

Updated Steps:
1. Duplicate current file, rename, and move to archive folder.
2. Pull Raw Data from latest WIP.
3. Go through each Branch WIP, duplicate file, rename, and move to their respective archive folder.
4. Pull out latest data for the "EAD - ..." fields and put into the "3 - Final WIP" tab.
5. Vlookup data from "Working WIP".
6. Go into each Branch WIP, delete all data and pull only data belonging to them from "3 - Final WIP", formatting appropriately.
7. Create pivots for each WIP.
8. Update functions in "Working WIP" to pull data from Branch WIPs.
9. Archive and update "Consolidated WIP"
10. Create pivots for "Consolidated WIP"
*/


/*
function onEdit(e) {
  getVariables();
  var range = e.range;
  if (range.getColumn() == 11) {
    //SpreadsheetApp.getUi().alert(val);
    var new_value = vLookup(range.getValue(), _ga_dv, 6, 7, 0);
    SpreadsheetApp.getActiveSheet().getRange(range.getRow(), range.getColumn() + 1).setValue(new_value);
  };
};
*/


function dev() {
};

////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// Run All ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function runAll() {
  var st = Date.now();
  getVariables();
  updateWIP();
  pullData();
  dupeCheck();
  compareData();
  updateAllBranchWIPs();
  updateImportData();
  cwUpdateWIP();
  cwUpdatePivots();
  draftEmail();
  endTime(st);
};


function runAllDev() {
  var st = Date.now();
  getVariablesDev();
  updateWIP();
  pullData();
  dupeCheck();
  compareData();
  updateAllBranchWIPs();
  updateImportData();
  cwUpdateWIP();
  cwUpdatePivots();
  //draftEmail();
  endTime(st);
};


function runEmail() {
  getVariables();
  draftEmail();
};


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Day Check ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


// Only run code on Monday
function dayCheck() {
  var today = new Date();
  if (today.getDay() == 1) {
    runAll();
  };
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// Step 1 ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function updateWIP() {
  var st = Date.now();
  SpreadsheetApp.flush();
  consoleHeader('Step 1: Update "Working WIP"');
  ////////////////////////////////////////////////////////////////////////////////
  console.log('Archive file');
  archiveFile(_file_ww, _folder_ww);
  console.log('Delete data');
  SpreadsheetApp.flush();
  deleteData(_ga_raw);
  SpreadsheetApp.flush();
  ////////////////////////////////////////////////////////////////////////////////
  console.log('Identify the latest file');
  var dest = DriveApp.getFolderById(_folder_ago_wip);
  // Remove older archives
  var files = dest.getFiles();
  var latest_date = 0;
  while (files.hasNext()) {
    // Every time you call .next(), it iterates through another file; only use it once in the while statement
    var file = files.next();
    var file_name = file.getName();
    var date_file = file_name.slice(-10).trim().replace(/-/g, '').replace(/\s/g, '');
    // Only save information from latest file
    if (date_file > latest_date) {
      latest_date = date_file;
      var latest_id = file.getId();
    };
  };
  ////////////////////////////////////////////////////////////////////////////////
  // Save data from latest file
  console.log('Copy all data and save to "Raw WIP"');
  var wip_dv = rangeValues(SpreadsheetApp.openById(latest_id).getSheetByName('workinprogress'), 0, 0);
  insertData(wip_dv, _ga_raw);
  // Format data
  formatDataSheet(_ga_raw);
  endTime(st);
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// Step 2 ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function pullData() {
  var st = Date.now();
  SpreadsheetApp.flush();
  consoleHeader('Step 2: Pull data from "Raw WIP"');
  var raw_forecasting = [];
  var raw_no_workspaces = [];
  var raw_wip = [];
  var data_rw = rangeValues(_ga_raw, 0, 0);
  ////////////////////////////////////////////////////////////////////////////////
  console.log('Separate data to three lists');
  for (var i = 0; i < data_rw.length; i++) {
    var copoc_group = data_rw[i][20].toLowerCase().trim().substring(0,6);
    var buyer_group = data_rw[i][9].toLowerCase().trim().substring(0,6);
    var workspace = data_rw[i][13];
    var requisition = data_rw[i][2];
    // Only pull data that belongs to an EAD group
    if (buyer_group == 'ead - ' || (buyer_group != 'ead - ' && copoc_group == 'ead - ')) {
      // Send to forecasting list
      if (data_rw[i][17] == 'Forecasting') {
        raw_forecasting.push(data_rw[i]);
      // Send to no workspaces list
      } else if (workspace == '' && requisition != '') {
        raw_no_workspaces.push(data_rw[i]);
      // Send to regular workspaces
      } else if (workspace != '') {
        raw_wip.push(data_rw[i]);
      };
    };
  };
  ////////////////////////////////////////////////////////////////////////////////
  console.log('Insert data to "Forecasting"');
  SpreadsheetApp.flush();
  deleteData(_ga_rf);
  SpreadsheetApp.flush();
  var dv_list = vLookupList(1, 2);
  for (i = 0; i < raw_forecasting.length; i++) {
    // Add Branch
    if (raw_forecasting[i][19] != '') {
      var branch_poc = raw_forecasting[i][19];
    } else if (raw_forecasting[i][19] == '' && raw_forecasting[i][8] != '') {
      var branch_poc = raw_forecasting[i][8];
    } else {
      var branch_poc = '';
    };
    raw_forecasting[i].push(vLookup(branch_poc, dv_list, 2, 0));  
  };
  insertData(raw_forecasting, _ga_rf);
  ////////////////////////////////////////////////////////////////////////////////
  console.log('Insert data to "Requisitions Need Workspaces - Current"');
  SpreadsheetApp.flush();
  deleteData(_ga_nwc);
  SpreadsheetApp.flush();
  var nwc_list = [];
  var dv_list = vLookupList(1, 2);
  for (i = 0; i < raw_no_workspaces.length; i++) {
    var req_num = raw_no_workspaces[i][2];
    // Branch POC to determine BRANCH, preference given to Buyer
    if (raw_no_workspaces[i][8] != '') {
      var branch_poc = raw_no_workspaces[i][8];
    } else if (raw_no_workspaces[i][8] == '' && raw_no_workspaces[i][19] != '') {
      var branch_poc = raw_no_workspaces[i][19];
    } else {
      var branch_poc = '';
    };
    // Contracts Office POC
    if (raw_no_workspaces[i][19] == '') {
      var co_poc = "(No Contracts Office POC Assigned)";
    } else {
      var co_poc = raw_no_workspaces[i][19];
    };
    // Purpose
    if (raw_no_workspaces[i][7].trim() != '') {
      var purpose = raw_no_workspaces[i][7].trim();
    } else {
      var purpose = raw_no_workspaces[i][14].trim();
    };
    // Committed amount
    if (raw_no_workspaces[i][6] == '$ -' || raw_no_workspaces[i][6] == '') {
      var comm_amt = 0;
    } else {
      var comm_amt = raw_no_workspaces[i][6];
    };
    nwc_list.push([vLookup(branch_poc, dv_list, 2, 0), // Branch
                   raw_no_workspaces[i][8], // Buyer
                   co_poc, // Contracts Office POC
                   '', // Req/Mod Workspace Number
                   req_num, // Requisition
                   '', // Contract Office POC Assign Date
                   purpose, // Purpose
                   '', // PRISM AAP
                   comm_amt, // Committed Amount
                   '', // Total Obligation
                   '', // Total Value
                   '', // Client
                   '', // Type
                   '', // PALT
                   '', // Days Since Contract Office POC Assigned
                   '', // Accrued PALT
                   '', // Special Interest
                   '', // Current Contract Expiration
                   '', // Fiscal Year
                   '', // Projected Award Date
                   '', // Process Update
                   '', // Comments/Issues
                   String(req_num.toString() + comm_amt) // Lookup ID
    ]);
  };
  insertData(nwc_list, _ga_nwc);
  _ga_nwc.getRange('A1').getFilter().sort(5, true);
  _ga_nwc.getRange('A1').getFilter().sort(2, true);
  _ga_nwc.getRange('A1').getFilter().sort(1, false);
  ////////////////////////////////////////////////////////////////////////////////
  console.log('Insert data to "Raw EAD WIP"');
  SpreadsheetApp.flush();
  deleteData(_ga_rew);
  SpreadsheetApp.flush();
  var dv_list = vLookupList(1, 2);
  for (i = 0; i < raw_wip.length; i++) {
    // Add Branch
    if (raw_wip[i][8] != '') {
      var branch_poc = raw_wip[i][8];
    } else if (raw_wip[i][8] == '' && raw_wip[i][19] != '') {
      var branch_poc = raw_wip[i][19];
    } else {
      var branch_poc = '';
    };
    raw_wip[i].push(vLookup(branch_poc, dv_list, 2, 0));
  };
  insertData(raw_wip, _ga_rew);
  endTime(st);
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// Step 3 ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function dupeCheck() {
  var st = Date.now();
  consoleHeader('3. Check for dupes from the "EAD WIP"');
  SpreadsheetApp.flush();
  // Check for dupes, post them in the "Duplicate Items" tab
  deleteData(_ga_di);
  SpreadsheetApp.flush();
  // Recreate raw_wip into new list with data
  var raw_wip = rangeValues(_ga_rew, 0, 0);
  var wip_list = [];
  var workspace_list = [];
  for (var i = 0; i < raw_wip.length; i++) {
    var workspace_num = raw_wip[i][13];
    // Contracts Office POC
    if (raw_wip[i][19] == '') {
      var co_poc = "(No Contracts Office POC Assigned)";
    } else {
      var co_poc = raw_wip[i][19];
    };
    // Committed amount
    if (raw_wip[i][6] == '$ -' || raw_wip[i][6] == '') {
      var comm_amt = 0;
    } else {
      var comm_amt = raw_wip[i][6];
    };
    // PR
    if (raw_wip[i][14].trim() != '') {
      var pr_name = raw_wip[i][14].trim();
    } else {
      var pr_name = raw_wip[i][7].trim();
    };
    // Amendment numbers
    if (raw_wip[i][3] == 'ORIG' || raw_wip[i][3] == '') {
      var amendment = 0;
    } else {
      var amendment = raw_wip[i][3];
    };
    wip_list.push([raw_wip[i][raw_wip[0].length - 1], // Branch
                  raw_wip[i][8], // Buyer
                  co_poc, // Contracts Office POC
                  workspace_num, // Req/Mod Workspace Number
                  raw_wip[i][2], // Requisition
                  raw_wip[i][22], // Contract Office POC Assign Date
                  pr_name, // Purpose
                  workspace_num.replace(/-/g, '').slice(-5).padStart(5, 0).toString(), // PRISM AAP
                  comm_amt, // Committed Amount
                  '', // Total Obligation
                  '', // Total Value of Action
                  '', // Client
                  '', // Type
                  '', // PALT
                  raw_wip[i][23], // Days Since Contract Office POC Assigned
                  raw_wip[i][23], // Accrued PALT
                  '', // Special Interest
                  '', // Current Contract Expiration
                  '', // Fiscal Year
                  '', // Projected Award Date
                  '', // Process Update
                  '', // Comments/Issues
                  amendment // Amendment
    ]);
    // Push item to separate list to check for dupes
    workspace_list.push([workspace_num]);
  };
  ////////////////////////////////////////////////////////////////////////////////
  // Count totals
  var workspaces = {};
  workspace_list.forEach(num => {
    if (workspaces[num]) {
        workspaces[num] += 1;
    } else {
        workspaces[num] = 1;
    };
  });
  // Identify only duplicate workspaces
  var dupes = []
  for (let x in workspaces) {
    if (workspaces[x] > 1) {
      dupes.push([x, workspaces[x]]);
    };
  };
  // Check if dupes present, if no dupes present, push to final list
  var final_list = [];
  if (dupes.length == 0) {
    for (i = 0; i < wip_list.length; i++) {
      final_list.push(wip_list[i]);
    };
  } else {
    // Identify duplicate workspaces with additive amendment count
    var dupes_data = [];
    for (i = 0; i < dupes.length; i++) {
      var amen_count = 0;
      for (var j = 0; j < wip_list.length; j++) {
        // Add all amendments into one number
        if (dupes[i][0] == wip_list[j][3]) {
          amen_count += wip_list[j][22];
        };
      };
      dupes_data.push([dupes[i][0], amen_count]);
    };
    ////////////////////////////////////////////////////////////////////////////////
    // List all dupes on "Duplicate Items"
    console.log('List dupes on "Duplicate Items"');
    SpreadsheetApp.flush();
    deleteData(_ga_di);
    SpreadsheetApp.flush();
    var ga_di_values = [];
    for (i = 0; i < dupes_data.length; i++) {
      for (j = 0; j < wip_list.length; j++) {
        if (dupes_data[i][0] == wip_list[j][3]) {
          ga_di_values.push([wip_list[j][0], // Branch
                             wip_list[j][1], // Buyer
                             wip_list[j][2], // Contracts Office POC
                             wip_list[j][3], // Req/Mod Workspace Number
                             wip_list[j][4], // Requisition
                             wip_list[j][22], // Amendment
                             wip_list[j][6], // Purpose
                             wip_list[j][8] // Committed Amount
          ]);
        };
      };
    };
    insertData(ga_di_values, _ga_di);
    _ga_di.getRange('A1').getFilter().sort(4, true);
    _ga_di.getRange('A1').getFilter().sort(3, true);
    _ga_di.getRange('A1').getFilter().sort(1, false);
    // First create new list with data that are not duplicates
    ////////////////////////////////////////////////////////////////
    console.log('Remove dupes from the wip_list');
    for (i = 0; i < wip_list.length; i++) {
      var dupe_ind = 0;
      for (j = 0; j < dupes_data.length; j++) {
        if (wip_list[i][3] == dupes_data[j][0]) {
          dupe_ind = 1;
        };
      };
      // Pushes non-dupe data to final list
      if (dupe_ind == 0) {
        // Push new data, remove last column of data
        final_list.push(wip_list[i].slice(0, -1));
      };
    };
    // Add specific dupe data back into data w/o dupes
    for (i = 0; i < dupes_data.length; i++) {
      // Add data with no amendments
      if (dupes_data[i][1] == 0) {
        var comm_total = 0;
        var updated_item = '';
        for (j = 0; j < wip_list.length; j++) {
          if (dupes_data[i][0] == wip_list[j][3]) {
            comm_total += wip_list[j][8];
            updated_item = wip_list[j];
            updated_item[8] = comm_total;
          };
        };
        // Push new data, remove last column of data
        final_list.push(updated_item.slice(0, -1));
      // Add data with latest amendment
      } else {
        var latest_amen = -1;
        for (j = 0; j < wip_list.length; j++) {
          if (dupes_data[i][0] == wip_list[j][3]) {
            var curr_amen = wip_list[j][22];
            if (curr_amen > latest_amen) {
              latest_amen = curr_amen;
              updated_item = wip_list[j];
            };
          };
        };
        // Push new data, remove last column of data
        final_list.push(updated_item.slice(0, -1));
      };
    };
  };
  ////////////////////////////////////////////////////////////////////////////////
  // Transfer the data
  console.log('Transfer Data to "Current WIP"');
  SpreadsheetApp.flush();
  deleteData(_ga_cw);
  SpreadsheetApp.flush();
  // Format PRISM column prior to adding data
  _ga_cw.getRange('H:H').setNumberFormat('@');
  insertData(final_list, _ga_cw);
  // Format data
  formatDataSheet(_ga_cw);
  _ga_cw.getRange('A1').getFilter().sort(4, true);
  _ga_cw.getRange('A1').getFilter().sort(3, true);
  _ga_cw.getRange('A1').getFilter().sort(1, false);
  endTime(st);
};


function formatDataSheet(sheet) {
  changeFont(sheet);
  sheet.getRange('I:K').setNumberFormat('_("$"* #,##0.00_);_("$"* \\(#,##0.00\\);_("$"* "-"??_);_(@_)');
  sheet.getRange('G:G').setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sheet.autoResizeColumns(1, 6);
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// Step 4 ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function compareData() {
  var st = Date.now();
  SpreadsheetApp.flush();
  consoleHeader('Step 4: Compare data from working tabs to current tabs');
  console.log('Working: "Working WIP"');
  var data_cw = rangeValues(_ga_cw, 0, 0);
  var data_ww = rangeValues(_ga_ww, 0, 0);
  // Columns to pull data from
  var col_list = [9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 21];
  for (var i = 0; i < data_cw.length; i++) {
    for (var j = 0; j < data_ww.length; j++) {
      // Compare workspace numbers; there should not be any duplicates, in theory...
      if (data_cw[i][3] == data_ww[j][3]) {
        for (var k = 0; k < col_list.length; k++) {
          data_cw[i][col_list[k]] = data_ww[j][col_list[k]];
        };
        // Remove row from list but only if it matches
        data_ww = data_ww.filter((value) => value != data_ww[j]);
      };
    };
  };
  console.log('Add data back to "Current WIP"');
  insertData(data_cw, _ga_cw);
  formatDataSheet(_ga_cw);
  formatDataSheet(_ga_ww);
  ////////////////////////////////////////////////////////////////////////////////
  console.log('Working: "Requisitions Need Workspaces - Working"');
  var data_nwc = rangeValues(_ga_nwc, 0, 0);
  var data_nww = rangeValues(_ga_nww, 0, 0);
  // Columns to pull data from
  var col_list = [9, 10, 11, 12, 13, 18, 20, 21];
  for (var i = 0; i < data_nwc.length; i++) {
    for (var j = 0; j < data_nww.length; j++) {
      if (data_nwc[i][data_nwc[0].length - 1] == data_nww[j][data_nww[0].length - 1]) {
        for (var k = 0; k < col_list.length; k++) {
          data_nwc[i][col_list[k]] = data_nww[j][col_list[k]];
        };
        // Remove row from list but only if it matches
        data_nww = data_nww.filter((value) => value != data_nww[j]);
      };
    };
  };
  console.log('Add data back to "Requisitions Need Workspaces - Current"');
  insertData(data_nwc, _ga_nwc);
  formatDataSheet(_ga_nwc);
  formatDataSheet(_ga_nww);
  endTime(st);
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// Step 5 ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function updateAllBranchWIPs() {
  var st = Date.now();
  SpreadsheetApp.flush();
  consoleHeader('Step 5: Update Branch WIPs, pull data and format, create pivots')
  // Save the name, workbook, and archive folder for each Branch
  var div_wips = [['NOS', _file_nos, _folder_nos],
                  ['NOS KC', _file_noskc, _folder_noskc],
                  ['NWS', _file_nws, _folder_nws],
                  ['NWS KC', _file_nwskc, _folder_nwskc],
                  ['OMAO', _file_omao, _folder_omao],
                  ['SAP', _file_sap, _folder_sap],
                  ['SAP KC', _file_sapkc, _folder_sapkc]
                  //['Closeout', _file_closeout, _folder_closeout]
  ];
  // Save data from all sheets
  var data_cw = rangeValues(_ga_cw, 0, 0);
  var data_rew = rangeValues(_ga_rew, 0, 0);
  var data_rf = rangeValues(_ga_rf, 0, 0);
  var data_nwc = rangeValues(_ga_nwc, -1, 0);
  // Loop through branch WIPs
  for (var i = 0; i < div_wips.length; i++) {
    var wname = div_wips[i][0];
    console.log('Working: ' + wname);
    // Archive file first
    console.log(wname + ": Archiving file");
    archiveFile(div_wips[i][1], div_wips[i][2]);
    ////////////////////////////////////////////////////////////////////////////////
    console.log(wname + ': Add data for "WIP"');
    var data = [];
    for (var j = 0; j < data_cw.length; j++) {
      if (div_wips[i][0] == data_cw[j][0]) {
        data.push(data_cw[j]);
      };
    };
    var sheet = SpreadsheetApp.openById(div_wips[i][1]);
    var sheet_cw = sheet.getSheetByName('WIP');
    ////////////////////////////////////////////////////////////////////////////////
    // Reset filters
    console.log("Reset filters");
    var last_col = _ga_cw.getLastColumn();
    var rng_fltr = sheet_cw.getRange('A1:' + columnToLetter(last_col) + String(sheet_cw.getLastRow()));
    var fltr = rng_fltr.getFilter();
    // First check to see if there is a filter; if not, then add
    if (fltr) {
      for (var j = 1; j <= last_col; j++) {
        fltr.setColumnFilterCriteria(j, SpreadsheetApp.newFilterCriteria());
      };
    } else {
      rng_fltr.createFilter();
    };
    ////////////////////////////////////////////////////////////////////////////////
    deleteData(sheet_cw);
    // Format PRISM AAP column prior to adding data
    sheet_cw.getRange('H:H').setNumberFormat('@');
    insertData(data, sheet_cw);
    formatData(sheet_cw);
    ////////////////////////////////////////////////////////////////////////////////
    console.log(wname + ': Add data for "Raw WIP"');
    var data = [];
    for (var j = 0; j < data_rew.length; j++) {
      if (String(div_wips[i][0]) == String(data_rew[j][data_rew[0].length - 1])) {
        data.push(data_rew[j].slice(0, -1));
      };
    };
    var sheet_rew = sheet.getSheetByName('Raw WIP');
    deleteData(sheet_rew);
    insertData(data, sheet_rew);
    sheet_rew.getRange("A1:" + columnToLetter(sheet_rew.getLastColumn()) + sheet_rew.getLastRow()).setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
    ////////////////////////////////////////////////////////////////////////////////
    console.log(wname + ': Add data for "Forecasting"');
    var data = [];
    for (var j = 0; j < data_rf.length; j++) {
      if (div_wips[i][0] == data_rf[j][data_rf[0].length - 1]) {
        data.push(data_rf[j].slice(0, -1));
      };
    };
    var sheet_rf = sheet.getSheetByName('Forecasting');
    deleteData(sheet_rf);
    insertData(data, sheet_rf);
    sheet_rf.getRange("A1:" + columnToLetter(sheet_rf.getLastColumn()) + sheet_rf.getLastRow()).setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
    ////////////////////////////////////////////////////////////////////////////////
    console.log(wname + ': Add data for "Requisitions Need Workspaces"');
    var data = [];
    for (var j = 0; j < data_nwc.length; j++) {
      if (div_wips[i][0] == data_nwc[j][0]) {
        data.push(data_nwc[j].slice(0, -1));
      };
    };
    var sheet_nwc = sheet.getSheetByName('Requisitions Need Workspaces');
    deleteData(sheet_nwc);
    insertData(data, sheet_nwc);
    formatDataRNW(sheet_nwc);
    ////////////////////////////////////////////////////////////////////////////////
    console.log(wname + ': Add data for "Pivot Data"');
    var sheet_pd = sheet.getSheetByName("Pivot Data");
    deleteData(sheet_pd);
    var wip_lrow = sheet_cw.getLastRow();
    var last_col = columnToLetter(sheet_cw.getLastColumn());
    // importRange formula is different for referencing sheets within same workbook
    sheet_pd.getRange("A2").setFormula("='" + sheet_cw.getName() + "'!A2:'" + sheet_cw.getName() + "'!" + last_col + wip_lrow);
    var nwc_lrow = sheet_nwc.getLastRow();
    sheet_pd.getRange("A" + (wip_lrow + 1)).setFormula("='" + sheet_nwc.getName() + "'!A2:'" + sheet_nwc.getName() + "'!" + last_col + nwc_lrow);
    formatDataSheet(sheet_pd);
    ////////////////////////////////////////////////////////////////////////////////
    // Create pivot tables
    console.log(wname + ': Create pivot tables');
    createPivotSheet(sheet, sheet_pd, wname);
  };
  endTime(st);
};


// Only used on sheet "WIP"
function formatData(sheet) {
  var lrow = sheet.getLastRow();
  // Table gridlines
  sheet.getRange('A1:' + columnToLetter(sheet.getLastColumn()) + lrow).activate();
  sheet.getActiveRangeList().setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
  // Background
  sheet.getRange('J1:M' + lrow).setBackground('#fff2cc');
  sheet.getRange('Q1:V' + lrow).setBackground('#fff2cc');
  // Drop-Down Menus
  if (lrow > 1) {
    // Clients
    var last_drow = getLastDataRow(_ga_dv, 4);
    var client_list = _ga_dv.getRange('D2:D' + last_drow).getValues();
    var client_list_final = [];
    for (var i = 0; i < client_list.length; i++) {
      client_list_final.push(client_list[i][0]);
    };
    // Type
    last_drow = getLastDataRow(_ga_dv, 6);
    var type_list = _ga_dv.getRange('F2:F' + last_drow).getValues();
    var type_list_final = [];
    for (i = 0; i < type_list.length; i++) {
      type_list_final.push(type_list[i][0]);
    };
    // Special Interest
    last_drow = getLastDataRow(_ga_dv, 9);
    var si_list = _ga_dv.getRange('I2:I' + last_drow).getValues();
    var si_list_final = [];
    for (i = 0; i < si_list.length; i++) {
      si_list_final.push(si_list[i][0]);
    };
    // Fiscal Year
    last_drow = getLastDataRow(_ga_dv, 11);
    var fy_list = _ga_dv.getRange('K2:K' + last_drow).getValues();
    var fy_list_final = [];
    for (i = 0; i < fy_list.length; i++) {
      fy_list_final.push(fy_list[i][0]);
    };
    // Process Update
    last_drow = getLastDataRow(_ga_dv, 13);
    var pu_list = _ga_dv.getRange('M2:M' + last_drow).getValues();
    var pu_list_final = [];
    for (i = 0; i < pu_list.length; i++) {
      pu_list_final.push(pu_list[i][0]);
    };
    // Populate ranges
    sheet.getRange('L2:L' + lrow).setDataValidation(SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireValueInList(client_list_final, true).build());
    sheet.getRange('M2:M' + lrow).setDataValidation(SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireValueInList(type_list_final, true).build());
    sheet.getRange('Q2:Q' + lrow).setDataValidation(SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireValueInList(si_list_final, true).build());
    sheet.getRange('S2:S' + lrow).setDataValidation(SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireValueInList(fy_list_final, true).build());
    sheet.getRange('U2:U' + lrow).setDataValidation(SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireValueInList(pu_list_final, true).build());
  };
  // Formatting
  formatDataSheet(sheet);
  sheet.getRange('A1').getFilter().sort(4, true);
  sheet.getRange('A1').getFilter().sort(3, true);
};


// Only used sheet "Requisitions Need Workspaces"
function formatDataRNW(sheet) {
  var lrow = sheet.getLastRow();
  // Table gridlines
  sheet.getRange('A1:' + columnToLetter(sheet.getLastColumn()) + lrow).activate();
  sheet.getActiveRangeList().setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
  // Yellow background
  sheet.getRange('J1:M' + lrow).setBackground('#fff2cc');
  sheet.getRange('S1:S' + lrow).setBackground('#fff2cc');
  sheet.getRange('U1:V' + lrow).setBackground('#fff2cc');
  // Red background
  sheet.getRange('D1:D' + lrow).setBackground('red');
  sheet.getRange('F1:F' + lrow).setBackground('red');
  sheet.getRange('H1:H' + lrow).setBackground('red');
  sheet.getRange('N1:R' + lrow).setBackground('red');
  sheet.getRange('T1:T' + lrow).setBackground('red');
  sheet.hideColumns(4);
  sheet.hideColumns(6);
  sheet.hideColumns(8);
  sheet.hideColumns(14, 5);
  sheet.hideColumns(20);
  // Drop-Down Menus
  if (lrow > 1) {
    // Client
    var last_drow = getLastDataRow(_ga_dv, 4);
    var client_list = _ga_dv.getRange('D2:D' + last_drow).getValues();
    var client_list_final = [];
    for (var i = 0; i < client_list.length; i++) {
      client_list_final.push(client_list[i][0]);
    };
    // Type
    last_drow = getLastDataRow(_ga_dv, 6);
    var type_list = _ga_dv.getRange('F2:F' + last_drow).getValues();
    var type_list_final = [];
    for (i = 0; i < type_list.length; i++) {
      type_list_final.push(type_list[i][0]);
    };
    // Fiscal Year
    last_drow = getLastDataRow(_ga_dv, 11);
    var fy_list = _ga_dv.getRange('K2:K' + last_drow).getValues();
    var fy_list_final = [];
    for (i = 0; i < fy_list.length; i++) {
      fy_list_final.push(fy_list[i][0]);
    };
    // Process Update
    last_drow = getLastDataRow(_ga_dv, 13);
    var pu_list = _ga_dv.getRange('M2:M' + last_drow).getValues();
    var pu_list_final = [];
    for (i = 0; i < pu_list.length; i++) {
      pu_list_final.push(pu_list[i][0]);
    };
    // Populate ranges
    sheet.getRange('L2:L' + lrow).setDataValidation(SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireValueInList(client_list_final, true).build());
    sheet.getRange('M2:M' + lrow).setDataValidation(SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireValueInList(type_list_final, true).build());
    sheet.getRange('S2:S' + lrow).setDataValidation(SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireValueInList(fy_list_final, true).build());
    sheet.getRange('U2:U' + lrow).setDataValidation(SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireValueInList(pu_list_final, true).build());
  };
  // Formatting
  formatDataSheet(sheet);
  sheet.getRange('A1').getFilter().sort(5, true);
  sheet.getRange('A1').getFilter().sort(2, true);
  sheet.getRange('A1').getFilter().sort(1, false);
};


// Ran at the start of each sheet, updating each Branch
function createPivotSheet(sheet, data_sheet, branch_name) {
  // Delete all data
  var name = "Summary";
  sheet.getSheetByName(name).activate();
  SpreadsheetApp.flush();
  sheet.deleteActiveSheet();
  SpreadsheetApp.flush();
  sheet.insertSheet(1).setName(name);
  sum_sheet = sheet.getSheetByName('Summary');
  // Create pivots
  console.log('Start Creating Pivots');
  var drange = "'" + data_sheet.getName() + "'!A1:" + columnToLetter(data_sheet.getLastColumn()) + data_sheet.getLastRow();
  createPT01(branch_name, 'Branch Summary by Specialist', sum_sheet, drange, 1, 1, 3, "Contract Specialist");
  createPT01(branch_name, 'Branch Summary by Client', sum_sheet, drange, 1, 6, 12, "Client");
  createPT01(branch_name, 'Branch Summary by Type', sum_sheet, drange, 1, 11, 13, "Type");
  createPT02(branch_name, 'Specialist by Client', sum_sheet, drange, 1, 16, 12, "Client");
  createPT02(branch_name, 'Type by Specialist', sum_sheet, drange, 1, 21, 13, "Type");
  createPT03(branch_name, 'Update by Type by Specialist', sum_sheet, drange, 1, 26);
  createPT04(branch_name, 'Branch Summary by Type and Specialist', sum_sheet, sheet.getSheetByName('WIP'), drange, 1, 32);
  createPTF(branch_name, sheet);
};


// Branch Summary by Specialist, Branch Summary by Client, Branch Summary by Type
function createPT01(branch, title, sheet, data_range, row_position, column_position, row_group, row_name) {
  console.log(branch + ' - ' + title);
  // Set title
  sheet.getRange(row_position, column_position).setValue(title);
  // Create Pivot
  var sourceData = sheet.getRange(data_range);
  var pivotTable = sheet.getRange(row_position + 1, column_position).createPivotTable(sourceData);
  // Rows
  var pivotGroup = pivotTable.addRowGroup(row_group);
  pivotGroup.setDisplayName(row_name);
  // Values
  pivotValue = pivotTable.addPivotValue(row_group, SpreadsheetApp.PivotTableSummarizeFunction.COUNTA);
  pivotValue.setDisplayName('Actions');
  pivotValue = pivotTable.addPivotValue(9, SpreadsheetApp.PivotTableSummarizeFunction.SUM);
  pivotValue.setDisplayName('Funded Amount');
  pivotValue = pivotTable.addPivotValue(11, SpreadsheetApp.PivotTableSummarizeFunction.SUM);
  pivotValue.setDisplayName('Total Acquisition Value');
  // Filters
  var criteria = SpreadsheetApp.newFilterCriteria().setVisibleValues([branch]).build();
  pivotTable.addFilter(1, criteria);
  // Formatting
  pivotTableCleanup(sheet, row_position, column_position, 4, [3, 4], );
};


// Specialist by Client, Type by Specialist
function createPT02(branch, title, sheet, data_range, row_position, column_position, row_group, row_name) {
  console.log(branch + ' - ' + title);
  // Set title
  sheet.getRange(row_position, column_position).setValue(title);
  // Create Pivot
  var sourceData = sheet.getRange(data_range);
  var pivotTable = sheet.getRange(row_position + 1, column_position).createPivotTable(sourceData);
  // Rows
  var pivotGroup = pivotTable.addRowGroup(3);
  pivotGroup.setDisplayName('Contract Specialist');
  pivotGroup = pivotTable.addRowGroup(row_group);
  pivotGroup.setDisplayName(row_name);
  pivotGroup.showTotals(false);
  // Values
  pivotValue = pivotTable.addPivotValue(3, SpreadsheetApp.PivotTableSummarizeFunction.COUNTA);
  pivotValue.setDisplayName('Actions');
  pivotValue = pivotTable.addPivotValue(9, SpreadsheetApp.PivotTableSummarizeFunction.SUM);
  pivotValue.setDisplayName('Funded Amount');
  // Filters
  var criteria = SpreadsheetApp.newFilterCriteria().setVisibleValues([branch]).build();
  pivotTable.addFilter(1, criteria);
  // Formatting
  pivotTableCleanup(sheet, row_position, column_position, 4, [4], );
};


// Update by Type by Specialist
function createPT03(branch, title, sheet, data_range, row_position, column_position) {
  console.log(branch + ' - ' + title);
  // Set title
  sheet.getRange(row_position, column_position).setValue(title);
  // Create Pivot
  var sourceData = sheet.getRange(data_range);
  var pivotTable = sheet.getRange(row_position + 1, column_position).createPivotTable(sourceData);
  // Rows
  var pivotGroup = pivotTable.addRowGroup(3);
  pivotGroup.setDisplayName('Contract Specialist');
  pivotGroup = pivotTable.addRowGroup(13);
  pivotGroup.setDisplayName('Type');
  pivotGroup.showTotals(false);
  pivotGroup = pivotTable.addRowGroup(21);
  pivotGroup.setDisplayName('Process Update');
  pivotGroup.showTotals(false);
  // Values
  pivotValue = pivotTable.addPivotValue(3, SpreadsheetApp.PivotTableSummarizeFunction.COUNTA);
  pivotValue.setDisplayName('Actions');
  pivotValue = pivotTable.addPivotValue(9, SpreadsheetApp.PivotTableSummarizeFunction.SUM);
  pivotValue.setDisplayName('Funded Amount');
  // Filters
  var criteria = SpreadsheetApp.newFilterCriteria().setVisibleValues([branch]).build();
  pivotTable.addFilter(1, criteria);
  // Formatting
  pivotTableCleanup(sheet, row_position, column_position, 5, [5], );
};


// Branch Summary by Type and Specialist
function createPT04(branch, title, sheet, data_sheet, data_range, row_position, column_position) {
  console.log(branch + ' - ' + title);
  // Set title
  sheet.getRange(row_position, column_position).setValue(title);
  // Create Pivot
  var sourceData = sheet.getRange(data_range);
  var pivotTable = sheet.getRange(row_position + 1, column_position).createPivotTable(sourceData);
  // Rows
  var pivotGroup = pivotTable.addRowGroup(13);
  pivotGroup.setDisplayName('Type');
  // Columns
  pivotGroup = pivotTable.addColumnGroup(3);
  pivotGroup.setDisplayName('Contract Specialist');
  pivotGroup.showTotals(false);
  // Values
  pivotValue = pivotTable.addPivotValue(3, SpreadsheetApp.PivotTableSummarizeFunction.COUNTA);
  pivotValue.setDisplayName('Actions');
  // Filters
  var criteria = SpreadsheetApp.newFilterCriteria().setVisibleValues([branch]).build();
  pivotTable.addFilter(1, criteria);
  criteria = SpreadsheetApp.newFilterCriteria().setVisibleValues(getUniqueValuesInColumn(data_sheet, 'Q')).build();
  pivotTable.addFilter(19, criteria);
  criteria = SpreadsheetApp.newFilterCriteria().setVisibleValues(getUniqueValuesInColumn(data_sheet, 'S')).build();
  pivotTable.addFilter(21, criteria);
  // Formatting
  pivotTableCleanup(sheet, row_position, column_position, getUniqueValuesInColumn(data_sheet, 'B').length, );
};


// Forecasting
function createPTF(branch, sheet) {
  console.log(branch + ' - Forecasting Records Table');
  var summ_sheet = sheet.getSheetByName("Summary");
  var last_row = getLastDataRow(sheet, 1) + 10;
  summ_sheet.getRange(last_row, 1).setValue("Number of Forecasting Records");
  summ_sheet.getRange(last_row, 2).setValue(sheet.getSheetByName("Forecasting").getLastRow() - 1);
  // Formatting
  summ_sheet.getRange("A" + last_row + ":B" + last_row).setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
};


function pivotTableCleanup(sheet, first_row, first_column, number_columns, acct_columns, resize_ind) {
  var fcol_letter = columnToLetter(first_column);
  var lcol = first_column + number_columns - 1;
  var lcol_letter = columnToLetter(lcol);
  // Title
  sheet.getRange((fcol_letter + first_row + ':' + lcol_letter + first_row).toString()).mergeAcross();
  sheet.getRange(first_row, first_column).setHorizontalAlignment('center').setFontWeight('bold');  
  sheet.getRange(fcol_letter + (first_row + 1) + ':' + lcol_letter + (first_row + 1)).setHorizontalAlignment('center').setFontWeight('bold');
  // Formatting
  var ldrow = getLastDataRow(sheet, first_column);
  var pivot_range = sheet.getRange(fcol_letter + first_row + ':' + lcol_letter + ldrow);
  pivot_range.setNumberFormat('General');
  if (acct_columns != undefined) {
    for (var i = 0; i < acct_columns.length; i++) {
      var acct_column = columnToLetter(first_column + acct_columns[i] - 1);
      sheet.getRange((acct_column + first_row) + ':' + (acct_column + ldrow)).setNumberFormat('_("$"* #,##0.00_);_("$"* \\(#,##0.00\\);_("$"* "-"??_);_(@_)');
    };
  };
  pivot_range.setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
  changeFont(sheet);
  sheet.autoResizeColumns(first_column, number_columns);
  // Resize left column
  if (resize_ind == undefined) {
    if (first_column > 1) {
      sheet.setColumnWidth(first_column - 1, 15);
    };
  };
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// Step 6 ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function updateImportData() {
  var st = Date.now();
  SpreadsheetApp.flush();
  consoleHeader('Step 6: Update functions in "Working WIP" and "Req. Need Work.')
  deleteData(_ga_ww);
  SpreadsheetApp.flush();
  console.log('Pull data values');
  ////////////////////////////////////////////////////////////////////////////////
  // Format PRISM column prior to adding data
  _ga_ww.getRange('H:H').setNumberFormat('@');
  // Update table with file locations
  var update_rng = _ga_dv.getRange('O2:Q8').getValues();
  for (var i = 0; i < update_rng.length; i++) {
    if (update_rng[i][0].toLowerCase().trim() == "nos") {
      update_rng[i].push("https://docs.google.com/spreadsheets/d/" + _file_nos + "/");
    } else if (update_rng[i][0].toLowerCase().trim() == "nos kc") {
      update_rng[i].push("https://docs.google.com/spreadsheets/d/" + _file_noskc + "/");
    } else if (update_rng[i][0].toLowerCase().trim() == "nws") {
      update_rng[i].push("https://docs.google.com/spreadsheets/d/" + _file_nws + "/");
    } else if (update_rng[i][0].toLowerCase().trim() == "nws kc") {
      update_rng[i].push("https://docs.google.com/spreadsheets/d/" + _file_nwskc + "/");
    } else if (update_rng[i][0].toLowerCase().trim() == "omao") {
      update_rng[i].push("https://docs.google.com/spreadsheets/d/" + _file_omao + "/");
    } else if (update_rng[i][0].toLowerCase().trim() == "sap") {
      update_rng[i].push("https://docs.google.com/spreadsheets/d/" + _file_sap + "/");
    } else if (update_rng[i][0].toLowerCase().trim() == "sap kc") {
      update_rng[i].push("https://docs.google.com/spreadsheets/d/" + _file_sapkc + "/");
    };
  };
  var ulrow = 1;
  var last_col = columnToLetter(_ga_ww.getLastColumn());
  for (var i = 0; i < update_rng.length; i++) {
    if (update_rng[i][1] > 0) {
      var rng_string = "WIP!A2:" + last_col + (1 + update_rng[i][1]);
      _ga_ww.getRange(ulrow + 1, 1).setFormula('=importrange("' + update_rng[i][3] + '", "' + rng_string + '")');
      var ulrow = ulrow + update_rng[i][1];
    };
  };
  // Add Mailbox data
  console.log('Transfer Mailbox data');
  var cw_data = rangeValues(_ga_cw, 0, 0);
  var mb_data = [];
  for (i = 0; i < cw_data.length; i++) {
    if (cw_data[i][0].toLowerCase().includes('mailbox')) {
      mb_data.push(cw_data[i]);
    };
  };
  var lrow = _ga_ww.getLastRow();
  for (i = 0; i < mb_data.length; i++) {
    for (var j = 0; j < mb_data[0].length - 1; j++) {
      _ga_ww.getRange(i + lrow + 1, j + 1).setValue(mb_data[i][j]);
    };
  };
  // Format data
  formatDataSheet(_ga_ww);
  ////////////////////////////////////////////////////////////////////////////////
  console.log('Updating functions in "Requisitions Need Workspaces - Working"');
  SpreadsheetApp.flush();
  deleteData(_ga_nww);
  SpreadsheetApp.flush();
  console.log('Pull data values');
  var ulrow = 1;
  var last_col = columnToLetter(_ga_nww.getLastColumn() - 1);
  for (i = 0; i < update_rng.length; i++) {
    if (update_rng[i][2] > 0) {
      var rng_string = '\'Requisitions Need Workspaces\'!A2:' + last_col + (1 + update_rng[i][2]);
      _ga_nww.getRange(ulrow + 1, 1).setFormula('=importrange("' + update_rng[i][3] + '", "' + rng_string + '")');
      var ulrow = ulrow + update_rng[i][2];
    };
  };
  // Add in lookup_id column
  console.log('Add Lookup column');
  var last_col = _ga_nww.getLastColumn();
  for (i = 2; i <= _ga_nww.getLastRow(); i++) {
    _ga_nww.getRange(i, last_col).setValue(_ga_nww.getRange(i, 5).getValue() + _ga_nww.getRange(i, 9).getValue());
  };
  // Add mailbox data
  console.log('Transfer Mailbox data');
  var nwc_data = rangeValues(_ga_nwc, 0, 0);
  var mb_data = [];
  for (i = 0; i < nwc_data.length; i++) {
    if (nwc_data[i][0].toLowerCase().includes('mailbox')) {
      mb_data.push(nwc_data[i]);
    };
  };
  var lrow = _ga_nww.getLastRow();
  for (i = 0; i < mb_data.length; i++) {
    for (j = 0; j < mb_data[0].length - 1; j++) {
      _ga_nww.getRange(i + lrow + 1, j + 1).setValue(mb_data[i][j]);
    };
  };
  endTime(st);
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// Step 7 ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function cwUpdateWIP() {
  var st = Date.now();
  SpreadsheetApp.flush();
  consoleHeader('Step 7: Updating "Conslidated WIP"');
  console.log("Archive file");
  archiveFile(_file_cw, _folder_cw);
  ////////////////////////////////////////////////////////////////////////////////
  // Save data to sheet
  SpreadsheetApp.flush();
  deleteData(_gac_w);
  SpreadsheetApp.flush();
  // Format PRISM column prior to adding data
  _gac_w.getRange('H:H').setNumberFormat('@');
  console.log('Import ranges from "Working WIP" and "Requisitions Need Workspaces"')
  var ga_ww_values = rangeValues(_ga_ww, 0, 0);
  var ga_nww_values = rangeValues(_ga_nww, -1, 0);
  // Combine the two lists
  ga_nww_values.forEach(i => ga_ww_values.push(i));
  ////////////////////////////////////////////////////////////////////////////////
  console.log('Get rid of "#ERROR!", add Branch Chief column');
  var dv_list = vLookupList(19, 20);
  // Change #ERROR! to the next row's value
  for (var i = 0; i < ga_ww_values.length; i++) {
    if (ga_ww_values[i][0] == "#ERROR!") {
      ga_ww_values[i][0] = ga_ww_values[i + 1][0]
    };
    ga_ww_values[i].push(vLookup(ga_ww_values[i][0], dv_list, 2, 0));
  };
  ////////////////////////////////////////////////////////////////////////////////
  insertData(ga_ww_values, _gac_w);
  formatDataSheet(_gac_w);
  endTime(st);
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// Step 8 ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function cwUpdatePivots() {
  var st = Date.now();
  SpreadsheetApp.flush();
  consoleHeader('Step 8: Creating Pivots for "Conslidated WIP"');
  // First import historical data
  console.log('Find historical week data');
  var week_num = Utilities.formatDate(new Date(), "CST", "w");
  var rng_week = _gac_hd.getRange("A1:A" + _gac_hd.getLastRow()).getValues();
  for (var i = 0; i < rng_week.length; i++) {
    if (rng_week[i] == week_num) {
      var row_id = i;
      _gac_hd.getRange("B" + (i + 1) + ":" + columnToLetter(_gac_hd.getLastColumn()) + (i + 40)).copyTo(_gac_d.getRange("A1"), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
      break;
    };
  };
  // Update Summary Tables first
  cwUpdateSummaryTables();
  // EAD Summary by Specialist
  cwCreatePivots01();
  // Emily Clark's Branch Summary
  cwCreatePivots02();
  // Nick DeGuire's Branch Summary
  cwCreatePivots03();
  // Summary by Branch and Type
  cwCreatePivots04();
  // Summary by Specialist and Type
  cwCreatePivots05();
  // Save values back to historical data
  console.log('Save data back to historical data');
  _gac_d.getRange("A1:" + columnToLetter(_gac_d.getLastColumn()) + "40").copyTo(_gac_hd.getRange("B" + (row_id + 1)), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
  endTime(st);
};


function cwUpdateSummaryTables() {
  consoleHeader('Updating summary tables');
  console.log("Emily Clark's Branch Summary");
  // LARGE
  _gac_d.getRange(12, 2).setValue(_gac_d.getRange(48, 3).getValue());
  _gac_d.getRange(12, 3).setValue(_gac_d.getRange(48, 4).getValue());
  // SAP
  _gac_d.getRange(13, 2).setValue(_gac_d.getRange(49, 3).getValue());
  _gac_d.getRange(13, 3).setValue(_gac_d.getRange(49, 4).getValue());
  // Mailboxes
  _gac_d.getRange(14, 2).setValue(_gac_d.getRange(53, 3).getValue());
  _gac_d.getRange(14, 3).setValue(_gac_d.getRange(53, 4).getValue());
  // Totals
  _gac_d.getRange(15, 2).setValue(_gac_d.getRange(12, 2).getValue() + _gac_d.getRange(13, 2).getValue() + _gac_d.getRange(14, 2).getValue());
  _gac_d.getRange(15, 3).setValue(_gac_d.getRange(12, 3).getValue() + _gac_d.getRange(13, 3).getValue() + _gac_d.getRange(14, 3).getValue());
  console.log("Nick DeGuire's Branch Summary");
  // LARGE
  _gac_d.getRange(29, 2).setValue(_gac_d.getRange(57, 3).getValue());
  _gac_d.getRange(29, 3).setValue(_gac_d.getRange(57, 4).getValue());
  // SAP
  _gac_d.getRange(30, 2).setValue(_gac_d.getRange(58, 3).getValue());
  _gac_d.getRange(30, 3).setValue(_gac_d.getRange(58, 4).getValue());
  // Mailboxes
  _gac_d.getRange(31, 2).setValue(_gac_d.getRange(61, 3).getValue());
  _gac_d.getRange(31, 3).setValue(_gac_d.getRange(61, 4).getValue());
  // Totals
  _gac_d.getRange(32, 2).setValue(_gac_d.getRange(29, 2).getValue() + _gac_d.getRange(30, 2).getValue() + _gac_d.getRange(31, 2).getValue());
  _gac_d.getRange(32, 3).setValue(_gac_d.getRange(29, 3).getValue() + _gac_d.getRange(30, 3).getValue() + _gac_d.getRange(31, 3).getValue());
  console.log("EAD Summary");
  for (var i = 4; i <= 7; i++) {
    for (var j = 2; j <= 3; j++) {
      // Mailboxes
      if (i == 6) {
        _gac_d.getRange(i, j).setValue(_gac_d.getRange(78, j + 1).getValue());
      // Totals
      } else if (i == 7) {
        _gac_d.getRange(i, j).setValue(_gac_d.getRange(i - 3, j).getValue() + _gac_d.getRange(i - 2, j).getValue() + _gac_d.getRange(i - 1, j).getValue());
      // Large and SAP
      } else {
        _gac_d.getRange(i, j).setValue(_gac_d.getRange(i + 8, j).getValue() + _gac_d.getRange(i + 25, j).getValue());
      };
    };
  };
  consoleHeader("Updating previous year totals");
  console.log("Emily Clark's Branch Summary");
  // NOS
  _gac_d.getRange(20, 2).setValue(_gac_d.getRange(67, 3).getValue());
  _gac_d.getRange(20, 3).setValue(_gac_d.getRange(67, 4).getValue());
  // OMAO
  _gac_d.getRange(21, 2).setValue(_gac_d.getRange(64, 3).getValue());
  _gac_d.getRange(21, 3).setValue(_gac_d.getRange(64, 4).getValue());
  // SAP
  _gac_d.getRange(22, 2).setValue(_gac_d.getRange(63, 3).getValue());
  _gac_d.getRange(22, 3).setValue(_gac_d.getRange(63, 4).getValue());
  // Mailboxes
  _gac_d.getRange(23, 2).setValue(_gac_d.getRange(53, 3).getValue());
  _gac_d.getRange(23, 3).setValue(_gac_d.getRange(53, 4).getValue());
  // Totals
  _gac_d.getRange(24, 2).setValue(_gac_d.getRange(20, 2).getValue() + _gac_d.getRange(21, 2).getValue() + _gac_d.getRange(22, 2).getValue() + _gac_d.getRange(23, 2).getValue());
  _gac_d.getRange(24, 3).setValue(_gac_d.getRange(20, 3).getValue() + _gac_d.getRange(21, 3).getValue() + _gac_d.getRange(22, 3).getValue() + _gac_d.getRange(23, 3).getValue());
  console.log("Nick DeGuire's Branch Summary");
  // NWS
  _gac_d.getRange(37, 2).setValue(_gac_d.getRange(72, 3).getValue());
  _gac_d.getRange(37, 3).setValue(_gac_d.getRange(72, 4).getValue());
  // SAP
  _gac_d.getRange(38, 2).setValue(_gac_d.getRange(69, 3).getValue());
  _gac_d.getRange(38, 3).setValue(_gac_d.getRange(69, 4).getValue());
  // Mailboxes
  _gac_d.getRange(39, 2).setValue(_gac_d.getRange(61, 3).getValue());
  _gac_d.getRange(39, 3).setValue(_gac_d.getRange(61, 4).getValue());
  // Totals
  _gac_d.getRange(40, 2).setValue(_gac_d.getRange(37, 2).getValue() + _gac_d.getRange(38, 2).getValue() + _gac_d.getRange(39, 2).getValue());
  _gac_d.getRange(40, 3).setValue(_gac_d.getRange(37, 3).getValue() + _gac_d.getRange(38, 3).getValue() + _gac_d.getRange(39, 3).getValue());
};


// EAD Summary by Specialist
function cwCreatePivots01() {
  var name = "EAD Summary by Specialist";
  consoleHeader('Updating "' + name + '" sheet');
  var drange = _gac_w.getRange('A1:' + columnToLetter(_gac_w.getLastColumn()) + _gac_w.getLastRow());
  // Create a new sheet
  _gac_e.activate();
  SpreadsheetApp.flush();
  _gac.deleteActiveSheet();
  // Code will time-out if flush() is not included here
  SpreadsheetApp.flush();
  _gac.insertSheet(0).setName(name);
  _gac_e = _gac.getSheetByName(name);
  // Create pivots
  // Row 1
  cwPivot01('EAD Total WIP', _gac_e, drange, 1, 1, 23, getUniqueValuesInColumn(_gac_w, 'A'), getUniqueValuesInColumn(_gac_w, 'U'),
            getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  var filter_values = ['EAD-NOS MAILBOX', 'EAD-NWS MAILBOX', 'EAD-OMAO MAILBOX', 'EAD-SAP MAILBOX'];
  cwPivot01('Mailboxes', _gac_e, drange, 1, 7, 1, filter_values, getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  // Row 2
  var frow = _gac_e.getLastRow();
  cwPivot01("Stacy Dohse'S NOS Branch", _gac_e, drange, frow + 3, 1, 3, ['NOS'], getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  cwPivot01("James Price's NOS Branch", _gac_e, drange, frow + 3, 7, 3, ['NOS KC'], getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  // Row 3
  frow = _gac_e.getLastRow();
  cwPivot01("Jennifer Hildebrandt's NWS Branch", _gac_e, drange, frow + 3, 1, 3, ['NWS'], getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  cwPivot01("Jackie Shewmaker's NWS Branch", _gac_e, drange, frow + 3, 7, 3, ['NWS KC'], getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  // Row 4
  frow = _gac_e.getLastRow();
  cwPivot01("Dawn Dabney's SAP Branch", _gac_e, drange, frow + 3, 1, 3, ['SAP'], getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  cwPivot01("Steven Prado's SAP Branch", _gac_e, drange, frow + 3, 7, 3, ['SAP KC'], getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  // Row 5
  frow = _gac_e.getLastRow();
  cwPivot01("Andrew Hildebrandt's OMAO Branch", _gac_e, drange, frow + 3, 1, 3, ['OMAO'], getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  // Row 6
  frow = _gac_e.getLastRow();
  _gac_d.getRange('A1:U7').copyTo(_gac_e.getRange(frow + 3, 1), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
  // Row 7
  frow = _gac_e.getLastRow();
  cwPivot01('Mailboxes', _gac_e, drange, frow + 3, 1, 1, filter_values, getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  // Formatting
  changeFont(_gac_e);
  //_gac_e.hideColumns(18, 7);
  // Set title
  _gac_e.insertRows(1, 2);
  _gac_e.getRange(1, 1).setValue('EAD - WIP - ' + Utilities.formatDate(new Date(), 'EST', 'MMMM dd, yyyy'));
  _gac_e.getRange('A1:K1').mergeAcross();
  _gac_e.getRange(1, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontSize(18);
};


// Emily Clark's Branch Summary
function cwCreatePivots02() {
  var name = "Emily Clark's Summary";
  consoleHeader('Updating "' + name + '" sheet');
  var drange = _gac_w.getRange('A1:' + columnToLetter(_gac_w.getLastColumn()) + _gac_w.getLastRow());
  // Create a new sheet
  _gac_ec.activate();
  SpreadsheetApp.flush();
  _gac.deleteActiveSheet();
  SpreadsheetApp.flush();
  _gac.insertSheet(1).setName(name);
  _gac_ec = _gac.getSheetByName(name);
  // Create pivots
  // Row 1
  var filter_values = ['NOS KC', 'SAP', 'NOS', 'OMAO'];
  cwPivot01("Emily Clark's Total WIP", _gac_ec, drange, 1, 1, 23, filter_values, getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  filter_values = ['EAD-SAP MAILBOX', 'EAD-NOS MAILBOX', 'EAD-OMAO MAILBOX'];
  cwPivot01('Mailboxes', _gac_ec, drange, 1, 7, 1, filter_values, getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  // Row 2
  var frow = _gac_ec.getLastRow();
  cwPivot01("Stacy Dohse's NOS Branch", _gac_ec, drange, frow + 3, 1, 3, ['NOS'], getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  cwPivot01("James Price's NOS Branch", _gac_ec, drange, frow + 3, 7, 3, ['NOS KC'], getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  // Row 3
  frow = _gac_ec.getLastRow();
  cwPivot01("Dawn Dabney's SAP Branch", _gac_ec, drange, frow + 3, 1, 3, ['SAP'], getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  cwPivot01("Andrew Hildebrandt's OMAO Branch", _gac_ec, drange, frow + 3, 7, 3, ['OMAO'], getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  // Row 4
  frow = _gac_ec.getLastRow();
  _gac_d.getRange('A9:U15').copyTo(_gac_ec.getRange(frow + 3, 1), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
  // Row 5
  frow = _gac_ec.getLastRow();
  _gac_d.getRange('A17:G24').copyTo(_gac_ec.getRange(frow + 3, 1), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
  // Extra column in row 1
  filter_values = ['NOS KC', 'SAP', 'NOS', 'OMAO', 'EAD-SAP MAILBOX', 'EAD-NOS MAILBOX', 'EAD-OMAO MAILBOX'];
  cwPivot01("Emily Clark's Summary", _gac_ec, drange, 1, 22, 1, filter_values, getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  // Formatting
  changeFont(_gac_ec);
  //_gac_ec.hideColumns(18, 7);
  // Set title
  _gac_ec.insertRows(1, 2);
  _gac_ec.getRange(1, 1).setValue(name + ' - ' + Utilities.formatDate(new Date(), 'EST', 'MMMM dd, yyyy'));
  _gac_ec.getRange('A1:K1').mergeAcross();
  _gac_ec.getRange(1, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontSize(18);
};


// Nick DeGuire's Branch Summary
function cwCreatePivots03() {
  var name = "Nick DeGuire's Summary";
  consoleHeader('Updating "' + name + '" sheet');
  var drange = _gac_w.getRange('A1:' + columnToLetter(_gac_w.getLastColumn()) + _gac_w.getLastRow());
  // Create a new sheet
  _gac_nd.activate();
  SpreadsheetApp.flush();
  _gac.deleteActiveSheet();
  SpreadsheetApp.flush();
  _gac.insertSheet(2).setName(name);
  _gac_nd = _gac.getSheetByName(name);
  // Create pivots
  // Row 1
  var filter_values = ['NWS', 'NWS KC', 'SAP KC'];
  cwPivot01("Nick DeGuire's Total WIP", _gac_nd, drange, 1, 1, 23, filter_values, getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  filter_values = ['EAD-SAP MAILBOX', 'EAD-NWS MAILBOX'];
  cwPivot01('Mailboxes', _gac_nd, drange, 1, 7, 1, filter_values, getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  // Row 2
  var frow = _gac_nd.getLastRow();
  cwPivot01("Jennifer Hildebrandt's NWS Branch", _gac_nd, drange, frow + 3, 1, 3, ['NWS'], getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  cwPivot01("Steven Prado's SAP Branch", _gac_nd, drange, frow + 3, 7, 3, ['SAP KC'], getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  // Row 3
  frow = _gac_nd.getLastRow();
  cwPivot01("Jackie Shewmaker's NWS Branch", _gac_nd, drange, frow + 3, 1, 3, ['NWS KC'], getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  // Row 4
  frow = _gac_nd.getLastRow();
  _gac_d.getRange('A26:U32').copyTo(_gac_nd.getRange(frow + 3, 1), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
  // Row 5
  frow = _gac_nd.getLastRow();
  _gac_d.getRange('A34:G40').copyTo(_gac_nd.getRange(frow + 3, 1), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
  // Extra column in row 1
  filter_values = ['SAP KC', 'NWS KC', 'NWS', 'EAD-SAP MAILBOX', 'EAD-NWS MAILBOX'];
  cwPivot01("Nick DeGuire's Summary", _gac_nd, drange, 1, 22, 1, filter_values, getUniqueValuesInColumn(_gac_w, 'U'), getUniqueValuesInColumn(_gac_w, 'S'), [3, 4, 5]);
  // Formatting
  changeFont(_gac_nd);
  //_gac_nd.hideColumns(18, 7);
  // Set title
  _gac_nd.insertRows(1, 2);
  _gac_nd.getRange(1, 1).setValue(name + ' - ' + Utilities.formatDate(new Date(), 'EST', 'MMMM dd, yyyy'));
  _gac_nd.getRange('A1:K1').mergeAcross();
  _gac_nd.getRange(1, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontSize(18);
};


// Summary by Branch and Type
function cwCreatePivots04() {
  var name = "Summary by Branch and Type";
  consoleHeader('Updating "' + name + '" sheet');
  var drange = _gac_w.getRange('A1:' + columnToLetter(_gac_w.getLastColumn()) + _gac_w.getLastRow());
  // Create a new sheet
  _gac_sb.activate();
  SpreadsheetApp.flush();
  _gac.deleteActiveSheet();
  SpreadsheetApp.flush();
  _gac.insertSheet(3).setName(name);
  _gac_sb = _gac.getSheetByName(name);
  // Create pivots
  cwPivot02("Dawn Dabney's SAP Branch by Contract Type", _gac_sb, drange, 1, 1, ['SAP'], [3]);
  cwPivot02("Jennifer Hildebrandt's NWS Branch by Contract Type", _gac_sb, drange, 1, 5, ['NWS'], [3]);
  cwPivot02("Stacy Dohse's NOS Branch by Contract Type", _gac_sb, drange, 1, 9, ['NOS'], [3]);
  cwPivot02("Andrew Hildebrandt's OMAO Branch by Contract Type", _gac_sb, drange, 1, 13, ['OMAO'], [3]);
  cwPivot02("Steven Prado's SAP Branch by Contract Type", _gac_sb, drange, 1, 17, ['SAP KC'], [3]);
  cwPivot02("Jackie Shewmaker's NWS Branch by Contract Type", _gac_sb, drange, 1, 21, ['NWS KC'], [3]);
  cwPivot02("James Price's NOS Branch by Contract Type", _gac_sb, drange, 1, 25, ['NOS KC'], [3]);
  var filter_values = ['EAD CLOSEOUTS MAILBOX', 'EAD-NOS MAILBOX', 'EAD-NWS MAILBOX', 'EAD-OMAO MAILBOX', 'EAD-SAP MAILBOX'];
  cwPivot02('Mailboxes Unassigned by Contract Type', _gac_sb, drange, 1, 29, filter_values, [3]);
  // Formatting
  changeFont(_gac_sb);
  // Set title
  _gac_sb.insertRows(1, 3);
  _gac_sb.getRange(1, 1).setValue('EAD - WIP - ' + Utilities.formatDate(new Date(), 'EST', 'MMMM dd, yyyy'));
  _gac_sb.getRange(2, 1).setValue('Summary by Branch and Contract Type');
  _gac_sb.getRange(('A1:' + columnToLetter(_gac_sb.getLastColumn()) + '1').toString()).mergeAcross();
  _gac_sb.getRange(1, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontSize(18);
  _gac_sb.getRange(('A2:' + columnToLetter(_gac_sb.getLastColumn()) + '2').toString()).mergeAcross();
  _gac_sb.getRange(2, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontSize(18);
};


// Summary by Specialist and Type
function cwCreatePivots05() {
  var name = 'Summary by Specialist and Type';
  consoleHeader('Updating "' + name + '" sheet');
  var drange = _gac_w.getRange('A1:' + columnToLetter(_gac_w.getLastColumn()) + _gac_w.getLastRow());
  // Create a new sheet
  _gac_ss.activate();
  SpreadsheetApp.flush();
  _gac.deleteActiveSheet();
  SpreadsheetApp.flush();
  _gac.insertSheet(4).setName(name);
  _gac_ss = _gac.getSheetByName(name);
  // Create pivots
  cwPivot03("Dawn Dabney's SAP Branch by Contract Type", _gac_ss, drange, 1, 1, ['SAP'], [4]);
  cwPivot03("Jennifer Hildebrandt's NWS Branch by Contract Type", _gac_ss, drange, 1, 6, ['NWS'], [4]);
  cwPivot03("Stacy Dohse's NOS Branch by Contract Type", _gac_ss, drange, 1, 11, ['NOS'], [4]);
  cwPivot03("Andrew Hildebrandt's OMAO Branch by Contract Type", _gac_ss, drange, 1, 16, ['OMAO'], [4]);
  cwPivot03("Steven Prado's SAP Branch by Contract Type", _gac_ss, drange, 1, 21, ['SAP KC'], [4]);
  cwPivot03("Jackie Shewmaker's NWS Branch by Contract Type", _gac_ss, drange, 1, 26, ['NWS KC'], [4]);
  cwPivot03("James Price's NOS Branch by Contract Type", _gac_ss, drange, 1, 31, ['NOS KC'], [4]);
  var filter_values = ['EAD CLOSEOUTS MAILBOX', 'EAD-NOS MAILBOX', 'EAD-NWS MAILBOX', 'EAD-OMAO MAILBOX', 'EAD-SAP MAILBOX'];
  cwPivot03('Mailboxes Unassigned by Specialist and Contract Type', _gac_ss, drange, 1, 36, filter_values, [4]);
  // Formatting
  changeFont(_gac_ss);
  // Set title
  _gac_ss.insertRows(1, 3);
  _gac_ss.getRange(1, 1).setValue('EAD - WIP - ' + Utilities.formatDate(new Date(), 'EST', 'MMMM dd, yyyy'));
  _gac_ss.getRange(2, 1).setValue('Summary by Specialist and Contract Type');
  _gac_ss.getRange(('A1:' + columnToLetter(_gac_ss.getLastColumn()) + '1').toString()).mergeAcross();
  _gac_ss.getRange(1, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontSize(18);
  _gac_ss.getRange(('A2:' + columnToLetter(_gac_ss.getLastColumn()) + '2').toString()).mergeAcross();
  _gac_ss.getRange(2, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontSize(18);
};


function cwPivot01(title, sheet, data_range, row_start, column_start, pivot_column, filter1, filter2, filter3, formatting_fields) {
  console.log(title);
  // Set title
  sheet.getRange(row_start, column_start).setValue(title);
  // Create Pivot
  var pivotTable = sheet.getRange(row_start + 1, column_start).createPivotTable(data_range);
  // Rows
  pivotTable.addRowGroup(pivot_column);
  // Values
  pivotValue = pivotTable.addPivotValue(pivot_column, SpreadsheetApp.PivotTableSummarizeFunction.COUNTA);
  pivotValue.setDisplayName('Actions');
  pivotValue = pivotTable.addPivotValue(9, SpreadsheetApp.PivotTableSummarizeFunction.SUM);
  pivotValue.setDisplayName('Commit Amount');
  pivotValue = pivotTable.addPivotValue(10, SpreadsheetApp.PivotTableSummarizeFunction.SUM);
  pivotValue.setDisplayName('Total Obligations');
  pivotValue = pivotTable.addPivotValue(11, SpreadsheetApp.PivotTableSummarizeFunction.SUM);
  pivotValue.setDisplayName('Total Value of Actions');
  // Filters
  var criteria = SpreadsheetApp.newFilterCriteria().setVisibleValues(filter1).build();
  pivotTable.addFilter(1, criteria);
  var criteria = SpreadsheetApp.newFilterCriteria().setVisibleValues(filter2).build();
  pivotTable.addFilter(21, criteria);
  var criteria = SpreadsheetApp.newFilterCriteria().setVisibleValues(filter3).build();
  pivotTable.addFilter(19, criteria);
  // Formatting
  pivotTableCleanup(sheet, row_start, column_start, 5, formatting_fields, 1);
};


// Summary by Branch and Type
function cwPivot02(title, sheet, data_range, row_start, column_start, filter1, formatting_fields) {
  console.log(title);
  // Set title
  sheet.getRange(row_start, column_start).setValue(title);
  // Create Pivot
  var pivotTable = sheet.getRange(row_start + 1, column_start).createPivotTable(data_range);
  // Rows
  pivotTable.addRowGroup(13);
  // Values
  pivotValue = pivotTable.addPivotValue(1, SpreadsheetApp.PivotTableSummarizeFunction.COUNTA);
  pivotValue.setDisplayName('Actions');
  pivotValue = pivotTable.addPivotValue(9, SpreadsheetApp.PivotTableSummarizeFunction.SUM);
  pivotValue.setDisplayName('Commit Amount');
  // Filters
  var criteria = SpreadsheetApp.newFilterCriteria().setVisibleValues(filter1).build();
  pivotTable.addFilter(1, criteria);
  // Formatting
  pivotTableCleanup(sheet, row_start, column_start, 3, formatting_fields, );
};


// Summary by Specialist and Type
function cwPivot03(title, sheet, data_range, row_start, column_start, filter1, formatting_fields) {
  console.log(title);
  // Set title
  sheet.getRange(row_start, column_start).setValue(title);
  // Create Pivot
  var pivotTable = sheet.getRange(row_start + 1, column_start).createPivotTable(data_range);
  // Rows
  var pivotGroup = pivotTable.addRowGroup(2);
  pivotGroup = pivotTable.addRowGroup(13);
  pivotGroup.showTotals(false);
  // Values
  pivotValue = pivotTable.addPivotValue(1, SpreadsheetApp.PivotTableSummarizeFunction.COUNTA);
  pivotValue.setDisplayName('Actions');
  pivotValue = pivotTable.addPivotValue(9, SpreadsheetApp.PivotTableSummarizeFunction.SUM);
  pivotValue.setDisplayName('Commit Amount');
  // Filters
  var criteria = SpreadsheetApp.newFilterCriteria().setVisibleValues(filter1).build();
  pivotTable.addFilter(1, criteria);
  // Formatting
  pivotTableCleanup(sheet, row_start, column_start, 4, formatting_fields, );
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// Step 9 ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function draftEmail() {
  var st = Date.now();
  SpreadsheetApp.flush();
  consoleHeader('Step 9: Send emails to branch chiefs');
  //////////////////////////////////////////////////////////////////////
  // Body
  var body = "Good Morning,<br><br>";
  body += "This week's WIP's are ready for your review:<br><br>";
  body += "<a href=\"https://docs.google.com/spreadsheets/d/" + _file_nos + "\">NOS Stacy WIP</a>, ";
  body += "<a href=\"https://drive.google.com/drive/folders/" + _wip_folder_nos + "\">Folder</a><br>";
  body += "<a href=\"https://docs.google.com/spreadsheets/d/" + _file_noskc + "\">NOS James WIP</a>, ";
  body += "<a href=\"https://drive.google.com/drive/folders/" + _wip_folder_noskc + "\">Folder</a><br>";
  body += "<a href=\"https://docs.google.com/spreadsheets/d/" + _file_nws + "\">NWS Jennifer WIP</a>, ";
  body += "<a href=\"https://drive.google.com/drive/folders/" + _wip_folder_nws + "\">Folder</a><br>";
  body += "<a href=\"https://docs.google.com/spreadsheets/d/" + _file_nwskc + "\">NWS Jackie WIP</a>, ";
  body += "<a href=\"https://drive.google.com/drive/folders/" + _wip_folder_nwskc + "\">Folder</a><br>";
  body += "<a href=\"https://docs.google.com/spreadsheets/d/" + _file_omao + "\">OMAO WIP</a>, ";
  body += "<a href=\"https://drive.google.com/drive/folders/" + _wip_folder_omao + "\">Folder</a><br>";
  body += "<a href=\"https://docs.google.com/spreadsheets/d/" + _file_sap + "\">SAP Dawn WIP</a>, ";
  body += "<a href=\"https://drive.google.com/drive/folders/" + _wip_folder_sap + "\">Folder</a><br>";
  body += "<a href=\"https://docs.google.com/spreadsheets/d/" + _file_sapkc + "\">SAP Steven WIP</a>, ";
  body += "<a href=\"https://drive.google.com/drive/folders/" + _wip_folder_sapkc + "\">Folder</a><br>";
  body += "<a href=\"https://docs.google.com/spreadsheets/d/" + _file_cw + "\">Consolidated WIP</a>, ";
  body += "<a href=\"https://drive.google.com/drive/folders/" + _wip_folder_cw + "\">Folder</a><br><br>";
  body += "As always, here are some notes about the WIP:<br><br>";
  body += "<li>A workspace (requirements or modification) must be associated with a requisition in PRISM in order for the requisition dollar value to populate on the WIP.</li>";
  body += "<li>Please note that the requisition includes the funding and a workspace includes the supporting documents.</li>";
  body += "<li>Multiple requisitions and multiple workspaces should not be submitted for the same action. If a requisition requires additional funding or to be edited, then it should be returned to the client to be amended.</li>";
  body += "<li>If none of your actions are populating and the above two bullets do not resolve this, ensure that your Group in PRISM is accurate, i.e. \"EAD-NOS, EAD-NWS, EAD-OMAO, etc.\"</li>";
  body += "<li>A modification (or requirements) workspace should be closed once it is completed in order for it to be removed from the WIP.</li>";
  body += "<li>Please refer to the <a href=\"https://drive.google.com/file/d/1IHcoAemD0anuMn6SVYk350H8-MTcB0I-/view?usp=drive_link\">WIP SOP</a> for instructions on how to utilize the WIP.</li>";
  body += "<li>The PALT is from the <a href=\"https://docs.google.com/spreadsheets/d/1ZGR5b9fCF213jQ2trdov_PdLBgqjzRCk\">DOC Acquisition Planning Timeline Tool</a>.</li>";
  body += "<li>There will always be a number in the PRISM AAP column, which is the last five of the requisition number.</li><br>";
  body += "Please contact me or Carley if you have any questions.<br><br>";
  //////////////////////////////////////////////////////////////////////
  // Signature
  var signature = parseFullName() + '<br>';
  signature += 'NOAA, AGO<br>';
  signature += 'Eastern Acquisition Division';
  //////////////////////////////////////////////////////////////////////
  // Draft Email
  GmailApp.createDraft("stacy.dohse@noaa.gov, james.e.price@noaa.gov, jennifer.hildebrandt@noaa.gov, jackie.a.shewmaker@noaa.gov, andrew.hildebrandt@noaa.gov, dawn.dabney@noaa.gov, steven.m.prado@noaa.gov, nicholas.j.deguire@noaa.gov",
                       "EAD WIP Updated - " + Utilities.formatDate(new Date(), "EST", "M/dd"),
                       "",
                       {cc: "carley.flaxman@noaa.gov, emily.clark@noaa.gov, melissa.r.sampson@noaa.gov",
                        htmlBody: body + signature
  });
  endTime(st);
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// Accessory Functions ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function getVariables() {
  // Working WIP
  _ga = SpreadsheetApp.getActive();
  _ga_raw = _ga.getSheetByName('Raw AGO WIP');
  _ga_rew = _ga.getSheetByName('Raw EAD WIP');
  _ga_cw = _ga.getSheetByName('Current WIP');
  _ga_ww = _ga.getSheetByName('Working WIP');
  _ga_rf = _ga.getSheetByName('Raw Forecasting');
  _ga_nwc = _ga.getSheetByName('Requisitions Need Workspaces - Current');
  _ga_nww = _ga.getSheetByName('Requisitions Need Workspaces - Working');
  _ga_di = _ga.getSheetByName('Duplicate Items');
  _ga_dv = _ga.getSheetByName('Data Values');
  // File and folder IDs
  _file_ww = "";
  _folder_ww = "";
  _file_nos = "";
  _folder_nos = "";
  _file_noskc = "";
  _folder_noskc = "";
  _file_nws = "";
  _folder_nws = "";
  _file_nwskc = "";
  _folder_nwskc = "";
  _file_omao = "";
  _folder_omao = "";
  _file_sap = "";
  _folder_sap = "";
  _file_sapkc = "";
  _folder_sapkc = "";
  //_file_closeout = "";
  //_folder_closeout = "";
  _file_cw = "";
  _folder_cw = "";
  // Consolidated WIP
  _gac = SpreadsheetApp.openById(_file_cw);
  _gac_e = _gac.getSheetByName('EAD Summary by Specialist');
  _gac_ec = _gac.getSheetByName("Emily Clark's Summary");
  _gac_nd = _gac.getSheetByName("Nick DeGuire's Summary");
  _gac_sb = _gac.getSheetByName('Summary by Branch and Type');
  _gac_ss = _gac.getSheetByName('Summary by Specialist and Type');
  _gac_w = _gac.getSheetByName('WIP');
  _gac_d = _gac.getSheetByName('Data Values');
  _gac_hd = _gac.getSheetByName('Historical Data');
  // WIP folder IDs
  _wip_folder_nos = "";
  _wip_folder_noskc = "";
  _wip_folder_nws = "";
  _wip_folder_nwskc = "";
  _wip_folder_omao = "";
  _wip_folder_sap = "";
  _wip_folder_sapkc = "";
  _wip_folder_cw = "";
  _folder_ago_wip = "";
};


function getVariablesDev() {
  _ga = SpreadsheetApp.getActive();
  _ga_raw = _ga.getSheetByName('Raw AGO WIP');
  _ga_rew = _ga.getSheetByName('Raw EAD WIP');
  _ga_cw = _ga.getSheetByName('Current WIP');
  _ga_ww = _ga.getSheetByName('Working WIP');
  _ga_rf = _ga.getSheetByName('Raw Forecasting');
  _ga_nwc = _ga.getSheetByName('Requisitions Need Workspaces - Current');
  _ga_nww = _ga.getSheetByName('Requisitions Need Workspaces - Working');
  _ga_di = _ga.getSheetByName('Duplicate Items');
  _ga_dv = _ga.getSheetByName('Data Values');
  // File and archive folder IDs
 _file_ww = "";
  _folder_ww = "";
  _file_nos = "";
  _folder_nos = "";
  _file_noskc = "";
  _folder_noskc = "";
  _file_nws = "";
  _folder_nws = "";
  _file_nwskc = "";
  _folder_nwskc = "";
  _file_omao = "";
  _folder_omao = "";
  _file_sap = "";
  _folder_sap = "";
  _file_sapkc = "";
  _folder_sapkc = "";
  //_file_closeout = "";
  //_folder_closeout = "";
  _file_cw = "";
  _folder_cw = "";
  // Consolidated WIP
  _gac = SpreadsheetApp.openById(_file_cw);
  _gac_e = _gac.getSheetByName('EAD Summary by Specialist');
  _gac_ec = _gac.getSheetByName("Emily Clark's Summary");
  _gac_nd = _gac.getSheetByName("Nick DeGuire's Summary");
  _gac_sb = _gac.getSheetByName('Summary by Branch and Type');
  _gac_ss = _gac.getSheetByName('Summary by Specialist and Type');
  _gac_w = _gac.getSheetByName('WIP');
  _gac_d = _gac.getSheetByName('Data Values');
  _gac_hd = _gac.getSheetByName('Historical Data');
  // WIP folder IDs
  _wip_folder_nos = "";
  _wip_folder_noskc = "";
  _wip_folder_nws = "";
  _wip_folder_nwskc = "";
  _wip_folder_omao = "";
  _wip_folder_sap = "";
  _wip_folder_sapkc = "";
  _wip_folder_cw = "";
  _folder_ago_wip = "";
};


function archiveFile(file_id, folder_id) {
  var gao = DriveApp.getFileById(file_id);
  var gao_name = gao.getName(); 
  gao.makeCopy();
  var new_name = gao_name + ' ' + currentMonday();
  var folder = DriveApp.getFolderById(folder_id);
  var files = folder.getFiles();
  while (files.hasNext()){
    var file = files.next();
    var file_name = file.getName();
    if (file_name == new_name) {
      file.setTrashed(true);
    };
  };
  DriveApp.getFilesByName('Copy of ' + gao_name).next().setName(new_name).moveTo(DriveApp.getFolderById(folder_id));
};


// Date format will be in yyyyMMdd; update accordingly
function currentMonday() {
  var date = new Date();
  var newDate = date.setDate(date.getDate() - date.getDay() + 1);
  return Utilities.formatDate(new Date(newDate), "CST", "yyyyMMdd");
};


function trimClean(text) {
  return text.toString().toLowerCase().trim().replace(/-/g, '').replace(/\s/g, '');
};


function dateDiff(start_date, end_date, unit) {
  var sdate_y = start_date.substring(0,4);
  var sdate_m = start_date.substring(4,6);
  var sdate_d = start_date.substring(6,8);
  var edate_y = end_date.substring(0,4);
  var edate_m = end_date.substring(4,6);
  var edate_d = end_date.substring(6,8);
  if (sdate_m > 12 || edate_m > 12) {
    return 'One or more of the months specified is greater than 12. Make sure the dates inputted are in the "yyyymmdd" format; for example: January 31, 2024 will be "20240131". Exiting...';
  } else if (sdate_d > 31 || edate_d > 31) {
    return 'One or more of the days specified is greater than 31. Make sure the dates inputted are in the "yyyymmdd" format; for example: January 31, 2024 will be "20240131". Exiting...';
  } else if (start_date.length != 8 || end_date.length != 8) {
    return 'One or more of the dates specified is not inputted in the "yyyymmdd" format. Exiting...';
  };
  // For some reason, the months need to be subtracted by 1 when converted to a new date
  var sdate_new = new Date(sdate_y, sdate_m - 1, sdate_d).getTime();
  var edate_new = new Date(edate_y, edate_m - 1, edate_d).getTime();
  var day_ms = 1000*60*60*24;
  var diff_date = (edate_new-sdate_new)/day_ms;
  if (unit == 'd') {
    return diff_date;
  } else if (unit == 'w') {
    return diff_date/7;
  } else if (unit == 'm') {
    return diff_date/(365/12);
  } else if (unit == 'y') {
    return diff_date/365;
  } else {
    return 'Improper unit specified. Input "d", "w", "m", or "y". Exiting...';
  };
};


function consoleHeader(txt) {
  var txt_len = txt.length;
  var len_diff = 80 - (txt_len + 2);
  console.log('#'.repeat(len_diff/2) + ' ' + txt + ' ' + '#'.repeat(len_diff/2));
};


function findLastPosition(spreadsheet, name_length, search_string) {
  console.log('Find Last Position for Searched Sheet');
  var sh_lst = [];
  var sh_name = ''
  var sheets = spreadsheet.getSheets();
  // Identify all applicable WIPs
  for (var i = 0 ; i < sheets.length ; i++) {
    sh_name = trimClean(sheets[i].getName());
    if (sh_name.length == name_length && sh_name.substring(0, search_string.length) == search_string) {
      sh_lst.push(sheets[i].getName());
    };
  };
  // Find latest WIP
  for (var i = 0 ; i < sh_lst.length ; i++) {
    sh_name = trimClean(sh_lst[i]);
    var wdate = sh_name.slice(-8);
    var ldate = 0;
    if (wdate > ldate) {
      ldate = wdate;
      var sh_n = sh_lst[i];
    };
  };
  return [spreadsheet.getSheetByName(sh_n).getIndex(), sh_n];
};


function vLookupList(start_column, end_column) {
  var lrow = _ga_dv.getRange(1, start_column).getDataRegion(SpreadsheetApp.Dimension.ROWS).getLastRow();
  var rng = columnToLetter(start_column) + "2:" + columnToLetter(end_column) + lrow
  return _ga_dv.getRange(rng).getValues();
};


function vLookup(search_value, list, col_return_num, case_match) {
  // Calculate last row depending on column searchedsheet
  for (var i = 0; i < list.length; i++) {
    if (case_match == 0) {
      if (search_value.toLowerCase() == list[i][0].toLowerCase()) {
        return list[i][col_return_num - 1];
      };
    } else {
      if (search_value == list[i][0]) {
        return list[i][col_return_num - 1];
      };
    };
  };
};


function vLookup2(search_value, sheet, col_search_num, col_return_num, case_match) {
  // Calculate last row depending on column searchedsheet
  var lrow = sheet.getRange(1, col_search_num).getDataRegion(SpreadsheetApp.Dimension.ROWS).getLastRow();
  for (var i = 2; i <= lrow; i++) {
    if (case_match == 0) {
      if (search_value.toLowerCase() == sheet.getRange(i, col_search_num).getValue().toLowerCase()) {
        return sheet.getRange(i, col_return_num).getValue();
      };
    } else {
      if (search_value == sheet.getRange(i, col_search_num).getValue()) {
        return sheet.getRange(i, col_return_num).getValue();
      };
    };
  };
};


function endTime(start) {
  var total_ms = Date.now() - start;
  var s_ms = (total_ms/1000).toString().split('.');
  if (s_ms[0] == 0) {
    console.log('Finished in: 0m 0.' + s_ms[1].substring(0,3) + 's');
  } else {
    var m_s = (s_ms[0]/60).toString().split('.');
    var final_s = (Number('.' + m_s[1])*60).toString().substring(0,3);
    var final_m = m_s[0];
    console.log('Finished in: ' + final_m + 'm ' + final_s.replace('.', '') + 's');
  };
};


function getUniqueValuesInColumn(sheet, column_letter) {
  var rng = sheet.getRange(column_letter + ':' + column_letter).getValues();
  var rng_list = [];
  for (i = 0; i < rng.length; i++) {
    rng_list.push(rng[i][0]);
  };
  var noduplicates = new Set(rng_list);
  var unique_values = [];
  noduplicates.forEach(x => unique_values.push(x));
  // Remove first value, which normally would be the column header
  var first_value = unique_values[0];
  var final_list = unique_values.filter((value) => value != first_value);
  return final_list.sort();
};


// https://stackoverflow.com/questions/17632165/determining-the-last-row-in-a-single-column
function columnToLetter(column) {
  var temp, letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  };
  return letter;
};
function letterToColumn(letter) {
  var column = 0, length = letter.length;
  for (var i = 0; i < length; i++) {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  };
  return column;
};
function getLastDataColumn(sheet) {
  var lastCol = sheet.getLastColumn();
  var range = sheet.getRange(columnToLetter(lastCol) + "1");
  if (range.getValue() !== '') {
    return lastCol;
  } else {
    return range.getNextDataCell(SpreadsheetApp.Direction.PREVIOUS).getColumn();
  };
};
function getLastDataRow(sheet, column_number) {
  var column_letter = columnToLetter(column_number);
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(column_letter + lastRow);
  if (range.getValue() !== '') {
    return lastRow;
  } else {
    return range.getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  };
};
function getLastDataColumnRow(sheet, row) {
  //var column_letter = columnToLetter(column_number);
  var last_column = sheet.getLastColumn();
  var range = sheet.getRange(row, last_column);
  if (range.getValue() !== '') {
    return last_column;
  } else {
    return range.getNextDataCell(SpreadsheetApp.Direction.PREVIOUS).getColumn();
  };
};


function getFirstRow(sheet, first_column) {
  if (sheet.getRange(1, first_column).getValue() == '') {
    return 1;
  } else {
    return getLastDataRow(sheet, first_column) + 3;
  };
};


function deleteData(sheet) {
  sheet.getRange('A2:' + columnToLetter(sheet.getLastColumn()) + (sheet.getLastRow() + 1)).deleteCells(SpreadsheetApp.Dimension.ROWS);
};


function parseFullName() {
  var un = Session.getActiveUser().getUsername();
  var un2 = un.split(".");
  var nlength = un2.length;
  // First name
  var fname = un2[0];
  var fname_final = fname.substring(0,1).toUpperCase() + fname.substring(1, fname.length);
  // Last name
  var lname = un2[nlength - 1];
  var lname_final = lname.substring(0,1).toUpperCase() + lname.substring(1, lname.length);
  return fname_final + " " + lname_final;
};


function addHistoricalTotals() {
  for (var i = 48; i <= 51; i++) {
    console.log("Working row: " + i);
    // EAD WIP Summary
    console.log("EAD WIP Summary")
    for (var j = 3; j <= 22; j++) {
      var row_id = 7 + (i * 42);
      _gac_hd.getRange(row_id, j).setValue(_gac_hd.getRange(row_id - 3, j).getValue() + _gac_hd.getRange(row_id - 2, j).getValue() + _gac_hd.getRange(row_id - 1, j).getValue());
    };
    // Emily Clark Summary
    console.log("Emily Clark Summary")
    for (j = 3; j <= 22; j++) {
      row_id = 15 + (i * 42);
      _gac_hd.getRange(row_id, j).setValue(_gac_hd.getRange(row_id - 3, j).getValue() + _gac_hd.getRange(row_id - 2, j).getValue() + _gac_hd.getRange(row_id - 1, j).getValue());
    };
    // Emily Clark WIP Summary
    console.log("Emily Clark WIP Summary")
    for (j = 3; j <= 8; j++) {
      row_id = 24 + (i * 42);
      _gac_hd.getRange(row_id, j).setValue(_gac_hd.getRange(row_id - 4, j).getValue() + _gac_hd.getRange(row_id - 3, j).getValue() + _gac_hd.getRange(row_id - 2, j).getValue() + _gac_hd.getRange(row_id - 1, j).getValue());
    };
    // Nick DeGuire Summary
    console.log("Nick DeGuire Summary")
    for (j = 3; j <= 22; j++) {
      row_id = 32 + (i * 42);
      _gac_hd.getRange(row_id, j).setValue(_gac_hd.getRange(row_id - 3, j).getValue() + _gac_hd.getRange(row_id - 2, j).getValue() + _gac_hd.getRange(row_id - 1, j).getValue());
    };
    // Nick DeGuire WIP Summary
    console.log("Nick DeGuire WIP Summary")
    for (j = 3; j <= 8; j++) {
      row_id = 40 + (i * 42);
      _gac_hd.getRange(row_id, j).setValue(_gac_hd.getRange(row_id - 3, j).getValue() + _gac_hd.getRange(row_id - 2, j).getValue() + _gac_hd.getRange(row_id - 1, j).getValue());
    };
  };
};


// Insert data from a list into a sheet
function insertData(list, sheet) {
  if (list.length != 0) {
    sheet.getRange(2, 1, list.length, list[0].length).setValues(list);
    changeFont(sheet)
  };
  /*
  if (column_offset == undefined || column_offset == 0) {
    sheet.getRange(2, 1, list.length, list[0].length + column_offset).setValues(list);
  } else {
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[0].length + column_offset; j++) {
        sheet.getRange(i + 2, j + 1).setValue(list[i][j]);
      };
    };    
  };
  */
};


// Save all data from sheet
function rangeValues(sheet, column_offset, row_offset) {
  return sheet.getRange("A2:" + columnToLetter(sheet.getLastColumn() + column_offset) + (sheet.getLastRow() + row_offset)).getValues();
};


// Change font to Times New Roman
function changeFont(sheet) {
  sheet.getRange("A:" + columnToLetter(sheet.getLastColumn())).setFontFamily('Times New Roman');
};








////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// NOS Status Report
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function pullValues(row_num, co_ind) {
  var template_folder = DriveApp.getFolderById("");
  var sheet = SpreadsheetApp.getActiveSheet();
  var contract = sheet.getRange(row_num, 1).getValue();
  var order = sheet.getRange(row_num, 2).getValue();
  if (order.toLowerCase() != "n/a") {
    contract = contract + " " + order;
    var contract_type = "Order";
  } else {
    var contract_type = "Contract";
  };
  var description = sheet.getRange(row_num, 3).getValue();
  var contractor = sheet.getRange(row_num, 4).getValue();
  var customer = sheet.getRange(row_num, 5).getValue();
  if (customer.indexOf("NCCOS") >= 0) {
    customer = "National Centers for Coastal Ocean Science (NCCOS)";
  };
  var type = sheet.getRange(row_num, 6).getValue();
  var total_value = sheet.getRange(row_num, 9).getValue();
  var pop = sheet.getRange(row_num, 10).getValue();
  var cor_poc = sheet.getRange(row_num, 16).getValue();
  var contractor_poc = sheet.getRange(row_num, 17).getValue();
  if (co_ind == 0) {
    var contracting_officer = Browser.inputBox("Enter Contracting Officer Name");
  } else {
    var contracting_officer = 1;
  }
  return [template_folder, // 0
          contract, // 1
          order, // 2
          contract_type, // 3
          description, // 4
          contractor, // 5
          customer, // 6
          type, // 7
          total_value, // 8
          pop, // 9
          cor_poc, // 10
          contractor_poc, // 11
          contracting_officer // 12
  ];
};


function generate120DayLetter() {
  // Get active row
  var arow = SpreadsheetApp.getSelection().getCurrentCell().getRow();
  // Initial check
  consoleHeader("Initial Check");
  var errors = errorTest(arow);
  if (errors[0] == 1) {
    Browser.msgBox(errors[1]);
    return;
  };
  // Pull values
  consoleHeader("Pulling Values");
  var values = pullValues(arow, 0);
  consoleHeader("Check PoP");
  var pop = parsePOP(values[9].split("\n"));
  if (pop == undefined) {
    Browser.msgBox("Cell does not appear to have option years available. Make sure the Period of Performance cell has option years in the future. Exiting...");
    return;
  } else if (pop[0] == "Error") {
    Browser.msgBox(pop[1]);
    return;
  } else if (pop.length > 7) {
    Browser.msgBox("Cell does not appear to have option years. Make sure the Period of Performance cell has option years specified. Exiting...");
    return;
  };
  // Open word doc and rename
  // All documents will be saved in root folder
  consoleHeader("Creating Word Doc");
  DriveApp.getFileById("").makeCopy(values[0])
  var newname = "120-Day Letter Option " + pop[0] + " " + values[1];
  DriveApp.getFilesByName("Copy of 120-Day Letter Template").next().setName(newname);
  // Loop through files in current folder to find the copied generated previously
  var files = values[0].getFiles();
  var nid = "";
  // Loop through folder till you find the new file, then save it's Id
  while (files.hasNext()){
    file = files.next();
    // Only save Id if its the copied file
    if (file.getName() == newname) {
      nid = file.getId();
    };
  };
  // Open doc and replace fields with pulled data
  consoleHeader("Inputting Values");
  var doc = DocumentApp.openById(nid);
  var body = doc.getBody();
  body.replaceText("{Date}", Utilities.formatDate(new Date(), "EST", "MMMM d, yyyy"));
  body.replaceText("{COR}", parseNameEmail(values[10].split("\n"))[0]);
  body.replaceText("{ContractingOfficer}", values[12]);
  body.replaceText("{Contract}", values[1]);
  body.replaceText("{Description}", values[4]);
  body.replaceText("{ContractType}", values[3]);
  body.replaceText("{Contractor}", values[5]);
  body.replaceText("{Customer}", values[6]);
  body.replaceText("{Expiration}", pop[6]);
  body.replaceText("{OptionYear}", pop[0]);
  body.replaceText("{POPStart}", pop[3]);
  body.replaceText("{POPEnd}", pop[4]);
  body.replaceText("{Return}", Utilities.formatDate(new Date(new Date().getTime() + 3600000*24*30), "EST", "MMMM d, yyyy"));
  body.replaceText("{ContactName}", parseFullName());
  body.replaceText("{ContactEmail}", Session.getActiveUser().getEmail());
  doc.saveAndClose();
  consoleHeader("Finished");
  Browser.msgBox("Letter drafted...");
  redirectFolder();
};


function generate60DayLetter() {
  // Get active row
  var arow = SpreadsheetApp.getSelection().getCurrentCell().getRow();
  // Initial check
  consoleHeader("Initial Check");
  var errors = errorTest(arow);
  if (errors[0] == 1) {
    Browser.msgBox(errors[1]);
    return;
  };  
  consoleHeader("Pulling Values");
  var values = pullValues(arow, 0);
  consoleHeader("Check PoP");
  var pop = parsePOP(values[9].split("\n"));
  if (pop == undefined) {
    Browser.msgBox("Cell does not appear to have option years available. Make sure the Period of Performance cell has option years in the future. Exiting...");
    return;
  } else if (pop[0] == "Error") {
    Browser.msgBox(pop[1]);
    return;
  } else if (pop.length > 7) {
    Browser.msgBox("Cell does not appear to have option years. Make sure the Period of Performance cell has option years specified. Exiting...");
    return;
  };
  var contractor_full = parseNameEmail(values[11].split("\n"));
  var contractor_fullname = contractor_full[0].split(" ");
  // Open word doc and rename
  // All documents will be saved in root folder
  consoleHeader("Creating Word Doc");
  DriveApp.getFileById("").makeCopy(values[0])  
  var newname = "60-Day Letter Option " + pop[0] + " " + values[1];
  DriveApp.getFilesByName("Copy of 60-Day Letter Template").next().setName(newname);
  // Loop through files in current folder to find the copied generated previously
  var files = values[0].getFiles();
  var nid = "";
  // Loop through folder till you find the new file, then save it's Id
  while (files.hasNext()){
    file = files.next();
    // Only save Id if its the copied file
    if (file.getName() == newname) {
      nid = file.getId();
    };
  };
  // Open doc and replace fields with pulled data
  consoleHeader("Inputting Values");
  var doc = DocumentApp.openById(nid);
  var body = doc.getBody();
  body.replaceText("{Date}", Utilities.formatDate(new Date(), "EST", "MMMM d, yyyy"));
  body.replaceText("{ContractingOfficer}", values[12]);
  body.replaceText("{Contract}", values[1]);
  body.replaceText("{Description}", values[4]);
  body.replaceText("{ContractType}", values[3]);
  body.replaceText("{Contractor}", values[5]);
  body.replaceText("{ContractorPOC}", contractor_full[0]);
  body.replaceText("{ContractorPOCEmail}", contractor_full[1]);
  body.replaceText("{ContractorGreeting}", contractor_fullname[contractor_fullname.length - 1]);
  body.replaceText("{OptionYear}", pop[0]);
  body.replaceText("{ContactName}", parseFullName());
  body.replaceText("{ContactEmail}", Session.getActiveUser().getEmail());
  doc.saveAndClose();
  consoleHeader("Finished");
  Browser.msgBox("Letter drafted...");
  redirectFolder();
};


function generateCORDelegation() {
  // Get active row
  var arow = SpreadsheetApp.getSelection().getCurrentCell().getRow();
  // Initial check
  consoleHeader("Initial Check");
  var errors = errorTest(arow);
  if (errors[0] == 1) {
    Browser.msgBox(errors[1]);
    return;
  };
  consoleHeader("Pulling Values");
  var values = pullValues(arow, 0);
  // Open word doc and rename
  consoleHeader("Creating Word Doc");
  DriveApp.getFileById("").makeCopy(values[0]) 
  var newname = "COR Delegation Letter " + values[1];
  DriveApp.getFilesByName("Copy of COR Delegation Letter Template").next().setName(newname);
  // Loop through files in current folder to find the copied generated previously
  var files = values[0].getFiles();
  var nid = ""
  // Loop through folder till you find the new file, then save it's Id
  while (files.hasNext()){
    file = files.next();
    // Only save Id if its the copied file
    if (file.getName() == newname) {
      nid = file.getId();
    };
  };
  // Open doc and replace fields with pulled data
  consoleHeader("Inputting Values");
  var doc = DocumentApp.openById(nid);
  var body = doc.getBody();
  body.replaceText("{Date}", Utilities.formatDate(new Date(), "EST", "MMMM d, yyyy"));
  body.replaceText("{COR}", parseNameEmail(values[10].split("\n"))[0]);
  body.replaceText("{ContractingOfficer}", values[12]);
  body.replaceText("{Contract}", values[1]);
  body.replaceText("{Description}", values[4]);
  body.replaceText("{ContractType}", values[3]);
  body.replaceText("{Contractor}", values[5]);
  body.replaceText("{Customer}", values[6]);
  doc.saveAndClose();
  consoleHeader("Finished");
  Browser.msgBox("Letter drafted...");
  redirectFolder();
};


function generateModMemorandum() {
  // Get active row
  var arow = SpreadsheetApp.getSelection().getCurrentCell().getRow();
  // Initial check
  consoleHeader("Initial Check");
  var errors = errorTest(arow);
  if (errors[0] == 1) {
    Browser.msgBox(errors[1]);
    return;
  };
  // Pull values
  consoleHeader("Pulling Values");
  var values = pullValues(arow, 0);
  consoleHeader("Check PoP");
  var pop = parseEntirePOP(values[9].split("\n"));
  if (pop[0] == "Error") {
    Browser.msgBox(pop[1]);
    return;
  };
  // Open word doc and rename
  // All documents will be saved in root folder
  consoleHeader("Creating Word Doc");
  DriveApp.getFileById("").makeCopy(values[0])
  var newname = "Modification Memorandum " + values[1];
  DriveApp.getFilesByName("Copy of Modification Memorandum Template").next().setName(newname);
  // Loop through files in current folder to find the copied generated previously
  var files = values[0].getFiles();
  var nid = "";
  // Loop through folder till you find the new file, then save it's Id
  while (files.hasNext()){
    file = files.next();
    // Only save Id if its the copied file
    if (file.getName() == newname) {
      nid = file.getId();
    };
  };
  // Open doc and replace fields with pulled data
  consoleHeader("Inputting Values");
  var doc = DocumentApp.openById(nid);
  var body = doc.getBody();
  body.replaceText("{Date}", Utilities.formatDate(new Date(), "EST", "MMMM d, yyyy"));
  body.replaceText("{ContractingOfficer}", values[12]);
  body.replaceText("{Contract}", values[1]);
  body.replaceText("{Description}", values[4]);
  body.replaceText("{ContractType}", values[3]);
  body.replaceText("{Contractor}", values[5]);
  body.replaceText("{Customer}", values[6]);
  body.replaceText("{PeriodOfPerformance}", pop);
  body.replaceText("{ContactName}", parseFullName());
  doc.saveAndClose();
  consoleHeader("Finished");
  Browser.msgBox("Memorandum drafted...");
  redirectFolder();
};


function pullUEI() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var arow = SpreadsheetApp.getSelection().getCurrentCell().getRow();
  // Initial check
  consoleHeader("Initial Check");
  var errors = errorTest(arow);
  if (errors[0] == 1) {
    Browser.msgBox(errors[1]);
    return;
  };  
  consoleHeader("Pulling Values");
  var contract = trimClean(sheet.getRange(arow, 1).getValue());
  // Calculate last row and save range in UEI sheet
  consoleHeader("Calculate Last Row");
  var dsheet = SpreadsheetApp.getActive().getSheetByName("UEIs");
  var lrow = dsheet.getDataRange().getLastRow();
  var dsheet_range = dsheet.getRange("A1:C" + lrow).getValues();
  // Loop through all contracts and save UEI if there is one
  consoleHeader("Save UEI");
  var uei = "";
  for (var i = 0; i < lrow; i++) {
    if (trimClean(dsheet_range[i][0]) == contract) {
      var uei = dsheet_range[i][2];
    };
  };
  // Send email if contract was found, exit otherwise
  consoleHeader("Send Email");
  if (uei != "") {
    MailApp.sendEmail({to: "vendorreport@feddatacheck.net",
                      //cc: "ugh@derp.com",
                      subject: uei,
                      //body: ""
                      });
    Browser.msgBox("Email sent...");
  } else {
    Browser.msgBox('Contract has not been found in "UEIs" sheet. Please add contract with associated UEI on "UEIs" sheet and try again...');
    return;
  };
};


// Survey Request 
function surveyRequest() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var arow = SpreadsheetApp.getSelection().getCurrentCell().getRow();
  // Initial check
  consoleHeader("Initial Check");
  var errors = errorTest(arow);
  if (errors[0] == 1) {
    Browser.msgBox(errors[1]);
    return;
  }; 
  consoleHeader("Pulling Values");
  var values = pullValues(arow, 1);
  var cor = parseNameEmail(values[10].split("\n"));
  // Find latest modification
  consoleHeader("Find Latest Modification");
  var mods = sheet.getRange(arow, 18).getValue().split("\n");
  var mod_desc = [];
  for (var i = mods.length - 1; i >= 0; i--) {
    var cl_text = trimClean(mods[i]);
    var w_text = mods[i].trim();
    if (cl_text.substring(0, 1) == "p") {
      mod_desc.push(w_text.substring(0, 6));
      if (w_text.split(":").length > 1) {
        mod_desc.push(w_text.split(":")[1].trim());
      } else if (w_text.split("-").length > 1) {
        mod_desc.push(w_text.split("-")[1].trim());
      } else {
        Browser.msgBox('Could not parse any modification description. Please make sure modification numbers have a ":" or "-" after it to denote the description. For example, "P24001: COR Change" or "P24003 - Option 1 Exercise". Exiting...');
        return;
      };
      break;
    };
  };
  // Create draft email
  consoleHeader("Draft Email");
  var embody = "Good Afternoon Vanassa,\n\nWill you please send a survey request for the following action?\n\n";
  embody = embody + "Modification: " + values[1] + " " + mod_desc[0] + "\n";
  embody = embody + "Modification Purpose: " + mod_desc[1] + "\n";
  embody = embody + "For: " + values[6] + "\n";
  embody = embody + "Contractor: " + values[5] + "\n";
  embody = embody + "CS: " + parseFullName() + "\n";
  embody = embody + "Email Survey to COR: " + cor[0] + ", " + cor[1] + "\n\n";
  embody = embody + "Thank you and please let me know if you have any questions.\n\n";
  var signature = parseFullName() + "\n";
  signature = signature + "NOAA, AGO\n";
  signature = signature + "Eastern Acquisition Division\n";
  // Create draft
  GmailApp.createDraft("vanassa.m.barner@noaa.gov",
                       "Survey Request for " + values[1] + " " + mod_desc[0],
                       embody + signature
  );
  Browser.msgBox('Email drafted - check your "Drafts" folder in Gmail. Exiting...');
};


// Parse Period of Performance and option year
function parsePOP(opop) {
  consoleHeader("Parsing POP");
  var oy = -1;
  var exdate = "";
  // Proceed if only one line for PoP; returns pretty start and end date
  if (opop.length == 1) {
    return parsePOPOneLine(opop);
  } else {
    for (var i = 0; i < opop.length; i++) {
      oy += 1;
      // Remove all whitespace
      /*
      var npop = opop[i].trim();
      if (npop.indexOf(":") > 0) {
        var fpop = npop.substring(npop.indexOf(":") + 1,npop.lenth).split("-");
      } else {
        var fpop = npop.split("-");
      };
      */
      var s_index = opop[i].indexOf(opop[i].match(/\d\//));
      if (s_index == -1) {
        return ["Error", 'POP not detected - make sure it is in the format "MM/DD/YYYY - MM/DD/YYYY"; for example: "09/30/2023 to 09/29/2024"'];
      };
      var upd_date = opop[i].substring(s_index - 1, opop[i].length).trim();
      var npop = upd_date.split("-");
      var spop = npop[0].trim();
      var epop = npop[1].trim();
      // Convert strings to date format
      var tdate = Utilities.formatDate(new Date(), "EST", "M/d/yyyy").split("/");
      var sdate = Utilities.formatDate(new Date(new Date(spop).getTime() + 3600000), "EST", "M/d/yyyy").split("/");
      // For when we return the values, need to add one hour to the time for some reason to show properly
      var sdate2 = Utilities.formatDate(new Date(new Date(spop).getTime() + 3600000), "EST", "MMMM d, yyyy");
      var edate = Utilities.formatDate(new Date(new Date(epop).getTime() + 3600000), "EST", "MMMM d, yyyy");
      // Must convert dates to number of days in order to compare them
      var tdated = Number(tdate[0]*30) + Number(tdate[1]) + Number(tdate[2]*365);
      var sdated = Number(sdate[0]*30) + Number(sdate[1]) + Number(sdate[2]*365);
      // Return the first date that is later than today, meaning the first option year
      if (sdated > tdated) {
        return [numberText(oy), spop, epop, sdate2, edate, sdate2 + " through " + edate, exdate];
      } else {
        // Save the expiration date as last thing before going to next year
        exdate = Utilities.formatDate(new Date(new Date(epop).getTime() + 3600000), "EST", "MMMM d, yyyy");
        continue;
      };
    };
  };
};


// Only run for POPs with one line
function parsePOPOneLine(opop) {
  // Find first instance of a digit followed by a "/", denoting the month
  var s_index = opop[0].indexOf(opop[0].match(/\d\//));
  // Stop if POP not detected
  if (s_index == -1) {
    return ["Error", 'POP not detected - make sure it is in the format "MM/DD/YYYY - MM/DD/YYYY"; for example: "09/30/2023 to 09/29/2024"'];
  }
  var upd_date = opop[0].substring(s_index - 1, opop[0].length).trim();
  var npop = upd_date.split("-");
  var spop = npop[0].trim();
  var epop = npop[1].trim();
  var sdate = Utilities.formatDate(new Date(new Date(spop).getTime() + 3600000), "EST", "MMMM d, yyyy");
  var edate = Utilities.formatDate(new Date(new Date(epop).getTime() + 3600000), "EST", "MMMM d, yyyy");
  return sdate + " through " + edate;
};


// Parse Entire Period of Performace
function parseEntirePOP(opop) {
  consoleHeader("Parsing POP");
  // Proceed if only one line for PoP; returns pretty start and end date
  if (opop.length == 1) {
    return parsePOPOneLine(opop);
  } else {
    for (var i = 0; i < opop.length; i++) {
      var s_index = opop[i].indexOf(opop[i].match(/\d\//));
      if (s_index == -1) {
        return ["Error", 'POP not detected - make sure it is in the format "M/D/YYYY - M/D/YYYY"; for example: "9/10/2023 to 9/9/2024"'];
      };
      var upd_date = opop[i].substring(s_index - 1, opop[i].length).trim();
      var npop = upd_date.split("-");
      var spop = npop[0].trim();
      var epop = npop[1].trim();
      // For when we return the values, need to add one hour to the time for some reason to show properly
      // Save just for starting year
      if (i == 0) {
        var estdate = Utilities.formatDate(new Date(new Date(spop).getTime() + 3600000), "EST", "MMMM d, yyyy");
      };
      var edate = Utilities.formatDate(new Date(new Date(epop).getTime() + 3600000), "EST", "MMMM d, yyyy");
    };
  };
  return estdate + " through " + edate;
};


// Pulls first value that has an email address
function parseNameEmail(poc_info) {
  var name = "";
  var email = "";
  for (var i = 0; i < poc_info.length; i++) {
    var txt = poc_info[i];
    if (txt.indexOf("@") == -1 && txt.trim().indexOf(" ") > 0) {
      name = txt;
    } else if (txt.indexOf("@") >= 0) {
      email = txt;
    };
    if (name != "" && email != "") {
      return [name, email]
    };
  };
};


function numberText(number) {
  if (number == 1) {
    return "One";
  } else if (number == 2) {
    return "Two";
  } else if (number == 3) {
    return "Three";
  } else if (number == 4) {
    return "Four";
  } else if (number == 5) {
    return "Five";
  } else if (number == 6) {
    return "Six";
  } else if (number == 7) {
    return "Seven";
  } else if (number == 8) {
    return "Eight";
  } else if (number == 9) {
    return "Nine";
  } else {
    return number;
  };
};


function parseFullName() {
  var un = Session.getActiveUser().getUsername();
  var un2 = un.split(".");
  var nlength = un2.length;
  // First name
  var fname = un2[0];
  var fname_final = fname.substring(0,1).toUpperCase() + fname.substring(1, fname.length);
  // Last name
  var lname = un2[nlength - 1];
  var lname_final = lname.substring(0,1).toUpperCase() + lname.substring(1, lname.length);
  return fname_final + " " + lname_final;
};


// Converts to string, converts to lower case, trims, removes dashes, removes white space
function trimClean(text) {
  return text.toString().toLowerCase().trim().replace(/-/g, "").replace(/\s/g, "");
};


// Add items to UI menu
function menuFunctions() {
  var menu = SpreadsheetApp.getUi().createMenu("Templates and Functions");
  menu.addItem("120-Day Letter Template", "generate120DayLetter");
  menu.addItem("60-Day Letter Template", "generate60DayLetter");
  menu.addItem("COR Delegation Letter Template", "generateCORDelegation");
  menu.addItem("Modification Memorandum Template", "generateModMemorandum");
  menu.addItem("Vendor Report Request", "pullUEI");
  menu.addItem("Customer Survey Request", "surveyRequest");
  menu.addToUi();
};


// Regex: https://support.google.com/a/answer/1371415?hl=en
function errorTest(arow) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var contract = sheet.getRange(arow, 1).getValue();
  var sheet_name = sheet.getName();
  // Return error code if running on "closed" sheets, "ueis", if contract doesn't have two digits, or if nothing there
  if (trimClean(sheet_name).indexOf("close") >= 0 || trimClean(sheet_name) == "ueis") {
    return [1, "Function can't run on this sheet. Exiting..."];    
  } else  if (!trimClean(contract).match(/^(.*\d{2}.*)$/) || trimClean(contract) == "") {
    return [1, "No contract detected in selected row. Exiting..."];
  } else {
    return [0,""];
  };
};


function redirectFolder() {
  var url = "https://drive.google.com/drive/folders/XXXXXX";
  var html = "<script>window.open('" + url + "');google.script.host.close();</script>";
  var userInterface = HtmlService.createHtmlOutput(html);
  SpreadsheetApp.getUi().showModalDialog(userInterface, 'Redirecting...');
};


// Archive file and remove older files
function archiveFile() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet_name = SpreadsheetApp.getActiveSpreadsheet().getName().trim();
  var dest = DriveApp.getFolderById("");
  var today = Utilities.formatDate(new Date(), "UTC", "YYYYMMdd");
  DriveApp.getFileById(sheet.getId()).makeCopy(sheet_name + " Archive " + today, dest);
  // Remove older archives
  var files = dest.getFiles();
  while (files.hasNext()) {
    // Every time you call .next(), it iterates through another file; only use it once in the while statement
    var file = files.next();
    var file_name = file.getName();
    var file_type = file.getMimeType();
    if (file_name.toLowerCase().indexOf(sheet_name.toLowerCase() + " archive") >= 0 && file_type == "application/vnd.google-apps.spreadsheet") {
      var file_date = file_name.slice(-8);
      var date_year = file_date.substring(0,4);
      var date_month = file_date.substring(4,6);
      var date_day = file_date.substring(6,8);
      // Convert to number of days to compare later
      var file_days = Number(date_year*365) + Number(date_month*30) + Number(date_day);
      var today_year = today.substring(0,4);
      var today_month = today.substring(4,6);
      var today_day = today.substring(6,8);
      // Convert to number of days to compare later
      var today_days = Number(today_year*365) + Number(today_month*30) + Number(today_day);
      // Delete older file
      if (today_days - file_days > 21) {
        file.setTrashed(true);
      };
    };
  };
};


function consoleHeader(txt) {
  var txt_len = txt.length;
  var len_diff = 80 - (txt_len + 2);
  console.log("#".repeat(len_diff/2) + " " + txt + " " + "#".repeat(len_diff/2));
};


// DEPRECATED
// Parse Period of Performance for COR Delegation Letters
// Returns start date pretty, end date pretty
function parsePOPCOR(opop) {
  console.log("#################### Parsing POP ####################")
  var oy = -1;
  if (opop.length = 1) {
    npop = opop[0].replace(/\s/g, "").split("-");
    var sdate = Utilities.formatDate(new Date(new Date(npop[0]).getTime() + 3600000), "EST", "MMMM d, yyyy");
    var edate = Utilities.formatDate(new Date(new Date(npop[1]).getTime() + 3600000), "EST", "MMMM d, yyyy");
  } else {
    for (var i = 0; i < opop.length; i++) {
      oy += 1;
      // Remove all whitespace
      var npop = opop[i].replace(/\s/g, "");
      if (npop.indexOf(":") > 0) {
        var fpop = npop.substring(npop.indexOf(":") + 1,npop.lenth).split("-");
      } else {
        var fpop = npop.split("-");
      };
      // Convert strings to date format
      if (oy == 0) {
        var sdate = Utilities.formatDate(new Date(new Date(fpop[0]).getTime() + 3600000), "EST", "MMMM d, yyyy");
      } else {
        var edate = Utilities.formatDate(new Date(new Date(fpop[1]).getTime() + 3600000), "EST", "MMMM d, yyyy");
      };
    };
  };
  return sdate + " through " + edate;
};


function findFolderId() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var file = DriveApp.getFileById(ss.getId());
  var folders = file.getParents();
  while (folders.hasNext()){
    console.log('folder name = '+folders.next().getId());
  };
};


// Works
function dev002() {
  var ugh = "hello-there";
  console.log(ugh.toString().replace("-", ""));
};


// 
function dev003() {
  var arow = SpreadsheetApp.getSelection().getCurrentCell().getRow();
  var values = pullValues(arow, 1);
  console.log(values[9].split("\n"));
  //return;
  console.log(parseEntirePOP(values[9].split("\n")));
};


// Works
function dev004() {
  var str = "OY1: 9/30/2023 - 9/29/2024";
  var s_index = str.indexOf(str.match(/\d\//));
  console.log(s_index);
  console.log(str.substring(s_index - 1, str.length).trim());
  var str2 = "9/30/2023 - 9/29/2024";
  var s_index = str2.indexOf(str2.match(/\d\//));
  console.log(s_index);
  console.log(str2.substring(s_index - 1, str2.length).trim());
  var str3 = "ugh derp";
  var s_index = str3.indexOf(str3.match(/\d\//));
  console.log(s_index);
  console.log(str3.substring(s_index - 1, str3.length).trim());
};


// Works
function dev005() {
  var strng = "OLD BPA";
  // does not work
  var regex = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+$/;
  // works
  var regex2 = /^(.*[0-90-90-9].*)$/;
  // works, finds any two digits in a row
  var regex3 = /^(.*\d{2}.*)$/;
  console.log((strng.trim().match(regex2)));
  if (!strng.trim().match(regex3)) {
    console.log(1);
  } else {
    console.log(0);
  };
  //console.log(strng.match(/()*));
};

