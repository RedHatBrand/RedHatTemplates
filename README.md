RedHatTemplates
===============

Outfit templates and assets

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

You should now have a ./build folder containing the built template and stylesheets
You should also have a server on port 4000

The default build env in development to build for produciton pass the flag
```
gulp build --type production
```

To publish to s3 (first you'll need to get the key and secret from me :))
```
gulp publish --type production
```
