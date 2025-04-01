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

1. We are going to expose our library as an UMD module, and we need to put the variable in the global scope. For this we need a new declaration file (d.ts). Create a new file in the root folder of your project named `StubLibrary/global.d.ts`.

1. Write the following to `StubLibrary/global.d.ts`:
    ```typescript
    /* eslint-disable no-var */
    declare global {
        var myLib: typeof import('myLib');
    }

    export { };
   
    ```

1. Update `StubLibrary/tsconfig.json` to allow UMD modules and javascript code as follows:
    ```diff
    {
        "extends": "../node_modules/pcf-scripts/tsconfig_base.json",
        "compilerOptions": {
    +       "allowJs": true,
    +       "allowUmdGlobalAccess": true,
    +       "outDir": "dist",
            "typeRoots": ["../node_modules/@types"]
        }
    }

1. Create a new folder to contain your libraries in `StubLibrary/StubLibrary` named `libs`.
    ```shell
    cd StubLibrary
    cd StubLibrary
    mkdir libs
    ```

1. Create a JS file `myLib-v_0_0_1.js` in the `libs` folder, path `StubLibrary/StubLibrary/libs/myLib-v_0_0_1.js`.

1. Write the following content to `StubLibrary/StubLibrary/libs/myLib-v_0_0_1.js`:
   ```javascript
   // UMD module pattern

   var myLib = (function (exports) {
      'use strict';
   
      function sayHello() {
         return "Hello from myLib";
      }
   
      exports.sayHello = sayHello;
   
      return exports;
   
   }(/** @type {import('myLib')}  */({})));

   ```
   
1. Create a new file named `featureconfig.json` in the `StubLibrary` project.

1. Write the following content to `StubLibrary/featureconfig.json`:

   ```json
   {
     "pcfAllowCustomWebpack": "on",
     "pcfAllowLibraryResources": "on"
   }
   
   ```

   [Learn more about the featureconfig.json file](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/dependent-libraries#featureconfigjson)


1. Create a new file named `webpack.config.js` in the `StubLibrary` project.

1. Write the following content to `StubLibrary/webpack.config.js`:

   ```typescript
   /* eslint-disable */
   "use strict";

   module.exports = {
     externals: {
       "myLib": "myLib"
     },
   }
     
   ```

   [Learn more about the webpack.config.js file](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/dependent-libraries#webpackconfigjs)

1.  Add a reference to the library under the `resources` in the `StubLibrary` control manifest. Update `StubLibrary/StubLibrary/ControlManifest.Input.xml` as follows:
    ```diff
    <?xml version="1.0" encoding="utf-8" ?>
    <manifest>
        <control namespace="SampleNamespace" constructor="StubLibrary" version="0.0.1" display-name-key="StubLibrary" description-key="StubLibrary description" control-type="standard" >
            <!--external-service-usage node declares whether this 3rd party PCF control is using external service or not, if yes, this control will be considered as premium and please also add the external domain it is using.
            If it is not using any external service, please set the enabled="false" and DO NOT add any domain below. The "enabled" will be false by default.
            Example1:
            <external-service-usage enabled="true">
                <domain>www.Microsoft.com</domain>
            </external-service-usage>
            Example2:
            <external-service-usage enabled="false">
            </external-service-usage>
            -->
            <external-service-usage enabled="false">
                <!--UNCOMMENT TO ADD EXTERNAL DOMAINS
                <domain></domain>
                <domain></domain>
                -->
            </external-service-usage>
            <!-- property node identifies a specific, configurable piece of data that the control expects from CDS -->
            <property name="sampleProperty" display-name-key="Property_Display_Key" description-key="Property_Desc_Key" of-type="SingleLine.Text" usage="bound" required="true" />
            <!--
            Property node's of-type attribute can be of-type-group attribute.
            Example:
            <type-group name="numbers">
                <type>Whole.None</type>
                <type>Currency</type>
                <type>FP</type>
                <type>Decimal</type>
            </type-group>
            <property name="sampleProperty" display-name-key="Property_Display_Key" description-key="Property_Desc_Key" of-type-group="numbers" usage="bound" required="true" />
            -->
            <resources>                
                <library name="myLib" version=">=1" order="1"> 
                    <packaged_library path="libs/myLib-v_0_0_1.js" version="0.0.1" /> 
                </library> 
                <code path="index.ts" order="2"/>
                <!-- UNCOMMENT TO ADD MORE RESOURCES
                <css path="css/StubLibrary.css" order="1" />
                <resx path="strings/StubLibrary.1033.resx" version="1.0.0" />
                -->
            </resources>
            <!-- UNCOMMENT TO ENABLE THE SPECIFIED API
            <feature-usage>
                <uses-feature name="Device.captureAudio" required="true" />
                <uses-feature name="Device.captureImage" required="true" />
                <uses-feature name="Device.captureVideo" required="true" />
                <uses-feature name="Device.getBarcodeValue" required="true" />
                <uses-feature name="Device.getCurrentPosition" required="true" />
                <uses-feature name="Device.pickFile" required="true" />
                <uses-feature name="Utility" required="true" />
                <uses-feature name="WebAPI" required="true" />
            </feature-usage>
            -->
        </control>
    </manifest>

    ```

1. Add the library to the [window](https://developer.mozilla.org/docs/Web/API/Window). Update the `StubLibrary/StubLibrary/index.ts` as follows:
    ```diff
    +import * as myLib from 'myLib';
    import { IInputs, IOutputs } from "./generated/ManifestTypes";

    export class StubLibrary implements ComponentFramework.StandardControl<IInputs, IOutputs> {
        /**
        * Empty constructor.
        */
        constructor() {
            // Empty
        }

        /**
        * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
        * Data-set values are not initialized here, use updateView.
        * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
        * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
        * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
        * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
        */
        public init(
            context: ComponentFramework.Context<IInputs>,
            notifyOutputChanged: () => void,
            state: ComponentFramework.Dictionary,
            container: HTMLDivElement
        ): void {
            // Add control initialization code
        }


        /**
        * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
        * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
        */
        public updateView(context: ComponentFramework.Context<IInputs>): void {
            // Add code to update control view
        }

        /**
        * It is called by the framework prior to a control receiving new data.
        * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
        */
        public getOutputs(): IOutputs {
            return {};
        }

        /**
        * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
        * i.e. cancelling any pending remote calls, removing listeners, etc.
        */
        public destroy(): void {
            // Add code to cleanup control if necessary
        }
    }

    +(function () {
    +   window.myLib = myLib;
    +})();
    ```

1. Push the component to your developer environment. Execute the following comamnd in your terminal:
    ```shell
    cd StubLibrary
    pac pcf push
    ```
    `Note!` This will create the custom control using the `dev` prefix, and component can be referenced as `dev_SampleNamespace.StubLibrary`

## 3. Build the Dependent control

1. Since the `dev_SampleNamespace.StubLibrary` is exposed as an UMD module, we need to put the variable in the global scope. For this we need a new declaration file (d.ts). Create a new file in the root folder of your `DependencyControl` project named `global.d.ts`.

1. Write the following content to `DependencyControl/global.d.ts`:
    ```typescript
    /* eslint-disable @typescript-eslint/triple-slash-reference */
    /* eslint-disable no-var */

    /// <reference path="../StubLibrary/myLib.d.ts" />
    import * as MyLib from 'myLib';

    declare global {
        var myLib: typeof MyLib;
    }

    export { };

    ```

1. Create a new file named `featureconfig.json` in the `DependencyControl` project.

1. Write the following content to `DependencyControl/featureconfig.json`:
    ```json
    {
        "pcfResourceDependency": "on"
    } 
    ```
