# Issue Forms Version Dropdown

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Version%20Dropdown-blue.svg?colorA=24292e&colorB=0366d6&style=flat&longCache=true&logo=github)](https://github.com/marketplace/actions/issue-forms-version-dropdown)
[![Sponsor ShaMan123](https://img.shields.io/badge/Sponsor%20%E2%9D%A4%20-ShaMan123-%E2%9D%A4?logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/ShaMan123)

[![🧪 Test](https://github.com/ShaMan123/gha-populate-form-version/actions/workflows/test.yml/badge.svg)](https://github.com/ShaMan123/gha-populate-form-version/actions/workflows/test.yml)
[![🚀 Update Bug Report](https://github.com/ShaMan123/gha-populate-form-version/actions/workflows/update_bug_report.yml/badge.svg)](https://github.com/ShaMan123/gha-populate-form-version/actions/workflows/update_bug_report.yml)
[![🚀 Update Demo](https://github.com/ShaMan123/gha-populate-form-version/actions/workflows/update_demo.yml/badge.svg)](https://github.com/ShaMan123/gha-populate-form-version/actions/workflows/update_demo.yml)

A github action populating an [issue forms](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms) version dropdown.

## Supported Registries

- npm
- github releases

PRs adding support to more registries are WELCOME.

## Configuring

- Follow [this workflow](.github/workflows/update_bug_report.yml).
- Replace the `uses: ./` directive to point to [![published action](https://img.shields.io/github/v/tag/ShaMan123/gha-populate-form-version?label=ShaMan123%2Fgha-populate-form-version%40&sort=semver)](https://github.com/marketplace/actions/issue-forms-version-dropdown).
- See `inputs` and `outputs` in the [spec](/action.yml).

Take a look at the resulting [issue template](../../issues/new?template=bug_report.yml).
And see the [bot](../../commits?author=github-actions%5Bbot%5D) in action.

https://user-images.githubusercontent.com/34343793/192214911-623c0755-3a11-4294-951c-3a03b36fd204.mp4

## Advanced Usage

Refer to the [demo workflow](.github/workflows/update_demo.yml) which populates version dropdowns for the [demo report](../../issues/new?template=demo.yml).

Refer to [![issue-forms-dropdown-options](https://img.shields.io/github/v/tag/ShaMan123/gha-form-dropdown-options?label=ShaMan123%2Fgha-form-dropdown-options%40&sort=semver)](https://github.com/marketplace/actions/issue-forms-dropdown-options) for [advanced usage](https://github.com/ShaMan123/gha-form-dropdown-options#advanced-usage) such as [creating a PR](https://github.com/ShaMan123/gha-form-dropdown-options#creating-a-pr) to update a bug report, [using a template](https://github.com/ShaMan123/gha-form-dropdown-options#templates) and more.

## Developing

- Create a [github access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic)
- Add it to `.env`:

```
GITHUB_TOKEN=
```

```bash
npm i
npm start
npm test
```
