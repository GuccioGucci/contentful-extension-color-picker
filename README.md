# Color Picker
![Contentful Extension](https://shields.io/badge/contentful-extension-51BCEA?logo=contentful&logoColor=white)

![Color Picker Extension](./readme-image.gif)


## Background

This extension has been created with [create-contentful-extension](https://github.com/contentful/create-contentful-extension).

**The extension is hosted by GitHub Pages**.

## Usage

You just need to properly configure Contentful.

1. Download the `extension.json`:

   ```sh
   wget https://raw.githubusercontent.com/GuccioGucci/contentful-extension-color-picker/main/extension.json
   ```

2. Deploy the extension to Contentful:

   ```sh
   npx -p contentful-cli contentful login
   npx -p contentful-cli contentful space use
   npx -p contentful-cli contentful space environment use
   npx -p contentful-cli contentful extension update --descriptor ./extension.json --force
   ```

   > If you prefer you could install `contentful-cli` globally instead of using `npx`:
   > 
   > ```sh
   > npm install -g contentful-cli
   > contentful login
   > contentful space use
   > contentful space environment use
   > contentful extension update --descriptor ./extension.json --force
   > ```

3. Now you can choose the `Color Picker` appearance from the Field configuration:

   ![Color Picker Extension](./readme-appearance.png)

5. You've done :tada:

## Local Setup

Setup your local environment by running

```sh
# install dependencies
npm install

# login to Contentful
npm run login

# configure Contentful space and environment
npm run configure
```

> Be sure to **choose a non-production environment**.
> Choosing `master` or `prod` should be avoided.

Just run `npm start` to deploy and run the extension in development mode.


### Deploy

#### Configuration Changes

When you have done with your configuration changes (*extension.json*), you can easily deploy on the selected space and environment by running

```sh
npm run deploy
```

If you need to deploy the extension to a different environment you can use the option `--environment-id`.

```sh
npm run deploy -- --environment-id dev
```

#### Code Changes

This extension is hosted by [GitHub Pages](https://pages.github.com/). You just need to push to the `main` branch to make it live :rocket:



## Useful Links

- https://github.com/contentful/create-contentful-extension
- https://www.contentful.com/developers/docs/extensibility/app-and-ui-extension-parameters/
