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

1. (Temporary workaround) Update your `StubLibrary.pcfproj` to disable the automatic npm install step as it is not currently compatible with NPM Workspaces. You can add the following property:
    ```diff
    <?xml version="1.0" encoding="utf-8"?>
    <Project ToolsVersion="15.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
        <PropertyGroup>
            <PowerAppsTargetsPath>$(MSBuildExtensionsPath)\Microsoft\VisualStudio\v$(VisualStudioVersion)\PowerApps</PowerAppsTargetsPath>
        </PropertyGroup>

        <Import Project="$(MSBuildExtensionsPath)\$(MSBuildToolsVersion)\Microsoft.Common.props" />
        <Import Project="$(PowerAppsTargetsPath)\Microsoft.PowerApps.VisualStudio.Pcf.props" Condition="Exists('$(PowerAppsTargetsPath)\Microsoft.PowerApps.VisualStudio.Pcf.props')" />

        <PropertyGroup>
            <Name>StubLibrary</Name>
             <ProjectGuid>bd0603c7-b7ee-4011-ba28-1fb7dcb14520</ProjectGuid>
            <OutputPath>$(MSBuildThisFileDirectory)out\controls</OutputPath>
    +       <PcfEnableAutoNpmInstall>false</PcfEnableAutoNpmInstall>
        </PropertyGroup>

        <PropertyGroup>
            <TargetFrameworkVersion>v4.6.2</TargetFrameworkVersion>
            <!--Remove TargetFramework when this is available in 16.1-->
            <TargetFramework>net462</TargetFramework>
            <RestoreProjectStyle>PackageReference</RestoreProjectStyle>
        </PropertyGroup>

        <ItemGroup>
            <PackageReference Include="Microsoft.PowerApps.MSBuild.Pcf" Version="1.*" />
            <PackageReference Include="Microsoft.NETFramework.ReferenceAssemblies" Version="1.0.0" PrivateAssets="All" />
        </ItemGroup>

        <ItemGroup>
            <ExcludeDirectories Include="$(MSBuildThisFileDirectory)\.gitignore" />
            <ExcludeDirectories Include="$(MSBuildThisFileDirectory)\bin\**" />
            <ExcludeDirectories Include="$(MSBuildThisFileDirectory)\obj\**" />
            <ExcludeDirectories Include="$(OutputPath)\**" />
            <ExcludeDirectories Include="$(MSBuildThisFileDirectory)\*.pcfproj" />
            <ExcludeDirectories Include="$(MSBuildThisFileDirectory)\*.pcfproj.user" />
            <ExcludeDirectories Include="$(MSBuildThisFileDirectory)\*.sln" />
            <ExcludeDirectories Include="$(MSBuildThisFileDirectory)\node_modules\**" />
        </ItemGroup>

        <ItemGroup>
            <None Include="$(MSBuildThisFileDirectory)\**" Exclude="@(ExcludeDirectories)" />
        </ItemGroup>

        <Import Project="$(MSBuildToolsPath)\Microsoft.Common.targets" />
        <Import Project="$(PowerAppsTargetsPath)\Microsoft.PowerApps.VisualStudio.Pcf.targets" Condition="Exists('$(PowerAppsTargetsPath)\Microsoft.PowerApps.VisualStudio.Pcf.targets')" />

    </Project>
    ```

1. Create a new folder at the root of your project named `DependencyControl`

1. Open a terminal to that folder:
   ```shell
   cd C:\repos\AlbanianXrm\PCF-Workspaces\DependencyControl
   ```

1. Create the second PCF Project
   ```shell
   pac pcf init -n DependencyControl -ns SampleNamespace -t field -fw react
   ```

1. Modify the `package.json` of your PCF project to have a different name and avoid clashes with workspaces. The diff for `DependencyControl/package.json` should look like this: 
    ```diff
    {
    -   "name": "pcf-project",
    +   "name": "dependency-control",
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
            "react": "16.14.0",
            "@fluentui/react-components": "9.46.2",
            "react-dom": "16.14.0"
        },
        "devDependencies": {
            "@eslint/js": "^9.17.0",
            "@microsoft/eslint-plugin-power-apps": "^0.2.51",
            "@types/powerapps-component-framework": "^1.3.15",
            "@types/react": "^16.14.60",
            "@types/react-dom": "^16.9.24",
            "eslint-plugin-promise": "^7.1.0",
            "eslint-plugin-react": "^7.37.2",
            "globals": "^15.13.0",
            "pcf-scripts": "^1",
            "pcf-start": "^1",
            "react": "^16.14.0",
            "typescript": "^4.9.5",
            "typescript-eslint": "^8.18.1"
        }
    }
    ```

1. Update `tsconfig.json` to point to the right parent project. `DependencyControl/tsconfig.json` needs to be updated as follows:
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

1. (Temporary workaround) Update your `DependencyControl.pcfproj` to disable the automatic npm install step as it is not currently compatible with NPM Workspaces. You can add the following property:
    ```diff
    <?xml version="1.0" encoding="utf-8"?>
    <Project ToolsVersion="15.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
        <PropertyGroup>
            <PowerAppsTargetsPath>$(MSBuildExtensionsPath)\Microsoft\VisualStudio\v$(VisualStudioVersion)\PowerApps</PowerAppsTargetsPath>
        </PropertyGroup>

        <Import Project="$(MSBuildExtensionsPath)\$(MSBuildToolsVersion)\Microsoft.Common.props" />
        <Import Project="$(PowerAppsTargetsPath)\Microsoft.PowerApps.VisualStudio.Pcf.props" Condition="Exists('$(PowerAppsTargetsPath)\Microsoft.PowerApps.VisualStudio.Pcf.props')" />

        <PropertyGroup>
            <Name>DependencyControl</Name>
            <ProjectGuid>5e30cb78-8719-4448-a674-82d41cfa6ed3</ProjectGuid>
            <OutputPath>$(MSBuildThisFileDirectory)out\controls</OutputPath>
    +       <PcfEnableAutoNpmInstall>false</PcfEnableAutoNpmInstall>
        </PropertyGroup>

        <PropertyGroup>
            <TargetFrameworkVersion>v4.6.2</TargetFrameworkVersion>
            <!--Remove TargetFramework when this is available in 16.1-->
            <TargetFramework>net462</TargetFramework>
            <RestoreProjectStyle>PackageReference</RestoreProjectStyle>
        </PropertyGroup>

        <ItemGroup>
            <PackageReference Include="Microsoft.PowerApps.MSBuild.Pcf" Version="1.*" />
            <PackageReference Include="Microsoft.NETFramework.ReferenceAssemblies" Version="1.0.0" PrivateAssets="All" />
        </ItemGroup>

        <ItemGroup>
            <ExcludeDirectories Include="$(MSBuildThisFileDirectory)\.gitignore" />
            <ExcludeDirectories Include="$(MSBuildThisFileDirectory)\bin\**" />
            <ExcludeDirectories Include="$(MSBuildThisFileDirectory)\obj\**" />
            <ExcludeDirectories Include="$(OutputPath)\**" />
            <ExcludeDirectories Include="$(MSBuildThisFileDirectory)\*.pcfproj" />
            <ExcludeDirectories Include="$(MSBuildThisFileDirectory)\*.pcfproj.user" />
            <ExcludeDirectories Include="$(MSBuildThisFileDirectory)\*.sln" />
            <ExcludeDirectories Include="$(MSBuildThisFileDirectory)\node_modules\**" />
        </ItemGroup>

        <ItemGroup>
            <None Include="$(MSBuildThisFileDirectory)\**" Exclude="@(ExcludeDirectories)" />
        </ItemGroup>

        <Import Project="$(MSBuildToolsPath)\Microsoft.Common.targets" />
        <Import Project="$(PowerAppsTargetsPath)\Microsoft.PowerApps.VisualStudio.Pcf.targets" Condition="Exists('$(PowerAppsTargetsPath)\Microsoft.PowerApps.VisualStudio.Pcf.targets')" />

    </Project>

    ```

1. Open a terminal in the root folder and install the NPM packages with the following comand:
    ```shell
    npm i
    ```

1. Check that the two components can be built without issues. Execute the following commands in your terminal:
    ```shell
    cd StubLibrary
    dotnet build -c Release
    cd ..
    cd DependencyControl
    dotnet build -c Release
    cd ..
    ```

## 2. Define the library 

1. You need a new declaration file (d.ts) to describe the objects and functions contained in your library. Create a new file in the root folder of your project named `StubLibrary/myLib.d.ts`.

1. Write the following content to `StubLibrary/myLib.d.ts`:
    ```typescript
    declare module 'myLib' {
        export function sayHello(): string;
    }

    ```
