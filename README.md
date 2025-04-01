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