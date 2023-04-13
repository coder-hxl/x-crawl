---
name: "\U0001F41E Bug report"
about: Create a report to help us improve
title: ''
labels: ''
assignees: ''

---

- type: markdown
    attributes:
      value: >
        **Thanks for taking the time to fill out this bug report!**

  - id: summary
    type: textarea
    attributes:
      label: Bug expectation
      description: What do you expect to happen? What actually happened instead?
      placeholder: |
        I expected ...

        What happened instead was ...
    validations:
      required: true
  - id: mvce
    type: textarea
    attributes:
      label: Minimal, reproducible example
      description: >
        Provide a [minimal, reproducible
        example](https://stackoverflow.com/help/minimal-reproducible-example).
        *No need for backticks — this automatically gets formatted into code.*
      render: TypeScript
    validations:
      required: true
  - id: error
    type: input
    attributes:
      label: Error string
      description: >
        Provide the bug's error. **If the script
        does not throw**, write `no error` (case insensitive).
      placeholder: Something went wrong
    validations:
      required: true
  - id: x-crawl-version
    type: input
    attributes:
      label: x-crawl version
      description: |
        What version of x-crawl are you running? *This must be a valid semver
        tag.*
    validations:
      required: true
  - id: node-version
    type: input
    attributes:
      label: Node version
      description: |
        What supported version of Node.js are you running? *This must be a valid
        semver tag.*
    validations:
      required: true
  - id: pkg-mgr
    type: dropdown
    attributes:
      label: Package manager
      description: What package manager are you running?
      options:
        - npm
        - yarn
        - pnpm
    validations:
      required: true
  - id: pkg-mgr-version
    type: input
    attributes:
      label: Package manager version
      description: |
        What version of the package manager are you running? *This must be a
        valid semver tag.*
    validations:
      required: true
