angular-ink
==================

Directive for filepicker.io
requires scripts from filepicker.io

Basic use:
`<input type="filepicker" ng-model="images" />`

Advanced use:

```
<filemanager ng-model="$parent.$parent.response.images"
             ink-options="inkOptions"
             class="form-control">
  <picks width="34"
         height="34"
         fit="crop"></picks>
  <button type="button" 
          class="btn btn-default"
          picker>Pick images</button>
</filemanager>
```

`ink-options` object detailing [ink filepicker options](https://developers.filepicker.io/docs/web/javascript_api/)

`ng-model` the model to bind the result to

`picks` a list of selected files, click to remove them.

`picker` bind launching the filepicker to clicking this element

Thumbnail filter

`x` width in pixels of the thumbnail 

`y` height in pixels of the thumbnail

`fit` - [Specifies how to resize the image.](https://developers.filepicker.io/docs/web/rest/#blob-images)

Usage: `{{"https://www.filepicker.io/api/file/hFHUCB3iTxyMzseuWOgG" | thumbnail:"40":"40":"crop"}}`

Becomes: `https://www.filepicker.io/api/file/hFHUCB3iTxyMzseuWOgG/covert?w=40&h=40&fit=crop`