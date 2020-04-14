const generateHTML = url => {
  let address = '';

  if (url.search('localhost') !== -1) address = `http://${url}`;
  else {
    address = `https://${url}`;
  }

  return `
    <!DOCTYPE html>
<html>
  <head>
    <title>Bug Tracker Docs</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8" />
    <link
      rel="shortcut icon"
      type="image/x-icon"
      href="https://quizizz.com/favicon.ico"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700"
      rel="stylesheet"
    />

    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <!-- we provide is specification here -->
    <redoc
      spec-url="${address}/swagger"
      expand-responses="all"
    ></redoc>
    <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"></script>
  </body>
</html>

    `;
};
module.exports = generateHTML;
