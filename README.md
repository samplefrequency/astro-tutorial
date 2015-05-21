
Contributing
------------

This tutorial repo follows
[gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow).
One complexity is that there are really two separate workflows in this one
repository. There is a branch to showcase the full functionality of a finished
app (`full`), as well as a starting point for the tutorial (`start`). An example development
workflow is as follows:

1. Branch off `develop` (either `start-develop` or `full-develop`).
2. Add in your features.
3. Make a pull request against the appropriate `develop` branch.
4. Once that's :+1:'ed, merge it.

### Releasing

`astro-tutorial` is released in conjunction with `astro-sdk`. [Follow the release checklist to publish a new release of Astro.](https://github.com/mobify/astro/blob/develop/RELEASE.md)
