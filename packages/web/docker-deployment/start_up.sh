#!/usr/bin/env bash

valid_url_regex='^https?://[-A-Za-z0-9\+&@#/%?=~_|!:,.;]*[-A-Za-z0-9\+&@#/%=~_|]'
valid_subpath_regex='^/[-A-Za-z0-9\+&@#/%?=~_|!:,.;]*[-A-Za-z0-9\+&@#/%=~_|]'

if [[ "$BACKEND_URL" =~ $valid_url_regex ]] # check if BACKEND_URL matches a valid url
then
    echo "BACKEND_URL looks like a valid url. Frontend proxy stays disabled and backend will be requested directly from the browser."
elif [[ "$BACKEND_URL" =~ $valid_subpath_regex ]] # check if BACKEND_URL matches a valid subpath
then
    echo "BACKEND_URL looks like a subpath. Frontend proxy will be enabled with subpath BACKEND_URL and will proxy BACKEND_PROXY_URL"

    echo "Replacing BACKEND_URL with $BACKEND_URL in nginx config"
    sed -i -e "s,\"\$%BACKEND_URL_PLACEHOLDER%\$\",$(echo "$BACKEND_URL" | sed 's/[.[\*^$]/\\&/g'),g" /etc/nginx/conf.d/default.conf

    echo "Replacing BACKEND_PROXY_URL with $BACKEND_PROXY_URL in nginx config"
    sed -i -e "s,\"\$%BACKEND_PROXY_URL_PLACEHOLDER%\$\",$(echo "$BACKEND_PROXY_URL" | sed 's/[.[\*^$]/\\&/g'),g" /etc/nginx/conf.d/default.conf

    echo "Enabling frontend proxy in nginx config"
    sed -i -e "s,#\$%disabled%\$#,,g" /etc/nginx/conf.d/default.conf
else # no valid subpath or url found
  echo "BACKEND_URL looks looks neither like a url, nor like a subpath. Please check the BACKEND_URL environment variable and restart the container..."

  # exit
  exit 1
fi

if [[ "$BASE_PATH" == "/" ]] # if $BASE_PATH equals '/'
then
    # Replacing $BASE_PATH with nothing
    sed -i -e "s,\"\$%BASE_PATH_PLACEHOLDER%\$\",,g" /etc/nginx/conf.d/default.conf

    # Replacing $BASE_PATH with '/'
    sed -i -e "s,\"\$%BASE_PATH_PLACEHOLDER%\$\",\"/\",g" /var/www/index.html

    # Replacing $BASE_PATH with '/'
    sed -i -e "s,\"\$%BASE_PATH_PLACEHOLDER%\$\",\"/\",g" /var/www/main.js

    echo "Replacing BACKEND_URL with $BACKEND_URL in main.js so the browser knows where the backend can be found"
    sed -i -e "s,\"\$%BACKEND_URL_PLACEHOLDER%\$\",\"$(echo "$BACKEND_URL" | sed 's/[.[\*^$]/\\&/g')\",g" /var/www/main.js
else
  echo "Enabling serving from subpath. Validator will be provide the content and api proxy if enabled through $BASE_PATH"
  sed -i -e "s,\"\$%BASE_PATH_PLACEHOLDER%\$\",$(echo "$BASE_PATH" | sed 's/[.[\*^$]/\\&/g'),g" /etc/nginx/conf.d/default.conf

  echo "Setting base path in index.html $BASE_PATH"
  sed -i -e "s,\"\$%BASE_PATH_PLACEHOLDER%\$\",\"$(echo "$BASE_PATH" | sed 's/[.[\*^$]/\\&/g')/\",g" /var/www/index.html

  echo "Replacing BACKEND_URL with $BACKEND_URL in main.js so the browser knows where the backend can be found"
  sed -i -e "s,\"\$%BACKEND_URL_PLACEHOLDER%\$\",\"$(echo "$BASE_PATH" | sed 's/[.[\*^$]/\\&/g')/$(echo "$BACKEND_URL" | sed 's/[.[\*^$]/\\&/g')\",g" /var/www/main.js

  echo "Setting base path in main.js $BASE_PATH"
  sed -i -e "s,\"\$%BASE_PATH_PLACEHOLDER%\$\",\"$(echo "$BASE_PATH" | sed 's/[.[\*^$]/\\&/g')/\",g" /var/www/main.js
fi

cat /etc/nginx/conf.d/default.conf

nginx -g 'daemon off;'
