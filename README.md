# OptiSigns

### Contributing

> NOTE: Before committing your changes, ensure that you have tested them locally using `pnpm test` and have ran them through a single pass of successful linting and formatting using `pnpm beautify`

1. **Feature branch**

All contributions should be from a feature branch whose name is derived from Linear, the format is as follows: `<username>/res-<issue_number>-<issue_title>`.

For example: `songsen/uploadFile`

2. **Pull request**

A pull request must be created against `main` in order for a contribution to be valid. Each pull request must fill out the pull request template as accurately as possible with as much detail and context for the pull request reviewer.

3. **Commit messages**

Commits should be descriptive and follow the conventional commits standard listed below.

#### Commit type

| Commit Type | Title                    | Description                                                                                              |
| ----------- | ------------------------ | -------------------------------------------------------------------------------------------------------- |
| `init`      | Inital Commit            | The projects first commit                                                                                |
| `feat`      | Features                 | A commit denoting a new feature                                                                          |
| `fix`       | Bug Fixes                | A commit denoting a bug Fix                                                                              |
| `docs`      | Documentation            | Documentation changes                                                                                    |
| `style`     | Styles                   | Changes that do not affect the meaning of the code (white-space, formatting, linting, etc)               |
| `refactor`  | Code Refactoring         | A code change, enhancement or improvement that neither fixes a bug nor adds a feature                    |
| `perf`      | Performance Improvements | A code optimisation that improves performance                                                            |
| `test`      | Tests                    | Adding tests or correcting existing tests                                                                |
| `ci`        | Continuous Integration   | Changes to our CI configuration files and scripts (e.g.: Github Actions, Terraform, Docker, K8s)         |
| `revert`    | Reverts                  | Reverts a previous commit                                                                                |
| `chore`     | Chores                   | Changes that do not fit within the above categories and do not add or remove application or package code |

## Examples

Each commit should have the following format:

```
commitType: commit message
```

```
init: the beginning of new things
```

```
feat: add temporal worker impl
```

```
docs: write code examples for using proxy with cli commands
```
