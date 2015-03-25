var columns = [
        { type: 'text', heading: 'Name', dataAccessor: 'name', sortFunction: function (a, b) {
            var strA = a.toLowerCase(),
                strB = b.toLowerCase();
            if (strA.indexOf('simon') !== -1) { return -1; }
            if (strB.indexOf('simon') !== -1) { return 1; }
            return strA === strB ? 0 : (strA < strB ? -1 : 1);
        } },
        { type: 'text', heading: 'Age', dataAccessor: 'age' },
        { type: 'text', heading: 'Email', dataAccessor: 'email' },
        { type: 'text', heading: 'Company', dataAccessor: 'company', sortable: false }
    ],
    mockGridInstance = {
        columns: ko.observableArray(columns),
        options: {
            data: [],
            sortable: true
        }
    };