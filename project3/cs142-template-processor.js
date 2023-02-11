'use strict';

function Cs142TemplateProcessor(template) {
    this.template = template;
}

Cs142TemplateProcessor.prototype.fillIn = function(dict) {
    let filled = this.template.slice();
    const matches = filled.match(/{{[^{]*}}/g);
    matches.forEach((tmp) => {
        const ans = tmp.slice();
        const property = ans.replace("{{", "").replace("}}", "");
        if (dict[property] !== undefined) {
            filled = filled.replace(ans, dict[property]);
        } else {
            filled = filled.replace(ans, "");
        }
    });
    return filled;
};
