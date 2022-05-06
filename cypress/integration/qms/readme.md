## VnV Automation - Statement of Purpose

This directory contains spec files used to generate VnV 
screenshots automatically. 

They present as integration tests and really, they are, but we require 
screenshots at specific points. 

Thus, these specs should always take screenshots. These screenshots are named
with the name of the test. The screenshot file names are used to generate
and fill in the automated VnV document. 

## Test Structure
In order to facilitate this, the tests get a specific naming convention.

That pattern is as follows: 

```javascript
context('Section Name', () => {
  //Each test in the section will be grouped togther. In the 
  // manually produced file, this would be the tabs.
  it('[1] - [2] - [3]', () => {
    // [1] = Test code, such as 1.1
    // [2] = A description of the action being tested
    // [3] = A description of the desired outcome.
    // We parse the string with regex on the dash.
    // ...
    cy.screenshot() //This command takes the screenshot.
  })
})
```

## Test Generation

The tests are to be based on design artifacts from the design and development phase. 