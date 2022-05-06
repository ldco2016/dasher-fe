#!/bin/sh
set -e

# Generate env for runtime use
yarn react-env --env APP_ENV
# Execute any subsequent command
exec "$@"