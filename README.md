RedHatTemplates
===============

Outfit templates and assets

## Getting setup

You'll need node and npm

Once you've got them make sure to install gulp globally

```
npm install gulp -g
```

Then install the dependencies

```
npm install
```

Then run
```
gulp
```

You should now have a `/.tmp` folder containing the built templates and stylesheets

You should also have a local server: [http://lvh.me:4000](http://lvh.me:4000)

## Working on templates

Work in the `/src` folder. Don't worry about the generated `/.tmp` folder. If you add new files and you can't see them in the list at  [http://lvh.me:4000](http://lvh.me:4000) stop (`CTRL` + `C`) and restart gulp.


## Putting them in the app

To get your work live, **first** you need to build for production
```
gulp build-production
```

Notice the `/build` folder is checked into this repo, double check all your changes (`git status`) and commit them before publishing

To publish to s3 (first you'll need to get the key and secret from me :))
```
gulp publish
```

Sweet, everything is up in the cloud. You can now add template files from the `/build` folder to outfit.
