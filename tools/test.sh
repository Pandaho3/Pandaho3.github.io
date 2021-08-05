#!/bin/bash
#
# Using HTML-proofer to test site.
#
# Requirement: https://github.com/gjtorikian/html-proofer
#
# Usage: bash /path/to/test.sh
#
# v2.0
# https://github.com/Pandaho3/Pandaho3.github.io
# © 2020 Cotes Chung
# MIT Licensed

DEST=_site
URL_IGNORE=cdn.jsdelivr.net

bundle exec htmlproofer $DEST \
  --disable-external \
  --check-html \
  --empty_alt_ignore \
  --allow_hash_href \
  --url_ignore $URL_IGNORE
