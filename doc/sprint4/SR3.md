# SR4

### Summary

Sprint retrospective for sprint 3 was held on November 7 2022. All team members were present and participated in the meeting. 

### Good Practices

Team members commented that the following practices were fruitful in the last sprint:

- Backend migrated an API endpoint by merging all sub-task branches into one feature branch before shipping. This made the migration smoother and did not break the endpoint on develop.
- Frontend used custom hooks to avoid rewriting functionality and encourage code reuse.
- Backend and frontend team worked closely together to develop and test business logic so as to ensure that no edge cases were missed in the business logic

### Bad Practices

Team members commented on the following bad practices that need to be improved on.

- Some parts of the API contract did not have samples of every possible response, this caused some confusion during development.
- Some parts of feature development specification did not specify every case that the feature should handle which caused confusion during development.
- Frontend has been exporting `Props` interfaces which is dirtying up the global namespace.

### Participants

Aydin, Ben, Howard, Mohammad, Pedram, Skandan, Tina
