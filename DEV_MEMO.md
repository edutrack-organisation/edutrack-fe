# Dev Memo

## TODO
- [ ] Types and DB management
- [ ] Configure APIs
- [ ] Add support for sub-questions (e.g. 7.a, 3.iii) (Implication: Parts a and b might test on different topics, but if you can't solve part a you cannot do part b)
- [ ] ER Diagram for BE
- [ ] Topics management
- [ ] Style CourseSelectPage
- [ ] Navbar: Add session timeout to local userId and move the validation to a wrapper component
- [ ] Navbar: Add back button for courses
- [ ] VierPapersPage: courseId validation
- [ ] Api: Error handling for API fetch failures
- [ ] ESLint configuration
    - Use `import type` instead of `import`
    - Double quotes instead of single quotes
    - Place semicolon at every line of code
- [ ] Adjust Typography fonts based on screen size


## Things to note

- Some boxes might use height={"calc(100vh - 5rem)"}, where the 5rem is the height of the NavBar

### API

- API calls to the backend should be made through the Api.tsx file for consistency and ease of maintenance.
- When API calls need to be made to systems outside of the project, it is recommended to create a new API file (e.g. ApiGoogle).
- ApiMock.tsx is used for testing purposes and should be ignored in the actual build. It should stay only on the testing branch and not the master branch.
    - When mocking APIs, it is recommended to use a setTimeout function to  simulate backend processing time.
