'use strict';

describe('Sorter', function () {
    var sorter;

    beforeEach(function () {
        sorter = new Sorter(mockGridInstance);
    });

    describe('init', function () {
        it('should set the default sort if provided', function () {
            // Without default sort direction
            mockGridInstance.options.sortable = {
                defaultSortCol: columns[1]
            };
            sorter = new Sorter(mockGridInstance);
            expect(sorter.currentSortCol()).toBe(columns[1]);
            expect(sorter.currentSortDir()).toBe('asc');

            // With default sort direction
            mockGridInstance.options.sortable.defaultSortCol = columns[2];
            mockGridInstance.options.sortable.defaultSortDir = 'desc';
            sorter = new Sorter(mockGridInstance);
            expect(sorter.currentSortCol()).toBe(columns[2]);
            expect(sorter.currentSortDir()).toBe('desc');
        });

        it('should not set a sort if a default was not provided', function () {
            mockGridInstance.options.sortable = true;
            sorter = new Sorter(mockGridInstance);
            expect(sorter.currentSortCol()).toBeUndefined();
            expect(sorter.currentSortDir()).toBeUndefined();
        });
    });

    describe('findCol', function () {
        var col;

        it('should find the column if all properties match', function () {
            col = sorter.findCol({ heading: 'Name' });
            expect(col).toBe(columns[0]);

            col = sorter.findCol({ dataAccessor: 'age' });
            expect(col).toBe(columns[1]);

            col = sorter.findCol({ sortable: false });
            expect(col).toBe(columns[3]);
        });

        it('should not find a column if some but not all properties match', function () {
            col = sorter.findCol({ heading: 'Name', dataAccessor: 'noname' });
            expect(col).toBeNull();
        });

        it('should not find a column if no properties match', function () {
            col = sorter.findCol({ key: 'value' });
            expect(col).toBeNull();
        });
    });

    describe('setColSort', function () {
        it('should set the given column as the new sort', function () {
            sorter.setColSort(columns[0]);
            expect(sorter.currentSortCol()).toBe(columns[0]);

            sorter.setColSort(columns[1]);
            expect(sorter.currentSortCol()).toBe(columns[1]);
        });

        it('should not set a non-sortable column as the new sort', function () {
            sorter.setColSort(columns[3]);
            expect(sorter.currentSortCol()).not.toBe(columns[3]);
        });

        it('should set the sort direction ascending if it\'s a new column sort', function () {
            sorter.setColSort(columns[2]);
            expect(sorter.currentSortCol()).toBe(columns[2]);
            expect(sorter.currentSortDir()).toBe('asc');
        });

        it('should reverse the sort direction if the same column is being sorted', function () {
            sorter.setColSort(columns[2]);
            expect(sorter.currentSortCol()).toBe(columns[2]);
            expect(sorter.currentSortDir()).toBe('asc');

            sorter.setColSort(columns[2]);
            expect(sorter.currentSortCol()).toBe(columns[2]);
            expect(sorter.currentSortDir()).toBe('desc');

            sorter.setColSort(columns[2]);
            expect(sorter.currentSortCol()).toBe(columns[2]);
            expect(sorter.currentSortDir()).toBe('asc');
        });

        it('should set the sort direction if it was given', function () {
            sorter.setColSort(columns[2], 'desc');
            expect(sorter.currentSortCol()).toBe(columns[2]);
            expect(sorter.currentSortDir()).toBe('desc');
        });
    });

    describe('doSort', function () {
        var arr = [
            { name: 'Simon', age: 24, email: 'simon@site.com', company: 'Mac' },
            { name: 'Henry', age: 30, email: 'henry@site.com', company: 'Mac' },
            { name: 'Aaron', age: 56, email: 'aaron@test.com', company: 'Google' },
            { name: 'Pascale', age: 24, email: 'pascale@sd.ca', company: 'SD' },
            { name: 'Jenny', age: 40, email: 'jen@gmail.com', company: 'DOV' }
        ];

        beforeEach(function () {
            mockGridInstance.data = ko.observableArray(arr.slice(0));
            mockGridInstance.options.data = arr;
            sorter = new Sorter(mockGridInstance);
        });

        it('should not do anything if using server sorting', function () {
            mockGridInstance.options.sortable = { serverSorting: true };
            sorter = new Sorter(mockGridInstance);
            sorter.doSort();
            expect(sorter.grid.data()).toEqual(arr);
        });

        it('should sort if using local data', function () {
            mockGridInstance.options.sortable = { serverSorting: false };
            sorter = new Sorter(mockGridInstance);
            sorter.setColSort(columns[1]);
            sorter.doSort();
            expect(sorter.grid.data()).toEqual([arr[0], arr[3], arr[1], arr[4], arr[2]]);
        });

        it('should reverse sort if direction descending', function () {
            sorter.setColSort(columns[1], 'desc');
            sorter.doSort();
            expect(sorter.grid.data()).toEqual([arr[2], arr[4], arr[1], arr[0], arr[3]]);
        });

        it('should use the defined sort function', function () {
            sorter.setColSort(columns[0]);
            sorter.doSort();
            expect(sorter.grid.data()).toEqual([arr[0], arr[2], arr[1], arr[4], arr[3]]);
        });

        it('should not fail if there is no data', function () {
            mockGridInstance.data = ko.observableArray([]);
            sorter.setColSort(columns[1]);
            sorter.doSort();
            expect(sorter.grid.data()).toEqual([]);
        });
    });

    describe('guessSortFn', function () {
        var sortFn;

        it('should guess alphabetical data', function () {
            sortFn = Sorter.guessSortFn('string');
            expect(sortFn).toBe(Sorter.sortAlphabetically);

            sortFn = Sorter.guessSortFn('1');
            expect(sortFn).toBe(Sorter.sortAlphabetically);

            sortFn = Sorter.guessSortFn('');
            expect(sortFn).toBe(Sorter.sortAlphabetically);
        });

        it('should guess numerical data', function () {
            sortFn = Sorter.guessSortFn(0);
            expect(sortFn).toBe(Sorter.sortNumerically);

            sortFn = Sorter.guessSortFn(926);
            expect(sortFn).toBe(Sorter.sortNumerically);
        });

        it('should default to alphabetical if data could not be guessed', function () {
            sortFn = Sorter.guessSortFn({});
            expect(sortFn).toBe(Sorter.sortAlphabetically);

            sortFn = Sorter.guessSortFn([]);
            expect(sortFn).toBe(Sorter.sortAlphabetically);

            sortFn = Sorter.guessSortFn(function () {});
            expect(sortFn).toBe(Sorter.sortAlphabetically);

            sortFn = Sorter.guessSortFn(new Date());
            expect(sortFn).toBe(Sorter.sortAlphabetically);
        });
    });

    describe('Sort Methods', function () {
        var res;

        it('should do alphabetical sort', function () {
            res = Sorter.sortAlphabetically('Some string here', 'Another string here');
            expect(res).toBe(1);

            res = Sorter.sortAlphabetically('Reverse this please', 'Some string here');
            expect(res).toBe(-1);

            res = Sorter.sortAlphabetically('MyString', 'MyString');
            expect(res).toBe(0);
        });

        it('should do numerical sort', function () {
            res = Sorter.sortNumerically(15, 100);
            expect(res).toBeLessThan(0);

            res = Sorter.sortNumerically(123, 123);
            expect(res).toBe(0);

            res = Sorter.sortNumerically(987, 10);
            expect(res).toBeGreaterThan(0);
        });
    });
});
