const fs = require('fs');
const ExcelJS = require('exceljs');

const excelFilePath = 'C:/Users/LEGION/Desktop/doublerLog.xlsx'; 

// check if the xlsx file exists
function add(a,b) {
    const stringA = String(a)
    const stringB = String(b)
    // new workbook
    const workbook = new ExcelJS.Workbook();
    let worksheet;
    if (fs.existsSync(excelFilePath)) {
        workbook.xlsx.readFile(excelFilePath).then(() => {
            worksheet = workbook.getWorksheet(1);
            // fetch the next row number
            const nextRow = worksheet.rowCount + 1;
            worksheet.getCell(`A${nextRow}`).value = stringA;
            worksheet.getCell(`B${nextRow}`).value = stringB;
            console.log('Input successfully!')
            // save
            return workbook.xlsx.writeFile(excelFilePath);
        });
    } else {
        worksheet = workbook.addWorksheet('Log');
        worksheet.addRow(['poolId', 'tokenId']);
        worksheet.addRow([stringA, stringB]);
        // save
        workbook.xlsx.writeFile(excelFilePath);
    }
}

function remove(searchString) {
    // create
    const workbook = new ExcelJS.Workbook();
    // read
    workbook.xlsx.readFile(excelFilePath)
    .then(() => {
        const worksheet = workbook.getWorksheet(1);
        // query and delete the row with searchString in column B
        for (let rowIndex = worksheet.rowCount; rowIndex >= 1; rowIndex--) {
            const row = worksheet.getRow(rowIndex);
            const cell = row.getCell('B');

            if (cell && cell.value == String(searchString)) {
                if (rowIndex === 1) {
                    row.getCell('A').value = '';
                    row.getCell('B').value = '';
                } else {
                    worksheet.spliceRows(rowIndex, 1);
                }
            }
        }
        // save
        return workbook.xlsx.writeFile(excelFilePath);
    })
    .then(() => {
        console.log(`Rows containing '${searchString}' removed successfully.`);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

async function isExist(poolId) {
    const workbook = new ExcelJS.Workbook();

    try {
        await workbook.xlsx.readFile(excelFilePath);
        const worksheet = workbook.getWorksheet(1);

        // Iterate over the poolId in column A
        for (let rowIndex = 1; rowIndex <= worksheet.rowCount; rowIndex++) {
            const cell = worksheet.getCell(`A${rowIndex}`);

            // Extract the text content from the cell
            const cellText = cell && cell.text ? cell.text : '';

            if (cellText === String(poolId)) {
                return true; // matched
            }
        }

        return false; // mismatch
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function getBValueByAValue(searchValue) {
    const workbook = new ExcelJS.Workbook();
    console.log('search',searchValue)
    try {
        await workbook.xlsx.readFile(excelFilePath);
        const worksheet = workbook.getWorksheet(1);

        // Iterate over the poolId in column A
        for (let rowIndex = worksheet.actualRowCount; rowIndex >= 1; rowIndex--) {
            const cellA = worksheet.getCell(`A${rowIndex}`);
            const cellB = worksheet.getCell(`B${rowIndex}`);
            // console.log('cellA',cellA.value)
            if (cellA && cellA.text == searchValue || cellA.value == searchValue) {
                // console.log('Bvalue：',cellB.value)
                return parseInt(cellB.value); // Return the value of column B that matches column A
            }
        }

        return null; // Mismatch
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
module.exports = {
    add,
    remove,
    isExist,
    getBValueByAValue
}
