
Contributing
------------

This tutorial repo follows
[gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow).
One complexity is that there are really three separate workflows in this one
repository. There is a branch to showcase the full functionality of a finished
app, as well as a starting and ending point for the tutorial. The development
workflow should be as follows:

1. Create a branch off of the showcase-master branch
2. Add in your features
3. Make a pull request against the showcase-develop branch
4. If you need to update the tutorial end point as a result of your changes,
branch off of your newly created branch, and update `app.js` to bring it inline
with the end point of the tutorial
5. Make a pull request against the end-tutorial-develop branch
6. If you need to update the starting point for the tutorial, branch off of your
tutorial-end branch, and make your changes.
7. Make a pull request against the start-tutorial-develop branch

### Releasing

When it comes time to cut a release, you must make a release branch for each of
the start, end, and showcase tutorial branches. Each release branch should have
a pull request made to it's corresponding master branch
(Eg. start-tutorial-release-0.1.0 -> start-tutorial-master). Once the pull
requests get approved, merge them into their master branches and tag them with
the appropriate version number.
