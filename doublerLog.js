const fs = require('fs');
const ExcelJS = require('exceljs');

const excelFilePath = 'E:/Users/LEGION/Desktop/doublerLog.xlsx'; 

// check if the xlsx file exists
function add(a,b) {
    const excelFilePath = 'E:/Users/LEGION/Desktop/doublerLog.xlsx';
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
    const excelFilePath = 'E:/Users/LEGION/Desktop/doublerLog.xlsx';
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
    const excelFilePath = 'E:/Users/LEGION/Desktop/doublerLog.xlsx';
    const workbook = new ExcelJS.Workbook();
    return workbook.xlsx.readFile(excelFilePath)
        .then(() => {
            const worksheet = workbook.getWorksheet(1);

            // iterate over the poolId in column A
            for (let rowIndex = 1; rowIndex <= worksheet.rowCount; rowIndex++) {
                const cell = worksheet.getCell(`A${rowIndex}`);
                if (cell && cell.value == String(poolId)) {
                    return true; // matched
                }
            }
            return false; // mismatch
        })
        .catch((error) => {
            console.error('Error:', error);
            return false;
        });
}

async function getBValueByAValue(searchValue) {
    const workbook = new ExcelJS.Workbook();

    return workbook.xlsx.readFile(excelFilePath)
        .then(() => {
            const worksheet = workbook.getWorksheet(1);

            // iterate over the poolId in column A
            for (let rowIndex = worksheet.actualRowCount; rowIndex >= 1; rowIndex--) {
                const cellA = worksheet.getCell(`A${rowIndex}`);
                const cellB = worksheet.getCell(`B${rowIndex}`);

                if (cellA && cellA.value === searchValue) {
                    return parseInt(cellB.value); // return the value of column B that matches column A
                }
            }

            return null; // mismatch
        })
        .catch((error) => {
            console.error('Error:', error);
            return null; 
        });
}
module.exports = {
    add,
    remove,
    isExist,
    getBValueByAValue
}
