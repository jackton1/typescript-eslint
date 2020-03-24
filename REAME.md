typescript eslint
=================

typescript eslint package for pre-commit.

For pre-commit: see https://github.com/pre-commit/pre-commit

For eslint: see https://github.com/eslint/eslint


### Using eslint with pre-commit

Add this to your `.pre-commit-config.yaml`:

    -   repo: https://github.com/jackton1/typescript-eslint
        rev: ''  # Use the sha / tag you want to point at
        hooks:
        -   id: typescript-eslint

When using plugins with `typescript-eslint` you'll need to declare them under
`additional_dependencies`. For example:

    -   repo: https://github.com/pre-commit/mirrors-eslint
        rev: ''  # Use the sha / tag you want to point at
        hooks:
        -   id: typescript-eslint
            additional_dependencies:
            -   eslint@4.15.0
            -   eslint-config-google@0.7.1
            -   eslint-loader@1.6.1
            -   eslint-plugin-react@6.10.3
            -   babel-eslint@6.1.2
