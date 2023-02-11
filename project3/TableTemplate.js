'use strict';

class TableTemplate {
    static fillIn(id, dict, columnName) {
        const table = document.getElementById(id);
        if (table.style.visibility === "hidden"){  
            table.style.visibility = "visible";
        }

        const rows = table.rows;
        const header = rows[0];
        const headerProcesser = new Cs142TemplateProcessor(header.innerHTML);
        header.innerHTML = headerProcesser.fillIn(dict);

        let columnIdx = -1;
        for (let i = 0; i < header.cells.length; i++) {
            if (header.cells[i].innerHTML === columnName) {
                columnIdx = i;
                break;
            }
        }

        if (columnIdx === -1 && typeof columnName === "string"){
            return;
        }
        for (let i = 1; i < rows.length; i++) {
            const nowCell = columnName ? rows[i].cells[columnIdx] : rows[i];
            const otherProcessor = new Cs142TemplateProcessor(nowCell.innerHTML);
            nowCell.innerHTML = otherProcessor.fillIn(dict);
        }
    }
}
