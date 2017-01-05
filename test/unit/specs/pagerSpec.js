'use strict';

function createInstance(passedOptions) {
    var defaultOptions = {
            enabled: true,
            defaultPageSize: 10,
            pageSizes: [10, 50, 100, 250, 500, 1000],
            serverPaging: false
        },
        options = deepReplace({}, defaultOptions, passedOptions),
        data = sampleData.slice(0);

    return new Pager(options, data);
}

describe('Pager', function () {
    var pager;

    describe('No paging options set', function () {
        var pager1,
            pager2,
            pager3,
            pager4;

        beforeAll(function () {
            pager1 = new Pager({}, sampleData.slice(0));
            pager2 = new Pager(false, sampleData.slice(0));
            pager3 = new Pager(undefined, sampleData.slice(0));
            pager4 = new Pager(null, sampleData.slice(0));
        });

        it('should be disabled by default', function () {
            expect(pager1.enabled()).toEqual(false);
            expect(pager2.enabled()).toEqual(false);
            expect(pager3.enabled()).toEqual(false);
            expect(pager4.enabled()).toEqual(false);
        });

        it('should show all data', function () {
            expect(pager1.itemsOnCurrentPage().length).toEqual(sampleData.length);
            expect(pager2.itemsOnCurrentPage().length).toEqual(sampleData.length);
            expect(pager3.itemsOnCurrentPage().length).toEqual(sampleData.length);
            expect(pager4.itemsOnCurrentPage().length).toEqual(sampleData.length);
        });
    });

    describe('Enabled option', function () {
        it('should be enabled if set to true', function () {
            pager = new Pager({ enabled: true }, sampleData.slice(0));
            expect(pager.enabled()).toEqual(true);
        });

        it('should be enabled if not set but other options are set', function () {
            pager = new Pager({ defaultPageSize: 100 }, sampleData.slice(0));
            expect(pager.enabled()).toEqual(true);
        });

        it('should be enabled if paging options (obj) set to true', function () {
            pager = new Pager(true, sampleData.slice(0));
            expect(pager.enabled()).toEqual(true);
        });

        it('should be disabled if set to false', function () {
            pager = new Pager({ enabled: false }, sampleData.slice(0));
            expect(pager.enabled()).toEqual(false);
        });
    });

    describe('PageSizes option', function () {
        beforeAll(function () {
            pager = new Pager({ pageSizes: [15, 20] }, sampleData.slice(0));
        });

        it('should use page sizes passed in', function () {
            var pager1 = new Pager(true, sampleData.slice(0));
            expect(pager.pageSizes()).toEqual([15, 20]);
        });

        it('should use page sizes passed in', function () {
            expect(pager.pageSizes()).toEqual([15, 20]);
        });

        it('should use the first page size as the current', function () {
            expect(pager.pageSize()).toEqual(15);
        });

        it('should display the correct number of pages', function () {
            expect(pager.maxPageIndex()).toEqual(Math.ceil(400 / 15 - 1));
        });

        it('should show the current number of items', function () {
            expect(pager.itemsOnCurrentPage().length).toEqual(15);
        });
    });

    describe('Setting defaultPageSize option', function () {
        var pager1,
            pager2,
            pager3;

        beforeAll(function () {
            pager1 = new Pager({ defaultPageSize: 50 }, sampleData.slice(0));
            pager2 = new Pager({ defaultPageSize: 55 }, sampleData.slice(0));
            pager3 = new Pager({ pageSizes: [15, 55], defaultPageSize: 55 }, sampleData.slice(0));
        });

        it('should use the correct page size as the current', function () {
            expect(pager1.pageSize()).toEqual(50);
        });

        it('should display the correct number of pages', function () {
            expect(pager1.maxPageIndex()).toEqual(Math.ceil(400 / 50 - 1));
        });

        it('should show the current number of items', function () {
            expect(pager1.itemsOnCurrentPage().length).toEqual(50);
        });

        it('should default to first page size if invalid default is entered', function () {
            expect(pager2.pageSize()).toEqual(10);
        });

        it('should use correct page size if custom page sizes are used', function () {
            expect(pager3.pageSize()).toEqual(55);
        });
    });

    describe('Local Paging', function () {
        beforeAll(function () {
            pager = createInstance({
                serverPaging: false
            });
        });

        describe('Initial State', function () {
            it('should have 10 items on current page', function () {
                expect(pager.itemsOnCurrentPage().length).toEqual(10);
            });

            it('should have 400 total items', function () {
                expect(pager.totalItems()).toEqual(400);
            });

            it('should have 40 pages', function () {
                expect(pager.maxPageIndex()).toEqual(39);
            });

            it('should be on page 1', function () {
                expect(pager.currentPageIndex()).toEqual(0);
            });
        });

        describe('Initial UI State', function () {
            it('should show page 1 in the UI', function () {
                expect(pager.currentPageIndexUI()).toEqual(1);
            });

            it('should show start on row 1', function () {
                expect(pager.rowStartUI()).toEqual(1);
            });

            it('should show end on row 10', function () {
                expect(pager.rowEndUI()).toEqual(10);
            });

            it('should display the right row count HTML', function () {
                expect(pager.rowCountHTML()).toEqual('Showing <strong>1-10</strong> of <strong>400</strong>');
            });
        });

        describe('Changing Page', function () {
            it('should update the page from the UI', function () {
                pager.setCurrentPageIndexUI(5);
                expect(pager.currentPageIndex()).toEqual(4);
            });

            it('should go to page one if non-numeric is entered', function () {
                pager.setCurrentPageIndexUI('a');
                expect(pager.currentPageIndex()).toEqual(0);
            });

            it('should go to the first page if lower number is entered', function () {
                pager.setCurrentPageIndexUI(0);
                expect(pager.currentPageIndex()).toEqual(0);
            });

            it('should go to the last page if bigger number is entered', function () {
                pager.setCurrentPageIndexUI(9999);
                expect(pager.currentPageIndex()).toEqual(39);
            });

            it('should go to previous page if not on first page', function () {
                pager.setCurrentPageIndexUI(5);
                pager.goToPrevPage();
                expect(pager.currentPageIndex()).toEqual(3);
            });

            it('should not try to go to previous page if on first page', function () {
                pager.setCurrentPageIndexUI(1);
                pager.goToPrevPage();
                expect(pager.currentPageIndex()).toEqual(0);
            });

            it('should go to next page if not on last page', function () {
                pager.setCurrentPageIndexUI(8);
                pager.goToNextPage();
                expect(pager.currentPageIndex()).toEqual(8);
            });

            it('should not try to go to next page if on last page', function () {
                pager.setCurrentPageIndexUI(40);
                pager.goToNextPage();
                expect(pager.currentPageIndex()).toEqual(39);
            });
        });

        describe('Changing Page Size', function () {
            beforeAll(function () {
                pager.pageSize(50);
            });

            it('should go to the first page', function () {
                expect(pager.currentPageIndex()).toEqual(0);
            });

            it('should return 50 items', function () {
                expect(pager.itemsOnCurrentPage().length).toEqual(50);
            });
        });
    });
});
