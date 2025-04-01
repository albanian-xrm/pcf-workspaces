# PCF Workspaces
Tutorial on how to use NPM workspaces to work with multiple PCF components on a monorepo.

NPM Workspaces is a feature in the npm CLI that allows you to manage multiple packages within a single top-level, root package. This feature streamlines the workflow by automating the linking process during npm install, avoiding the need to manually use npm link. [read more here...](https://docs.npmjs.com/cli/using-npm/workspaces)

For this tutorial we are going to build components using Dependent Libraries, and with the help of workspaces we are going to avoid having many node_module folders in our project. If you are interested in Dependent Libraries [read more here...](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/dependent-libraries)

## 1. Setting up the workspace
Go to the root of your project. Our example will be using vscode but this is not mandatory.

```shell
code C:\repos\AlbanianXrm\PCF-Workspaces
```

1. Create a `package.json` file at the root of your project.

1. Write the following content to the `package.json`:
    ```json
    {
        "name": "pcf-worskpaces",
        "workspaces":[
            "StubLibrary",
            "DependencyControl"
        ]
    }
    ```

1. Create a new folder at the root of your project named `StubLibrary`

1. Open a terminal to that folder:
   ```shell
   cd C:\repos\AlbanianXrm\PCF-Workspaces\StubLibrary
   ```

1. Create the first PCF Project
   ```shell
   pac pcf init -n StubLibrary -ns SampleNamespace -t field
   ```

1. Modify the `package.json` of your PCF project to have a different name and avoid clashes with workspaces. The diff for `StubLibrary/package.json` should look like this: 
    ```diff
    {
    -   "name": "pcf-project",
    +   "name": "stub-library",
        "version": "1.0.0",
        "description": "Project containing your PowerApps Component Framework (PCF) control.",
        "scripts": {
            "build": "pcf-scripts build",
            "clean": "pcf-scripts clean",
            "lint": "pcf-scripts lint",
            "lint:fix": "pcf-scripts lint fix",
            "rebuild": "pcf-scripts rebuild",
            "start": "pcf-scripts start",
            "start:watch": "pcf-scripts start watch",
            "refreshTypes": "pcf-scripts refreshTypes"
        },
        "dependencies": {
        },
        "devDependencies": {
            "@eslint/js": "^9.17.0",
            "@microsoft/eslint-plugin-power-apps": "^0.2.51",
            "@types/node": "^18.19.54",
            "@types/powerapps-component-framework": "^1.3.15",
            "eslint-plugin-promise": "^7.1.0",
            "globals": "15.13.0",
            "pcf-scripts": "^1",
            "pcf-start": "^1",
            "typescript": "^4.9.5",
            "typescript-eslint": "^8.18.1"
        }
    }

    ```

1. Update `tsconfig.json` to point to the right parent project. `StubLibrary/tsconfig.json` needs to be updated as follows:
    ```diff
    {
    -    "extends": "./node_modules/pcf-scripts/tsconfig_base.json",
    +    "extends": "../node_modules/pcf-scripts/tsconfig_base.json",
        "compilerOptions": {
    -       "typeRoots": ["node_modules/@types"]
    +       "typeRoots": ["../node_modules/@types"]
        }
    }

    ```
