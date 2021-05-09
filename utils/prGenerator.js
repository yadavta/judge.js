/* Copyright (C) 2021 Tanush Yadav <tanushyadav@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const ExcelJS = require('exceljs');
const fs = require('fs');

let centerAlignment = { vertical: 'middle', horizontal: 'center' }

let grayFill = {
  type: 'pattern',
  pattern: 'lightGray'
}

//tournamentName = String; 
async function generatePRExcel(tournamentName) {
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet(tournamentName);

  //titles
  ws.mergeCells('A1:G1');
  ws.mergeCells('A2:G2');
  ws.mergeCells('A3:G3');
  ws.getCell('A1').value = "**REQUISTION FOR GOOD/SERVICES**";
  ws.getCell('A2').value = "THIS IS NOT A PURCHASE ORDER";
  ws.getCell('A3').value = "INTERNAL USE ONLY – NOT VALID FOR USE AT VENDORS";
  ws.getCell('A1').alignment = centerAlignment;
  ws.getCell('A2').alignment = centerAlignment;
  ws.getCell('A3').alignment = centerAlignment;

  //graying
  let toFill = ['I1', 'I2', 'J1', 'J2', 'I3', 'J3', 'A11', 'B11', 'C11', 'D11', 'E11', 'F11', 'G11', 'H11', 'I11', 'J11'];
  toFill.forEach(function (value) {
    ws.getCell(value).fill = grayFill;
  });

  //general info
  ws.getCell('A5').value = 'Requested By';
  ws.getCell('A6').value = '(General Fund) Department';
  ws.getCell('A7').value = 'Vendor';
  ws.getCell('A8').value = 'Address';
  ws.getCell('A9').value = 'City, State, Zip';
  ws.getCell('H5').value = 'Date';
  ws.mergeCells('G6:H6');
  ws.getCell('H6').value = '(ASB) Club/Activity';
  ws.getCell('H7').value = 'Phone';
  ws.getCell('H8').value = 'Email';
  ws.getCell('H9').value = 'Vendor Contact';

  //general info values
  toMergeGeneralInfo = ['B5:F5', 'C6:F6', 'B7:F7', 'B8:F8', 'B9:F9', 'I5:J5', 'I6:J6', 'I7:J7', 'I8:J8', 'I9:J9']
  toMergeGeneralInfo.forEach(function (value) {
    ws.mergeCells(value);
  });
  ws.getColumn('A').width = 20;
  ws.getColumn('C').width = 20;


  //form numbers
  ws.getCell('I1').value = "PO#";
  ws.getCell('I2').value = "PR#";
  ws.getCell('I3').value = "Check#";

  //actualData
  /*ws.addTable({
    name: 'CostsTable',
    ref: 'A11',
    headerRow: true,
    totalsRow: false,
    style: {
      showRowStripes: true,
      showColumnStripes: true
    },
    columns: [
      {name: 'Quantity'},
      {name: 'Unit'},
      {name: 'Catalog No.'},
      {name: 'Description'},
      {name: 'Unit Price'},
    ],
    rows: [
      [1, "", "", "Interlake Team Registration Fees", 1400]
    ]
  });

  //change column widths
  const CostsTable = ws.getTable('CostsTable')
  //CostsTable.getColumn(3).width = 35;
  //CostsTable.commit();
  ws.mergeCells('D11:H11');*/

  //actual data without table
  ws.getCell('A11').value = "Quantity";
  ws.getCell('B11').value = 'Unit';
  ws.getCell('C11').value = 'Catalog No.';
  ws.getCell('D11').value = 'Description';
  ws.getCell('I11').value = 'Unit Price';
  ws.mergeCells('D11:H11');
  ws.mergeCells('D12:H12');
  



  //generate sheet
  await workbook.xlsx.writeFile('test.xlsx').then(function () {
    console.log("done");
  });


}


generatePRExcel("Stanford");

exports.PRExcel = generatePRExcel;