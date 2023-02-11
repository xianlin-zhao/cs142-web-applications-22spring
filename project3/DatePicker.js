'use strict';

class DatePicker {
    constructor(id, callback) {
        this.id = id;
        this.callback = callback;
    }

    render(date) {
        const parent = document.getElementById(this.id);
        const table = document.createElement("table");

        const titleRow = table.insertRow();
        const leftChange = titleRow.insertCell();
        leftChange.innerHTML = "<";
        leftChange.addEventListener("click", () => {
            table.remove();
            this.render(new Date(date.getFullYear(), date.getMonth() - 1, 1));
        });
        leftChange.setAttribute("class", "change");
        
        const infoDisplay = titleRow.insertCell();
        infoDisplay.colSpan = "5";
        const months = ["January", "February", "March", "April", "May", "June", "July", 
                    "August", "September", "October", "November", "December"];
        infoDisplay.innerHTML = months[date.getMonth()] + "    " + date.getFullYear();
        infoDisplay.setAttribute("class", "info");

        const rightChange = titleRow.insertCell();
        rightChange.innerHTML = ">";
        rightChange.addEventListener("click", () => {
            table.remove();
            this.render(new Date(date.getFullYear(), date.getMonth() + 1, 1));
        });
        rightChange.setAttribute("class", "change");

        const headerRow = table.insertRow();
        const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        for (let i = 0; i < 7; i++) {
            const weekCell = headerRow.insertCell();
            weekCell.innerHTML = days[i];
        }
        headerRow.setAttribute("class", "header");

        const month = date.getMonth();
        const year = date.getFullYear();
        const firstDay = new Date(year, month, 1);
        
        const nowDay = new Date(year, month, 1 - firstDay.getDay());
        do {
            const weekRow = table.insertRow();
            for (let i = 0; i < 7; i++) {
                const dayCell = weekRow.insertCell();
                dayCell.innerHTML = nowDay.getDate();
                if (nowDay.getMonth() === month) {
                    const tmpObj = {
                        month: nowDay.getMonth() + 1,
                        day: nowDay.getDate(),
                        year: nowDay.getFullYear()
                    };
                    dayCell.addEventListener("click", () => {
                        this.callback(this.id, tmpObj);
                    });
                    dayCell.setAttribute("class", "normal");
                } else {
                    dayCell.setAttribute("class", "dim");
                }
                nowDay.setDate(nowDay.getDate() + 1);
            }
            weekRow.setAttribute("class", "week");
        } while (nowDay.getMonth() === month);

        parent.appendChild(table);
    }
}
