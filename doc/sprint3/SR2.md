# SR2

### Summary

Sprint retrospective for sprint 1 was held on October 23 2022. All team members were present and participated in the meeting. 

### Good Practices

Team members commented that the following practices were fruitful in the last sprint:

- Backend used postman to thoroughly test endpoints.
- Backend made scripts available to automate creating mock data for frontend testing.
- Frontend handled niche edge cases such as not being passed certain query params effectively. 
- Frontend followed best practices for input sanitization. In the case of markdown input, xss attacks were mitigated by using appropriate plugins to sanitize input.
- Frontend wrote some reusable components and logic that we will be able to reuse this sprint, such as copy button for group join codes.

### Bad Practices

Team members commented on the following bad practices that need to be improved on.

- Frontend needs to write hooks to reuse code instead of copy pasting. We agreed to reuse some hooks this sprint for functionality we need to encourage code reuse.
- Backend needs to update the API contract frequently as soon as changes are made so that Frontend team is aware of the changes.
- Some Backend PR reviews were rushed; we went over best practices for reviewing a PR which mostly involved checking out the PR's branch and testing it. The team agreed that reviewers will always test PRs moving forward.
- Some PRs were made without fulfilling the PR checklist, we agreed that moving forward we would make best efforts to check all relevant boxes before a PR unless we have a good reason.
- Some business logic edge cases were identified near the end of sprint and required hurried meetings to iron them out. We agreed to collectively spend more time on business logic early on in the spring.

### Participants

Aydin, Ben, Howard, Mohammad, Pedram, Skandan, Tina
