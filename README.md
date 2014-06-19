RedHatTemplates
===============

Outfit templates and assets.

This is a static site generator; it largely uses [MetalSmith](http://www.metalsmith.io/). It's job is to compile [SASS / SCSS](http://sass-lang.com/) into css, publish assets to [S3](http://aws.amazon.com/s3/) and allow us to write templates with `{{ tags }}` and preview them with real data.

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

Work in the `/src` folder. Don't worry about the generated `/.tmp` or `build` folders. 

To add a new template make a new folder anywhere in the `/src/templates` folder. Pop a file called `index.html` in there. This file is just for our preview template data. You'll see some existing examples in `/src/templates`. 

All it needs is some JSON data, EG:

```javascript
---
{
  "data": {
    "my-tag": "The value of my tag",
    "another-tag": "You get the idea",
    "things": [
      { 
        "tag-one": "Lorem", 
        "tag-two": "Ipsum"
      },
      { 
        "tag-one": "Foo", 
        "tag-two": "Bar"
      }
    ]
  }
}
---
```

After you've got this you can make some `.html` files in that directory which will be your templates. They'll be able to use the data defined in the `index.html` file you just made. EG:

Call it anything you like (except "index.html") and give it some preview dimensions.

```html
---
{
  "width": "100mm",
  "height": "100mm"
}
---

<!DOCTYPE>
<html>
  <head>
  </head>
  <body>
    <h1>{{ my-tag }}</h1>
    <p>{{ another-tag }}</p>
    
    <ul>
      {{#things}}
      <li>
        <strong>{{ tag-one }}</strong> {{ tag-two }}
      </li>
      {{/things}}
    </ul>
  </body>
</html>
```

If you go to [http://lvh.me:4000](http://lvh.me:4000) you should see your new `index.html` file in the list. Click it and you should see every file you put in the same folder, filled with your preivew data.

If you add new files and you can't see them in the list at  [http://lvh.me:4000](http://lvh.me:4000) first make sure you've got an `index.html` file in your directory, then stop (`CTRL` + `C`) and restart gulp.


## Putting them in Outfit

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
