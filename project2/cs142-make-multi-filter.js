'use strict';

function cs142MakeMultiFilter(originalArray) {
    const currentArray = originalArray.slice();
    function arrayFilterer(filterCriteria, callback) {
        if (typeof filterCriteria !== 'function') {
            return currentArray;
        }

        let idx = 0;
        while (idx < currentArray.length) {
            if (filterCriteria(currentArray[idx]) === false) {
                currentArray.splice(idx, 1);
            } else {
                idx += 1;
            }
        }

        if (typeof callback === 'function') {
            callback = callback.bind(originalArray);
            callback(currentArray);
        }

        return arrayFilterer;
    }
    return arrayFilterer;
}
