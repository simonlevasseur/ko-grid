/* eslint no-unused-vars :0 */
var columns = [
    { type: 'text',
        heading: 'Name',
        dataAccessor: 'name',
        sortFunction: function (a, b) {
            var strA = a.toLowerCase();
            var strB = b.toLowerCase();
            if (strA.indexOf('simon') !== -1) {
                return -1;
            }
            if (strB.indexOf('simon') !== -1) {
                return 1;
            }
            if (strA === strB) {
                return 0;
            }
            else {
                return strA < strB ? -1 : 1;
            }
        } },
        { type: 'text', heading: 'Age', dataAccessor: 'age' },
        { type: 'text', heading: 'Email', dataAccessor: 'email' },
        { type: 'text', heading: 'Company', dataAccessor: 'company', sortable: false }
];
var mockGridInstance = {
    columns: ko.observableArray(columns),
    options: {
        data: [],
        sortable: true
    }
};
