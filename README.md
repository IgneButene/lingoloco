# lingoloco
JS library to easily translate text on the web where it is not available

It can easily be implemented by importing it
<script src="lingoloco.js"></script>
and adding translation to the html files
<script>
  lingoloco.context(".title")
    .translate("stupid", "loco");
</script>

Context - sets the context, set by using JS query strings.
Translate - words which are going to be replaced.

I.e.,
<div class="title">
  stupid
</div>

will be rendered as

<div class="title">
  loco
</div>
