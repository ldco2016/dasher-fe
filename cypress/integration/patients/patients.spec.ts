/// <reference types="cypress" />
import _ from 'lodash'
import { IsValidDate } from './util'

context('Patients', () => {
  beforeEach(() => {
    cy.login()

    // Goes to patients / patient details
    cy.get('[data-cy=Patients]').click()

    // This ignores a benign render error when cypress has all of the drawers open
    // on a snall screen
    // (uncaught exception)Error: ResizeObserver loop limit exceeded
    // Ticket: https://alunacare.atlassian.net/browse/AR-248
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })
  })
  it.skip('Renders matching patient from patients list', () => {
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(1)')
      .invoke('text')
      .then((text1) => {
        cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(1)').click()

        cy.get('[data-cy="patient-name"]')
          .invoke('text')
          .should((text2) => {
            expect(text2.trim()).contains(text1.trim())
          })
      })

    cy.get('[data-testid=KeyboardArrowLeftIcon]').click()
    // Selector relies on generated classnames... so skip for now
    cy.get(
      '.css-syyjoe > .MuiButtonBase-root > [data-testid=KeyboardArrowRightIcon]'
    ).click()
  })

  context('Data Display validation', () => {
    // TODO: this test is not going to details first, why is it looking for DOB?
    it.skip('DOB displays correctly', () => {
      cy.get('main')
        .find('time')
        .then((what) => {
          _.forEach(what, (val) => IsValidDate(val.innerText))
        })
    })
  })

  context('Table Sorting', () => {
    it('Has correct default sort', () => {
      const sel = {
        asthmaControlDesc:
          '[data-cy=table-sort-label-asthmaControl-desc] > [data-testid=ArrowDownwardIcon]',
        asthmaControlAsc:
          '[data-cy=table-sort-label-asthmaControl-asc] > [data-testid=ArrowDownwardIcon]',
      }
      cy.get(sel.asthmaControlDesc)
        .should('exist')
        .should('be.visible')
        .click()
        .end()

      cy.get(sel.asthmaControlDesc).should('not.exist').end()

      cy.get(sel.asthmaControlAsc).should('exist').should('be.visible').click()

      cy.get(sel.asthmaControlAsc).should('not.exist')

      cy.get(sel.asthmaControlDesc).should('exist').should('be.visible')
    })

    it('Supports re-sorting as expected', () => {
      const sel = {
        asthmaControl: {
          core: '[data-cy=table-cell-asthmaControl]',
          desc: '[data-cy=table-sort-label-asthmaControl-desc] > [data-testid=ArrowDownwardIcon]',
          asc: '[data-cy=table-sort-label-asthmaControl-asc] > [data-testid=ArrowDownwardIcon]',
        },
        name: {
          core: '[data-cy=table-cell-Name]',
          desc: '[data-cy=table-sort-label-Name-desc] > svg',
          asc: '[data-cy=table-sort-label-Name-asc] > svg',
        },
      }

      cy.get(sel.asthmaControl.desc).should('exist').should('be.visible').end()

      cy.get(sel.name.core).should('exist').click()

      cy.get(sel.name.asc).should('exist').should('be.visible').click().end()

      cy.get(sel.name.asc).should('not.exist')

      cy.get(sel.name.desc).should('exist').should('be.visible').click().end()

      cy.get(sel.asthmaControl.core)
        .should('exist')
        .click()
        .should('exist')
        .should('be.visible')
    })

    it('retains sort criteria upon navigation (AR-383)', () => {
      const sel = {
        name: {
          core: '[data-cy=table-cell-Name]',
          desc: '[data-cy=table-sort-label-Name-desc] > svg',
          asc: '[data-cy=table-sort-label-Name-asc] > svg',
        },
      }

      cy.get(sel.name.core).should('exist').click()

      cy.get('[data-cy=Dashboard]').should('exist').click()

      cy.get('[data-cy=Patients]').should('exist').click()

      cy.get(sel.name.asc).should('exist').should('be.visible').click().end()
    })
  })

  context.skip('Search - Asthma control', () => {
    it.skip('Selects Good', () => {
      cy.get('[data-cy=chip-all-all]').should('be.visible')

      cy.get('#mui-component-select-select-multiple-chip').click()

      cy.get('[data-cy=menu-item-good-1]').click().type('{esc}')

      // Good chip should be visible; all chip should be gone.
      cy.get('[data-cy="chip-all-all"]').should('not.exist')
      cy.get('[data-cy="chip-default-good"]').should('be.visible')
    })

    /* 
      Currently we don't have test accounts which express all of the states
      that the patient list can be in. Because filters for asthmaControl are
      now dynamic based on whether or not that filter option exists in the
      dataset, we can't test for veryPoor, and poor. Our current test acct
      (dr dolittle) does have all, undefined, and poor. To work around this
      for the time being, we have built static fixtures with Cypress component
      tests to verify that these states render appropriately on the table, and
      that the dynamic filter selection reflects the available options 
    */

    it.skip('Selects Good and Poor', () => {
      cy.get('[data-cy=chip-all-all]').should('be.visible')

      cy.get('#mui-component-select-select-multiple-chip').click()

      cy.get('[data-cy=menu-item-good-1]').click().type('{esc}')

      // Good chip should be visible; all chip should be gone.
      cy.get('[data-cy="chip-all-all"]').should('not.exist')
      cy.get('[data-cy="chip-default-good"]').should('be.visible')
      // cy.get('[data-cy="chip-error-veryPoor"]').should('be.visible')
    })

    it.skip('Select Good twice and clears to All', () => {
      cy.get('[data-cy=chip-all-all]').should('be.visible')

      cy.get('#mui-component-select-select-multiple-chip').click()

      cy.get('[data-cy=menu-item-good-1]') // Select
        .click()
        .end()

      cy.get('li[data-cy=menu-item-good-1]') // Unselect -> All
        .click()

      // Closes the menu
      cy.get('[id=menu-select-multiple-chip]').click()

      // Good chip should be visible; all chip should be gone.
      cy.get('[data-cy="chip-all-all"]').should('be.visible')
      cy.get('[data-cy="chip-default-good"]').should('not.exist')
    })

    it.skip('Re-selects all after another value', () => {
      cy.get('[data-cy=chip-all-all]').should('be.visible')

      cy.get('#mui-component-select-select-multiple-chip').click()

      cy.get('[data-cy=menu-item-good-1]').click().type('{esc}').end()

      // Good chip should be visible; all chip should be gone.
      cy.get('[data-cy="chip-all-all"]').should('not.exist')
      cy.get('[data-cy="chip-default-good"]').should('be.visible')

      // click 'All'
      cy.get('#mui-component-select-select-multiple-chip').click()
      cy.get('[data-cy=menu-item-all-0]').click().type('{esc}').end()

      cy.get('[data-cy="chip-all-all"]').should('be.visible')
      cy.get('[data-cy="chip-default-good"]').should('not.exist')
    })

    it('retains the sort criteria (AR-383)', () => {
      cy.get('[data-cy=chip-all-all]').should('be.visible')

      cy.get('#mui-component-select-select-multiple-chip').click()

      cy.get('[data-cy=menu-item-good-1]')
        .click()
        // .get('[data-cy=menu-item-veryPoor-2]')
        // .click()
        .type('{esc}')

      // Good chip should be visible; all chip should be gone.
      cy.get('[data-cy="chip-all-all"]').should('not.exist')
      cy.get('[data-cy="chip-default-good"]').should('be.visible')
      // cy.get('[data-cy="chip-error-veryPoor"]').should('be.visible')

      cy.get('[data-cy=Dashboard]').should('exist').click()

      cy.get('[data-cy=Patients]').should('exist').click()

      cy.get('[data-cy="chip-all-all"]').should('not.exist')
      cy.get('[data-cy="chip-default-good"]').should('be.visible')
      // cy.get('[data-cy="chip-error-veryPoor"]').should('be.visible')
    })
  })

  context('Grid Paging', () => {
    //I'll revisit this in another branch; this isn't related to the current PR.
    it.skip('displays row count given filter', () => {
      cy.get('.MuiTablePagination-displayedRows')
        .should('exist')
        .should('contain', /1-\d+ of \d+/gi)

      cy.get('.css-1r1dv4r > .MuiInputBase-root > .MuiInputBase-input')
        .should('exist')
        .type('iv')

      cy.get('.MuiTablePagination-displayedRows')
        .should('exist')
        .should('contain', /1-\d+ of \d+/gi)

      cy.get('.css-1r1dv4r > .MuiInputBase-root > .MuiInputBase-input')
        .clear()
        .type('235346452342356457575664564564576456')

      cy.get('.MuiTablePagination-displayedRows')
        .should('exist')
        .should('contain', /0-\d+ of \d+/gi)
    })
  })

  context('grid sorting last used', () => {
    const executeSortOnLastUsed = () =>
      cy.get('[data-cy=table-cell-lastUsed]').click()

    it('Sorts back-n-fourth', () => {
      executeSortOnLastUsed()

      cy.get('[data-cy=table-row-0] > [data-cy=cell_integer]').contains(/^\d+$/)

      //executeSortOnLastUsed()

      // This is not always true
      //cy.get('[data-cy=table-row-0] > [data-cy=cell_Today]').contains('Today')
    })

    // it('Sort - Inactive mid-last', () => {
    //   // Inactive stay where they should
    // })

    it('sort - no data always at the end.', () => {
      // This test is data dependent and not really the best as it will break if the data is changed too drastically.
      executeSortOnLastUsed()
      const anyRowLastUsed = '[data-cy^=table-row-] > [data-cy=cell_empty]'

      cy.get(anyRowLastUsed).contains('--')

      executeSortOnLastUsed()

      cy.get(anyRowLastUsed).contains('--')
    })
  })

  //Data dependent.
  it.skip('Verifies that y-axis symptom score has no decimals ', () => {
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(1)').click()

    // select a wide range of readings over time which is
    // more likely to push the yaxis into decimal territory
    cy.get('[value="3m"]').click()

    cy.get('[data-cy=symptomScoreYAxisTick]')
      .invoke('text')
      .should('match', /^[0-9]*$/)
  })

  context.skip('Filters by provider', () => {
    const testProvider = 'Leonard McCoy'

    it('Selects John Dolittle', () => {
      cy.get('[data-cy="provider"]').should('contain', testProvider)
      cy.get('#providerss-select').click()
      cy.get('[data-value="John Dolittle"]').click()
      cy.get('[data-cy="provider"]').should('contain', 'John Dolittle')
      cy.get('[data-cy="provider"]').should('not.contain', testProvider)
      cy.get('#providers-select').click()
      cy.get('[data-value="All Providers"]').click()
      cy.get('[data-cy="provider"]').should('contain', testProvider)
      cy.get('[data-cy=table-sort-label-provider-asc]').click()
      cy.get(':nth-child(1) > [data-cy=provider]').should(
        'contain',
        testProvider
      )
    })
  })
})
